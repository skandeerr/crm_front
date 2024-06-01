import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProspectModéle } from '../Modéles/Prospect-Modéle';
import { Observable } from 'rxjs';
import { Permission } from '../Modéles/Permission';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private apiUrl = 'http://localhost:9092/crm/api/role';


  constructor(private http: HttpClient) {}

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.apiUrl+"/roles");
  }

  deletePermission(id: Number): Observable<Permission> {
    return this.http.delete<Permission>(`${this.apiUrl}/${id}`);
  }

  updatePermission(id: number, nouveauPermission: Permission): Observable<Permission> {
    return this.http.put<Permission>(`${this.apiUrl}/${id}`, nouveauPermission);
  }

  ajouterPermission(nouveauPermission: Permission): Observable<Permission> {
    return this.http.post<Permission>(this.apiUrl, nouveauPermission);
  }

  
}
