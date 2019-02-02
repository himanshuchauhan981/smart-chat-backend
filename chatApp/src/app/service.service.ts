import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
@Injectable({
   providedIn: 'root'
})

export class ServiceService {
   constructor(public http: HttpClient) { }

}
