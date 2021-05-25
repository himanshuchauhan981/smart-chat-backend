import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from "@angular/material";
import { ADD_GROUP_MEMBERS } from "src/app/chat-interface";

import { ChatService } from "src/app/service/chat.service";

@Component({
  selector: "app-add-participants",
  templateUrl: "./add-participants.component.html",
  styleUrls: ["./add-participants.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class AddParticipantsComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<AddParticipantsComponent>,
    private chatService: ChatService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public groupDetails
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  userList: ADD_GROUP_MEMBERS[] = [];

  selectedUsers: string[] = [];

  ngOnInit() {
    this.chatService.listAllUsers().subscribe((res: any) => {
      let userList = res.data.userList.reduce((r, e) => {
        e.checked = false;
        let group = e.name[0];
        if (!r[group]) r[group] = { group, children: [e] };
        else r[group].children.push(e);
        return r;
      }, {});
      this.userList = Object.values(userList);
    });
  }

  handleChange(group: string, userId: string) {
    this.userList.forEach((value, index) => {
      if (value.group === group) {
        let childrenIndex = value.children.findIndex(
          (subIndex) => subIndex._id == userId
        );
        let prevValue = this.userList[index].children[childrenIndex].checked;
        this.userList[index].children[childrenIndex].checked = !prevValue;
      }
    });
  }

  addMembers(): void {
    let memberList = [];
    for (let i = 0; i < this.userList.length; i++) {
      let children = this.userList[i].children;
      for (let j = 0; j < children.length; j++) {
        if (children[j].checked === true) {
          memberList.push(children[j]._id);
        }
      }
    }

    if (memberList.length === 0) {
      this.snackBar.open("Select atleast one member", "Close", {
        duration: 5000,
      });
    } else {
      this.chatService
        .addNewMembers(memberList, this.groupDetails.groupId)
        .subscribe((res: any) => {
          this.closeDialog();
          this.snackBar.open(res.msg, "Close", { duration: 5000 });
        });
    }
  }
}
