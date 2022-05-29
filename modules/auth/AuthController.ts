import { NextFunction } from "express";
import { IRequest, IResponse } from "../../interfaces/Api";
import AuthHandler from "./AuthHandler";

class AuthController {
  authHandler: AuthHandler;

  constructor() {
    this.authHandler = new AuthHandler();
  }

  public login = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const payload = req.body;
      const response = await this.authHandler.login(payload);

      res.status(response.status).json(response);
    }
    catch(err) {
      next(err);
    }
  }

  public signup = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const payload = req.body;
      const response = await this.authHandler.signUp(payload);

      res.status(response.status).json({ message: response.message });
    }
    catch(err) {
      next(err);
    }
  }
};

export default new AuthController;