import { Component, OnInit } from '@angular/core'
import { ChatService } from 'src/app/service/chat.service'
import { UserService } from 'src/app/service/user.service'

@Component({
	selector: 'userlist',
	templateUrl: './userlist.component.html',
	styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

	activeUserList = []

	username: string

	constructor(
		private chatService: ChatService,
		private userService: UserService
	) { }

	ngOnInit() {
		this.chatService.userListObservable.subscribe((data)=>{
			this.activeUserList = data
		})

		this.userService.getUsername()
		.subscribe((res:any)=>{
			this.username = res.username
		})
	}

	createRoom(sender:string, reciever:string){
		sender = sender.toLocaleLowerCase()
		reciever = reciever.toLocaleLowerCase()
		let roomArray = []
		roomArray.push(sender,reciever)
		let roomID = roomArray.sort().toString()
		return roomID
	}

	generateRoomID(receiver){
		let sender = this.username
		// let socket = this.chatService.socket
		let roomID = this.createRoom(sender,receiver)
		
		// socket.emit('JOIN_ROOM',roomID,sender,receiver)
		// this.chatService.setActiveChatWindow()
		this.chatService.joinRoom(roomID, sender, receiver)
	}

}
