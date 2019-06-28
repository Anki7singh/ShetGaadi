import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { BookresourceComponent } from './bookresource/bookresource.component';
import { AuthGuard } from './auth.guard';
import { AddresourceComponent } from './addresource/addresource.component';
import {WeatherComponent} from './weather/weather.component';
import {BookingProcessComponent} from './booking-process/booking-process.component';
import {NotificationComponent} from './notification/notification.component';
// import { from } from 'rxjs';

const routes: Routes = [
  {

    path:'',
    redirectTo:'/home',
    pathMatch: 'full'
  },
  {
    path:'home',
    component: HomeComponent
  },
  {
    path:'login',
    component: LoginComponent
  },

  {
    path:'registration',
    component:RegistrationComponent
  },
  
  {
    path:'bookresource',
    component:BookresourceComponent,
    canActivate: [AuthGuard]
  },
  {
path:'bookingprocess/:ResourceId',
component:BookingProcessComponent,
canActivate:[AuthGuard]
  },
  {
    path :'weather',
    component:WeatherComponent

  },

  {
    path :'notification',
    component:NotificationComponent,
    canActivate: [AuthGuard]


  },

  {
    path:'addresource',
    component:AddresourceComponent,
    canActivate: [AuthGuard]

  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
