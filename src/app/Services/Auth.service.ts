import { Injectable } from '@angular/core';
import { User } from '../Modéles/user';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:9092/crm/api/auth/signup';
  private apiUrl1 = 'http://localhost:9092/crm/api/auth/signin';

  constructor(private http: HttpClient,private route : Router) {}

  SignUp(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  SignIn(username: string,password: string,): Observable<User> {
    
    return this.http.post<User>(this.apiUrl1, {username, password});
  }
  IsLoggedIn(){
    return localStorage.getItem('token')!=null;
  }
  getToken(){
    return localStorage.getItem('token')
  }
  getId(){
    return localStorage.getItem('id')
  }
  Logout(){
    localStorage.removeItem('token');
    this.route.navigateByUrl("/login")

 }
 getRole(){
  return localStorage.getItem('roles')
 }
 
}

  
  

