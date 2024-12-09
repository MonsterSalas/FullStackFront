import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../interface/usuario.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {
  registroForm: FormGroup;
  mostrarPassword: boolean = false;  // Añadido para controlar la visibilidad de la contraseña

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombreCompleto: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]]
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {  // Función añadida
    this.mostrarPassword = !this.mostrarPassword;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registroForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.registroForm.get(field);
    
    if (field === 'password') {
      if (control?.errors?.['required']) return 'La contraseña es requerida';
      if (control?.errors?.['minlength']) return 'La contraseña debe tener al menos 8 caracteres';
      if (control?.errors?.['maxlength']) return 'La contraseña no puede tener más de 20 caracteres';
      if (control?.errors?.['pattern']) return 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial';
    }
    
    return 'Este campo es requerido';
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      const usuario: Usuario = {
        ...this.registroForm.value,
        rolId: 1
      };

      this.usuarioService.crearUsuario(usuario).subscribe({
        next: (response) => {
          Swal.fire({
            title: 'Éxito',
            text: 'Usuario registrado correctamente',
            icon: 'success',
            timer: 1500
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          console.error('Error al registrar:', error);
          Swal.fire({
            title: 'Error',
            text: error.error?.mensaje || 'Ocurrió un error al intentar registrar el usuario',
            icon: 'error'
          });
        }
      });
    } else {
      this.registroForm.markAllAsTouched();
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos requeridos correctamente',
        icon: 'error'
      });
    }
  }
}