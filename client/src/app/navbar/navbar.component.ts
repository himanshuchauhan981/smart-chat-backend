import { Component, OnInit } from '@angular/core'
import{ Router } from '@angular/router'

import { UserService } from '../service/user.service'
import { ChatService } from '../service/chat.service'

@Component({
	selector: 'chat-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	currentUser : string

	constructor(
		private userService: UserService,
		private router: Router,
		private chatService: ChatService
	) { }

	ngOnInit() {
		this.userService.getUsername()
		.subscribe((res: any)=>{
			this.currentUser = res.username
		})
	}

	logoutUser(){
		// this.userService.logOutUser()
		// .subscribe((res:any) =>{
		// 	this.userService.removeJWTToken()
		// 	this.router.navigate(['/login'])
		// })
		this.chatService.logoutUser()
		this.userService.removeJWTToken()
		this.router.navigate(['/login'])
	}

}