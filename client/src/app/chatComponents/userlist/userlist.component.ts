import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { PrivateChats } from "src/app/chat-interface";
import { ChatService } from "src/app/service/chat.service";
import { UserService } from "src/app/service/user.service";

@Component({
  selector: "userlist",
  templateUrl: "./userlist.component.html",
  styleUrls: ["./userlist.component.css"],
})
export class UserlistComponent implements OnInit {
  activeGroupList = [];

  username: string;
  activeUserListType: string = "private";
  userList = [];
  privateChatsList: PrivateChats[] = [];

  constructor(
    public chatService: ChatService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPrivateChatsList();

    this.chatService.userListObservable.subscribe((data) => {
      this.chatService.activeUserList = data;
    });

    this.chatService.groupListObservable.subscribe((data) => {
      this.activeGroupList = data;
    });

    this.chatService.messageCountObservable.subscribe((data) => {
      let index = this.chatService.activeUserList.findIndex(
        (user) => user._id === data.sender
      );
      let messageCount = this.chatService.activeUserList[index].messageCount;
      this.chatService.activeUserList[index].messageCount = messageCount + 1;
    });
  }

  logoutUser() {
    this.chatService.logoutUser();
    this.userService.removeToken();
    this.router.navigate(["/login"]);
  }

  getFriendsList() {
    this.chatService.getFriendsList().subscribe((res: any) => {
      this.activeUserListType = "friends";
      this.userList = res.friendsList;
    });
  }

  getPrivateChatsList() {
    this.chatService.getPrivateChats().subscribe((res) => {
      console.log(res["privateChats"]);
      this.privateChatsList = res["privateChats"];
    });
  }

  createRoom(sender: string, reciever: string) {
    let roomArray = [];
    roomArray.push(sender, reciever);
    let roomID = roomArray.sort().toString();
    return roomID;
  }

  generateRoomID(receiver: string) {
    let decodedToken = this.userService.decodeToken();
    let sender = decodedToken["id"];
    let roomID = this.createRoom(sender, receiver);
    this.chatService.joinRoom(roomID, sender, receiver);
  }

  generateGroupId(groupName: string) {
    this.chatService.joinGroup(groupName, this.username);
  }
}
