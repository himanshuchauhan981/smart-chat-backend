import { Component, OnInit, Inject } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms'

import { UserService } from '../../service/user.service'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'

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

  errorMessage: String

  constructor(
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public currentUser: string,
    public dialogRef:MatDialogRef<GroupChatComponent>,
    private snackBar: MatSnackBar
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
      this.userService.createGroup(groupName, groupUsers, this.currentUser)
      .subscribe((response) =>{
        this.snackBar.open(response['msg'],'Close',{
          duration: 5000
        })
        this.dialogRef.close()
      },(error) =>{
        this.errorMessage = error['error']['msg']
        this.groupForm.controls.groupName.setErrors({existingGroupName: true})
      })
      
    }
    else{
      this.groupForm.markAllAsTouched()
    }
  }

}
