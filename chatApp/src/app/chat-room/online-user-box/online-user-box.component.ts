import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../auth.service';
import {ChatService} from './../../chat.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-online-user-box',
  templateUrl: './online-user-box.component.html',
  styleUrls: ['./online-user-box.component.css'],
  providers: [ChatService]
})
export class OnlineUserBoxComponent implements OnInit {
  public usernameDetails: any;
  private activeuser: string;
  constructor(private _auth: AuthService, private _chatService: ChatService, private _router: ActivatedRoute) {
    this._router.queryParams.subscribe(params => {
      this.activeuser = params['user'];
    });
  }

  ngOnInit() {
    this._auth.showRegisteredUsers().subscribe(
      res => this.usernameDetails = res);
  }

}
