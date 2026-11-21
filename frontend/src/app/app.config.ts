import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { sesionInterceptor } from './core/sesion.interceptor';
import { VencimientoSesionService } from './core/vencimiento-sesion.service';
import { PaginadorEs } from './shared/paginador-es';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([sesionInterceptor])),
    // cada vez que alguien pida el paginador de material, se entrega la version en español
    { provide: MatPaginatorIntl, useClass: PaginadorEs },
    // se crea al arrancar la app: asi empieza a vigilar el vencimiento del token desde el primer momento
    provideAppInitializer(() => {
      inject(VencimientoSesionService);
    }),
  ]
};