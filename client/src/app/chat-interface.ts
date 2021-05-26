export interface UserDetails {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface DecodedToken {
  expiresIn?: string;
  id?: string;
  iat?: Number;
}

export interface RECEIVE_MESSAGES {
  receiverDetails: ReceiverDetails;
  roomMessages: RoomMessages[];
  roomID: string;
}

export interface ReceiverDetails {
  _id: string;
  name: string;
  roomId: string;
}

export interface Sender {
  _id: string;
  firstName: string;
  lastName: string;
  isActive: string;
}

export interface Receiver {
  _id: string;
  firstName: string;
  lastName: string;
  isActive: string;
}

export interface RoomMessages {
  _id: string;
  isRead: boolean;
  text: string;
  createdDate: string;
  sender: Sender;
  receiver: Receiver;
}

export interface PrivateChats {
  text: string;
  receiver: Receiver;
  sender: Sender;
  createdDate: string;
  unReadCount: number;
}

export interface OnlineStatus {
  userId: string;
  status: string;
}

export interface MESSAGE_COUNT {
  id: string;
  newMessagesCount: number;
  createdDate: string;
  text: string;
}

export interface ADD_GROUP_MEMBERS {
  group: string;
  children: Array<{
    _id: string;
    isActive: string;
    name: string;
    checked: boolean;
  }>;
}
