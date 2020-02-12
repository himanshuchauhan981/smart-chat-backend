import { Injectable } from '@angular/core'
import * as io from 'socket.io-client'
import { Subject, BehaviorSubject } from 'rxjs'

import { UserService } from './user.service'

@Injectable({
	providedIn: 'root'
})
export class ChatService {

	socket : SocketIOClient.Socket

	userListObservable = new Subject<any>()

	activeChatWindow = new Subject<Boolean>()

	receiver = new Subject<string>()

	room : string

	// message = new Subject<Array<any>>()
	message : BehaviorSubject<Array<any>> = new BehaviorSubject([])

	typingStatus = new Subject<Boolean>()


	// createUser(name,id){
	// 	return {
	// 		name: name,
	// 		socketId: id
	// 	}
	// }

	constructor(private userService: UserService) {
		this.socket = io(this.userService.baseUrl)
		this.activeChatWindow.next(false)
	}

	initiateSocket(currentUser){
		this.socket.emit('SET_USER_SOCKET',currentUser)
		// this.socket.on('connect',()=>{
		// 	let createdUser = this.createUser(currentUser,this.socket.id)
		// 	this.socket.emit('CONNECT_USERS',createdUser, currentUser)
		// })

		this.socket.on('CONNECTED_USERS',(activeUsers)=>{
			this.userListObservable.next(activeUsers)
		})

		// this.socket.emit('ACTIVE_USERS',currentUser)

		this.socket.on('SHOW_USER_MESSAGES',(messages,receiver,roomID)=>{
			this.receiver.next(receiver)
			this.room = roomID
			this.message.next(messages)
			// console.log(messages)
		})

		this.socket.on('RECEIVE_MESSAGE',messageData =>{
			// let data : any = this.message.value.push(messageData)
			// this.message.next(data)
			// let data : any = this.message.value.push(messageData)
			let oldMessages = this.message.value;
			let updatedMessages = [...oldMessages, messageData];
			this.message.next(updatedMessages);
		})

		this.socket.on('USER_TYPING_STATUS',(typingStatus)=>{
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

	emitTypingStatus(typingStatus){
		this.socket.emit('USER_TYPING_STATUS',this.room,typingStatus)
	}
}
