import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatButtonModule } from '@angular/material/button'
import { HttpClientModule } from '@angular/common/http'
import { StorageServiceModule } from 'angular-webstorage-service'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { UserlistComponent } from './chatComponents/userlist/userlist.component';
import { ChatboxComponent } from './chatComponents/chatbox/chatbox.component';
import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		SignupComponent,
		HomeComponent,
		UserlistComponent,
		ChatboxComponent,
		NavbarComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatButtonModule,
		BrowserAnimationsModule,
		HttpClientModule,
		StorageServiceModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
