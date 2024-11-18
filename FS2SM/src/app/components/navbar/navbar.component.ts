import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private Router: Router) {
  }
  get isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false; // Asume que no está logueado si localStorage no está disponible
  }
  
  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    Swal.fire('Sesión cerrada', 'Has cerrado sesión exitosamente', 'success');
    setTimeout(() => {
      this.Router.navigate(['/login']);
    }, 1000); // Retrasar la navegación por 1 segundo (1000 ms)
  }
}
