import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'

import { ChatService } from 'src/app/service/chat.service'
import { FormGroup, FormControl } from '@angular/forms'

@Component({
	selector: 'chatbox',
	templateUrl: './chatbox.component.html',
	styleUrls: ['./chatbox.component.css']
})
export class ChatboxComponent implements OnInit {

	constructor(private chatService: ChatService) { }

	receiver : string

	roomMessages = []

	@ViewChild('clearInput',{static: false}) clearInput: ElementRef

	ngOnInit() {
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

	get message(){ return this.sendMessageForm.get('message') }

	sendMessage(sendMessageForm){
		this.chatService.sendMessage(this.receiver,sendMessageForm.value.message)
		this.clearInput.nativeElement.value = ''
	}
}
