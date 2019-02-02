import { Component, OnInit } from '@angular/core';
import {ServiceService} from '../service.service';
import { Router }  from '@angular/router';
import { SignupComponent } from '../signup/signup.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
   constructor(private _route: Router) { }

   ngOnInit(){
   }
   SignUpForm = () =>{
      console.log('its working');
      return this._route.navigate(['/registerForm'])
   }
}
