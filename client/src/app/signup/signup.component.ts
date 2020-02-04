import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { SignupService } from '../service/signup.service'
import { SignUpValidators } from './signup.validators'

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	constructor(private signupService: SignupService) { }

	ngOnInit() {
	}

	signupForm = new FormGroup({
		signupusername: new FormControl('',Validators.required),
		signuppassword: new FormControl('',Validators.required),
		signupConfirmpassword: new FormControl('',Validators.required),
		signupemail: new FormControl('',[Validators.required, Validators.email])
	},
	{
		validators: SignUpValidators.MustMatch
	})

	get signupusername(){ return this.signupForm.get('signupusername') }

	get signuppassword(){ return this.signupForm.get('signuppassword') }

	get signupConfirmpassword(){ return this.signupForm.get('signupConfirmpassword') }

	get signupemail(){ return this.signupForm.get('signupemail') }

	submitUser(signupForm){
		if(signupForm.status === 'INVALID') return 
		this.signupService.saveNewUser(signupForm.value)
		.subscribe(res =>{
			console.log(res)
		})
	}
}
