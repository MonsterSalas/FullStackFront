import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Cliente } from '../../interface/cliente.model';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

function validarContrasenia(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value || ''; // Asegúrate de que valor sea una cadena vacía si es null o undefined
    console.log("Valor de la contraseña:", valor); // Para depuración
    const tieneNumero = /[0-9]/.test(valor);
    console.log("Tiene número:", tieneNumero); // Para depuración
    const tieneMayuscula = /[A-Z]/.test(valor);
    console.log("Tiene mayúscula:", tieneMayuscula); // Para depuración
    const tieneLongitudAdecuada = valor.length >= 8;
    console.log("Tiene longitud adecuada:", tieneLongitudAdecuada); // Para depuración
    if (!tieneNumero || !tieneMayuscula || !tieneLongitudAdecuada) {
      console.log("Contraseña inválida"); // Para depuración
      return { contraseniaInvalida: true };
    }
    console.log("Contraseña válida"); // Para depuración
    return null;
  };
}

function validarCorreo(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value || ''; // Asegúrate de que valor sea una cadena vacía si es null o undefined
    const formatoCorreo = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!formatoCorreo.test(valor)) {
      return { correoInvalido: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule,CommonModule],
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  clienteActual!: Cliente;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarCliente();
    this.inicializarFormulario();
  }

  cargarCliente(): void {
    const clienteGuardado = localStorage.getItem('user');
    if (clienteGuardado) {
      this.clienteActual = JSON.parse(clienteGuardado);
    }
  }

  inicializarFormulario(): void {
    this.perfilForm = new FormGroup({
      nombreCompleto: new FormControl(this.clienteActual?.nombreCompleto || '', Validators.required),
      correo: new FormControl(this.clienteActual?.correo || '', [Validators.required, validarCorreo()]),
      contrasennia: new FormControl(this.clienteActual?.contrasennia || '', [Validators.required, validarContrasenia()]),
    });
  }

  guardarCambios(): void {
    if (this.perfilForm.valid) {
      const clientesGuardados = localStorage.getItem('clientes');
      let clientes: Cliente[] = clientesGuardados ? JSON.parse(clientesGuardados) : [];
      const index = clientes.findIndex(c => c.correo === this.clienteActual.correo);
      if (index !== -1) {
        clientes[index] = { ...this.clienteActual, ...this.perfilForm.value };
        localStorage.setItem('clientes', JSON.stringify(clientes));
        localStorage.setItem('user', JSON.stringify(clientes[index])); // Actualiza también el cliente en 'user'
        Swal.fire({
          title: 'Cambios guardados',
          text: 'Se ha guardado de manera existosa la información de tu perfil',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          this.router.navigate(['/perfil']); // Navega a la página de perfil después de cerrar el alerta
        });
      }
    }
  }
}
