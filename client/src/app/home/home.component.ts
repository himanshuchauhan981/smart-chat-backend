import { Component, OnInit } from "@angular/core";

import { UserService } from "../service/user.service";
import { ChatService } from "../service/chat.service";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { DecodedToken } from "../chat-interface";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  currentUser: string;

  showChatWindow: Boolean = false;

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private titleService: Title,
    private router: Router
  ) {}

  ngOnInit() {
    let decodedToken: DecodedToken = this.userService.decodeToken();
    if (decodedToken) {
      this.chatService.initiateSocket(decodedToken);
    } else {
      this.router.navigateByUrl("/login");
    }

    // this.userService.getUsername();
    // .subscribe((res : any)=>{
    // 	this.currentUser = res.username
    // 	this.titleService.setTitle(`${res.firstName} ${res.lastName}`)

    // })
    // else
    //   this.chatService.activeChatWindow.subscribe((status) => {
    //     this.showChatWindow = status;
    //   });
  }
}
