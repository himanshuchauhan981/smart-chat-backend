import { Component, OnInit, Input } from '@angular/core';
import {ChatService} from './../../chat.service';
import {Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [ChatService]
})
export class ChatBoxComponent implements OnInit {
  public user: string;
  public messageArray: Array<{user: String, message: String}> = [];
  public messageText: string;

  constructor(private _chatService: ChatService, private _route: ActivatedRoute, private router: Router) {
      this._route.queryParams.subscribe(params => {
         this.user = params['user'];
      });

      // When new user join, then previous user would get notification of
      // new active user
      this._chatService.newUserJoined().subscribe(data => this.messageArray.push(data));
      this._chatService.userLeftRoom().subscribe(data => this.messageArray.push(data));
      this._chatService.newMessageReceived().subscribe(data => this.messageArray.push(data));
  }
  ngOnInit() {
      // Login User Joins the community room
      this._chatService.joinRoom({user: this.user});
  }

  leave() {
      this._chatService.leaveRoom({user: this.user});
  }

  sendMessage() {
      this._chatService.sendMessage({user: this.user, message: this.messageText});
  }

  remove() {
    this._chatService.removeUser();
    return this.router.navigate(['/login']);
  }

}
