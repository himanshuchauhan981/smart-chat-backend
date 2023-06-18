import { NextFunction } from "express";

import { IRequest, IResponse, User } from "../../interfaces/Api";
import FriendHandler from "./FriendHandler";

class FriendController {

  private friendHandler: FriendHandler;

  constructor() {
    this.friendHandler = new FriendHandler();
  }

  public newRequest = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const payload = req.body;
      const user = req.user as User;
      const response = await this.friendHandler.newRequest(payload, user);

      res.status(response.status).send(response);
    }
    catch(err) {
      next(err);
    }
  };

  public requestList = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const user = req.user;
      
      const response = await this.friendHandler.requestList(user?.id as string);
      res.status(response.status).send(response);
    }
    catch(err) {
      next(err);
    }
  };

  public acceptRejectRequest = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const payload = req.body;
      const user = req.user;

      const response = await this.friendHandler.acceptRejectRequest(payload, user?.id as string);
      res.status(response.status).send(response);
    }
    catch(err) {
      next(err);
    }
  };

  public removeFriendRequest = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const response = await this.friendHandler.removeFriendRequest(req.params.id as string, req.user?.id as string);
      res.status(response.status).send(response);
    }
    catch(err) {
      next(err);
    }
  };

  public friendsList = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try{
      const id = req.user?.id as string;
      const query = req.query;

      const response = await this.friendHandler.friendsList(id, query);

      res.status(response.status).json(response);
    }
    catch(err) {
      next(err);
    }
  }
};

export default new FriendController;