import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ModalDialog } from './modal-dialog';
import type { DatosModal } from './modal-dialog';

// reemplazo de alert() y confirm(): todos los mensajes de la app se muestran con modales
@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly dialog = inject(MatDialog);

  // mientras es true, error() no muestra nada (ver bloquearErrores)
  private erroresBloqueados = false;

  async informar(mensaje: string, titulo = 'Información'): Promise<void> {
    await this.abrir({ titulo, mensaje, tipo: 'info' });
  }

  async error(mensaje: string, titulo = 'Ocurrió un problema'): Promise<void> {
    if (this.erroresBloqueados) return;
    await this.abrir({ titulo, mensaje, tipo: 'error' });
  }

  // true si el usuario confirma. cerrar el modal sin elegir cuenta como cancelar
  async confirmar(
    mensaje: string,
    titulo = 'Confirmar acción',
    textoConfirmar?: string,
    textoCancelar?: string,
  ): Promise<boolean> {
    const respuesta = await this.abrir({ titulo, mensaje, tipo: 'confirmacion', textoConfirmar, textoCancelar });
    return respuesta === true;
  }

  // cierra todos los modales abiertos (los que estaban esperando una respuesta la reciben como "cancelar")
  cerrarTodos(): void {
    this.dialog.closeAll();
  }

  // cuando la sesion vence, la app avisa con UN solo modal y lleva al login. mientras tanto, los errores
  // de las pantallas que estaban pidiendo datos (que fallaron por lo mismo) no se muestran: se apilarian encima
  bloquearErrores(bloquear: boolean): void {
    this.erroresBloqueados = bloquear;
  }

  private abrir(datos: DatosModal): Promise<boolean | undefined> {
    const referencia = this.dialog.open<ModalDialog, DatosModal, boolean>(ModalDialog, {
      data: datos,
      width: '440px',
      maxWidth: '92vw',
    });
    return firstValueFrom(referencia.afterClosed());
  }
}