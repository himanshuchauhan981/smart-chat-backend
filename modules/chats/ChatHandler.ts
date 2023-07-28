import mongoose from "mongoose";
import moment from "moment";

import ChatModel from "../../schemas/chats";
import { SendMessagePayload } from "../socket/interface";
import { STATUS_CODE, RESPONSE } from "../../constants";

class ChatHandler {
  async privateChatList(userId: string) {

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const aggregateArray: any = [
			{
				$match: {
					$or: [
						{ sender: userObjectId },
						{ receiver: userObjectId },
					],
				},
			},
			{
				$project: {
					sender: 1,
					receiver: 1,
					text: 1,
					createdAt: 1,
					room: 1,
					unreadMessages: {
						$cond: [
							{
								$and: [
									{ $eq: ['$isRead', false] },
									{
										$eq: ['$receiver', userObjectId],
									},
								],
							},
							1,
							0,
						],
					},
				},
			},
			{
				$group: {
					_id: { id: '$room' },
					text: { $last: '$text' },
					receiver: { $last: '$receiver' },
					sender: { $last: '$sender' },
					unReadCount: { $sum: '$unreadMessages' },
					createdAt: { $last: '$createdAt' },
				},
			},
			{ $sort: { createdAt: -1 } },
			{ $project: { _id: 0 } },
		];

    const populateOptions = [
			{
				path: 'receiver',
				select: 'firstName lastName isActive',
			},
			{
				path: 'sender',
				select: 'firstName lastName isActive',
			},
		];

    const privateChatsDocument = await ChatModel.aggregate(aggregateArray);

    let privateChats = await ChatModel.populate(privateChatsDocument, populateOptions);

    privateChats.forEach(item => {
      if(item.receiver._id.toString() === userId) {

        [item.receiver, item.sender] = [item.sender, item.receiver];
      }
    });

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