import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	constructor() { }

	ngOnInit() { }

	loginForm = new FormGroup({
		loginusername : new FormControl('',Validators.required),
		loginpassword : new FormControl('',Validators.required)
	})

	get loginusername(){ return this.loginForm.get('loginusername') }

	get loginpassword(){ return this.loginForm.get('loginpassword') }

	loginUser(loginForm){
		console.log(loginForm)
	}
}
