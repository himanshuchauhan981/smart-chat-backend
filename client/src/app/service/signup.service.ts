import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
	providedIn: 'root'
})
export class SignupService {

	constructor(private http: HttpClient) { }

	saveNewUser(userdata){
		return this.http.post('/api/signup',userdata)
	}
}
