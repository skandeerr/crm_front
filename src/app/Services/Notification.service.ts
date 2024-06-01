import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProspectModéle } from '../Modéles/Prospect-Modéle';
import { Observable } from 'rxjs';
import { Tasks } from '../Modéles/Tasks';
import { Notification } from '../Modéles/Notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // private apiUrl = 'http://localhost:4000/prospect';
  private apiUrl = 'http://localhost:9092/crm/api/notification';


  constructor(private http: HttpClient) {}

  getNotificationsOfDay(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl+"/DayNotification");
  }

  MakeNotificationViewd(id: any): any {
    return this.http.put<Notification>(`${this.apiUrl}/${id}`,null);
  }

  
}
