import { Component, OnInit } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { MatSnackBar } from '@angular/material'

import { UserService } from '../service/user.service'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginError: string = null

	constructor(
		private userService: UserService,
		private router: Router,
		private titleService: Title,
		private matSnackBar: MatSnackBar
	) { }

	ngOnInit() {
		this.titleService.setTitle('Login')
	}

	loginForm = new FormGroup({
		username: new FormControl('', Validators.required),
		password: new FormControl('', Validators.required)
	})

	login(loginForm) {
		if (loginForm.status === 'INVALID') return

		this.userService.login(loginForm.value)
			.subscribe((res: any) => {
				this.userService.storeToken(res.token)
				this.router.navigateByUrl('home')
			}, (err) => {
				this.matSnackBar.open(err.error.msg, 'Close')
			})
	}
}
