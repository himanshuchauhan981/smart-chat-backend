const SocketIO = require('socket.io');

import socketEvents from "../constants/socketEvents";
import { GroupMembersPayload, SendMessagePayload } from "../modules/socket/interface";
import SocketHandler from "../modules/socket/SocketHandler";
import { GroupDetails } from "../schemas/groupDetails";

class SocketManager {
  static io: any;
  static socketHandler: SocketHandler;

  constructor(server: any) {
    SocketManager.io = SocketIO(server, { cors: { origin: '*'} });
    SocketManager.socketHandler = new SocketHandler();``
  }

  public init(): void {
    const socketHandler = new SocketHandler();

    SocketManager.io.on('connection', (socket: any) => {

      socket.on(socketEvents.CREATE_USER_SOCKET, (userId: string) => socketHandler.joinSocket(userId, socket));

      socket.on(socketEvents.DISCONNECT, () => socketHandler.removeUser(socket, SocketManager.io));

      socket.on(socketEvents.LOGOUT_USER, () => socketHandler.removeUser(socket, SocketManager.io));

      socket.on(
        socketEvents.JOIN_PRIVATE_ROOM,
        (roomId: string, sender: string, receiver: string, pageIndex: number, pageSize: number) =>
          socketHandler.joinPrivateRoom(socket, SocketManager.io, roomId, sender, receiver, pageIndex, pageSize)
      );

      socket.on(
        socketEvents.SEND_MESSAGE,
        (messagePayload: SendMessagePayload) => socketHandler.sendMessage(SocketManager.io, messagePayload)
      );

      socket.on(
        socketEvents.DELETE_PRIVATE_MESSAGE,
        (messageId: string, senderId: string) => socketHandler.deletePrivateMessage(SocketManager.io, messageId, senderId)
      )

      socket.on(socketEvents.JOIN_GROUP_ROOM, (groupId: string) => socketHandler.joinGroupRoom(SocketManager.io, groupId))
    });
  }

  static addGroupToGroupList(groupMembers: GroupMembersPayload[], groupData: GroupDetails) {
    this.socketHandler.addGroupToGroupList(SocketManager.io, groupMembers, groupData);
  }
}

export default SocketManager;