import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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

  constructor(
    public chatService: ChatService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.chatService.userListObservable.subscribe((data) => {
      this.chatService.activeUserList = data;
    });

    this.chatService.groupListObservable.subscribe((data) => {
      this.activeGroupList = data;
    });

    // this.userService.getUsername()
    // .subscribe((res:any)=>{
    // 	this.username = res.username
    // })

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

  createRoom(sender: string, reciever: string) {
    sender = sender.toLocaleLowerCase();
    reciever = reciever.toLocaleLowerCase();
    let roomArray = [];
    roomArray.push(sender, reciever);
    let roomID = roomArray.sort().toString();
    return roomID;
  }

  generateRoomID(user) {
    let sender = this.username;
    let fullName = `${user.firstName} ${user.lastName}`;
    let roomID = this.createRoom(sender, user.username);
    this.chatService.joinRoom(roomID, sender, user.username, fullName);
  }

  generateGroupId(groupName: string) {
    this.chatService.joinGroup(groupName, this.username);
  }
}
