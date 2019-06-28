import { Component, OnInit } from '@angular/core';
import {ResourcesService} from '../resources.service';

@Component({
  selector: 'app-bookresource',
  templateUrl: './bookresource.component.html',
  styleUrls: ['./bookresource.component.css']
})
export class BookresourceComponent implements OnInit {

  Mybooking=[]
  constructor( private _resourcesService:ResourcesService ) { }

  bookingcompleted(resourceNumber){
    var bookingRealeasedata={
      resourceNumber:resourceNumber
    }
      this._resourcesService.bookingRelease(bookingRealeasedata).subscribe(
        (data:any)=>{
          alert("Resource Availabe."+data.sucess)

        }
      )
  }
  
  ngOnInit() {

    var senddata ={ 
      userid:localStorage.getItem('id'),
      username:localStorage.getItem('name'),
      usermobile:localStorage.getItem('phoneNumber')
    }

    this._resourcesService.getMybooking(senddata) 
    .subscribe(
    (data:any)=> { 
    console.log(data.resourceNumber);
    this.Mybooking=data;
  console.log("All bokked resources.");

  }),
  console.log(this.Mybooking);
    
    // this._resourcesService.getMybooking(senddata) 
    // .subscribe(
    //   res=> this.Mybooking=res,
    //   err => console.log(err)
      
    // ),console.log("this.res");
    // console.log(this.Mybooking);
  }

}
