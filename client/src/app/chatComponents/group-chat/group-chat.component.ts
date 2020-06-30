import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { UserService } from '../../service/user.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent implements OnInit {

  groupForm = new FormGroup({
    groupName : new FormControl('',Validators.required)
  })

  userList = []

  constructor(
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public currentUser: string,
    public dialogRef:MatDialogRef<GroupChatComponent>
  ) { }

  ngOnInit(): void {
    this.userService.getAllUsers(this.currentUser).subscribe((data:any) =>{
      this.userList = data
    })
  }

  close(){
    this.dialogRef.close()
  }

}
