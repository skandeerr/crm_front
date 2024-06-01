import { Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { UserService } from '../Services/Auth.service';
@Injectable({
  providedIn: 'root'
})
export class authGuard  {
  constructor(private loginService : UserService, private route:Router){}
  canActivate(){
     if(this.loginService.IsLoggedIn()){
    return true;}
    else{
      localStorage.clear()
      console.log("ddddddddddd")
      this.route.navigateByUrl("/login");
      return false;
    }
  }
  
}
