import { Component, OnInit } from '@angular/core'
import{ Router } from '@angular/router'

import { UserService } from '../service/user.service'

@Component({
	selector: 'chat-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	constructor(
		private userService: UserService,
		private router: Router
	) { }

	ngOnInit() {
	}

	logoutUser(){
		this.userService.logOutUser()
		.subscribe((res:any) =>{
			this.userService.removeJWTToken()
			this.router.navigate(['/login'])
		})
	}

}