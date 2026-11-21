import { HttpErrorResponse } from '@angular/common/http';
import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { SesionService } from './sesion.service';
import { VencimientoSesionService } from './vencimiento-sesion.service';

// rutas donde un 401 NO significa "sesion vencida": en el login es "contrasena incorrecta" (ya se muestra como error)
// y la pantalla "cargando" maneja por su cuenta el 401 de /auth/autorizar
const RUTAS_CON_401_PROPIO = ['/auth/login', '/auth/registro', '/auth/autorizar'].map((ruta) => environment.apiUrl + ruta);

// agrega el header "Authorization: Bearer <token>" a los pedidos hacia NUESTRO backend cuando hay sesion iniciada.
// a otros servidores no se les manda: el token no tiene por que salir de la app.
// si el backend responde 401 (token invalido o vencido), lleva al usuario al login
export const sesionInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const sesion = inject(SesionService);
  const token = sesion.token();
  if (!token || !peticion.url.startsWith(environment.apiUrl)) return siguiente(peticion);

  const vencimiento = inject(VencimientoSesionService);

  // las peticiones son inmutables: se clona con el header agregado
  return siguiente(peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } })).pipe(
    catchError((error: unknown) => {
      const es401 = error instanceof HttpErrorResponse && error.status === 401;
      // solo si el token sigue siendo el mismo: una respuesta vieja no tiene que cerrar una sesion nueva
      if (es401 && !RUTAS_CON_401_PROPIO.includes(peticion.url) && sesion.token() === token) {
        void vencimiento.sesionExpirada();
      }
      // el error sigue su camino: cada pantalla decide como mostrarlo
      return throwError(() => error);
    }),
  );
};