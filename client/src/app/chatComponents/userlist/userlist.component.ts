import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { MESSAGE_COUNT, PrivateChats } from "src/app/chat-interface";
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

    this.chatService.onlineStatus.subscribe((onlineUser) => {
      if (onlineUser && this.privateChatsList.length !== 0) {
        let objIndex = this.privateChatsList.findIndex(
          (obj) =>
            obj.receiver._id === onlineUser.userId ||
            obj.sender._id === onlineUser.userId
        );

        if (objIndex !== -1) {
          this.privateChatsList[objIndex].receiver.isActive = onlineUser.status;
          this.privateChatsList[objIndex].sender.isActive = onlineUser.status;
        }
      }

      if (onlineUser && this.userList.length !== 0) {
        let objIndex = this.userList.findIndex(
          (obj) => obj._id === onlineUser.userId
        );

        if (objIndex !== -1) {
          this.userList[objIndex].isActive = onlineUser.status;
        }
      }
    });

    this.chatService.socket.on(
      "PRIVATE_MESSAGES_COUNT",
      (socketData: MESSAGE_COUNT) => {
        if (socketData) {
          let objIndex = this.privateChatsList.findIndex(
            (obj) => obj.receiver._id === socketData.id
          );

          if (objIndex !== -1) {
            this.privateChatsList[objIndex].unReadCount =
              socketData.newMessagesCount;
            this.privateChatsList[objIndex].createdDate =
              socketData.createdDate;
            this.privateChatsList[objIndex].text = socketData.text;

            this.privateChatsList.sort((a, b) =>
              a.createdDate < b.createdDate ? 1 : -1
            );
          }
        }
      }
    );
    this.chatService.userListLatestMessage.subscribe((data) => {
      if (data) {
        console.log(data);
        console.log(this.privateChatsList);
        let objIndex = this.privateChatsList.findIndex(
          (obj) =>
            obj.receiver._id == data.receiver._id &&
            obj.sender._id == data.sender._id
        );

        if (objIndex !== -1) {
          this.privateChatsList[objIndex].text = data.text;
          this.privateChatsList[objIndex].createdDate = data.createdDate;

          this.privateChatsList.sort((a, b) =>
            a.createdDate < b.createdDate ? 1 : -1
          );
        }
      }
    });
    // -----------------------------------------------------

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
      this.privateChatsList = res["privateChats"];
      this.activeUserListType = "private";
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
