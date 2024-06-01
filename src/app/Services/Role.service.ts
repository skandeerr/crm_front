import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProspectModéle } from '../Modéles/Prospect-Modéle';
import { Observable } from 'rxjs';
import { Permission } from '../Modéles/Permission';
import { Role } from '../Modéles/Role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:9092/crm/api/permission';


  constructor(private http: HttpClient) {}

  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.apiUrl+"/permissions");
  }

  deleteRole(id: Number): Observable<Role> {
    return this.http.delete<Role>(`${this.apiUrl}/${id}`);
  }

  updateRole(id: number, nouveauPermission: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, nouveauPermission);
  }

  ajouterRole(nouveauPermission: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, nouveauPermission);
  }

  
}
