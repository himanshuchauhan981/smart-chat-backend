import { NextFunction } from "express";
import response from "../constants/response";

import STATUS_CODE from "../constants/statusCode";
import { IRequest, IResponse, User } from "../interfaces/Api";
import JWTService from "../utils/jwt.service";

function authValidation(req: IRequest, res: IResponse, next: NextFunction): void {
  try {
    const jwtService = new JWTService();

    let jwt = req.headers.authorization as string;

    if(!jwt) {
      res.status(STATUS_CODE.UNAUTHORIZED).json({ message: response.REQUIRED_TOKEN });
    }

    if(jwt?.toLocaleLowerCase().startsWith('bearer')) {
      jwt = jwt.slice('bearer'.length).trim();
    }

    const decodedToken = jwtService.decode(jwt) as User;

    req.user = decodedToken;

    next();
  }
  catch(err: any) {
    if(err.name === 'TokenExpiredError') {
      res.status(STATUS_CODE.UNAUTHORIZED).json({ message: response.EXPIRED_TOKEN });
    }

    res.status(STATUS_CODE.SERVER_ERROR).json({ message: response.FAILED_TOKEN_VALIDATION });
  }
}

export default authValidation;