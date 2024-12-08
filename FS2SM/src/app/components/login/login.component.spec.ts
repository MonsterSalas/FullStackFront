import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    
    spyOn(router, 'navigate');
    spyOn(localStorage, 'setItem');
    spyOn(console, 'log');
    spyOn(console, 'error');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should initialize with invalid form', () => {
      expect(component.loginForm.valid).toBeFalse();
    });

    it('should be valid when all fields are filled', () => {
      component.loginForm.controls['username'].setValue('test');
      component.loginForm.controls['password'].setValue('password');
      expect(component.loginForm.valid).toBeTrue();
    });

    it('should show error alert for invalid form submission', fakeAsync(() => {
      component.login();
      tick();
      expect(Swal.fire).toHaveBeenCalled();
    }));
  });

  describe('Admin Login', () => {
    it('should handle admin login correctly', fakeAsync(() => {
      component.loginForm.setValue({
        username: 'admin',
        password: 'admin'
      });

      component.login();
      tick();

      expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({ rol: 'ADMIN' }));
      expect(Swal.fire).toHaveBeenCalled();

      tick(1000);
      expect(router.navigate).toHaveBeenCalledWith(['/admin']);
    }));
  });

  describe('Normal User Login', () => {
    it('should handle successful login', fakeAsync(() => {
      component.loginForm.setValue({
        username: 'user',
        password: 'password'
      });

      authService.login.and.returnValue(of({ mensaje: 'Login exitoso' }));

      component.login();
      tick();

      expect(localStorage.setItem).toHaveBeenCalledWith('isLoggedIn', 'true');
      expect(router.navigate).toHaveBeenCalledWith(['/index']);
    }));

    it('should handle invalid credentials', fakeAsync(() => {
      component.loginForm.setValue({
        username: 'user',
        password: 'wrong'
      });

      authService.login.and.returnValue(of({ mensaje: 'Error' }));

      component.login();
      tick();

      expect(Swal.fire).toHaveBeenCalled();
    }));
  });

  describe('Error Handling', () => {
    it('should handle 400 error', fakeAsync(() => {
      component.loginForm.setValue({
        username: 'user',
        password: 'password'
      });

      authService.login.and.returnValue(throwError(() => ({ status: 400 })));

      component.login();
      tick();

      expect(Swal.fire).toHaveBeenCalled();
    }));

    it('should handle general error', fakeAsync(() => {
      component.loginForm.setValue({
        username: 'user',
        password: 'password'
      });

      authService.login.and.returnValue(throwError(() => ({ status: 500 })));

      component.login();
      tick();

      expect(Swal.fire).toHaveBeenCalled();
    }));
  });
});