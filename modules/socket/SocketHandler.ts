import socketEvents from "../../constants/socketEvents";
import { Chat } from "../../schemas/chats";
import { GroupDetails } from "../../schemas/groupDetails";
import { User, UserChatStatus } from "../../schemas/users";
import AuthHandler from "../auth/AuthHandler";
import ChatHandler from "../chats/ChatHandler";
import GroupChatHandler from "../group-chats/GroupChatHandler";
import { GroupMembersPayload, SendMessagePayload } from "./interface";


class SocketHandler {

  private socketUser: any = {};
  private authHandler: AuthHandler;
  private chatHandler: ChatHandler;
  private groupChatHandler: GroupChatHandler;

  constructor() {
    this.authHandler = new AuthHandler();
    this.chatHandler = new ChatHandler();
    this.groupChatHandler = new GroupChatHandler();
  }

  public joinSocket = async (userId: string, socket: any) => {
    socket.userId = userId;

    this.socketUser[userId] = socket;

    const userChatStatus = await this.authHandler.updateChatStatus(userId, UserChatStatus.online) as User;

    const socketData = {
			userId,
			status: socketEvents.ONLINE_STATUS,
		};

    // const userData = {
		// 	firstName: userChatStatus.firstName,
		// 	lastName: userChatStatus.lastName,
		// };

    socket.broadcast.emit(socketEvents.ONLINE_STATUS, socketData);

		// this.socketUser[userChatStatus?._id.toString()].emit(socketEvents.SOCKET_USER_DATA, userData);
  }

  removeUser = async (socket: any, io: any) => {
    const { userId } = socket;

    delete this.socketUser[userId];

    if(userId) {
      const userChatStatus = await this.authHandler.updateChatStatus(userId, UserChatStatus.offline);

      // const socketData = {
      //   userId: userChatStatus?._id.toString(),
      //   status: userChatStatus?.userStatus
      // };

      // io.emit(socketEvents.ONLINE_STATUS, socketData);
    }
  };

  joinPrivateRoom = async (socket: any, io: any, room: string, senderId: string, receiverId: string) => {
    socket.join(room);

    const { data: { user }} = await this.authHandler.findUser(receiverId);

    await this.chatHandler.readMessages(room, receiverId);

    const roomMessages = await this.chatHandler.privateChatMessages(room, senderId);

    const socketReceiveMessages = {
      receiverDetails: user,
      room,
      roomMessages,
    };

    io.to(room).emit(socketEvents.RECEIVE_MESSAGES, socketReceiveMessages);

    const senderSocket = this.socketUser[senderId];

    if(senderSocket) {
      const senderSocketData = {
        newMessageCount: 0,
        id: receiverId,
				text: roomMessages.length ? roomMessages[roomMessages.length - 1]?.text: null,
				createdAt: roomMessages.length ? roomMessages[roomMessages.length -1]?.createdAt: null,
      };

      io.to(senderSocket.id).emit(socketEvents.PRIVATE_MESSAGES_COUNT, senderSocketData);
    }
  };

  sendMessage = async (io: any, messagePayload: SendMessagePayload) => {
    if(messagePayload.receiver) {

      const newMessage = await this.chatHandler.create(messagePayload);

      const count = await this.chatHandler.countDocuments(messagePayload.room, false, messagePayload.sender);

      io.to(messagePayload.room).emit(socketEvents.RECEIVE_NEW_MESSAGE, { newMessage });

      const receiverSocket = this.socketUser[messagePayload.receiver];

      if(receiverSocket) {

        const receiverSocketData = {
          newMessagesCount: count,
          id: messagePayload.sender,
          createdAt: newMessage.createdAt,
          text: messagePayload.text,
          sender: newMessage.sender,
          receiver: newMessage.receiver,
        };

        io.to(this.socketUser[messagePayload.receiver].id).emit(socketEvents.PRIVATE_MESSAGES_COUNT, receiverSocketData);
      }
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

			io.to(messagePayload.room).emit(socketEvents.GROUP_MESSAGES_COUNT,receiverSocketData);
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

    groupMembers.forEach(item =>{
      if(item.userId in this.socketUser) {
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
};

export default SocketHandler;