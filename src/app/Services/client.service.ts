import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientModéle } from '../Modéles/client-modéle';
import { Observable } from 'rxjs';
import { UserConnected } from '../Modéles/UserConnected';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:4000/client';
  private apiUrl1 = 'http://localhost:9092/crm/api/contact';

  constructor(private http: HttpClient) {}

  getAllClients(): Observable<ClientModéle[]> {
    return this.http.get<ClientModéle[]>(this.apiUrl1+"/contacts");
  }
  getUserById(id:any): Observable<UserConnected> {
    return this.http.get<UserConnected>(`${this.apiUrl1+"/user"}/${id}`);
  }
  deleteClient(id: Number): Observable<ClientModéle> {
    return this.http.delete<ClientModéle>(`${this.apiUrl1}/${id}`);
  }

  ajouterClient(nouveauClient: ClientModéle): Observable<ClientModéle> {
    return this.http.post<ClientModéle>(this.apiUrl1, nouveauClient);
  }

  updateClient(
    id: number,
    nouveauClient: ClientModéle
  ): Observable<ClientModéle> {
    return this.http.put<ClientModéle>(`${this.apiUrl1}/${id}`, nouveauClient);
  }
}
