import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-online-user-box',
  templateUrl: './online-user-box.component.html',
  styleUrls: ['./online-user-box.component.css']
})
export class OnlineUserBoxComponent implements OnInit {

  constructor(private _auth: AuthService) { }

  ngOnInit() {
    this._auth.showRegisteredUsers();
  }

}
