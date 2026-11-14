import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { Registro } from './pages/registro/registro';

// sprint 1: navegacion libre entre las cuatro pantallas. los guards llegan en el sprint 3
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: Login, title: 'Ingresar | FireLink' },
  { path: 'registro', component: Registro, title: 'Registro | FireLink' },
  { path: 'publicaciones', component: Publicaciones, title: 'Publicaciones | FireLink' },
  { path: 'mi-perfil', component: MiPerfil, title: 'Mi perfil | FireLink' },
  { path: '**', redirectTo: 'login' },
];