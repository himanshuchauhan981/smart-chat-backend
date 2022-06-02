import bcyrpt from "bcryptjs";
import moment from "moment";
import mongoose from "mongoose";

import { LoginInput, SignUpInput } from "./interface/Input";
import UserModel, { User, UserChatStatus } from "../../schemas/users";
import CustomError from "../../exception/CustomError";
import response from "../../constants/response";
import { FriendsListResponse, LoginResponse, SignUpResponse } from "./interface/response";
import statusCode from "../../constants/statusCode";
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
    const userDetails = await UserModel.findOne({ username: payload.username }) as User;

    if(!userDetails) {
      throw new CustomError(response.invalidCredentials, statusCode.unauthorized);
    }

    const verifyPassword = this.verifyPassword(userDetails.password, payload.password);

    if(!verifyPassword) {
      throw new CustomError(response.invalidCredentials, statusCode.unauthorized);
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
      status: statusCode.success,
      message: response.loginSuccessfull,
      data: { token }
    }
  }

  async signUp(payload: SignUpInput): Promise<SignUpResponse>{

    try {
      const userDetails = await UserModel.findOne({ username: payload.username }) as User;

      if (userDetails) {
        throw new CustomError(response.existingUser, 403);
      }
      const password = await this.generateHashPassword(payload.password);

      await UserModel.create({ ...payload, password });

      return { status: statusCode.success, message: response.signupSuccessfull };
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
        status: statusCode.success,
        message: response.success,
        data: { friendsList }
      };
    }
    catch(err) {
      throw err;
    }
  }

  updateChatStatus(userId: string, status: string) {
    let updatePayload: any = {};

    if(status === UserChatStatus.online) {
      updatePayload.isActive = UserChatStatus.online;
      updatePayload.lastLogin = moment().valueOf();
    }
    else {
      updatePayload.isActive = UserChatStatus.offline;
    }

    return UserModel.findByIdAndUpdate(userId, updatePayload, { new: true });
  }

  findUser(userId: string) {
    const name = this.formatName();

    const aggregateArray: any[] = [
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $project: name },
    ];

    return UserModel.aggregate(aggregateArray);
  }

  async findAllUsers(userId: string) {
    const formatNameOpton = this.formatName();

    const aggregateArray: any = [
			{ $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
			{
				$project: {
					name: formatNameOpton.name,
					isActive: 1,
				},
			},
			{ $sort: { name: 1 } },
		];

    const userList = await UserModel.aggregate(aggregateArray);

    return {status: statusCode.success, message: response.success, data: { userList } };
  }
}

export default AuthHandler;