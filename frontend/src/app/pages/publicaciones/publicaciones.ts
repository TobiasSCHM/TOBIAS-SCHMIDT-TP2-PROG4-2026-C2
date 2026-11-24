import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import type { PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { mensajeDeError } from '../../core/errores';
import type { OrdenPublicaciones, PaginaPublicaciones, Publicacion } from '../../core/models/publicacion.model';
import { PublicacionesService } from '../../core/publicaciones.service';
import { SesionService } from '../../core/sesion.service';
import { ModalService } from '../../shared/modal/modal.service';
import { PublicacionCard } from '../../shared/publicacion-card/publicacion-card';

// pantalla de publicaciones: decide QUE se muestra (orden, pagina) y habla con el backend.
// cada publicacion se dibuja con PublicacionCard, que solo recibe datos y avisa lo que hace el usuario
@Component({
  selector: 'app-publicaciones',
  imports: [
    RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatPaginatorModule,
    MatProgressSpinnerModule, PublicacionCard,
  ],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones {
  private readonly servicio = inject(PublicacionesService);
  private readonly modal = inject(ModalService);
  protected readonly sesion = inject(SesionService);
  //el administrador puede dar de baja cualquier publicacion
  protected readonly esAdmin = computed(() => this.sesion.usuario()?.perfil === 'administrador');

  protected readonly opcionesTamanio = [5, 10, 20];

  protected readonly pagina = signal<PaginaPublicaciones | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly orden = signal<OrdenPublicaciones>('fecha'); // por defecto: por fecha
  protected readonly indice = signal(0); // numero de pagina, empezando en 0
  protected readonly tamanio = signal(5); // publicaciones por pagina
  // ids de las publicaciones cuyo me gusta se esta procesando (para evitar doble clic)
  protected readonly procesando = signal<string[]>([]);

  // numero del ultimo pedido de carga: sirve para ignorar respuestas viejas que lleguen tarde
  private ultimaCarga = 0;

  constructor() {
    if (this.sesion.activa()) void this.cargar();
  }

  protected esPropia(publicacion: Publicacion): boolean {
    return publicacion.autor.id === this.sesion.usuario()?.id;
  }

  // trae del backend la pagina actual. el backend pide "offset" (cuantas saltear) y "limit" (cuantas traer)
  protected async cargar(): Promise<void> {
    const numero = ++this.ultimaCarga;
    this.cargando.set(true);
    this.error.set(null);
    try {
      const respuesta = await firstValueFrom(
        this.servicio.listar({
          orden: this.orden(),
          offset: this.indice() * this.tamanio(),
          limit: this.tamanio(),
        }),
      );
      if (numero !== this.ultimaCarga) return; // llego una respuesta mas nueva: esta ya no sirve

      // si la pagina quedo vacia porque se eliminaron publicaciones, se vuelve a la ultima que exista
      const ultimaPagina = Math.max(0, Math.ceil(respuesta.total / this.tamanio()) - 1);
      if (respuesta.datos.length === 0 && this.indice() > ultimaPagina) {
        this.indice.set(ultimaPagina);
        await this.cargar();
        return;
      }
      this.pagina.set(respuesta);
    } catch (error) {
      if (numero !== this.ultimaCarga) return;
      this.error.set(mensajeDeError(error));
    } finally {
      if (numero === this.ultimaCarga) this.cargando.set(false);
    }
  }

  protected cambiarOrden(orden: OrdenPublicaciones): void {
    if (orden === this.orden()) return;
    this.orden.set(orden);
    this.indice.set(0); // al cambiar el orden se vuelve a la primera pagina
    void this.cargar();
  }

  protected cambiarPagina(evento: PageEvent): void {
    this.indice.set(evento.pageIndex);
    this.tamanio.set(evento.pageSize);
    void this.cargar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      // se actualiza solo esa publicacion con lo que respondio el backend (sin recargar toda la pagina)
      this.pagina.update((p) =>
        p && { ...p, datos: p.datos.map((d) => (d.id === publicacion.id ? { ...d, ...estado } : d)) },
      );
    } catch (error) {
      await this.modal.error(mensajeDeError(error), 'No se pudo actualizar el Me gusta');
      await this.cargar(); // se vuelve a pedir la pagina para mostrar el estado real
    } finally {
      this.procesando.update((ids) => ids.filter((id) => id !== publicacion.id));
    }
  }

  protected async eliminar(publicacion: Publicacion): Promise<void> {
    const confirmo = await this.modal.confirmar(
      `¿Querés eliminar «${publicacion.titulo}»? Esta acción no se puede deshacer: ` +
      'la publicación y sus comentarios dejarán de estar disponibles.',
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
    await this.cargar();
  }
}