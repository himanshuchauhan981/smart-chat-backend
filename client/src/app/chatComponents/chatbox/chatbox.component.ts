import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

import { ChatService } from "src/app/service/chat.service";
import { FormGroup, FormControl } from "@angular/forms";
import { UserService } from "src/app/service/user.service";
import { RoomMessages } from "src/app/chat-interface";

@Component({
  selector: "chatbox",
  templateUrl: "./chatbox.component.html",
  styleUrls: ["./chatbox.component.css"],
})
export class ChatboxComponent implements OnInit {
  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}

  receiverName: string;
  roomId: string;
  receiverId: string;
  roomMessages: RoomMessages[] = [];

  sender: string;

  receiverUsername: string;

  typing: Boolean = false;

  messageType: string;

  @ViewChild("clearMessage", { static: false }) clearMessage: ElementRef;

  sendMessageForm = new FormGroup({
    message: new FormControl(""),
  });

  ngOnInit() {
    // this.userService.getUsername().subscribe((res:any) =>{
    // 	this.sender = res.username
    // })

    this.chatService.receiverDetails.subscribe((data) => {
      if (data) {
        this.receiverName = `${data.firstName} ${data.lastName}`;
        this.roomId = data.roomId;
        this.receiverId = data._id;
      }

      // this.receiverFullName = data.receiverFullName
      // this.receiverUsername = data.receiverId
      // this.messageType = 'PRIVATE'
    });

    this.chatService.roomMessages.subscribe((messages) => {
      this.roomMessages = messages;
    });

    // this.chatService.message.subscribe((messages) => {
    //   this.roomMessages = messages;
    // });

    this.chatService.groupChatObservable.subscribe((data) => {
      this.messageType = "GROUP";
      // this.receiverFullName = this.receiverUsername = data.groupName
    });
  }

  sendMessage(sendMessageForm: FormGroup) {
    this.chatService.sendMessage(
      this.receiverId,
      sendMessageForm.value.message,
      this.roomId
    );
    this.clearMessage.nativeElement.value = "";
  }
}
