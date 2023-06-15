import bcyrpt from "bcryptjs";
import moment from "moment";
import mongoose, { PipelineStage } from "mongoose";

import { LoginInput, SignUpInput } from "./interface/Input";
import UserModel, { User } from "../../schemas/users";
import CustomError from "../../exception/CustomError";
import RESPONSE from "../../constants/response";
import { FriendsListResponse, LoginResponse, SignUpResponse } from "./interface/response";
import STATUS_CODE from "../../constants/statusCode";
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

  private formatName() {
    return {
      name: {
        $concat: [
          {
            $concat: [
              { $toUpper: { $substrCP: ['$firstName', 0, 1] } },
              {
                $substrCP: [
                  '$firstName',
                  1,
                  { $subtract: [{ $strLenCP: '$firstName' }, 1] },
                ],
              },
            ],
          },
          ' ',
          {
            $concat: [
              { $toUpper: { $substrCP: ['$lastName', 0, 1] } },
              {
                $substrCP: [
                  '$lastName',
                  1,
                  { $subtract: [{ $strLenCP: '$lastName' }, 1] },
                ],
              },
            ],
          },
        ],
      }
    }; 
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

  async friendsList(userId: string): Promise<FriendsListResponse> {
    try {
      const formatNameOption = this.formatName();
      const aggregateArray: any[] = [
        { $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
        {
          $project: {
            name: formatNameOption.name,
            isActive: 1,
            userStatus: 1,
          },
        },
        { $sort: { name: 1 } },
      ];

      const friendsList = await UserModel.aggregate(aggregateArray);

      return {
        status: STATUS_CODE.SUCCESS,
        message: RESPONSE.SUCCESS,
        data: { friendsList }
      };
    }
    catch(err) {
      throw err;
    }
  }

  updateChatStatus(userId: string, status: string) {
    let updatePayload: any = {};

    updatePayload.isActive = status;
    return UserModel.findByIdAndUpdate(userId, updatePayload, { new: true });
  }

  async findUser(userId: string) {
    const projections = { fullName: 1 };
    
    const user = await UserModel.findById(userId, projections);
    return {
      status: STATUS_CODE.SUCCESS,
      message: RESPONSE.SUCCESS,
      data: { user }
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
  
      const count = await UserModel.count(query);
  
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