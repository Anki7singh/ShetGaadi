import { Component, OnInit } from '@angular/core';
import{AuthService} from '../auth.service' ;
import {Router} from '@angular/router'
import { UserData } from '../models/userdata';
import { ResourcesService } from '../resources.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginUserData={}
  userData:UserData;
  constructor(private _auth:AuthService,private _router:Router,private resourcesService:ResourcesService ) { }

  ngOnInit() {
  }
loginUser(){
  this._auth.loginUser(this.loginUserData)
  .subscribe( 
    res =>{
      console.log(res.success)

      if (res.success=="false") {
        
      alert(res.message+" <b>Please try again.</b>");
      } else {
        

      localStorage.setItem('token',res.token),
      localStorage.setItem('id',res.data[0]['id']),
      localStorage.setItem('name',res.data[0]['name']),
      localStorage.setItem('email',res.data[0]['email']),
      localStorage.setItem('phoneNumber',<string>res.data[0]['phone_number']),
      this.userData=new UserData();
      this.userData.id='1';
      this.userData.mobile="787";
      this.userData.username="test";
      this.resourcesService.user_info.next(this.userData);
      this._router.navigate(['/bookresource'])
      }
     
    },
    err => console.log(err)    
    )
  console.log(this.loginUserData)
}
}



// this._auth.registerUser(this.registerUserData).subscribe((data:any) => {
//   // console.log(data);
//   console.log(data.fail);
//   if (data.success) {
//     } 
//   else {        
//     this.addRegisterResponseError = data.fail;
//     this.form.reset();

//   }
  
// },
// error => this.error = error


// );