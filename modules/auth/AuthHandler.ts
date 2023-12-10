import bcyrpt from "bcryptjs";
import moment from "moment";
import mongoose, { PipelineStage } from "mongoose";

import { LoginInput, SignUpInput, UpdateUserInput } from "./interface/Input";
import UserModel, { User } from "../../schemas/users";
import CustomError from "../../exception/CustomError";
import { LoginResponse, SignUpResponse, UpdateUserResponse } from "./interface/response";
import { STATUS_CODE, RESPONSE } from "../../constants";
import JWTService from "../../utils/jwt.service";

class AuthHandler {

  private readonly jwtService: JWTService;

  constructor() {
    this.jwtService = new JWTService;
  }
  
  private generateHashPassword(password: string): Promise<string> {
    const salt = bcyrpt.genSaltSync(10);
    return bcyrpt.hash(password, salt);
  }

  private verifyPassword(hashPassword: string, password: string): boolean {
    return bcyrpt.compareSync(password, hashPassword);
  }
  
  async login(payload: LoginInput): Promise<LoginResponse> {
    const userDetails = await UserModel.findOne({ userName: payload.userName }) as User;

    if(!userDetails) {
      throw new CustomError(RESPONSE.INVALID_CREDENTIALS, STATUS_CODE.UNAUTHORIZED);
    }

    const verifyPassword = this.verifyPassword(userDetails.password, payload.password);

    if(!verifyPassword) {
      throw new CustomError(RESPONSE.INVALID_CREDENTIALS, STATUS_CODE.UNAUTHORIZED);
    }

    await UserModel.findByIdAndUpdate(
      userDetails._id,
      { $set: { lastLogin: moment().valueOf() } }
    );

    const jwtPayload = {
      id: userDetails._id.toString(),
    }

    const token = this.jwtService.signJWT(jwtPayload);

    return {
      status: STATUS_CODE.SUCCESS,
      message: RESPONSE.LOGIN_SUCCESS,
      data: { token }
    }
  }

  async signUp(payload: SignUpInput): Promise<SignUpResponse>{
    try {
      const searchConditions = {
        $or: [
          { userName: payload.userName },
          { email: payload.email }
        ]
      };
      
      const projections = { _id: 1, email: 1 };
      const userDetails = await UserModel.findOne(searchConditions, projections) as User;

      if (userDetails) {

        if(userDetails.email === payload.email) {
          throw new CustomError(RESPONSE.EXISTING_EMAIL, STATUS_CODE.CONFLICT);
        }
        throw new CustomError(RESPONSE.EXISTING_USERNAME, STATUS_CODE.CONFLICT);
      }
      const password = await this.generateHashPassword(payload.password);

      await UserModel.create({ ...payload, password });

      return { status: STATUS_CODE.SUCCESS, message: RESPONSE.SIGNUP_SUCCESS };
    }
    catch(err) {
      throw err;
    }
	}

  updateChatStatus(userId: string, status: string, socketId: string) {
    let updatePayload: any = {};

    updatePayload.isActive = status;
    updatePayload.socketId = socketId;
    return UserModel.findByIdAndUpdate(userId, updatePayload, { new: true });
  }

  async findUser(userId: string) {
    const projections = { fullName: 1, socketId: 1, userStatus: 1, status: '$isActive' };
    
    const user = await UserModel.findById(userId, projections);
    return {
      status: STATUS_CODE.SUCCESS,
      message: RESPONSE.SUCCESS,
      data: { user }
    };    
  }

  async updateUser(userId: string, payload: UpdateUserInput): Promise<UpdateUserResponse> {
    let toUpdate: UpdateUserInput = {};

    if(payload.fullName) {
      toUpdate.fullName = payload.fullName;
    }

    if(payload.userStatus) {
      toUpdate.userStatus = payload.userStatus;
    }

    await UserModel.findByIdAndUpdate(userId, toUpdate);
    
    return {
      status: STATUS_CODE.SUCCESS,
      message: RESPONSE.USER_UPDATE_SUCCESS,
    };
  }

  async findAllUsers(search: string, userId: string) {
    try {
      const query = {
        $or: [
          { userName: new RegExp(search, 'i') },
          { fullName: new RegExp(search, 'i') }
        ],
        _id: { $ne: new mongoose.Types.ObjectId(userId) }
      }
      const aggregationPipeline: PipelineStage[] = [
        { $match: query },
        { $project: { fullName: 1, isActive: 1, userStatus: 1 } },
        { $sort: { fullName: 1 } },
        { $lookup: {
            from: 'friends',
            let: { userId: '$_id' },
            pipeline: [
                {
                  $match: {
                    $and: [
                      { $expr: { $ne: ['$status', 'REJECTED'] } },
                      { $expr: { $eq: ['$requestedBy', new mongoose.Types.ObjectId(userId)] } },
                      { $expr: { $eq: ['$friendId', '$$userId'] } },
                      { $expr: { $eq: ['$isDeleted', false] } }
                    ]
                  }
                }
            ],
            as: 'friendRequest'
        }},
        { $unwind: { path: '$friendRequest', preserveNullAndEmptyArrays: true } },
        { $project: { fullName: 1, userName: 1, isActive: 1, userStatus: 1, 'friendRequest.status': 1, 'friendRequest._id':1 } }
      ];

      const userList = await UserModel.aggregate(aggregationPipeline);
  
      const count = await UserModel.countDocuments(query);
  
      return {
        status: STATUS_CODE.SUCCESS,
        message: RESPONSE.SUCCESS,
        data: { users: userList, count }
      };
    }
    catch(err) {
      throw err;
    }
  }
}

export default AuthHandler;