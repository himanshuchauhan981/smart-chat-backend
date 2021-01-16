import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service'

import { environment } from '../../environments/environment'

@Injectable({
	providedIn: 'root'
})
export class UserService {

	baseUrl : string = environment.baseUrl

	constructor(private http: HttpClient, @Inject(SESSION_STORAGE) private storage: WebStorageService) { }

	signUp(userdata) {
		return this.http.post(`${this.baseUrl}/api/signup`, userdata)
	}

	login(loginValues) {
		return this.http.post(`${this.baseUrl}/api/login`, loginValues)
	}
	
	storeToken  = (token) =>{
		this.storage.set('token',token)
	}

	getUsername = ()=>{
		let token = this.storage.get('token')

		let httpOptions = {
			headers: new HttpHeaders({
				'Content-Type':  'application/json',
				'Authorization': token
			})
		}
		return this.http.get(`${this.baseUrl}/api/validateToken`,httpOptions)
	}

	removeToken = ()=>{
		this.storage.remove('token')
	}

	getAllUsers = (currentUser: string) =>{
		return this.http.get(`${this.baseUrl}/api/users`,{
			params: { currentUser: currentUser}
		})
	}

	createGroup = (groupName: string, groupUsers:any, admin: string) =>{
		return this.http.post(`${this.baseUrl}/api/group`,{
			name: groupName,
			members: groupUsers,
			admin: admin
		})
	}
}
