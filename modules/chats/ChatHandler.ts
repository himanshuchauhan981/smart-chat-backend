import mongoose from "mongoose";
import moment from "moment";

import ChatModel from "../../schemas/chats";
import { SendMessagePayload } from "../socket/interface";
import { STATUS_CODE, RESPONSE } from "../../constants";
import RoomsModel, { RoomType } from "../../schemas/rooms";

class ChatHandler {

  async privateChatList(pageIndex: number, pageSize: number, userId: string) {

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const aggregateArray: any = [
      {
        $match: {
          type: RoomType.PRIVATE,
          members: {
            $in: [
              userObjectId,
            ],
          },
        },
      },
      {
        $addFields: {
          receiverId: {
            $filter: {
              input: "$members",
              as: "item",
              cond: {
                $ne: [
                  "$$item",
                  userObjectId,
                ],
              },
            },
          },
        },
      },
      { $unwind: "$receiverId" },
      { $skip: pageIndex },
      { $limit: pageSize },
      {
        $lookup: {
          from: "users",
          localField: "receiverId",
          foreignField: "_id",
          as: "receiver",
        },
      },
      { $unwind: "$receiver" },
      {
        $lookup: {
          from: 'chats',
          localField: 'lastMessage',
          foreignField: '_id',
          as: 'privateChat',
        }
      },
      {
        $unwind: {
          path: '$privateChat',
          preserveNullAndEmptyArrays: true
        },
      },
      {
        $project: {
          roomId: 1,
          fullName: "$receiver.fullName",
          message: '$privateChat.text',
          receiverId: '$receiver._id',
          isActive: '$receiver.isActive'
        },
      },
    ]

    const privateChats = await RoomsModel.aggregate(aggregateArray);

    return { status: STATUS_CODE.SUCCESS, message: RESPONSE.SUCCESS, data: { privateChats } };

  }

  async privateChatMessages(roomId: string, senderId: string, pageIndex: number, pageSize: number) {
    pageIndex = pageIndex * pageSize;

    const aggregateArray: any = [
      { $match: { roomId: new mongoose.Types.ObjectId(roomId) } },
      {
        $addFields: {
          isSender: {
            $cond: [
              { $eq: ['$sender', new mongoose.Types.ObjectId(senderId)] },
              1,
              0,
            ],
          },
        },
      },
      // {
      //   $match: {
      //     $or: [
      //       { $and: [{ isSender: 0 }, { toDelete: false }] },
      //       { $and: [{ isSender: 1 }, { fromDelete: false }] },
      //     ],
      //   },
      // },
      {
        $project: {
          text: 1,
          createdAt: 1,
          sender: 1,
          receiver: 1,
          isRead: 1,
          fromDelete: 1,
          toDelete: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: pageIndex },
      { $limit: pageSize },
    ];

    const populateOptions = [
      { path: 'sender', select: 'fullName' },
      { path: 'receiver', select: 'fullName' },
    ];

    const roomMessages = await ChatModel.aggregate(aggregateArray);

    return ChatModel.populate(roomMessages, populateOptions);
  }

  async readMessages(room: string, userId: string): Promise<void> {
    await ChatModel.updateMany(
      { room, isRead: false, sender: new mongoose.Types.ObjectId(userId) },
      { isRead: true, isReadDate: moment().valueOf() },
    );
  }

  async create(payload: SendMessagePayload) {
    const populateOptions = [
      { path: 'sender', select: 'firstName lastName isActive' },
      { path: 'receiver', select: 'firstName lastName isActive' },
    ];
    
    const newMessage = await ChatModel.create(payload);

    return newMessage.populate(populateOptions);
  }

  countDocuments(conditions: any) {
    return ChatModel.countDocuments(conditions);
  }

  findById(id: string) {
    return ChatModel.findById(id);
  }

  async deleteMessage(messageId: string, updatePayload: any): Promise<void> {
    await ChatModel.findByIdAndUpdate(messageId, {$set: updatePayload});
  }

  checkForNewWindowMessage(room: string) {
    return ChatModel.findOne({ room });
  }
}

export default ChatHandler;