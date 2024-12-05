import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      // Caso especial para admin
      if (username === 'admin' && password === 'admin') {
        this.handleSuccessfulLogin({ rol: 'ADMIN' }, '/admin');
        return;
      }

      this.authService.login(username, password).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          if (response && response.mensaje === "Login exitoso") {
            this.handleSuccessfulLogin({ username }, '/index');
          } else {
            this.showErrorAlert('Credenciales inválidas');
          }
        },
        error: (error) => {
          console.error('Error durante el login:', error);
          if (error.status === 400) {
            this.showErrorAlert('Credenciales inválidas');
          } else {
            this.showErrorAlert('Error al intentar iniciar sesión');
          }
        }
      });
    } else {
      this.showErrorAlert('Por favor, completa todos los campos');
    }
  }

  private handleSuccessfulLogin(user: any, redirectPath: string): void {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));

    Swal.fire({
      title: 'Sesión Iniciada',
      text: 'Has iniciado sesión exitosamente',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    }).then(() => {
      this.router.navigate([redirectPath]);
    });
  }

  private showErrorAlert(message: string): void {
    Swal.fire({
      title: 'Oops!',
      text: message,
      icon: 'error',
      timer: 2000
    });
  }
}