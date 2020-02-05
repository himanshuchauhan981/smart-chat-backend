import { Component, OnInit } from '@angular/core'
import * as io from 'socket.io-client'

import { UserService } from '../service/user.service'
import { ChatService } from '../service/chat.service'

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	currentUser : string

	constructor(
		private userService: UserService,
		private chatService: ChatService,
	) {  }

	ngOnInit() {
		this.userService.getUsername()
		.subscribe((res : any)=>{
			this.currentUser = res.username
			this.chatService.initiateSocket(this.currentUser)
		})
	}
}
