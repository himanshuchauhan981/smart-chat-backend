import { Injectable, Inject } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service'

@Injectable({
	providedIn: 'root'
})
export class UserService {

	baseUrl : string = "http://localhost:3000"

	constructor(private http: HttpClient, @Inject(SESSION_STORAGE) private storage: WebStorageService) { }

	saveNewUser(userdata) {
		return this.http.post('/api/signup', userdata)
	}

	loginExistingUser(logindata) {
		return this.http.post('/api/login', logindata)
	}
	
	storeJWTToken  = (token) =>{
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
		return this.http.get('/api/validateToken',httpOptions)
	}

	removeJWTToken = ()=>{
		this.storage.remove('token')
	}

	// logOutUser = ()=>{
	// 	let token = this.storage.get('token')
	// 	let httpOptions = {
	// 		headers: new HttpHeaders({
	// 			'Content-Type': 'application/json',
	// 			'Authorization': token
	// 		})
	// 	}

	// 	return this.http.get('/api/logout',httpOptions)
	// }

}
