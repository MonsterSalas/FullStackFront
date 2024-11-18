import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import Swal from 'sweetalert2';
import {Router} from '@angular/router';

interface Producto {
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, // Añade CommonModule aquí
    ReactiveFormsModule // Añade ReactiveFormsModule aquí
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  productos: Producto[] = [
    {
      nombre: 'ASUS Prime H510M-E',
      descripcion: 'Placa Madre ASUS Prime H510M-E',
      imagen: 'assets/img/motherboard.jpg',
      precio: 100
    },
    {
      nombre: 'Samsung Odyssey Neo G9',
      descripcion: 'Tela Curva Super Ultrawide, 240Hz, FreeSync',
      imagen: 'assets/img/monitor.jpeg',
      precio: 200
    },
  ];

  productoSeleccionadoIndex: number | null = null;
  editProductForm: FormGroup;

  constructor(private fb: FormBuilder,private Router: Router) {
    this.editProductForm = this.fb.group({
      nombre: [''],
      descripcion: [''],
      precio: [null]
    });
  }

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  abrirModalEditar(index: number): void {
    this.productoSeleccionadoIndex = index;
    const producto = this.productos[index];
    this.editProductForm.setValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio
    });
  }
  

  guardarCambios(): void {
    if (this.productoSeleccionadoIndex !== null) {
      // Guarda la imagen actual del producto
      const imagenOriginal = this.productos[this.productoSeleccionadoIndex].imagen;
      
      // Actualiza el producto con los valores del formulario
      const productoActualizado = this.editProductForm.value;
      
      // Restablece la imagen del producto a la original
      productoActualizado.imagen = imagenOriginal;
      
      // Actualiza el producto en el array
      this.productos[this.productoSeleccionadoIndex] = productoActualizado;
      
      // Lógica para cerrar el modal y actualizar la lista de productos
      this.productoSeleccionadoIndex = null; // Resetea el índice seleccionado
      Swal.fire({
        title: 'Modifiaciones guardadas',
        text: 'El producto ha sido actualizado exitosamente',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000 // El alerta se cerrará automáticamente después de 1 segundos
      }).then(() => {
        this.Router.navigate(['/admin']); // Navega a la página deseada después de cerrar el alerta
      });
    }
  }
}
