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
    groupName : new FormControl('',Validators.required),
    userChecked : new FormControl()
  })

  userList = []

  allChecked : boolean = false

  constructor(
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public currentUser: string,
    public dialogRef:MatDialogRef<GroupChatComponent>
  ) { }

  ngOnInit(): void {
    this.userService.getAllUsers(this.currentUser).subscribe((userData:any) =>{
      for(let users in userData){
        userData[users]['checked'] = false
      }
      this.userList = userData
    })
  }

  close(){
    this.dialogRef.close()
  }

  setUserCheckbox(value: boolean,id: string){
    for(var i=0;i<this.userList.length; i++){
      if(this.userList[i]._id == id){
        this.userList[i]['checked'] = value
      }
    }
  }

  create(){
    let userCheckedValue = this.userList.filter(user => user.checked == true)
    let groupName = this.groupForm.get('groupName').value
    if (groupName != '' && userCheckedValue.length != 0){
      let groupUsers = this.userList.filter(user => user.checked == true)
      this.userService.createGroup(groupName, groupUsers, this.currentUser).subscribe((data) =>{
        
      })
      this.dialogRef.close()
    }
    else{
      this.groupForm.markAllAsTouched()
    }
  }

}
