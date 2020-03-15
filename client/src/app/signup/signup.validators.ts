import { AbstractControl } from '@angular/forms' 

export class SignUpValidators{
    static MustMatch(control: AbstractControl){
        const password : string = control.get('password').value
        const confirmPassword : string = control.get('confirmpassword').value

        if(password !== confirmPassword){
            control.get('confirmpassword').setErrors({mustMatch: true})
        }
        else{
            control.get('confirmpassword').setErrors(null)
        }
        return null
    }
}