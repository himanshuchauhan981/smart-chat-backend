import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'

import { UserService } from '../service/user.service'
import { SignUpValidators } from './signup.validators'
import { Title } from '@angular/platform-browser'

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	signupError: string = null

	constructor(
		private userService: UserService,
		private router: Router,
		private titleService: Title
	) { }

	ngOnInit(){
		this.titleService.setTitle('Sign Up')
	}

	signupForm = new FormGroup({
		username: new FormControl('',Validators.required),
		password: new FormControl('',Validators.required),
		confirmpassword: new FormControl('',Validators.required),
		email: new FormControl('',[Validators.required, Validators.email])
	},
	{
		validators: SignUpValidators.MustMatch
	})

	submit(signupForm){
		if(signupForm.status === 'INVALID') return 
		this.userService.signUp(signupForm.value)
		.subscribe((res: any) =>{
			if(!res.signUpStatus){
				this.signupError = res.msg
			}
			else{
				this.router.navigate(['login'])
			}
		})
	}
}
