import { Injectable, Inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { SESSION_STORAGE, WebStorageService } from 'angular-webstorage-service'

@Injectable({
	providedIn: 'root'
})
export class UserService {

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
}
