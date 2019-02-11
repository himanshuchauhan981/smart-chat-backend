import { Component, OnInit } from '@angular/core';
import {ChatService} from '../chat.service';
import {ActivatedRoute} from '@angular/router';


@Component({
   selector: 'app-chat-room',
   templateUrl: './chat-room.component.html',
   styleUrls: ['./chat-room.component.css'],
   providers:[ChatService]
})
export class ChatRoomComponent implements OnInit {
   public user : string;
   public messageArray:Array<{user:string, message:string}> = []
   public messageText:string;

   constructor(private _chatService : ChatService, private _route:ActivatedRoute){
      this._route.queryParams.subscribe(params =>{
         this.user = params["user"];
      });

      // When new user join, then previous user would get notification of
      // new active user
      this._chatService.newUserJoined().subscribe(data=> this.messageArray.push(data))
      this._chatService.userLeftRoom().subscribe(data=> this.messageArray.push(data))
      this._chatService.newMessageReceived().subscribe(data=>this.messageArray.push(data));
   }
   ngOnInit(){
      //Login User Joins the community room
      this._chatService.joinRoom({user:this.user})
   }
   leave(){
      this._chatService.leaveRoom({user:this.user})
   }
   sendMessage(){
      this._chatService.sendMessage({user:this.user, message:this.messageText});
   }
   private room: string = 'community';

}
