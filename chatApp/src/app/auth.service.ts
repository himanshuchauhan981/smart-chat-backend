import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   constructor(private _http: HttpClient) { }

   get_user_details(username,email,password){
      var data = {
         'a':username,
         'b':email,
         'c':password
      }
      return this._http.post('/chat/save_details',data).subscribe();
   }
}
