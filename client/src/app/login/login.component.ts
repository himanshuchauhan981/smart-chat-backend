import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { UserService } from '../service/user.service'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginError : string = null

	constructor(private userService : UserService, private router: Router) { }

	ngOnInit() { }

	loginForm = new FormGroup({
		loginusername : new FormControl('',Validators.required),
		loginpassword : new FormControl('',Validators.required)
	})

	get loginusername(){ return this.loginForm.get('loginusername') }

	get loginpassword(){ return this.loginForm.get('loginpassword') }

	loginUser(loginForm){
		if(loginForm.status === 'INVALID') return

		this.userService.loginExistingUser(loginForm.value)
		.subscribe((res :any)=>{
			if(!res.loginStatus){
				this.loginError = res.loginError
			}
			else{
				this.userService.storeJWTToken(res.token)
				this.router.navigate(['home'])
			}
		})
	}
}
