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
  firstName: string;
  lastName: string;
  roomId: string;
}

export interface Sender {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Receiver {
  _id: string;
  firstName: string;
  lastName: string;
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
  createdDate: string;
  unReadCount: number;
  isActive: boolean;
}
