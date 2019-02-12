import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import * as io from 'socket.io-client';


@Injectable({
   providedIn: 'root'
})
export class ChatService {
   // Creating new Connections from frontend side
   private socket = io('http://localhost:1234');

   constructor() { }

   // Function for login user to join community room
   joinRoom(data) {
      this.socket.emit('join', data);
   }

   newUserJoined() {
      const observable = new Observable<{user: string, message: string}>(observer => {
         this.socket.on('New user joined', (data) => {
            observer.next(data);
         });
         return () => {this.socket.disconnect(); };
      });
      return observable;
   }

   // Function for users to leave community room
   leaveRoom(data) {
     this.socket.emit('leave', data);
   }

   userLeftRoom() {
      const observable = new Observable<{user: string, message: string}>(observer => {
         this.socket.on('left room', (data) => {
            observer.next(data);
         });
         return () => {this.socket.disconnect(); };
      });
      return observable;
   }

   sendMessage(data) {
      this.socket.emit('message', data);
   }

   newMessageReceived() {
      const observable = new Observable<{user: string, message: string}>(observer => {
         this.socket.on('new message', (data) => {
            observer.next(data);
         });
         return () => { this.socket.disconnect(); };
      });
      return observable;
   }

   removeUser() {
     this.socket.on('disconnect', () => {
       this.socket.disconnect();
       console.log('hello');
       console.log(this.socket.id + 'got disconnected');
     });
   }
}
