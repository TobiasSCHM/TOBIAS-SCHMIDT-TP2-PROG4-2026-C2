import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { SesionService } from './sesion.service';

// agrega el header "x-usuario-id" a los pedidos hacia NUESTRO backend cuando hay sesion iniciada.
// a otros servidores no se les manda: el id de un usuario no tiene por que salir de la app.
// en el sprint 3 este mismo interceptor pasa a mandar el token jwt
export const sesionInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const usuario = inject(SesionService).usuario();
  if (!usuario || !peticion.url.startsWith(environment.apiUrl)) return siguiente(peticion);

  // las peticiones son inmutables: se clona con el header agregado
  return siguiente(peticion.clone({ setHeaders: { 'x-usuario-id': usuario.id } }));
};