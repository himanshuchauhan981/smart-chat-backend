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

	receiverFullName : string

	receiverId : string

	roomMessages = []

	typing : Boolean = false

	messageType : string

	@ViewChild('clearInput',{static: false}) clearInput: ElementRef

	ngOnInit() {
		this.userService.getUsername().subscribe((res:any) =>{
			this.sender = res.username
		})

		this.chatService.userChatObservable.subscribe(data =>{
			this.receiverFullName = data.receiverFullName
			this.receiverId = data.receiverId
			this.messageType = 'PRIVATE'
		})

		this.chatService.message.subscribe(messages =>{
			this.roomMessages = messages
		})

		this.chatService.groupChatObservable.subscribe(data => {
			this.messageType = 'GROUP'
			this.receiverFullName = this.receiverId = data.groupName
		})
	}

	sendMessageForm = new FormGroup({
		message: new FormControl('')
	})

	sendMessage(sendMessageForm){
		this.chatService.sendMessage(this.sender,this.receiverId,sendMessageForm.value.message,this.messageType)
		this.clearInput.nativeElement.value = ''		
	}
}
