import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   constructor(private _http: HttpClient) { }

   get_user_details = function(username,email,password){
      var data = {
         'username':username,
         'email':email,
         'password':password
      }
      return this._http.post('/chat/save_details',data);
   }
}
