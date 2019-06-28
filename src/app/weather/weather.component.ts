import { Component, OnInit } from '@angular/core';
import {ResourcesService} from '../resources.service';

@Component({
  selector: 'app-weather',
  templateUrl:'./weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  weatherInfo={}
  weatherData :any;
  dataNotRecive=[];
  resposererror="";
  weatherstatus="";
  windspeed:any;
  
  
  constructor(private _resourcesService:ResourcesService) { }


  getWeatherdata(){
    this._resourcesService.getWeather(this.weatherInfo).subscribe((data:any) => 
    {
      this.resposererror=data.cod;
      this.weatherstatus=data.weather[0]['description'];
      
      console.log(">>>>>>>>>>>>>>>>>>> "+ this.weatherstatus);
      
      if (data.cod==200) {
        this.weatherData = data.main;
        this.windspeed = data.wind[0]['speed'];
        console.log(this.weatherData);

        } 
      else {        
        this.dataNotRecive = data.message;
     
      }
      
     },

    );
   
  }
  
  ngOnInit() {

  }
}
// (data:any) => {
      // console.log(data);
    //   console.log(data.fail);
    //   if (data.success) {
    //     this.addResourcResponseSuccess = data.message;

    //     this.loading = false;
    //     console.log(data.message);
    //     this.form.reset()
    //     } 
    //   else {        
    //     this.addResourcResponseError = data.fail;
    //     this.loading = false;
    //     this.form.reset()
    //   }
      
    //  },
    //  error => this.error = error


