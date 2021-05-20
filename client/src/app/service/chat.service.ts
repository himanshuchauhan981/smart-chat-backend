import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { Subject, BehaviorSubject } from "rxjs";

import { UserService } from "./user.service";
import { Title } from "@angular/platform-browser";
import { DecodedToken } from "../chat-interface";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  socket: SocketIOClient.Socket;
  baseUrl: string = environment.baseUrl;

  userListObservable = new Subject<any>();

  groupListObservable = new Subject<any>();

  activeChatWindow = new Subject<Boolean>();

  userChatObservable = new Subject<any>();

  groupChatObservable = new Subject<any>();

  messageCountObservable = new Subject<any>();

  room: string;

  message: BehaviorSubject<Array<any>> = new BehaviorSubject([]);

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

  initiateSocket(decodeToken: DecodedToken) {
    this.socket.emit("CREATE_USER_SOCKET", decodeToken.id);

    // ---------------------------------------------------------

    this.socket.on("CONNECTED_USERS", (activeUsers) => {
      this.userListObservable.next(activeUsers["privateUsers"]);
      this.groupListObservable.next(activeUsers["userGroups"]);
    });

    this.socket.on(
      "SHOW_USER_MESSAGES",
      (messages, receiver: string, roomID: string, fullName: string) => {
        this.setReadingStatus(receiver);
        this.userChatObservable.next({
          receiverId: receiver,
          receiverFullName: fullName,
        });
        this.room = roomID;
        this.message.next(messages);
      }
    );

    this.socket.on("RECEIVE_MESSAGE", (messageData) => {
      if (this.room === messageData.room) {
        let oldMessages = this.message.value;
        let updatedMessages = [...oldMessages, messageData];
        this.message.next(updatedMessages);
      }
    });

    this.socket.on("SHOW_GROUP_MESSAGES", (data) => {
      this.room = data.groupName;
      this.groupChatObservable.next({ groupName: this.room });
      this.message.next(data.groupMessages);
    });

    this.socket.on("MESSAGE_COUNT", (data) => {
      this.messageCountObservable.next(data);
    });
  }

  setActiveChatWindow() {
    this.activeChatWindow.next(true);
  }

  logoutUser() {
    this.socket.emit("LOGOUT_USER");
  }

  joinRoom(roomId: string, sender: string, receiver: string, fullName: string) {
    this.activeChatWindow.next(true);
    this.socket.emit("JOIN_ROOM", roomId, sender, receiver, fullName);
  }

  sendMessage(
    sender: string,
    receiver: string,
    message: string,
    messageType: string
  ) {
    this.socket.emit(
      "SEND_MESSAGE",
      sender,
      receiver,
      message,
      this.room,
      messageType
    );
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
    this.activeChatWindow.next(true);
    this.socket.emit("JOIN_GROUP", groupName, sender);
  }

  updateMessageCount(message) {
    this.userListObservable.subscribe((data) => {
      console.log(data);
    });
  }
}
