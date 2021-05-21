import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Subject, BehaviorSubject } from "rxjs";

import { UserService } from "./user.service";
import { Title } from "@angular/platform-browser";
import {
  DecodedToken,
  ReceiverDetails,
  RECEIVE_MESSAGES,
  RoomMessages,
} from "../chat-interface";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  socket: SocketIOClient.Socket;
  baseUrl: string = environment.baseUrl;
  receiverDetails = new Subject<ReceiverDetails>();
  roomMessages: BehaviorSubject<Array<RoomMessages>> = new BehaviorSubject([]);

  userListObservable = new Subject<any>();

  groupListObservable = new Subject<any>();

  userChatObservable = new Subject<any>();

  groupChatObservable = new Subject<any>();

  messageCountObservable = new Subject<any>();

  room: string;

  activeUserList = [];

  constructor(
    private userService: UserService,
    private titleService: Title,
    private http: HttpClient
  ) {
    this.socket = io(this.userService.baseUrl);
    // this.activeChatWindow.next(false);
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

  initiateSocket(decodeToken: DecodedToken) {
    this.socket.emit("CREATE_USER_SOCKET", decodeToken.id);

    this.socket.on("RECEIVE_MESSAGES", (socketData: RECEIVE_MESSAGES) => {
      this.receiverDetails.next({
        ...socketData.receiverDetails,
        roomId: socketData.roomID,
      });

      this.roomMessages.next(socketData.roomMessages);
      // this.setReadingStatus(receiver);
      // this.userChatObservable.next({
      //   receiverId: receiver,
      //   receiverFullName: fullName,
      // });
      // this.room = roomID;
      // this.message.next(messages);
    });

    // ---------------------------------------------------------

    this.socket.on("CONNECTED_USERS", (activeUsers) => {
      this.userListObservable.next(activeUsers["privateUsers"]);
      this.groupListObservable.next(activeUsers["userGroups"]);
    });

    // this.socket.on("RECEIVE_MESSAGE", (messageData) => {
    //   if (this.room === messageData.room) {
    //     let oldMessages = this.message.value;
    //     let updatedMessages = [...oldMessages, messageData];
    //     this.message.next(updatedMessages);
    //   }
    // });

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

  joinRoom(roomId: string, sender: string, receiver: string) {
    this.socket.emit("JOIN_ROOM", roomId, sender, receiver);
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

  joinGroup(groupName: string, sender: string) {
    // this.activeChatWindow.next(true);
    this.socket.emit("JOIN_GROUP", groupName, sender);
  }

  updateMessageCount(message) {
    this.userListObservable.subscribe((data) => {
      console.log(data);
    });
  }
}
