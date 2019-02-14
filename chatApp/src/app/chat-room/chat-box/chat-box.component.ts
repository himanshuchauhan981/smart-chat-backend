import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../chat.service';
import {Router, ActivatedRoute} from '@angular/router';
import {AuthService} from '../../auth.service';


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [ChatService, AuthService]
})
export class ChatBoxComponent implements OnInit {
  public user: string;
  public messageArray: Array<{ user: String, message: String }> = [];
  public communityMessageArray : string;
  public messageText: string;

  constructor(private _chatService: ChatService, private _route: ActivatedRoute, private router: Router, private _authService: AuthService) {
    this._route.queryParams.subscribe(params => {
      this.user = params['user'];
    });

    // When new user join, then previous user would get notification of new user
    this._chatService.newUserJoined().subscribe(data => this.messageArray.push(data));

    // When user leaves, then othe users would get notification of left user.
    this._chatService.userLeftRoom().subscribe(data => this.messageArray.push(data));

    // All the connected users will receive new messages from particular user
    this._chatService.newMessageReceived().subscribe(data => this.messageArray.push(data));
  }

  ngOnInit() {

    // Login User Joins the community room
    this._chatService.joinRoom({user: this.user});
    this._authService.communityChats().subscribe(data => this.communityMessageArray= data);
  }

  leave() {
    this._chatService.leaveCommunityRoom({user: this.user});
  }

  sendMessage() {
    this._chatService.sendMessage({user: this.user, message: this.messageText});
    this._authService.sendMessageDetails({sender: this.user, message: this.messageText}).subscribe();
  }

  remove() {
    this._chatService.removeUser();
    this._authService.makeCurrentUserOffline(this.user).subscribe();
    return this.router.navigate(['/login']);
  }

}
