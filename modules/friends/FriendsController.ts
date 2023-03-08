import { NextFunction } from "express";

import { IRequest, IResponse } from "../../interfaces/Api";
import FriendHandler from "./FriendHandler";

class FriendController {

  private friendHandler: FriendHandler;

  constructor() {
    this.friendHandler = new FriendHandler();
  }

  public newRequest = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const payload = req.body;
      const user = req.user;
      const response = await this.friendHandler.newRequest(payload, user?.id as string);

      res.status(response.status).send(response.data);
    }
    catch(err) {
      next(err);
    }
  };
};

export default new FriendController;