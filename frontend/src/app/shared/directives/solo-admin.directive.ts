import { Directive, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import type { EmbeddedViewRef } from '@angular/core';
import { SesionService } from '../../core/sesion.service';

//<a *appSoloAdmin> ... </a> -> el elemento existe solo si el usuario logueado es administrador.
//es una comodidad de la interfaz, la autorizacion de verdad la hace el backend en cada ruta
@Directive({ selector: '[appSoloAdmin]' })
export class SoloAdminDirective {
  private readonly sesion = inject(SesionService);
  private readonly plantilla = inject(TemplateRef);
  private readonly contenedor = inject(ViewContainerRef);
  private vista: EmbeddedViewRef<unknown> | null = null;

  constructor() {
    // se vuelve a evaluar cada vez que cambia el usuario de la sesion (login, logout, perfil actualizado)
    effect(() => {
      const esAdmin = this.sesion.usuario()?.perfil === 'administrador';
      if (esAdmin && !this.vista) {
        this.vista = this.contenedor.createEmbeddedView(this.plantilla);
      } else if (!esAdmin && this.vista) {
        this.contenedor.clear();
        this.vista = null;
      }
    });
  }
}