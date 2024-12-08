import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { PerfilComponent } from './perfil.component';
import { Cliente } from '../../interface/cliente.model';
import Swal from 'sweetalert2';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let router: Router;
  let mockCliente: Cliente = {
    nombreCompleto: 'Test User',
    correo: 'test@test.com',
    contrasennia: 'Password123'
  };

  beforeEach(async () => {
    spyOn(localStorage, 'getItem').and.callFake((key) => {
      if (key === 'user') return JSON.stringify(mockCliente);
      if (key === 'clientes') return JSON.stringify([mockCliente]);
      return null;
    });
    spyOn(localStorage, 'setItem');
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    await TestBed.configureTestingModule({
      imports: [PerfilComponent, ReactiveFormsModule, RouterTestingModule],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Inicialización', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load client data', () => {
      expect(component.clienteActual).toEqual(mockCliente);
    });

    it('should initialize form with client data', () => {
      expect(component.perfilForm.value).toEqual({
        nombreCompleto: mockCliente.nombreCompleto,
        correo: mockCliente.correo,
        contrasennia: mockCliente.contrasennia
      });
    });
  });

  describe('Validaciones del formulario', () => {
    it('should validate required fields', () => {
      component.perfilForm.patchValue({
        nombreCompleto: '',
        correo: '',
        contrasennia: ''
      });
      expect(component.perfilForm.valid).toBeFalse();
    });

    it('should validate email format', () => {
      component.perfilForm.patchValue({ correo: 'invalid-email' });
      expect(component.perfilForm.get('correo')?.errors?.['correoInvalido']).toBeTrue();
      
      component.perfilForm.patchValue({ correo: 'valid@email.com' });
      expect(component.perfilForm.get('correo')?.errors?.['correoInvalido']).toBeFalsy();
    });

    it('should validate password requirements', () => {
      component.perfilForm.patchValue({ contrasennia: 'weak' });
      expect(component.perfilForm.get('contrasennia')?.errors?.['contraseniaInvalida']).toBeTrue();
      
      component.perfilForm.patchValue({ contrasennia: 'StrongPass123' });
      expect(component.perfilForm.get('contrasennia')?.errors?.['contraseniaInvalida']).toBeFalsy();
    });
  });

  describe('guardarCambios', () => {
    it('should save valid changes', fakeAsync(() => {
      component.perfilForm.patchValue({
        nombreCompleto: 'New Name',
        correo: 'new@email.com',
        contrasennia: 'NewPass123'
      });

      component.guardarCambios();
      tick();

      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(Swal.fire).toHaveBeenCalled();
      tick(1000);
      expect(router.navigate).toHaveBeenCalledWith(['/perfil']);
    }));

    it('should not save invalid form', () => {
      component.perfilForm.patchValue({ correo: 'invalid-email' });
      component.guardarCambios();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Validadores personalizados', () => {
    it('should validate email properly', () => {
      const emailControl = component.perfilForm.get('correo');
      emailControl?.setValue('invalid');
      expect(emailControl?.errors?.['correoInvalido']).toBeTrue();
      
      emailControl?.setValue('valid@domain.com');
      expect(emailControl?.errors?.['correoInvalido']).toBeFalsy();
    });

    it('should validate password properly', () => {
      const passwordControl = component.perfilForm.get('contrasennia');
      
      passwordControl?.setValue('short');
      expect(passwordControl?.errors?.['contraseniaInvalida']).toBeTrue();
      
      passwordControl?.setValue('nouppercase1');
      expect(passwordControl?.errors?.['contraseniaInvalida']).toBeTrue();
      
      passwordControl?.setValue('NONUMBER');
      expect(passwordControl?.errors?.['contraseniaInvalida']).toBeTrue();
      
      passwordControl?.setValue('ValidPass123');
      expect(passwordControl?.errors?.['contraseniaInvalida']).toBeFalsy();
    });
  });
});