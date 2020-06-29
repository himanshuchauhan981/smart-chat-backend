import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { UserService } from '../../service/user.service'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent implements OnInit {

  groupForm = new FormGroup({
    groupName : new FormControl('',Validators.required)
  })

  constructor(private userService: UserService,@Inject(MAT_DIALOG_DATA) public currentUser: String) { }

  ngOnInit(): void {
    this.userService.getAllUsers(this.currentUser).subscribe((data) =>{
      console.log(data)
    })
  }

}
