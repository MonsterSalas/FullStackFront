import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component'; // Asegúrate de ajustar la ruta de importación correctamente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corregido a 'styleUrls' en plural
})
export class AppComponent {
  title = 'FullStack';
}
