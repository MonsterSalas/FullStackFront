import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../interface/usuario.interface';
import { HttpErrorResponse } from '@angular/common/http';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8081/api/usuarios';

  const mockUsuario: Usuario = {
    username: 'testuser',
    nombreCompleto: 'Test User',
    password: 'password123',
    rolId: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('crearUsuario', () => {
    it('should handle successful user creation', () => {
      const expectedResponse = { mensaje: 'Usuario creado exitosamente' };

      service.crearUsuario(mockUsuario).subscribe({
        next: (response) => expect(response).toEqual(expectedResponse),
        error: fail
      });

      const req = httpMock.expectOne(`${baseUrl}/crear`);
      expect(req.request.method).toBe('POST');
      req.flush(expectedResponse);
    });

    it('should handle error in user creation', () => {
      const errorMessage = 'Error al crear usuario';

      service.crearUsuario(mockUsuario).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
          expect(error.error).toEqual(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/crear`);
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('obtenerUsuarios', () => {
    it('should return empty array when no users exist', () => {
      service.obtenerUsuarios().subscribe({
        next: (usuarios) => expect(usuarios).toEqual([]),
        error: fail
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush([]);
    });

    it('should handle error in getting users', () => {
      service.obtenerUsuarios().subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(baseUrl);
      req.flush('Error interno', { status: 500, statusText: 'Server Error' });
    });
  });

  describe('obtenerUsuarioPorId', () => {
    it('should handle user not found', () => {
      const idBuscado = 999;

      service.obtenerUsuarioPorId(idBuscado).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/${idBuscado}`);
      req.flush('Usuario no encontrado', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('actualizarUsuario', () => {
    it('should handle successful update', () => {
      const idActualizar = 1;
      const updatedUser = { ...mockUsuario, nombreCompleto: 'Updated Name' };

      service.actualizarUsuario(idActualizar, updatedUser).subscribe({
        next: (response) => expect(response).toEqual(updatedUser),
        error: fail
      });

      const req = httpMock.expectOne(`${baseUrl}/${idActualizar}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedUser);
    });

    it('should handle validation error in update', () => {
      const idActualizar = 1;
      
      service.actualizarUsuario(idActualizar, mockUsuario).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/${idActualizar}`);
      req.flush('Datos inválidos', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('eliminarUsuario', () => {
    it('should handle successful deletion', () => {
      const idEliminar = 1;

      service.eliminarUsuario(idEliminar).subscribe({
        next: () => expect().nothing(),
        error: fail
      });

      const req = httpMock.expectOne(`${baseUrl}/${idEliminar}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null, { status: 204, statusText: 'No Content' });
    });

    it('should handle error in deletion', () => {
      const idEliminar = 1;

      service.eliminarUsuario(idEliminar).subscribe({
        next: () => fail('should have failed'),
        error: (error: HttpErrorResponse) => {
          expect(error.status).toBe(403);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/${idEliminar}`);
      req.flush('No autorizado', { status: 403, statusText: 'Forbidden' });
    });
  });
});