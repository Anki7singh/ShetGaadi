import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _registerUrl="http://127.0.0.1:5000/adduser";
  private _loginUrl="http://127.0.0.1:5000/loginuser";
  
  constructor(private http:HttpClient, private _router:Router) { }
// User login and Registration's
  registerUser(user){
   return this.http.post<any>(this._registerUrl,user)
  }

  loginUser(user){
    return this.http.post<any>(this._loginUrl,user)
  }

  loggedIn(){
    return localStorage.getItem('token')
  }

getToken(){
  return localStorage.getItem('token')
}
logoutUser(){
  localStorage.removeItem('token')  
  localStorage.removeItem('id')  
  localStorage.removeItem('name') 
  localStorage.removeItem('email')
  localStorage.removeItem('phoneNumber')
  this._router.navigate(['/home'])

}

// User functions end
// Driver Function 

}
