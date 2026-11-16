import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { mensajeDeError } from '../../core/errores';
import type { Publicacion } from '../../core/models/publicacion.model';
import { PublicacionesService } from '../../core/publicaciones.service';
import { SesionService } from '../../core/sesion.service';
import { ModalService } from '../../shared/modal/modal.service';
import { PublicacionCard } from '../../shared/publicacion-card/publicacion-card';

// mi perfil: los datos del usuario logueado y sus ultimas 3 publicaciones.
// los datos salen de la sesion (lo que devolvio el login); las publicaciones, del backend
@Component({
  selector: 'app-mi-perfil',
  imports: [
    DatePipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule,
    PublicacionCard,
  ],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil {
  private readonly servicio = inject(PublicacionesService);
  private readonly modal = inject(ModalService);
  protected readonly sesion = inject(SesionService);

  // null = todavia no se cargaron (muestra el spinner); lista vacia = el usuario no publico nada
  protected readonly publicaciones = signal<Publicacion[] | null>(null);
  protected readonly total = signal(0); // cuantas publicaciones tiene en total (se muestran solo las ultimas 3)
  protected readonly error = signal<string | null>(null);
  // ids de las publicaciones cuyo me gusta se esta procesando (para evitar doble clic)
  protected readonly procesando = signal<string[]>([]);

  constructor() {
    if (this.sesion.activa()) void this.cargar();
  }

  protected async cargar(): Promise<void> {
    const usuario = this.sesion.usuario();
    if (!usuario) return;

    this.error.set(null);
    try {
      // mismo endpoint que el listado general, filtrado por mi id y limitado a 3 (las mas nuevas primero)
      const pagina = await firstValueFrom(this.servicio.listar({ usuario: usuario.id, orden: 'fecha', limit: 3 }));
      this.publicaciones.set(pagina.datos);
      this.total.set(pagina.total);
    } catch (error) {
      this.error.set(mensajeDeError(error));
    }
  }

  // da o quita el me gusta segun el estado actual de la publicacion
  protected async alternarMeGusta(publicacion: Publicacion): Promise<void> {
    if (this.procesando().includes(publicacion.id)) return;
    this.procesando.update((ids) => [...ids, publicacion.id]);
    try {
      const estado = await firstValueFrom(
        publicacion.meGusta
          ? this.servicio.quitarMeGusta(publicacion.id)
          : this.servicio.darMeGusta(publicacion.id),
      );
      this.publicaciones.update(
        (lista) => lista?.map((d) => (d.id === publicacion.id ? { ...d, ...estado } : d)) ?? null,
      );
    } catch (error) {
      await this.modal.error(mensajeDeError(error), 'No se pudo actualizar el Me gusta');
      await this.cargar();
    } finally {
      this.procesando.update((ids) => ids.filter((id) => id !== publicacion.id));
    }
  }

  protected async eliminar(publicacion: Publicacion): Promise<void> {
    const confirmo = await this.modal.confirmar(
      `¿Querés eliminar «${publicacion.titulo}»? Esta acción no se puede deshacer.`,
      'Eliminar publicación',
      'Eliminar',
      'Cancelar',
    );
    if (!confirmo) return;

    try {
      await firstValueFrom(this.servicio.eliminar(publicacion.id));
    } catch (error) {
      await this.modal.error(mensajeDeError(error), 'No se pudo eliminar la publicación');
      await this.cargar();
      return;
    }
    await this.modal.informar('La publicación fue eliminada.', 'Publicación eliminada');
    await this.cargar(); // al volver a pedir las 3 ultimas, entra la siguiente publicacion mas vieja
  }
}