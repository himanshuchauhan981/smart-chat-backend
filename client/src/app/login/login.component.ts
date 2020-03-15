import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { UserService } from '../service/user.service'
import { Title } from '@angular/platform-browser'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginError : string = null

	constructor(
		private userService : UserService,
		private router: Router,
		private titleService: Title
	) { }

	ngOnInit(){
		this.titleService.setTitle('Login')
	}

	loginForm = new FormGroup({
		username : new FormControl('',Validators.required),
		password : new FormControl('',Validators.required)
	})

	login(loginForm){
		if(loginForm.status === 'INVALID') return

		this.userService.login(loginForm.value)
		.subscribe((res :any)=>{
			if(!res.loginStatus){
				this.loginError = res.loginError
			}
			else{
				this.userService.storeToken(res.token)
				this.router.navigate(['home'])
			}
		})
	}
}
