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

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombreCompleto: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }
  ngOnInit(): void {}
  isFieldInvalid(field: string): boolean {
    const control = this.registroForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
  onSubmit(): void {
    if (this.registroForm.valid) {
      const usuario: Usuario = {
        ...this.registroForm.value,
        rolId: 1 // ID para el rol de usuario normal
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
        text: 'Por favor, complete todos los campos requeridos',
        icon: 'error'
      });
    }
  }
}