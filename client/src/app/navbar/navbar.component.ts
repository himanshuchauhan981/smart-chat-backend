import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'

import { UserService } from '../service/user.service'
import { ChatService } from '../service/chat.service'
import { GroupChatComponent } from '../chatComponents/group-chat/group-chat.component'

@Component({
	selector: 'chat-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	currentUser: string

	constructor(
		private userService: UserService,
		private router: Router,
		private chatService: ChatService,
		private dialog: MatDialog
	) { }

	ngOnInit() { }

	logoutUser() {
		this.chatService.logoutUser()
		this.userService.removeToken()
		this.router.navigate(['/login'])
	}

	createGroup() {
		this.dialog.open(GroupChatComponent, {
			width: '400px',
			data: this.currentUser,
			autoFocus: false
		})
	}

}