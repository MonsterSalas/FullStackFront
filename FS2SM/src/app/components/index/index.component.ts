import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

interface Producto {
  nombre: string;
  descripcion: string;
  imagen: string;
  precio: number;
}

interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

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

  ngOnInit(): void {
    this.actualizarCarrito();
  }

  verCarrito(): void {
    this.actualizarCarrito();
    const carritoModal = document.getElementById('carritoModal');
    if (carritoModal) {
      // Abre el modal (necesitas un framework de UI para modal)
    }
  }

  comprar(producto: Producto): void {
    if (this.carrito[producto.nombre]) {
      this.carrito[producto.nombre].cantidad++;
    } else {
      this.carrito[producto.nombre] = { producto: producto, cantidad: 1 };
    }
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.actualizarCarrito();
    Swal.fire('Producto añadido', `${producto.nombre} ha sido añadido al carrito`, 'success');
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
      this.carrito[producto].cantidad++;
      localStorage.setItem('carrito', JSON.stringify(this.carrito));
      this.actualizarCarrito();
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
