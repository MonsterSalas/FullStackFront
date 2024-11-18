import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { RegistrarComponent } from './registrar.component';
import { Cliente } from '../../interface/cliente.model';

describe('RegistrarComponent', () => {
  let component: RegistrarComponent;
  let fixture: ComponentFixture<RegistrarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, RegistrarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();

    // Limpiar localStorage antes de cada prueba
    localStorage.removeItem('clientes');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Inicializa valores vacios en el form', () => {
    const form = component.registrarForm;
    expect(form).toBeDefined();
    expect(form.get('nombreCompleto')?.value).toBe('');
    expect(form.get('correo')?.value).toBe('');
    expect(form.get('contrasennia')?.value).toBe('');
  });

  it('Valida formato del correo', () => {
    const emailControl = component.registrarForm.get('correo');
    emailControl?.setValue('test@test.com');
    expect(emailControl?.valid).toBeTrue();

    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalse();
  });

  it('valida la contrasennia con formato correcto', () => {
    const passwordControl = component.registrarForm.get('contrasennia');
    passwordControl?.setValue('Password1');
    expect(passwordControl?.valid).toBeTrue();

    passwordControl?.setValue('short');
    expect(passwordControl?.valid).toBeFalse();

    passwordControl?.setValue('alllowercase');
    expect(passwordControl?.valid).toBeFalse();

    passwordControl?.setValue('ALLUPPERCASE');
    expect(passwordControl?.valid).toBeFalse();

    passwordControl?.setValue('12345678');
    expect(passwordControl?.valid).toBeFalse();
  });

  it('Agrega un cliente si es valido el form', async () => {
    const mockSwalResult: SweetAlertResult = {
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: true
    };

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve(mockSwalResult)); // Simular una promesa resuelta
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true)); // Simular una promesa resuelta

    component.registrarForm.setValue({
      nombreCompleto: 'Test User',
      correo: 'testuser@example.com',
      contrasennia: 'Password1'
    });

    const cliente: Cliente = {
      nombreCompleto: 'Test User',
      correo: 'testuser@example.com',
      contrasennia: 'Password1'
    };

    await component.registrarCliente();

    expect(component.clientes.length).toBe(1);
    expect(component.clientes[0]).toEqual(cliente);
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Registro Exitoso',
      text: 'Te has registrado de manera exitosa',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    }));
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('No crear clientes si el correo ya existe', () => {
    spyOn(Swal, 'fire');

    component.clientes = [{
      nombreCompleto: 'Existing User',
      correo: 'existing@example.com',
      contrasennia: 'Password1'
    }];
    component.saveClientes();

    component.registrarForm.setValue({
      nombreCompleto: 'Test User',
      correo: 'existing@example.com',
      contrasennia: 'Password1'
    });

    component.registrarCliente();
    
    expect(component.clientes.length).toBe(1);
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'El cliente con este correo electrónico ya existe.', 'error');
  });

});
