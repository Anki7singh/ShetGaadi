import { Component, OnInit } from '@angular/core';
import {ResourcesService} from '../resources.service';
import {Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
resources=[];
// ResourceId:string;
  constructor( private _resourcesService:ResourcesService, private _router:Router ) { }

  ngOnInit() {
    this._resourcesService.getResource()
    .subscribe(
      res=> {this.resources=res;
        // console.log(res);
        
      },
      err => console.log(err)
    )
    // console.log("____________________________");
    // console.log(this.resources);
  }
  bookingprocessOnclick(ResourceId){
    this._router.navigate(['/bookingprocess',ResourceId])
    
  }
}
