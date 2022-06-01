import { NextFunction } from "express";

import { IRequest, IResponse } from "../../interfaces/Api";
import ChatHandler from "./ChatHandler";

class ChatController {

  private chatHandler: ChatHandler;

  constructor() {
    this.chatHandler = new ChatHandler();
  }

  public privateChatList = async (req: IRequest, res: IResponse, next: NextFunction) => {
    try{
      const response = await this.chatHandler.privateChatList(req.user?.id as string);

      res.status(response.status).send(response.data);
    }
    catch(err) {
      next(err);
    }
  }
}

export default new ChatController;