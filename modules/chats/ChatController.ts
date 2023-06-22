import { NextFunction } from "express";

import { IRequest, IResponse } from "../../interfaces/Api";
import ChatHandler from "./ChatHandler";
import { STATUS_CODE } from "../../constants";

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

  public specificChatMessages = async(req: IRequest, res: IResponse, next: NextFunction) => {
    try {
      const { params, query } = req;
      const pageSize = parseInt(query.pageSize as string, 10);
      const pageIndex = pageSize * parseInt(query.pageIndex as string, 10)

      const chatMessages = await this.chatHandler.privateChatMessages(params.id as string, req.user?.id as string, pageIndex, pageSize);

      const countConditions = { room: params.id as string };
      const count = await this.chatHandler.countDocuments(countConditions);

      const response = { status: STATUS_CODE.SUCCESS, data: { chatMessages, count } };
      res.status(STATUS_CODE.SUCCESS).send(response);

    }
    catch(err) {
      next(err);
    }
  };
}

export default new ChatController;