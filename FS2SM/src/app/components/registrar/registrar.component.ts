import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Cliente } from '../../interface/cliente.model'; // Asegúrate de ajustar la ruta de importación según sea necesario
import Swal from 'sweetalert2';
import {Router} from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function validarContrasenia(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value || ''; // Asegurarse de que valor sea una cadena vacía si es null o undefined
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
    const valor = control.value || ''; // Asegurarse de que valor sea una cadena vacía si es null o undefined
    const formatoCorreo = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!formatoCorreo.test(valor)) {
      return { correoInvalido: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css'] // Corregido de 'styleUrl' a 'styleUrls'
})




export class RegistrarComponent implements OnInit {
  registrarForm!: FormGroup;
  public clientes: Cliente[] = [];
  

  constructor(public Router: Router) {
  }

  ngOnInit(): void {
    
    this.registrarForm = new FormGroup({
      nombreCompleto: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, validarCorreo()]),
      contrasennia: new FormControl('', [Validators.required, validarContrasenia()])
    });
    this.loadClientes();
  }

  loadClientes(): void {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      this.clientes = JSON.parse(clientesGuardados);
    }
  }

  saveClientes(): void {
    localStorage.setItem('clientes', JSON.stringify(this.clientes));
  }

  agregarCliente(cliente: Cliente): boolean {
    const longitudInicial = this.clientes.length;
    this.clientes.push(cliente);
    this.saveClientes();
    return this.clientes.length > longitudInicial;
  }
  existeCliente(correo: string): boolean {
    return this.clientes.some(cliente => cliente.correo === correo);
  }

  registrarCliente(): void {
    if (this.registrarForm.valid) {
      const nuevoCliente: Cliente = this.registrarForm.value;
      // Verificar si el cliente ya existe
      if (this.existeCliente(nuevoCliente.correo)) {
        Swal.fire('Error', 'El cliente con este correo electrónico ya existe.', 'error');
        return;
      }
      const resultado = this.agregarCliente(nuevoCliente);
      if (resultado) {
        Swal.fire({
          title: 'Registro Exitoso',
          text: 'Te has registrado de manera exitosa',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          this.Router.navigate(['/login']);
        });
      } else {
        console.log("Error al agregar el cliente.");
      }
      this.registrarForm.reset();
    }
    else {
      // Verificar qué campo tiene el error y mostrar el mensaje correspondiente
      if (this.registrarForm.get('correo')?.errors?.['correoInvalido']) {
        Swal.fire('Error', 'El correo electrónico no tiene un formato válido.', 'error');
      } else if (this.registrarForm.get('contrasennia')?.errors?.['contraseniaInvalida']) {
        Swal.fire('Error', 'La contraseña debe tener al menos 8 caracteres, incluir una mayúscula y un número.', 'error');
      }
    }
  }
}
