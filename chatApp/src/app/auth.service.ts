import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
   constructor(private _http: HttpClient) { }

   public usernameDetails: any;

   get_user_details = function(username, email, password) {
      const data = {
         'username': username,
         'email': email,
         'password': password
      };
      return this._http.post('/chat/save_details', data);
   };
   checkUserDetail = function(loginUsername, loginPassword) {
      const data = {
         'loginUsername': loginUsername,
         'loginPassword': loginPassword
      };
      return this._http.post('/chat/check_details', data);
   };

   showRegisteredUsers = function() {
     return this._http.get('/chat/getUsernames').subscribe(
       res => console.log(res));
   };
}
