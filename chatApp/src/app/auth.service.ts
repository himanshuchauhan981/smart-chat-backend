import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   constructor(private _http: HttpClient) { }

   get_user_details = function(username,email,password){
      const data = {
         'username':username,
         'email':email,
         'password':password
      }
      return this._http.post('/chat/save_details',data);
   }
   checkUserDetail = function(loginUsername, loginPassword){
      const data = {
         'loginUsername':loginUsername,
         'loginPassword':loginPassword
      }
      return this._http.post('/chat/check_details',data);
   }
}
