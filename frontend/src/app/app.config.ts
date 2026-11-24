import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig, inject, isDevMode, provideAppInitializer, provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideServiceWorker } from '@angular/service-worker';
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
    // registra el service worker de angular (ngsw-worker.js, que genera el build de produccion
    // a partir de ngsw-config.json). solo se activa en produccion: en desarrollo (ng serve) no se sirve.
    // registerWhenStable: espera a que la app termine de arrancar (o 30 s como maximo) para no competir con la carga inicial
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ]
};