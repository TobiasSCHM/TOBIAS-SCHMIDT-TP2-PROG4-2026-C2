import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import type { AbstractControl } from '@angular/forms';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ComentariosService } from '../../core/comentarios.service';
import { mensajeDeError } from '../../core/errores';
import type { Comentario } from '../../core/models/comentario.model';
import type { Publicacion } from '../../core/models/publicacion.model';
import { PublicacionesService } from '../../core/publicaciones.service';
import { SesionService } from '../../core/sesion.service';
import { ModalService } from '../../shared/modal/modal.service';
import { PublicacionCard } from '../../shared/publicacion-card/publicacion-card';

const LIMITE = 5; // comentarios por carga: la primera vez y cada vez que se toca "cargar mas"
const MAX_CARACTERES = 350; // el mismo limite que el backend

// reglas de un comentario: no vacio (ni solo espacios) y hasta 350 caracteres
const REGLAS = [Validators.required, Validators.pattern(/\S/), Validators.maxLength(MAX_CARACTERES)];

// pagina de una publicacion: se ve en grande, con sus comentarios debajo.
// se puede comentar, cargar mas comentarios y editar los propios
@Component({
  selector: 'app-publicacion-detalle',
  imports: [
    DatePipe, ReactiveFormsModule, RouterLink, MatButtonModule, MatCardModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatProgressSpinnerModule, PublicacionCard,
  ],
  templateUrl: './publicacion-detalle.html',
  styleUrl: './publicacion-detalle.css',
})
export class PublicacionDetalle {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly publicaciones = inject(PublicacionesService);
  private readonly comentariosApi = inject(ComentariosService);
  private readonly modal = inject(ModalService);
  protected readonly sesion = inject(SesionService);

  protected readonly maxCaracteres = MAX_CARACTERES;

  // id de la publicacion: sale de la direccion (/publicaciones/:id)
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  // publicacion
  protected readonly publicacion = signal<Publicacion | null>(null);
  protected readonly errorPublicacion = signal<{ titulo: string; mensaje: string; reintentable: boolean } | null>(null);
  protected readonly procesandoMeGusta = signal(false);

  // comentarios. null = todavia no se cargaron (muestra el spinner); lista vacia = no hay comentarios
  protected readonly comentarios = signal<Comentario[] | null>(null);
  protected readonly total = signal(0);
  protected readonly cargandoComentarios = signal(false);
  protected readonly errorComentarios = signal<string | null>(null);
  // se pone en true cuando el backend ya no tiene mas comentarios para traer (ver cargarComentarios)
  private readonly sinMas = signal(false);
  protected readonly hayMas = computed(() => !this.sinMas() && (this.comentarios()?.length ?? 0) < this.total());

  // formulario para comentar y formulario para editar (se edita de a un comentario por vez)
  protected readonly nuevoForm = this.fb.group({ mensaje: ['', REGLAS] });
  protected readonly edicionForm = this.fb.group({ mensaje: ['', REGLAS] });
  protected readonly enviando = signal(false);
  protected readonly guardando = signal(false);
  protected readonly editandoId = signal<string | null>(null);

  constructor() {
    if (this.sesion.activa()) void this.cargar();
  }

  // trae la publicacion y, si existe, sus primeros comentarios
  protected async cargar(): Promise<void> {
    this.errorPublicacion.set(null);
    try {
      this.publicacion.set(await firstValueFrom(this.publicaciones.obtener(this.id)));
    } catch (error) {
      // 404 (no existe o fue eliminada) y 400 (el id de la direccion esta mal escrito): para el usuario es lo mismo
      const noExiste = error instanceof HttpErrorResponse && (error.status === 404 || error.status === 400);
      this.errorPublicacion.set(
        noExiste
          ? { titulo: 'La publicación no existe', mensaje: 'Puede que haya sido eliminada o que el enlace sea incorrecto.', reintentable: false }
          : { titulo: 'No se pudo cargar la publicación', mensaje: mensajeDeError(error), reintentable: true },
      );
      return;
    }
    await this.cargarComentarios();
  }

