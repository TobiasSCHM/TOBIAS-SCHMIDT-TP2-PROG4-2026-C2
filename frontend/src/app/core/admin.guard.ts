import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { ModalService } from '../shared/modal/modal.service';
import { SesionService } from './sesion.service';

// sprint 4: deja entrar a una ruta solo a los administradores. es una comodidad de la interfaz: la proteccion
// de verdad esta en el backend, que responde 403 a los usuarios comunes en cada ruta administrativa
export const adminGuard: CanActivateFn = () => {
  const sesion = inject(SesionService);
  const router = inject(Router);
  const modal = inject(ModalService);

  if (!sesion.activa()) return router.createUrlTree(['/login']);

  if (sesion.usuario()?.perfil !== 'administrador') {
    void modal.error('Esta sección es solo para administradores.', 'Acceso restringido');
    return router.createUrlTree(['/publicaciones']);
  }
  return true;
};