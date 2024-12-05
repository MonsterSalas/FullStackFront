import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const credentials = {
      username: username,
      password: password
    };
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }
}