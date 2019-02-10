import { Component, OnInit } from '@angular/core';

import {AuthService} from '../auth.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
  providers:[AuthService]
})
export class ChatRoomComponent implements OnInit {

  constructor(private _authService : AuthService) { }

  ngOnInit() {
  }

}
