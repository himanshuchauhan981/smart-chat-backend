import { NextFunction } from "express";
import { RESPONSE } from "../constants/response";

import { STATUS_CODE } from "../constants/statusCode";
import { IRequest, IResponse, User } from "../interfaces/Api";
import JWTService from "../utils/jwt.service";
import UserModel from "../schemas/users";

async function authValidation(req: IRequest, res: IResponse, next: NextFunction): Promise<void> {
  try {
    const jwtService = new JWTService();

    let jwt = req.headers.authorization as string;

    if(!jwt) {
      res.status(STATUS_CODE.UNAUTHORIZED).json({ message: RESPONSE.REQUIRED_TOKEN });
    }

    if(jwt?.toLocaleLowerCase().startsWith('bearer')) {
      jwt = jwt.slice('bearer'.length).trim();
    }

    const decodedToken = jwtService.decode(jwt) as User;

    const userDetails = await UserModel.findById(decodedToken.id);

    req.user = {
      ...decodedToken,
      fullName: userDetails?.fullName as string,
    };

    next();
  }
  catch(err: any) {
    if(err.name === 'TokenExpiredError') {
      res.status(STATUS_CODE.UNAUTHORIZED).json({ message: RESPONSE.EXPIRED_TOKEN });
    }

    res.status(STATUS_CODE.SERVER_ERROR).json({ message: RESPONSE.FAILED_TOKEN_VALIDATION });
  }
}

export default authValidation;