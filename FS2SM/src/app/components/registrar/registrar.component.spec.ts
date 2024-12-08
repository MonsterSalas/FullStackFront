import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrarComponent } from './registrar.component';
import { UsuarioService } from '../../services/usuario.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('RegistrarComponent', () => {
  let component: RegistrarComponent;
  let fixture: ComponentFixture<RegistrarComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['crearUsuario']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegistrarComponent],
      providers: [
        FormBuilder,
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate form fields', () => {
    const form = component.registroForm;
    expect(form.valid).toBeFalsy();

    form.controls['nombreCompleto'].setValue('Test User');
    form.controls['username'].setValue('testuser');
    form.controls['password'].setValue('password123');

    expect(form.valid).toBeTruthy();
  });

  it('should show field as invalid when touched and empty', () => {
    const nombreCompletoControl = component.registroForm.controls['nombreCompleto'];
    nombreCompletoControl.markAsTouched();
    
    expect(component.isFieldInvalid('nombreCompleto')).toBeTruthy();
    
    nombreCompletoControl.setValue('Test User');
    expect(component.isFieldInvalid('nombreCompleto')).toBeFalsy();
  });

  it('should submit form successfully', fakeAsync(() => {
    const mockResponse = { success: true };
    usuarioServiceSpy.crearUsuario.and.returnValue(of(mockResponse));
    
    const swalFireSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }) as any);

    component.registroForm.setValue({
      nombreCompleto: 'Test User',
      username: 'testuser',
      password: 'password123'
    });

    component.onSubmit();
    tick();

    expect(usuarioServiceSpy.crearUsuario).toHaveBeenCalledWith({
      nombreCompleto: 'Test User',
      username: 'testuser',
      password: 'password123',
      rolId: 1
    });
    expect(swalFireSpy).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should handle submission error', fakeAsync(() => {
    const mockError = { error: { mensaje: 'Error de registro' } };
    usuarioServiceSpy.crearUsuario.and.returnValue(throwError(() => mockError));
    
    const swalSpy = spyOn(Swal, 'fire');

    component.registroForm.setValue({
      nombreCompleto: 'Test User',
      username: 'testuser',
      password: 'password123'
    });

    component.onSubmit();
    tick();

    expect(swalSpy).toHaveBeenCalled();
    const swalArgs = swalSpy.calls.mostRecent().args[0];
    expect(swalArgs).toEqual(jasmine.objectContaining({
      text: 'Error de registro'
    }));
  }));
});