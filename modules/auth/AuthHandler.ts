import bcyrpt from "bcryptjs";
import moment from "moment";

import { LoginInput, SignUpInput } from "./interface/Input";
import UserModel, { User } from "../../schemas/users";
import CustomError from "../../exception/CustomError";
import response from "../../constants/response";
import { LoginResponse, SignUpResponse } from "./interface/response";
import statusCode from "../../constants/statusCode";

class AuthHandler {
  
  #generateHashPassword(password: string): Promise<string> {
    const salt = bcyrpt.genSaltSync(10);
    return bcyrpt.hash(password, salt);
  }

  #verifyPassword(hashPassword: string, password: string): boolean {
    return bcyrpt.compareSync(password, hashPassword);
  }
  
  async login(payload: LoginInput): Promise<LoginResponse> {
    const userDetails = await UserModel.findOne({ username: payload.username }) as User;

    if(!userDetails) {
      throw new CustomError(response.noUserFound, statusCode.unauthorized);
    }

    const verifyPassword = this.#verifyPassword(userDetails.password, payload.password);

    if(!verifyPassword) {
      throw new CustomError(response.noUserFound, statusCode.unauthorized);
    }

    await UserModel.findByIdAndUpdate(
      userDetails._id, 
      { $set: { lastLogin: moment().valueOf() } }
    );

    return { status: statusCode.success, message: response.loginSuccessfull }
  }

  async signUp(payload: SignUpInput): Promise<SignUpResponse>{

    try {
      const userDetails = await UserModel.findOne({ username: payload.username }) as User;

      if (userDetails) {
        throw new CustomError(response.existingUser, 403);
      }
      const password = await this.#generateHashPassword(payload.password);

      await UserModel.create({ ...payload, password });

      return { status: statusCode.success, message: response.signupSuccessfull };
    }
    catch(err) {
      throw err;
    }
	}
}

export default AuthHandler;