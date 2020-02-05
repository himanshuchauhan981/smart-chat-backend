import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/service/chat.service';

@Component({
	selector: 'userlist',
	templateUrl: './userlist.component.html',
	styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

	activeUserList = []

	constructor(private chatService: ChatService) { }

	ngOnInit() {
		this.chatService.userListObservable.subscribe((data)=>{
			this.activeUserList = data
			console.log(this.activeUserList)
		})
	}

}
