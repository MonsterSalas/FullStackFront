import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Cliente } from '../../interface/cliente.model'; // Asegúrate de ajustar la ruta de importación según sea necesario
import { CommonModule } from '@angular/common'; // Importa CommonModule
import {Router} from '@angular/router';
import { RouterModule } from '@angular/router'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corregido de 'styleUrl' a 'styleUrls'
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  private clientes: Cliente[] = [];

  constructor(private formBuilder: FormBuilder,private Router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    this.loadClientes();
  }
  loadClientes(): void {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      this.clientes = JSON.parse(clientesGuardados);
    }
  }
  authenticate(username: string, password: string): Cliente | undefined {
    return this.clientes.find(u => u.correo === username && u.contrasennia === password);
  }
  login(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;
      const user = this.authenticate(username, password);
      if (user) {
        console.log('Autenticación exitosa');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        Swal.fire({
          title: 'Sesión Iniciada',
          text: 'Has iniciado sesión exitosamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000 // El alerta se cerrará automáticamente después de 1 segundos
        }).then(() => {
          this.Router.navigate(['/index']); // Navega a la página deseada después de cerrar el alerta
        });
      }else if(username === 'admin' && password === 'admin'){
        console.log('Autenticación exitosa');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        Swal.fire({
          title: 'Sesión Iniciada',
          text: 'Has iniciado sesión exitosamente',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000 // El alerta se cerrará automáticamente después de 1 segundos
        }).then(() => {
          this.Router.navigate(['/admin']); // Navega a la página deseada después de cerrar el alerta
        });

      } 
      else {
        Swal.fire({
          title: 'Oops!',
          text: 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.',
          icon: 'error',
          timer: 2000 // El alerta se cerrará automáticamente después de 1 segundos
        })
      }
    }else{
      Swal.fire({
        title: 'Oops!',
        text: 'Por favor, completa los campos requeridos.',
        icon: 'error',
        timer: 2000 // El alerta se cerrará automáticamente después de 1 segundos
      })
    }
  }
  logout(): void {
    localStorage.removeItem('isLoggedIn');
  }
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false; // Asume que no está logueado si localStorage no está disponible
  }
}  