import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

// provisorio tmb
@Component({
  selector: 'app-registro',
  imports: [MatCardModule],
  template: `
    <div class="contenedor-angosto">
      <mat-card>
        <mat-card-header><mat-card-title>Crear cuenta</mat-card-title></mat-card-header>
        <mat-card-content><p class="texto-suave">Acá va el formulario de registro.</p></mat-card-content>
      </mat-card>
    </div>
  `,
})
export class Registro {}