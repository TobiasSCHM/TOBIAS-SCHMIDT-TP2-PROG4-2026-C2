import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// sprint 1: la pantalla existe y se puede navegar hasta ella. los datos del usuario llegan en el sprint 2
@Component({
  selector: 'app-mi-perfil',
  imports: [MatCardModule, MatIconModule],
  template: `
    <div class="contenedor">
      <h1 class="titulo-pagina">Mi perfil</h1>
      <p class="texto-suave">Acá se muestran los datos de tu cuenta.</p>
      <mat-card>
        <mat-card-content class="vacio">
          <mat-icon>account_circle</mat-icon>
          <h2>Tu perfil</h2>
          <p class="texto-suave">Tu foto y tus datos van a aparecer en esta pantalla.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .titulo-pagina { margin: 0 0 4px; font-size: 28px; font-weight: 500; }
    .vacio { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 40px 16px; }
    .vacio mat-icon { width: 96px; height: 96px; font-size: 96px; color: #9aa4b2; }
    .vacio h2 { margin: 16px 0 4px; font-weight: 500; }
    .vacio p { margin: 0; }
  `,
})
export class MiPerfil {}