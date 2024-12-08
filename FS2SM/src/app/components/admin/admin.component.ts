import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto, ProductoDTO } from '../../interface/producto.interface';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  editProductForm: FormGroup;
  searchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productoService: ProductoService
  ) {
    this.editProductForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [null, [Validators.required, Validators.min(0)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      categoria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.productosFiltrados = productos;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
      }
    });
  }

  buscarProductos(event: any): void {
    const termino = event.target.value.toLowerCase();
    this.searchTerm = termino;
    
    if (termino === '') {
      this.productosFiltrados = this.productos;
    } else {
      this.productosFiltrados = this.productos.filter(producto => 
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino)
      );
    }
  }

  abrirModalEditar(producto: Producto): void {
    Swal.fire({
      title: 'Editar Producto',
      html: `
        <div class="swal2-form">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input id="nombre" class="swal2-input" value="${producto.nombre}">
          </div>
          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" class="swal2-textarea">${producto.descripcion}</textarea>
          </div>
          <div class="form-group">
            <label for="precio">Precio</label>
            <input id="precio" type="number" class="swal2-input" value="${producto.precio}">
          </div>
          <div class="form-group">
            <label for="stock">Stock</label>
            <input id="stock" type="number" class="swal2-input" value="${producto.stock}">
          </div>
          <div class="form-group">
            <label for="categoria">Categoría</label>
            <input id="categoria" class="swal2-input" value="${producto.categoria}">
          </div>
        </div>
      `,
      customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup',
        input: 'custom-swal-input'
      },
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
        const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value;
        const precio = (document.getElementById('precio') as HTMLInputElement).value;
        const stock = (document.getElementById('stock') as HTMLInputElement).value;
        const categoria = (document.getElementById('categoria') as HTMLInputElement).value;
        
        if (!nombre || !descripcion || !precio || !stock || !categoria) {
          Swal.showValidationMessage('Por favor complete todos los campos');
          return false;
        }
        
        return {
          nombre,
          descripcion,
          precio: parseFloat(precio),
          stock: parseInt(stock),
          categoria
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const productoActualizado = result.value;
        this.productoService.updateProducto(producto.id!, productoActualizado).subscribe({
          next: () => {
            Swal.fire({
              title: 'Modificaciones guardadas',
              text: 'El producto ha sido actualizado exitosamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.cargarProductos();
          },
          error: (error) => {
            console.error('Error al actualizar producto:', error);
            Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
          }
        });
      }
    });
  }

  abrirModalCrear(): void {
    Swal.fire({
      title: 'Crear Nuevo Producto',
      html: `
        <div class="swal2-form">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input id="nombre" class="swal2-input">
          </div>
          <div class="form-group">
            <label for="descripcion">Descripción</label>
            <textarea id="descripcion" class="swal2-textarea"></textarea>
          </div>
          <div class="form-group">
            <label for="precio">Precio</label>
            <input id="precio" type="number" class="swal2-input">
          </div>
          <div class="form-group">
            <label for="stock">Stock</label>
            <input id="stock" type="number" class="swal2-input">
          </div>
          <div class="form-group">
            <label for="categoria">Categoría</label>
            <input id="categoria" class="swal2-input">
          </div>
        </div>
      `,
      customClass: {
        container: 'custom-swal-container',
        popup: 'custom-swal-popup',
        input: 'custom-swal-input'
      },
      showCancelButton: true,
      confirmButtonText: 'Crear',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const nombre = (document.getElementById('nombre') as HTMLInputElement).value;
        const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value;
        const precio = (document.getElementById('precio') as HTMLInputElement).value;
        const stock = (document.getElementById('stock') as HTMLInputElement).value;
        const categoria = (document.getElementById('categoria') as HTMLInputElement).value;
        
        if (!nombre || !descripcion || !precio || !stock || !categoria) {
          Swal.showValidationMessage('Por favor complete todos los campos');
          return false;
        }
        
        return {
          nombre,
          descripcion,
          precio: parseFloat(precio),
          stock: parseInt(stock),
          categoria
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoProducto = result.value;
        this.productoService.crearProducto(nuevoProducto).subscribe({
          next: () => {
            Swal.fire({
              title: 'Producto creado',
              text: 'El producto ha sido creado exitosamente',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.cargarProductos();
          },
          error: (error) => {
            console.error('Error al crear producto:', error);
            Swal.fire('Error', 'No se pudo crear el producto', 'error');
          }
        });
      }
    });
  }

  eliminarProducto(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.deleteProducto(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'El producto ha sido eliminado',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            });
            this.cargarProductos();
          },
          error: (error) => {
            console.error('Error al eliminar producto:', error);
            Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
          }
        });
      }
    });
  }
}