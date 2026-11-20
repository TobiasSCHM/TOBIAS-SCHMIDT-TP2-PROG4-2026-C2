import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { SesionService } from './sesion.service';

// agrega el header "Authorization: Bearer <token>" a los pedidos hacia NUESTRO backend cuando hay sesion iniciada.
// a otros servidores no se les manda: el token no tiene por que salir de la app
export const sesionInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const token = inject(SesionService).token();
  if (!token || !peticion.url.startsWith(environment.apiUrl)) return siguiente(peticion);

  // las peticiones son inmutables: se clona con el header agregado
  return siguiente(peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};