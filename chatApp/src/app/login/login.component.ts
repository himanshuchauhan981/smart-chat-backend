import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
   loginForm:FormGroup;
   loginError: boolean = false;
   private loginErrorText: string;
   public room: string;

   constructor(private formBuilder: FormBuilder, private _auth: AuthService, private router: Router) {}

   ngOnInit(){
      this.loginForm = this.formBuilder.group({
         loginUsername:['',Validators.required],
         loginPassword:['',Validators.required]
      })
   }
   loginSubmit(event){
      const target = event.target;
      const loginUsername = target.querySelector('#loginUsernameID').value;
      const loginPassword = target.querySelector('#loginPasswordID').value;
      this._auth.checkUserDetail(loginUsername, loginPassword).subscribe(err =>{
         this.loginError = true
         this.loginErrorText = err.message;
         if(err.isUserCorrect == true){
           this._auth.makeCurrentUserOnline(loginUsername).subscribe();
           return this.router.navigate(['/chatroom'],{queryParams:{'user':loginUsername}});
         }
      });
   }
}
