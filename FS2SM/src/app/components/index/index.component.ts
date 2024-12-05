import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto, CarritoItem } from '../../interface/producto.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  estaLogueado: boolean = false;
  carrito: { [key: string]: CarritoItem } = {};
  productos: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.actualizarCarrito();
  }

  cargarProductos(): void {
    this.productoService.getAllProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
      }
    });
  }

  comprar(producto: Producto): void {
    if (this.carrito[producto.nombre]) {
      if (this.carrito[producto.nombre].cantidad < producto.stock) {
        this.carrito[producto.nombre].cantidad++;
        Swal.fire('Producto añadido', `${producto.nombre} ha sido añadido al carrito`, 'success');
      } else {
        Swal.fire('Stock insuficiente', `No hay más unidades disponibles de ${producto.nombre}`, 'warning');
        return;
      }
    } else {
      this.carrito[producto.nombre] = { producto: producto, cantidad: 1 };
      Swal.fire('Producto añadido', `${producto.nombre} ha sido añadido al carrito`, 'success');
    }
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.actualizarCarrito();
  }

  actualizarCarrito(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const carritoGuardado = localStorage.getItem('carrito');
      if (carritoGuardado) {
        this.carrito = JSON.parse(carritoGuardado);
      }
    }
  }

  incrementarProducto(producto: string): void {
    if (this.carrito[producto]) {
      const stockDisponible = this.productos.find(p => p.nombre === producto)?.stock || 0;
      if (this.carrito[producto].cantidad < stockDisponible) {
        this.carrito[producto].cantidad++;
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        this.actualizarCarrito();
      } else {
        Swal.fire('Stock insuficiente', `No hay más unidades disponibles de ${producto}`, 'warning');
      }
    }
  }

  disminuirProducto(producto: string): void {
    if (this.carrito[producto]) {
      this.carrito[producto].cantidad--;
      if (this.carrito[producto].cantidad === 0) {
        delete this.carrito[producto];
      }
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
      this.actualizarCarrito();
    }
  }

  obtenerTotal(): number {
    let total = 0;
    for (const key in this.carrito) {
      if (this.carrito.hasOwnProperty(key) && this.carrito[key] !== null) {
        total += this.carrito[key].cantidad * this.carrito[key].producto.precio;
      }
    }
    return total;
  }
}