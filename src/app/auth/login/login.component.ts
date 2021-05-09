import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  registerkey = false
  pattern = '^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+[.][A-Za-z]{2,}$';
  spinner  = false;
  profilekey = false
  photo;
  firebaseError;

  constructor(private Auth : AuthService) { }

  ngOnInit(): void {
  }
  onImageChange(event) {
this.photo = event
  }


  register() {
    this.registerkey = !this.registerkey
    this.firebaseError =""
  }

  facebook() {
    this.Auth.facebookLogin().then(() => {
      setTimeout(() => {
        if (this.Auth.userFaceFirstTime == true) {
        this.profilekey =true
      }
   },1000)
  })
}



  onSubmit(formData) {
    this.spinner = true
    const email = formData.value.Email
    const password = formData.value.password
    
    

    if (!this.registerkey &&!this.profilekey) {
      this.Auth.signIn(email, password).catch(error => {
        this.spinner = false
        this.firebaseError = error.message
      })
    } else if(this.registerkey && !this.profilekey) {
      this.Auth.signUp(email, password).then(() => {
        this.spinner = false
        this.profilekey = true
      }).catch(error => {
        this.spinner = false
        this.firebaseError = error.message
      })
    } else if (this.profilekey) {
      console.log("profile info")
      const Username = formData.value.Username
      const Weight = formData.value.Weight
      const Height = formData.value.Height
      const Birthday = formData.value.Birthday
      console.log(Birthday)
      this.Auth.setUserInfo(this.photo, Username, Birthday, Weight , Height)
    }
  }









}
