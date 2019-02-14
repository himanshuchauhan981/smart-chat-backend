import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private _http: HttpClient) {
  }

  get_user_details = function (username, email, password) {
    const data = {
      'username': username,
      'email': email,
      'password': password
    };
    return this._http.post('/chat/save_details', data);
  };

  checkUserDetail = function (loginUsername, loginPassword) {
    const data = {
      'loginUsername': loginUsername,
      'loginPassword': loginPassword
    };
    return this._http.post('/chat/check_details', data);
  };

  showRegisteredUsers = function () {
    return this._http.get('/chat/getUsernames');
  };

  sendMessageDetails = function (data) {
    return this._http.post('/chat/saveChats', data);
  };

  communityChats = function () {
    return this._http.get('/chat/getCommunityChats');
  };

  makeCurrentUserOnline = function(onlineUserName){
    const data= {
      'onlineUserName':onlineUserName
    };
    return this._http.post('/chat/makeOnline',data);
  }

  makeCurrentUserOffline = function(onlineUserName){
    const data = {
      'onlineUserName':onlineUserName
    };
    return this._http.post('/chat/makeOffline',data);
  }
}
