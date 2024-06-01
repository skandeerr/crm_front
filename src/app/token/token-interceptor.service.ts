import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { UserService } from '../Services/Auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private injector : Injector) { 
    
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log("itersector")
    let authService = this.injector.get(UserService)
      let tokenizedReq = req.clone({
        setHeaders:{
          Authorization : `Bearer ${authService.getToken()}`
        }
      })
      return next.handle(tokenizedReq)
  }
}
