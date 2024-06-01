import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProspectModéle } from '../Modéles/Prospect-Modéle';
import { Observable } from 'rxjs';
import { Tasks } from '../Modéles/Tasks';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // private apiUrl = 'http://localhost:4000/prospect';
  private apiUrl = 'http://localhost:9092/crm/api/task';


  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Tasks[]> {
    return this.http.get<Tasks[]>(this.apiUrl+"/tasks");
  }
  getTasksOfToday(): Observable<Tasks[]> {
    return this.http.get<Tasks[]>(this.apiUrl+"/Daytasks");
  }
  deleteTask(id: Number): Observable<Tasks> {
    return this.http.delete<Tasks>(`${this.apiUrl}/${id}`);
  }

  updateTask(id: number, nouveauProspect: Tasks): Observable<Tasks> {
    return this.http.put<Tasks>(`${this.apiUrl}/${id}`, nouveauProspect);
  }

  ajouterTask(nouveauProspect: Tasks): Observable<Tasks> {
    return this.http.post<Tasks>(this.apiUrl, nouveauProspect);
  }

  
}
