import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ModalService } from '../../shared/modal/modal.service';

// botones provisionales para probar los modales de información, error y confirmacion
@Component({
  selector: 'app-publicaciones',
  imports: [MatCardModule, MatButtonModule],
  template: `
    <div class="contenedor">
      <mat-card>
        <mat-card-header><mat-card-title>Publicaciones</mat-card-title></mat-card-header>
        <mat-card-content>
          <p class="texto-suave">Acá va el listado de publicaciones.</p>
          <div class="acciones">
            <button mat-stroked-button (click)="probarInformacion()">Probar modal de información</button>
            <button mat-stroked-button (click)="probarError()">Probar modal de error</button>
            <button mat-stroked-button (click)="probarConfirmacion()">Probar confirmación</button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
})
export class Publicaciones {
  private readonly modal = inject(ModalService);

  protected probarInformacion(): void {
    void this.modal.informar('Este es un mensaje informativo.');
  }

  protected probarError(): void {
    void this.modal.error('Algo salió mal. Probá de nuevo.');
  }

  protected async probarConfirmacion(): Promise<void> {
    const confirmo = await this.modal.confirmar('¿Querés continuar con la acción?');
    await this.modal.informar(confirmo ? 'Elegiste continuar.' : 'Cancelaste la acción.');
  }
}