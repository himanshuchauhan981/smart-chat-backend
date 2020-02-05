import { AbstractControl } from '@angular/forms' 

export class SignUpValidators{
    static MustMatch(control: AbstractControl){
        const password : string = control.get('signuppassword').value
        const confirmPassword : string = control.get('signupConfirmpassword').value

        if(password !== confirmPassword){
            control.get('signupConfirmpassword').setErrors({mustMatch: true})
        }
        else{
            control.get('signupConfirmpassword').setErrors(null)
        }
        return null
    }
}