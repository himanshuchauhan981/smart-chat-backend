import { NextFunction } from "express";
import response from "../constants/response";

import statusCode from "../constants/statusCode";
import { IRequest, IResponse, User } from "../interfaces/Api";
import JWTService from "../utils/jwt.service";

function authValidation(req: IRequest, res: IResponse, next: NextFunction): void {
  try {
    const jwtService = new JWTService();

    let jwt = req.headers.authorization as string;

    if(!jwt) {
      res.status(statusCode.unauthorized).json({ message: response.requiredToken });
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
      res.status(statusCode.unauthorized).json({ message: response.expiredToken });
    }

    res.status(statusCode.serverError).json({ message: response.failedTokenValidation });
  }
}

export default authValidation;