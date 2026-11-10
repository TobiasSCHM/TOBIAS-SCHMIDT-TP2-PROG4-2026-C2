import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

//el formulario de login lo voy a construir en la proxima sesion
@Component({
  selector: 'app-login',
  imports: [MatCardModule],
  template: `
    <div class="contenedor-angosto">
      <mat-card>
        <mat-card-header><mat-card-title>Ingresar</mat-card-title></mat-card-header>
        <mat-card-content><p class="texto-suave">Acá va el formulario de login.</p></mat-card-content>
      </mat-card>
    </div>
  `,
})
export class Login {}