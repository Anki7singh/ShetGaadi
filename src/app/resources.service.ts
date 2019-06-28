import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserData } from './models/userdata';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  private _resourceUrl="http://127.0.0.1:5000/getresources";
  private _getMybooking="http://127.0.0.1:5000/getMybooking";

  private _bookingRealease="http://127.0.0.1:5000/bookingRealease";
  private _acceptRequest="http://127.0.0.1:5000/acceptRequest"

  
  private _getMybookingRequest="http://127.0.0.1:5000/getMybookingRequest"
  private _addResourceUrl="http://127.0.0.1:5000/addResource";
  private _getWeather="http://127.0.0.1:5000/weather";
  private _bookingprocess="http://127.0.0.1:5000/bookingprocess";

  private _bookingMakerequest="http://127.0.0.1:5000/bookingMakeRequest";

  private _rejectRequest="http://127.0.0.1:5000/rejectRequest"

  weatherUrl:string;
  
  public user_info:Subject<UserData>;
  public userdata:UserData;
  senddata={}




  
  constructor(private http:HttpClient) { 
    this.user_info=new Subject<UserData>();
    this.user_info.subscribe((data:UserData)=>this.userdata=data)
  
  }

// to send a  booking request 
  bookingMakerequest(senddata){
    console.log(">>>>>>>>>>>>>>>>>>>>"+senddata);    
    return this.http.post<any>(this._bookingMakerequest,senddata);  

  }

  // _bookingRealease
  // release resource.
  bookingRelease (release){
    return this.http.post<any>(this._bookingRealease,release)
  }


  // to reject resource request and send a confirmation mail.
  rejectResourceRequest(sendRejectData){
    console.log(">>>>>>>>>>>>>>>>>>>>"+sendRejectData);    
    return this.http.post<any>(this._rejectRequest,sendRejectData);    
 } 
 
 // To Accept resource request and send a confirmation mail and sms.
 acceptResourceRequest(sendAccepData){
   console.log(">>>>>>>>>>>>>>>>>>>>"+sendAccepData);    
   return this.http.post<any>(this._acceptRequest,sendAccepData);    
}



// to process  booking request 
  bookingprocess(ResourceID){
    console.log(">>>>>>>>>>>>>>>>>>>>"+ResourceID);    
    return this.http.post<any>(this._bookingprocess,ResourceID);    
 }

//  weather data is fetch when city name is correct else it will send a error report

  getWeather(cityName){
     return this.http.post<any>(this._getWeather,cityName);
  }

  // sent a resource request to get all the availabe resource
  getResource(){
    return this.http.get<any>(this._resourceUrl);
  }
  
  // get the reource request made my single users
  getMybooking(bookingdata){
    return this.http.post<any>(this._getMybooking,bookingdata);
  }



  // Here owner id will be sent to get booking notification 
  getMybookingRequest(ownerid){
    console.log("\n\nheyyyyyyyyyyyyyyyyyyyyyyyyyy\n\n",ownerid);
    return this.http.post<any>(this._getMybookingRequest,ownerid);
  }

  // resources are added here
  addResource(resources){
      return this.http.post<any>(this._addResourceUrl,resources)
   
  }

}

//  Web Api to get weather data 
// api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=d7a09b36e7fa04d2e58738e66a4322df
