import { Socket } from "socket.io";
interface SendMessagePayload {
  sender: string;
  receiver: string;
  text: string;
  room: string;
}

interface GroupMembersPayload {
  userId: string;
  groupId: string;
}

interface NewGroup {
  admin: string;
  name: string;
  status: string;
  image: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ISocket extends Socket {
  userId: string;
};

export {
  SendMessagePayload,
  GroupMembersPayload,
  NewGroup,
  ISocket,
};