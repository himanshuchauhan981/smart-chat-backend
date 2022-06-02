import { NextFunction } from "express";

import { IRequest, IResponse } from "../../interfaces/Api";
import GroupChatHandler from "./GroupChatHandler";

class GroupChatController {

  private groupChatHandler: GroupChatHandler;

  constructor() {
    this.groupChatHandler = new GroupChatHandler();
  }

  public create  = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const response = await this.groupChatHandler.createGroup(req.body, req.user?.id as string);

      res.status(response.status).send(response.data);
    }
    catch(err) {
      next(err);
    }
  };

  public groupList  = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try{
      const response = await this.groupChatHandler.userGroupList(req.user?.id as string);

      res.status(response.status).send(response.data);
    }
    catch(err) {
      next(err);
    }
  };
};

export default new GroupChatController;