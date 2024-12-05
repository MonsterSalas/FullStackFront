import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDTO, Rol } from '../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) { }

  crearRol(rol: Rol): Observable<ResponseDTO> {
    return this.http.post<ResponseDTO>(`${this.apiUrl}/crear`, rol);
  }

  obtenerRoles(): Observable<ResponseDTO> {
    return this.http.get<ResponseDTO>(this.apiUrl);
  }

  obtenerRolPorId(id: number): Observable<ResponseDTO> {
    return this.http.get<ResponseDTO>(`${this.apiUrl}/${id}`);
  }

  actualizarRol(id: number, rol: Rol): Observable<ResponseDTO> {
    return this.http.put<ResponseDTO>(`${this.apiUrl}/${id}`, rol);
  }

  eliminarRol(id: number): Observable<ResponseDTO> {
    return this.http.delete<ResponseDTO>(`${this.apiUrl}/${id}`);
  }
}
