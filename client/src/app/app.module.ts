import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule } from "@angular/material/button";
import { HttpClientModule } from "@angular/common/http";
import { StorageServiceModule } from "ngx-webstorage-service";
import { MatDialogModule } from "@angular/material/dialog";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { HomeComponent } from "./home/home.component";
import { UserlistComponent } from "./chatComponents/userlist/userlist.component";
import { ChatboxComponent } from "./chatComponents/chatbox/chatbox.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { GroupChatComponent } from "./chatComponents/group-chat/group-chat.component";
import { MomentModule } from "angular2-moment";

@NgModule({
  declarations: [
    AppComponent,
    ChatboxComponent,
    GroupChatComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    SignupComponent,
    UserlistComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTabsModule,
    ReactiveFormsModule,
    StorageServiceModule,
    MatMenuModule,
    MomentModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [GroupChatComponent],
})
export class AppModule {}
