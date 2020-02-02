import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	constructor() { }

	ngOnInit() {
	}

	signupForm = new FormGroup({
		signupusername: new FormControl('',Validators.required),
		signuppassword: new FormControl('',Validators.required),
		signupConfirmpassword: new FormControl('',Validators.required)
	})

	get signupusername(){ return this.signupForm.get('signupusername') }

	get signuppassword(){ return this.signupForm.get('signuppassword') }

	get signupConfirmpassword(){ return this.signupForm.get('signupConfirmpassword') }
}
