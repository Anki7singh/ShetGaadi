import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
// import {FormBuilder, FormGroup, Validators} from "@angular/forms";
// import { HttpClient } from '@angular/common/http';

import {ResourcesService} from '../resources.service';
import { log } from 'util';

@Component({
  selector: 'app-booking-process',
  templateUrl: './booking-process.component.html',
  styleUrls: ['./booking-process.component.css']
})
export class BookingProcessComponent implements OnInit {
  public ResourceID;
  public resourceget=[];
  public userid;
  public phoneNumber :string;
  public name;
  sendData = {};
  public bookingDetails=[];
  public email;
  
  // here we have to edit the notification 

  addRegisterResponseSuccess: string;
  addRegisterResponseError: string;
  error: any;
  form: FormGroup;

  constructor( private route:ActivatedRoute, private _resourcesService:ResourcesService,private fb:FormBuilder) {

   }

  
   submitbookingdata(){
    console.log(this.bookingDetails);
    
    if (this.form.status === 'INVALID') {
      alert("Please enter data. ")
      return 
    }

    this.sendData = { "resouceget" : this.resourceget ,"userMobileNumber":this.phoneNumber,"useremail":this.email, "userId" : this.userid , "name" : this.name,"noOfDays":this.form.value.days,"paymentMode":this.form.value.paymentmode,"picklocation":this.form.value.picklocation,"droplocation":this.form.value.droplocation,"bookingDate":this.form.value.bookingdate}
    console.log("databhsu",this.sendData)
  
    
    this._resourcesService.bookingMakerequest(this.sendData).subscribe((data:any) => {
            console.log(data);
            console.log(data.fail);
            if (data.success) {
              this.addRegisterResponseSuccess = data.message;
              this.form.reset();
              console.log(data.message);
              } 
            else {        
              this.addRegisterResponseError = data.fail;
              this.form.reset();
          
            }
            
          },
          error => this.error = error


        ); 


   }

  ngOnInit() {
    this.form = this.fb.group({
      'days':['',[Validators.required]],
      'bookingdate':['',[Validators.required]],
      'paymentmode':['',[Validators.required]],
      'picklocation':['',[Validators.required]],
      'droplocation':['',[Validators.required]]
    });
   this.route.paramMap.subscribe(
     params=>{
       this.ResourceID=params.get('ResourceId');
       console.log(this.ResourceID); 
     }
  // let id =this.route.snapshot.params['ResourceId']
   );
  console.log("________________");

  this._resourcesService.bookingprocess(this.ResourceID)
    .subscribe(
      res=> {this.resourceget=res;
        console.log(this.resourceget);
        // console.log(res.resourceNumber);
        // console.log(res.resourceOwnBy);
        // console.log(this.ResourceID);
        this.userid = localStorage.getItem('id');
        this.name = localStorage.getItem('name');
        this.phoneNumber = localStorage.getItem('phoneNumber');
        this.email = localStorage.getItem('email');

        // console.log( this._resourcesService.userdata);
        console.log(this.userid);
        console.log(this.name);
        console.log(this.phoneNumber);
        console.log(this.email);
        
       
      },
      err => console.log(err)
    );
  
    
  }

}
