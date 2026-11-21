import { Routes } from '@angular/router';
import { Cargando } from './pages/cargando/cargando';
import { Login } from './pages/login/login';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { Registro } from './pages/registro/registro';

// la app arranca en /cargando: valida el token guardado y manda a publicaciones o al login (sprint 3).
// el resto de las pantallas siguen siendo accesibles por su direccion
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cargando' },
  { path: 'cargando', component: Cargando, title: 'Cargando | FireLink' },
  { path: 'login', component: Login, title: 'Ingresar | FireLink' },
  { path: 'registro', component: Registro, title: 'Registro | FireLink' },
  { path: 'publicaciones', component: Publicaciones, title: 'Publicaciones | FireLink' },
  { path: 'mi-perfil', component: MiPerfil, title: 'Mi perfil | FireLink' },
  { path: '**', redirectTo: 'cargando' },
];