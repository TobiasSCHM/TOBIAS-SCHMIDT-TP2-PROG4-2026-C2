import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export type TipoModal = 'info' | 'error' | 'confirmacion';

export interface DatosModal {
  titulo: string;
  mensaje: string;
  tipo: TipoModal;
  textoConfirmar?: string;
  textoCancelar?: string;
}

// contenido del modal. lo abre ModalService: ninguna pantalla lo usa directamente
@Component({
  selector: 'app-modal-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="titulo">
      <mat-icon [class]="'icono ' + datos.tipo">{{ icono }}</mat-icon>
      {{ datos.titulo }}
    </h2>
    <mat-dialog-content>
      <p class="mensaje">{{ datos.mensaje }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      @if (datos.tipo === 'confirmacion') {
        <button mat-button [mat-dialog-close]="false">{{ datos.textoCancelar ?? 'Cancelar' }}</button>
        <button mat-flat-button [mat-dialog-close]="true" cdkFocusInitial>{{ datos.textoConfirmar ?? 'Confirmar' }}</button>
      } @else {
        <button mat-flat-button [mat-dialog-close]="true" cdkFocusInitial>Aceptar</button>
      }
    </mat-dialog-actions>
  `,
  styles: `
    .titulo { display: flex; align-items: center; gap: 8px; }
    .icono.error { color: #c62828; }
    .icono.info { color: #1565c0; }
    .icono.confirmacion { color: #ef6c00; }
    .mensaje { margin: 0; white-space: pre-line; }
  `,
})
export class ModalDialog {
  protected readonly datos = inject<DatosModal>(MAT_DIALOG_DATA);

  protected get icono(): string {
    if (this.datos.tipo === 'error') return 'error';
    return this.datos.tipo === 'confirmacion' ? 'help' : 'info';
  }
}