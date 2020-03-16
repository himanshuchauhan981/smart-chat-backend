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

	typingStatus : string = ''

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

		this.chatService.typingStatus.subscribe(typingStatus =>{
			if(typingStatus == true && this.chatService.typingUsername === this.sender){
				this.typingStatus = `${this.chatService.typingUsername} is typing`
			}
			else this.typingStatus = ''
		})
	}

	sendMessageForm = new FormGroup({
		message: new FormControl('')
	})

	sendMessage(sendMessageForm){
		this.chatService.sendMessage(this.receiver,sendMessageForm.value.message)
		this.clearInput.nativeElement.value = ''
	}

	timeoutFunction(){
		this.typing = false
		this.chatService.typingStatus.next(false)
	}

	typingMessage(event){
		if(event.keyCode != 13){
			if(this.typing === false){
				this.typing = true
				this.chatService.emitTypingStatus(true,this.receiver)
			}
			else{
				clearTimeout(this.timeout)
			}
			this.timeout = setTimeout(this.timeoutFunction.bind(this),1000)
		}
	}
}
