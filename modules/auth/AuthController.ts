import { NextFunction } from "express";

import { IRequest, IResponse } from "../../interfaces/Api";
import AuthHandler from "./AuthHandler";

class AuthController {
  private authHandler: AuthHandler;

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

      res.status(response.status).json({ message: response.message, status: response.status });
    }
    catch(err) {
      next(err);
    }
  }

  public findAllUsers = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try{
      const search = req.query.search as string;
      const userId =req.user?.id as string;

      const response = await this.authHandler.findAllUsers(search, userId);

      res.status(response.status).json(response.data);
    }
    catch(err) {
      next(err);
    }
  }

  public specificUser = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const user = req.user;

      const response = await this.authHandler.findUser(user?.id as string);
      res.status(response.status).json(response.data);
    }
    catch(err) {
      next(err);
    }
  };
};

export default new AuthController;