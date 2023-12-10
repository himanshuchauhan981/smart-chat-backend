import mongoose from "mongoose";
import moment from 'moment';

import socketEvents from "../../constants/socketEvents";
import { Chat } from "../../schemas/chats";
import { GroupDetails } from "../../schemas/groupDetails";
import { User, UserChatStatus } from "../../schemas/users";
import AuthHandler from "../auth/AuthHandler";
import ChatHandler from "../chats/ChatHandler";
import GroupChatHandler from "../group-chats/GroupChatHandler";
import { GroupMembersPayload, ISocket, SendMessagePayload } from "./interface";
import RoomHandler from "../rooms/RoomHandler";
import { RoomType } from "../../schemas/rooms";


class SocketHandler {

  private socketUser: any = {};
  private authHandler: AuthHandler;
  private chatHandler: ChatHandler;
  private groupChatHandler: GroupChatHandler;
  private roomHandler: RoomHandler;

  constructor() {
    this.authHandler = new AuthHandler();
    this.chatHandler = new ChatHandler();
    this.groupChatHandler = new GroupChatHandler();
    this.roomHandler = new RoomHandler();
  }

  public joinSocket = async (userId: string, socket: any) => {
    socket.userId = userId;
    this.socketUser[userId] = socket;

    const userChatStatus = await this.authHandler.updateChatStatus(userId, UserChatStatus.online, socket.id) as User;

    const socketData = {
      userId,
      status: userChatStatus.isActive,
    };

    // const userData = {
    // 	firstName: userChatStatus.firstName,
    // 	lastName: userChatStatus.lastName,
    // };

    socket.broadcast.emit(socketEvents.ONLINE_STATUS, socketData);

    // this.socketUser[userChatStatus?._id.toString()].emit(socketEvents.SOCKET_USER_DATA, userData);
  }

  removeUser = async (socket: ISocket, io: any) => {
    const { userId } = socket;

    delete this.socketUser[userId];

    if (userId) {
      const userChatStatus = await this.authHandler.updateChatStatus(userId, UserChatStatus.offline, '') as User;

      const socketData = {
        userId,
        status: userChatStatus.isActive,
      };

      io.emit(socketEvents.ONLINE_STATUS, socketData);
    }
  };

  joinPrivateRoom = async (socket: ISocket, io: any, room: string, senderId: string, receiverId: string, pageIndex: number, pageSize: number) => {
    let existingRoom = await this.roomHandler.findByRoomId(room);

    if (!existingRoom) {
      const payload = {
        members: [
          new mongoose.Types.ObjectId(senderId),
          new mongoose.Types.ObjectId(receiverId),
        ],
        type: RoomType.PRIVATE,
      };

      existingRoom = await this.roomHandler.create(payload);
    }

    socket.join(room);

    const { data: { user } } = await this.authHandler.findUser(receiverId);

    await this.chatHandler.readMessages(room, receiverId);

    const roomMessages = await this.chatHandler.privateChatMessages(existingRoom._id.toString(), senderId, pageIndex, pageSize);

    const countConditions = { room };
    const count = await this.chatHandler.countDocuments(countConditions);

    const socketReceiveMessages = {
      room,
      roomMessages,
      count,
    };

    io.to(room).emit(socketEvents.RECEIVE_MESSAGES, socketReceiveMessages);

    const senderSocket = this.socketUser[senderId];

    socket.emit(socketEvents.SET_RECEIVER_DETAILS, user);

    if (senderSocket) {
      const senderSocketData = {
        newMessageCount: 0,
        id: receiverId,
        text: roomMessages.length ? roomMessages[roomMessages.length - 1]?.text : null,
        createdAt: roomMessages.length ? roomMessages[roomMessages.length - 1]?.createdAt : null,
        receiverDetails: user,
      };

      io.to(user?.socketId).emit(socketEvents.PRIVATE_MESSAGES_COUNT, senderSocketData);
    }
  };

  sendMessage = async (io: any, messagePayload: SendMessagePayload) => {
    if (messagePayload.receiver) {
      const roomDetails = await this.roomHandler.findByRoomId(messagePayload.room);

      const newMessage = await this.chatHandler.create({ ...messagePayload, roomId: roomDetails?._id.toString() as string });

      const countConditions = {
        roomId: roomDetails?._id.toString(),
        isRead: false,
        sender: new mongoose.Types.ObjectId(messagePayload.sender),
      };

      const count = await this.chatHandler.countDocuments(countConditions);

      io.to(messagePayload.room).emit(socketEvents.RECEIVE_NEW_MESSAGE, { newMessage });

      const receiverSocket = this.socketUser[messagePayload.receiver];

      if (receiverSocket) {

        const socketData = {
          newMessagesCount: count,
          lastMessage: newMessage.text,
          lastMessageAt: moment(newMessage.createdAt).valueOf(),
          roomId: newMessage.roomId,
        };

        io.to(this.socketUser[messagePayload.receiver].id).emit(socketEvents.PRIVATE_MESSAGES_COUNT, socketData);
        io.to(this.socketUser[messagePayload.sender].id).emit(socketEvents.PRIVATE_MESSAGES_COUNT, socketData);
      }

      await this.roomHandler.updateLastMessage(messagePayload.room, newMessage._id.toString());
    }
    else {

      const newMessage = await this.groupChatHandler.createMessage(messagePayload);

      const count = await this.groupChatHandler.countDocuments(messagePayload.room, messagePayload.sender, false);

      io.to(messagePayload.room).emit(socketEvents.RECEIVE_NEW_MESSAGE, { newMessage });

      const receiverSocketData = {
        newMessagesCount: count,
        id: newMessage.sender._id,
        createdDate: newMessage.createdAt,
        text: newMessage.text,
      };

      io.to(messagePayload.room).emit(socketEvents.GROUP_MESSAGES_COUNT, receiverSocketData);
    }
  };

  deletePrivateMessage = async (io: any, messageId: string, senderId: string) => {

    let toUpdate = {};
    const messageDetails = await this.chatHandler.findById(messageId) as Chat;

    if (messageDetails.sender._id.toString() === senderId) {
      toUpdate = { fromDelete: true };
    } else {
      toUpdate = { toDelete: true };
    }

    const specificSocket = this.socketUser[senderId];

    if (specificSocket) {
      io.to(senderId).emit(socketEvents.UPDATE_DELETED_PRIVATE_MESSAGE, messageId);
    }

    this.chatHandler.deleteMessage(messageId, toUpdate);
  };

  addGroupToGroupList = async (io: any, groupMembers: GroupMembersPayload[], groupData: GroupDetails) => {

    groupMembers.forEach(item => {
      if (item.userId in this.socketUser) {
        io.to(item.userId).emit(socketEvents.ADD_GROUP_TO_GROUPLIST, groupData);
      }
    });
  };

  joinGroupRoom = async (io: any, groupId: any) => {

    const groupDetails = await this.groupChatHandler.findGroupById(groupId);

    const roomMessages = await this.groupChatHandler.groupChatList(groupId);

    const socketArgs = {
      receiverDetails: { name: groupDetails?.name, _id: null },
      roomID: groupId,
      roomMessages,
    };

    io.to(groupId).emit(socketEvents.RECEIVE_MESSAGES, socketArgs);
  };

  sendNotification = async (io: any, userId: string, notification: Notification) => {
    io.to(userId).emit(socketEvents.NEW_NOTIFICATION, notification);
  };
};

export default SocketHandler;