import { Routes } from '@angular/router';
import { adminGuard } from './core/admin.guard';
import { Cargando } from './pages/cargando/cargando';
import { DashboardUsuarios } from './pages/dashboard-usuarios/dashboard-usuarios';
import { Login } from './pages/login/login';
import { MiPerfil } from './pages/mi-perfil/mi-perfil';
import { PublicacionDetalle } from './pages/publicacion-detalle/publicacion-detalle';
import { Publicaciones } from './pages/publicaciones/publicaciones';
import { Registro } from './pages/registro/registro';

// la app arranca en /cargando: valida el token guardado y manda a publicaciones o al login (sprint 3).
// el resto de las pantallas siguen siendo accesibles por su direccion. sprint 4: /dashboard/* solo para administradores
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cargando' },
  { path: 'cargando', component: Cargando, title: 'Cargando | FireLink' },
  { path: 'login', component: Login, title: 'Ingresar | FireLink' },
  { path: 'registro', component: Registro, title: 'Registro | FireLink' },
  { path: 'publicaciones', component: Publicaciones, title: 'Publicaciones | FireLink' },
  { path: 'publicaciones/:id', component: PublicacionDetalle, title: 'Publicación | FireLink' },
  { path: 'mi-perfil', component: MiPerfil, title: 'Mi perfil | FireLink' },
  { path: 'dashboard/usuarios', component: DashboardUsuarios, canActivate: [adminGuard], title: 'Usuarios | FireLink' },
  {
    // carga diferida: chart.js solo se descarga cuando un administrador entra a las estadisticas
    path: 'dashboard/estadisticas',
    loadComponent: () => import('./pages/dashboard-estadisticas/dashboard-estadisticas').then((m) => m.DashboardEstadisticas),
    canActivate: [adminGuard],
    title: 'Estadísticas | FireLink',
  },
  { path: '**', redirectTo: 'cargando' },
];