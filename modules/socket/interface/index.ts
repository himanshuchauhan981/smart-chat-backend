import mongoose from "mongoose";
import { Socket } from "socket.io";

interface File {
  url?: string;
  name?: string;
};

interface SendMessagePayload {
  sender: string;
  receiver: string;
  text?: string;
  type: string;
  room: string;
  roomId: string;
  file?: File[];
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

interface NewRoom {
  type: string;
  members: mongoose.Types.ObjectId[],
};

export {
  SendMessagePayload,
  GroupMembersPayload,
  NewGroup,
  ISocket,
  NewRoom,
};