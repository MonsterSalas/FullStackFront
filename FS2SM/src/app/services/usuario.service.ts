import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, ResponseDTO } from '../interface/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) { }

  crearUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear`, usuario);
  }
  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}