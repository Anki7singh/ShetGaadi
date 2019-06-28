import { Component, OnInit } from '@angular/core';
import {ResourcesService} from '../resources.service'; 

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  Mybooking= []
  private isvalid :boolean;
  public ownerid ;
  public resourceId;
  public usermail;
  public youremail;
  
  // sendRejectRequest =[];

  constructor(private _resourcesService:ResourcesService ) { }

  bookingrejected(resourceNumber,useremail,nameofuser,userMobileNumber){
    var mydata= {
      key2:resourceNumber,
      key1:useremail,
      key3:nameofuser,
      key4:userMobileNumber
    }

    console.log("keysss");
    console.log(mydata['key1']);
    console.log(mydata['key2']);
    console.log(mydata['key3']);
    console.log(mydata['key4']);
    
      this._resourcesService.rejectResourceRequest(mydata) 
      .subscribe(
      (data:any)=> { 
      console.log(data.success);
      alert("Resource request rejected.");

      // if (data.success) {
      //   console.log(data[0]);
      //   this.isvalid=true;
        
      //   console.log("** \n\n"+this.isvalid);
      // }
      // else{
      //   this.Mybooking=data, 
      //    err => console.log(err)
      //     this.isvalid=true;
      // }
    }),
    console.log("Resource request rejected.");
   

      // console.log(this.resourceId, this.usermail)
    
          // alert("________ RES ID _______ click reject");

  }

  acceptRequest(resource,resourceNumber,resourceOwnBy,useremail,noOfDays,nameofuser,userMobileNumber,bookingDate,paymentMode,picklocation,droplocation){
    
    var acceptrequest={      
      useremail:useremail,
      resourceNumber:resourceNumber,
      nameofuser:nameofuser,
      userMobileNumber:userMobileNumber,
      resource:resource,
      resourceOwnBy:resourceOwnBy,
      noOfDays:noOfDays,
      bookingDate:bookingDate,
      paymentMode:paymentMode,
      picklocation:picklocation,
      droplocation:droplocation,
      ownerMobileNumber:localStorage.getItem('phoneNumber'),
      ownerid:this.ownerid,
      owneremail:this.youremail,
      Requeststatus:"accepted"
    }
    console.log(acceptrequest);
    this._resourcesService.acceptResourceRequest(acceptrequest) 
    .subscribe(
    (data:any)=> { 
    console.log(data.success);
    alert("Resource request Accepted.");

    // if (data.success) {
    //   console.log(data[0]);
    //   this.isvalid=true;
      
    //   console.log("** \n\n"+this.isvalid);
    // }
    // else{
    //   this.Mybooking=data, 
    //    err => console.log(err)
    //     this.isvalid=true;
    // }
  }),
  console.log("Resource request Accepted.");
 

  }

  ngOnInit() {
    this.ownerid = localStorage.getItem('id');
    this.youremail = localStorage.getItem('email');
    console.log(" booking notification"+this.ownerid);
    this._resourcesService.getMybookingRequest(this.ownerid) 
    .subscribe((data:any)=> { 
      console.log(data.success);

      if (data.success) {
        console.log(data[0]);
        this.isvalid=true;
        
        console.log("** \n\n"+this.isvalid);
      }
      else{
        this.Mybooking=data, 
         err => console.log(err)
          this.isvalid=true;
      }
    },
    ),console.log(this.Mybooking);
  }


} 