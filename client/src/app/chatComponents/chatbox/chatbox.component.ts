import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'

import { ChatService } from 'src/app/service/chat.service'
import { FormGroup, FormControl } from '@angular/forms'
import { UserService } from 'src/app/service/user.service'

@Component({
	selector: 'chatbox',
	templateUrl: './chatbox.component.html',
	styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

	constructor(private chatService: ChatService,private userService: UserService) { }

	sender : string

	receiver : string

	roomMessages = []

	typing : Boolean = false

	timeout = undefined

	@ViewChild('clearInput',{static: false}) clearInput: ElementRef

	ngOnInit() {
		this.userService.getUsername().subscribe((res:any) =>{
			this.sender = res.username
		})

		this.chatService.receiver.subscribe(username =>{
			this.receiver = username
		})

		this.chatService.message.subscribe(messages =>{
			this.roomMessages = messages
		})
	}

	sendMessageForm = new FormGroup({
		message: new FormControl('')
	})

	sendMessage(sendMessageForm){
		this.chatService.sendMessage(this.receiver,sendMessageForm.value.message)
		this.clearInput.nativeElement.value = ''
	}
}
