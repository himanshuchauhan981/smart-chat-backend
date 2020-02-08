import { Injectable } from '@angular/core'
import * as io from 'socket.io-client'
import { Subject } from 'rxjs'

import { UserService } from './user.service'

interface UserList {
	name: string,
	socketId: string
}

@Injectable({
	providedIn: 'root'
})
export class ChatService {

	socket : SocketIOClient.Socket

	userListObservable = new Subject<any>()

	createUser(name,id){
		return {
			name: name,
			socketId: id
		}
	}

	constructor(private userService: UserService) {
		this.socket = io(this.userService.baseUrl)
	}

	initiateSocket(currentUser){
		this.socket.on('connect',()=>{
			let createdUser = this.createUser(currentUser,this.socket.id)
			this.socket.emit('CONNECT_USERS',createdUser, currentUser)
		})

		this.socket.on('CONNECTED_USERS',(activeUsers)=>{
			this.userListObservable.next(activeUsers)
		})

		this.socket.emit('ACTIVE_USERS',currentUser)
	}
}
