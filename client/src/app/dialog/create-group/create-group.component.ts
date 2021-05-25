import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material";

import { ChatService } from "src/app/service/chat.service";
import { AddParticipantsComponent } from "../add-participants/add-participants.component";

@Component({
  selector: "create-group",
  templateUrl: "./create-group.component.html",
  styleUrls: ["./create-group.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class CreateGroupComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<CreateGroupComponent>,
    private chatService: ChatService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {}

  createGroupForm = new FormGroup({
    name: new FormControl("", Validators.required),
    status: new FormControl(""),
  });

  closeGroup(): void {
    this.dialogRef.close();
  }

  createNewGroup(createGroupForm: FormGroup) {
    if (!createGroupForm.invalid) {
      let groupDetails = createGroupForm.value;
      this.chatService.createNewGroup(groupDetails).subscribe((res: any) => {
        this.closeGroup();
        this.dialog.open(AddParticipantsComponent, {
          width: "550px",
          data: { groupId: res.groupId },
        });
      });
    }
  }
}
