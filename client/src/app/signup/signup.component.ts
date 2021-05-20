import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { MatSnackBar } from '@angular/material/snack-bar'
import { HttpErrorResponse } from '@angular/common/http'

import { UserService } from '../service/user.service'
import { SignUpValidators } from './signup.validators'

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	constructor(
		private userService: UserService,
		private router: Router,
		private titleService: Title,
		private matSnackBar: MatSnackBar
	) { }

	ngOnInit() {
		this.titleService.setTitle('Sign Up')
	}

	signupForm = new FormGroup({
		username: new FormControl('', Validators.required),
		password: new FormControl('', Validators.required),
		confirmpassword: new FormControl('', Validators.required),
		firstName: new FormControl('', Validators.required),
		lastName: new FormControl('', Validators.required)
	},
		{
			validators: SignUpValidators.MustMatch
		})

	submit(signupForm) {
		if (signupForm.status === 'INVALID') return
		this.userService.signUp(signupForm.value)
			.subscribe((res: any) => {
				this.router.navigateByUrl('/login');
			}, (err: HttpErrorResponse) => {
				this.matSnackBar.open(err.error.msg, 'Close')
			})
	}
}