  // trae los comentarios que faltan (los siguientes a los que ya se muestran) y los suma al final de la lista
  protected async cargarComentarios(): Promise<void> {
    if (this.cargandoComentarios()) return;
    this.cargandoComentarios.set(true);
    this.errorComentarios.set(null);
    try {
      const actuales = this.comentarios() ?? [];
      const pagina = await firstValueFrom(this.comentariosApi.listar(this.id, actuales.length, LIMITE));

      // si otro usuario comento mientras tanto, la pagina puede traer alguno que ya se muestra: se descarta por id
      const idsActuales = new Set(actuales.map((c) => c.id));
      const nuevos = pagina.datos.filter((c) => !idsActuales.has(c.id));

      this.comentarios.set([...actuales, ...nuevos]);
      this.total.set(pagina.total);
      // si el backend devolvio menos de lo pedido (o nada nuevo), ya no quedan mas: se oculta "cargar mas"
      this.sinMas.set(pagina.datos.length < LIMITE || nuevos.length === 0);
    } catch (error) {
      this.errorComentarios.set(mensajeDeError(error));
    } finally {
      this.cargandoComentarios.set(false);
    }
  }

  // da o quita el me gusta segun el estado actual de la publicacion
  protected async alternarMeGusta(): Promise<void> {
    const actual = this.publicacion();
    if (!actual || this.procesandoMeGusta()) return;
    this.procesandoMeGusta.set(true);
    try {
      const estado = await firstValueFrom(
        actual.meGusta ? this.publicaciones.quitarMeGusta(actual.id) : this.publicaciones.darMeGusta(actual.id),
      );
      // se actualiza con lo que respondio el backend (sin volver a pedir toda la publicacion)
      this.publicacion.update((p) => p && { ...p, ...estado });
    } catch (error) {
      await this.modal.error(mensajeDeError(error), 'No se pudo actualizar el Me gusta');
      await this.refrescarPublicacion(); // se vuelve a pedir para mostrar el estado real
    } finally {
      this.procesandoMeGusta.set(false);
    }
  }

  protected esPropio(comentario: Comentario): boolean {
    return comentario.autor.id === this.sesion.usuario()?.id;
  }

  // texto del primer error de un campo de comentario (vacio si no tiene errores)
  protected mensajeError(control: AbstractControl): string {
    if (control.errors?.['maxlength']) return `Máximo ${MAX_CARACTERES} caracteres.`;
    return control.errors ? 'El comentario no puede estar vacío.' : '';
  }

  // publica un comentario nuevo
  protected async enviarComentario(): Promise<void> {
    // marcar todo como "tocado" hace que aparezcan los errores del campo
    this.nuevoForm.markAllAsTouched();
    if (this.nuevoForm.invalid || this.enviando()) return;

    this.enviando.set(true);
    try {
      const comentario = await firstValueFrom(
        this.comentariosApi.crear(this.id, this.nuevoForm.controls.mensaje.value.trim()),
      );
      // el nuevo va arriba de todo (es el mas reciente) y el total sube en uno
      this.comentarios.update((lista) => [comentario, ...(lista ?? [])]);
      this.total.update((t) => t + 1);
      this.nuevoForm.reset({ mensaje: '' }); // reset tambien saca el estado "tocado": no queda un error visible
    } catch (error) {
      await this.modal.error(mensajeDeError(error), 'No se pudo publicar el comentario');
    } finally {
      this.enviando.set(false);
    }
  }

  protected empezarEdicion(comentario: Comentario): void {
    this.editandoId.set(comentario.id);
    this.edicionForm.reset({ mensaje: comentario.mensaje });
  }

  protected cancelarEdicion(): void {
    this.editandoId.set(null);
  }

  // guarda el mensaje editado. el backend marca el comentario como modificado y la pantalla muestra "(editado)"
  protected async guardarEdicion(comentario: Comentario): Promise<void> {
    this.edicionForm.markAllAsTouched();
    if (this.edicionForm.invalid || this.guardando()) return;

    const mensaje = this.edicionForm.controls.mensaje.value.trim();
    // sin cambios no hay nada que guardar
    if (mensaje === comentario.mensaje) {
      this.editandoId.set(null);
      return;
    }

    this.guardando.set(true);
    try {
      const actualizado = await firstValueFrom(this.comentariosApi.modificar(this.id, comentario.id, mensaje));
      this.comentarios.update((lista) => lista?.map((c) => (c.id === actualizado.id ? actualizado : c)) ?? null);
      this.editandoId.set(null);
    } catch (error) {
      await this.modal.error(mensajeDeError(error), 'No se pudo guardar el comentario');
    } finally {
      this.guardando.set(false);
    }
  }

  // vuelve a pedir la publicacion sin mostrar errores (solo para corregir lo que se ve despues de un fallo)
  private async refrescarPublicacion(): Promise<void> {
    try {
      this.publicacion.set(await firstValueFrom(this.publicaciones.obtener(this.id)));
    } catch {
      // si tampoco se puede, se deja lo que ya se estaba mostrando
    }
  }
}