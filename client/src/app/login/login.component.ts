import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl } from '@angular/forms'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	constructor() { }

	ngOnInit() { }

	loginForm = new FormGroup({
		username: new FormControl("")
	})

	get username(){ return this.loginForm.get('username') }

}
