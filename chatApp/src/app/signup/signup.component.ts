import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from './confirm-password.validator';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

   registerForm : FormGroup;
   submitted = false;
   submitError: boolean = false;
   private usernameErrorText:string;

   constructor(
      private formBuilder:FormBuilder,
      private Auth: AuthService,
      private route: Router
   ) {}

   ngOnInit(){
      this.registerForm = this.formBuilder.group({
         username:['',Validators.required],
         email_id:['',[Validators.required,Validators.email]],
         pass:['',[Validators.required,Validators.minLength(6)]],
         con_pass:['',[Validators.required]]
      },{
          validator: MustMatch('pass', 'con_pass')
      });
   }

   get f() { return this.registerForm.controls; }

   registerUser(event){
      this.submitted = true;
      if(this.registerForm.invalid){
         console.log('Invalid Submission');
         return;
      }
      const target = event.target;
      const username = target.querySelector('#username_text').value;
      const email = target.querySelector('#email_text').value;
      const password = target.querySelector('#password_text').value;

      this.Auth.get_user_details(username,email,password).subscribe(err =>{
            this.submitError = true;
            console.log(err);
      });
   }
}
