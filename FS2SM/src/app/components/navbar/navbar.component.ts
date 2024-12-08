import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private Router: Router) {}

  get isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  }

  get isAdmin(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.rol === 'ADMIN';
      }
    }
    return false;
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('user');
    Swal.fire('Sesión cerrada', 'Has cerrado sesión exitosamente', 'success');
    setTimeout(() => {
      this.Router.navigate(['/login']);
    }, 1000);
  }
}