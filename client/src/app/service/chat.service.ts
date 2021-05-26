import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Subject, BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { UserService } from "./user.service";
import {
  DecodedToken,
  OnlineStatus,
  ReceiverDetails,
  RECEIVE_MESSAGES,
  RoomMessages,
} from "../chat-interface";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  socket: SocketIOClient.Socket;
  baseUrl: string = environment.baseUrl;
  receiverDetails: BehaviorSubject<ReceiverDetails> = new BehaviorSubject(null);
  roomMessages: BehaviorSubject<Array<RoomMessages>> = new BehaviorSubject([]);
  onlineStatus: BehaviorSubject<OnlineStatus> = new BehaviorSubject(null);
  userListLatestMessage: BehaviorSubject<any> = new BehaviorSubject(null);

  userListObservable = new Subject<any>();

  groupListObservable = new Subject<any>();

  userChatObservable = new Subject<any>();

  groupChatObservable = new Subject<any>();

  messageCountObservable = new Subject<any>();

  room: string;

  activeUserList = [];

  constructor(private userService: UserService, private http: HttpClient) {
    this.socket = io(this.userService.baseUrl);
  }

  getFriendsList() {
    let token = this.userService.getToken();

    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: token,
      }),
    };
    return this.http.get(`${this.baseUrl}/api/friendsList`, httpOptions);
  }

  getPrivateChats() {
    let token = this.userService.getToken();

    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: token,
      }),
    };
    return this.http.get(`${this.baseUrl}/api/privateChats`, httpOptions);
  }

  getGroupsList() {
    let token = this.userService.getToken();

    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: token,
      }),
    };
    return this.http.get(`${this.baseUrl}/api/groups`, httpOptions);
  }

  createNewGroup(groupDetails) {
    let token = this.userService.getToken();

    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: token,
      }),
    };
    return this.http.post(
      `${this.baseUrl}/api/group`,
      groupDetails,
      httpOptions
    );
  }

  listAllUsers = () => {
    let token = this.userService.getToken();

    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: token,
      }),
    };
    return this.http.get(`${this.baseUrl}/api/users`, httpOptions);
  };

  addNewMembers = (members, groupId) => {
    let token = this.userService.getToken();

    let httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: token,
      }),
    };

    return this.http.post(
      `${this.baseUrl}/api/group/${groupId}/addMembers`,
      members,
      httpOptions
    );
  };

  initiateSocket(decodeToken: DecodedToken) {
    this.socket.emit("CREATE_USER_SOCKET", decodeToken.id);

    this.socket.on("RECEIVE_MESSAGES", (socketData: RECEIVE_MESSAGES) => {
      this.receiverDetails.next({
        ...socketData.receiverDetails,
        roomId: socketData.roomID,
      });

      this.roomMessages.next(socketData.roomMessages);
    });

    this.socket.on("ONLINE_STATUS", (socketData) => {
      this.onlineStatus.next(socketData);
    });

    this.socket.on("RECEIVE_NEW_MESSAGE", (socketData) => {
      let { newMessage } = socketData;
      let roomId = this.receiverDetails.value.roomId;

      if (roomId === newMessage.room) {
        let oldMessages = this.roomMessages.value;
        let updatedMessages = [...oldMessages, newMessage];
        this.roomMessages.next(updatedMessages);
      }
      this.userListLatestMessage.next(newMessage);
    });
    // ---------------------------------------------------------

    this.socket.on("CONNECTED_USERS", (activeUsers) => {
      this.userListObservable.next(activeUsers["privateUsers"]);
      this.groupListObservable.next(activeUsers["userGroups"]);
    });

    this.socket.on("SHOW_GROUP_MESSAGES", (data) => {
      this.room = data.groupName;
      this.groupChatObservable.next({ groupName: this.room });
      // this.message.next(data.groupMessages);
    });

    this.socket.on("MESSAGE_COUNT", (data) => {
      this.messageCountObservable.next(data);
    });
  }

  logoutUser() {
    this.socket.emit("LOGOUT_USER");
  }

  joinPrivateRoom(roomId: string, sender: string, receiver: string) {
    this.socket.emit("JOIN_PRIVATE_ROOM", roomId, sender, receiver);
  }

  joinGroupRoom(groupId: string) {
    this.socket.emit("JOIN_GROUP_ROOM", { groupId });
  }

  sendMessage(receiver: string, text: string, room: string) {
    let decodedToken = this.userService.decodeToken();
    let sender = decodedToken["id"];
    let socketData = { sender, receiver, text, room };

    this.socket.emit("SEND_MESSAGE", socketData);
  }

  setReadingStatus(receiver) {
    this.activeUserList.filter((key) => {
      if (key["username"] === receiver) {
        key["messageCount"] = 0;
      }
      return true;
    });
  }
}
