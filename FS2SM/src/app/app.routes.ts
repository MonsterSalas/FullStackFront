import { Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component'; 
import { RegistrarComponent } from './components/registrar/registrar.component'; 
import { PerfilComponent } from './components/perfil/perfil.component'; 
import { AdminComponent } from './components/admin/admin.component'; 

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'index',
        pathMatch: 'full'
    },
    {
        path: 'index',
        component: IndexComponent
    },
    { path: 'login',
        component: LoginComponent },
    { path: 'registrar',
        component: RegistrarComponent },
    { path: 'perfil',
            component: PerfilComponent },
    { path: 'admin',
        component: AdminComponent }
        

];

