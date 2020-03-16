import { Injectable } from '@angular/core'
import * as io from 'socket.io-client'
import { Subject, BehaviorSubject } from 'rxjs'

import { UserService } from './user.service'
import { Title } from '@angular/platform-browser'

@Injectable({
	providedIn: 'root'
})
export class ChatService {

	socket : SocketIOClient.Socket

	userListObservable = new Subject<any>()

	activeChatWindow = new Subject<Boolean>()

	receiver = new Subject<string>()

	room : string

	message : BehaviorSubject<Array<any>> = new BehaviorSubject([])

	typingStatus = new Subject<Boolean>()

	typingUsername : string

	activeUserList = []

	constructor(private userService: UserService,private titleService: Title) {
		this.socket = io(this.userService.baseUrl)
		this.activeChatWindow.next(false)
	}

	initiateSocket(currentUser){
		
		this.socket.emit('SET_USER_SOCKET',currentUser)

		this.socket.on('CONNECTED_USERS',(activeUsers)=>{
			this.userListObservable.next(activeUsers)
		})

		this.socket.on('SHOW_USER_MESSAGES',(messages,receiver,roomID)=>{
			this.setReadingStatus(receiver)

			this.receiver.next(receiver)
			this.room = roomID
			this.message.next(messages)
		})

		this.socket.on('RECEIVE_MESSAGE',messageData =>{
			if(this.room === messageData.room){
				
				let oldMessages = this.message.value;
				let updatedMessages = [...oldMessages, messageData];
				this.message.next(updatedMessages);
			}
		})

		this.socket.on('TYPING_STATUS',(typingStatus,receiver)=>{
			this.typingUsername = receiver
			this.typingStatus.next(typingStatus)
		})
	}

	setActiveChatWindow(){
		this.activeChatWindow.next(true)
	}

	logoutUser(){
		this.socket.emit('LOGOUT_USER')
	}

	joinRoom(roomId, sender, receiver){
		this.activeChatWindow.next(true)
		this.socket.emit('JOIN_ROOM',roomId, sender, receiver)
	}

	sendMessage(receiver,message){
		this.socket.emit('SEND_MESSAGE',receiver,message,this.room)
	}

	emitTypingStatus(typingStatus,receiver){
		this.socket.emit('USER_TYPING_STATUS',this.room,typingStatus,receiver)
	}

	setReadingStatus(receiver){
		this.activeUserList.filter((key) =>{
			if(key['username'] === receiver){
				key['messageCount'] = 0
			}
			return true
		})
	}
}
