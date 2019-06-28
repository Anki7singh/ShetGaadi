import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import{AuthService} from '../auth.service' ;
import { ToastrService } from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  registerUserData={}
  addRegisterResponseSuccess: string;
  addRegisterResponseError: string;
  error: any;
  form: FormGroup;
  
  constructor(private _auth:AuthService ,private router:Router, private toastr: ToastrService) {
   }

  // registerUser(){
  //   this._auth.registerUser(this.registerUserData)
  //     .subscribe( 
  //       res => console.log(res),
  //       err => console.log(err)    
  //       )
  //   console.log(this.registerUserData)
  // }
  registerUser(){
    this._auth.registerUser(this.registerUserData).subscribe((data:any) => {
            // console.log(data);
            console.log(data.fail);
            if (data.success) {
              this.addRegisterResponseSuccess = data.message;
              this.router.navigate(['/home'])
             alert(data.message);
              } 
            else {        
              this.addRegisterResponseError = data.fail;
              this.form.reset();
          
            }
            
          },
          error => this.error = error


        );
  }



  alert(){
    console.log("njhygyg")
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
  ngOnInit() {
  }

}
