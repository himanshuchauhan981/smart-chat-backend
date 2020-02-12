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

	typing : Boolean

	timeout = undefined

	typingStatus : string = ''

	@ViewChild('clearInput',{static: false}) clearInput: ElementRef

	ngOnInit() {
		this.chatService.receiver.subscribe(username =>{
			this.receiver = username
		})

		this.chatService.message.subscribe(messages =>{
			this.roomMessages = messages
		})

		this.chatService.typingStatus.subscribe(typingStatus =>{
			if(typingStatus == true){
				this.typingStatus = `${this.receiver} is typing`
			}
			else this.typingStatus = ''
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

	timeoutFunction(){
		this.typing = false
		console.log('timeout function')
		this.chatService.emitTypingStatus(false)
	}

	typingMessage(){
		if(this.typing == false){
			this.typing = true
			this.chatService.emitTypingStatus(true)
			this.timeout = setTimeout(this.timeoutFunction.bind(this),5000)
		}
		else{
			clearTimeout(this.timeout)
			this.timeout = setTimeout(this.timeoutFunction.bind(this),5000)
		}
	}
}
