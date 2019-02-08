import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';

const routes: Routes = [
   {
      path:'login',
      component:LoginComponent
   },
   {
      path:'',
      component:LoginComponent
   },
   {
      path:'signup',
      component:SignupComponent
   },
   {
      path:'chatroom',
      component:ChatRoomComponent
   }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
