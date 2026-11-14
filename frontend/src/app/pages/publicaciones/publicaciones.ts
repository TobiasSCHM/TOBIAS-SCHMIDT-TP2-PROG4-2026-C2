import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// sprint 1: la pantalla existe y se puede navegar hasta ella. el listado llega en el sprint 2
@Component({
  selector: 'app-publicaciones',
  imports: [MatCardModule, MatIconModule],
  template: `
    <div class="contenedor">
      <h1 class="titulo-pagina">Publicaciones</h1>
      <p class="texto-suave">Acá se muestran las publicaciones de los usuarios.</p>
      <mat-card>
        <mat-card-content class="vacio">
          <mat-icon>article</mat-icon>
          <h2>Todavía no hay publicaciones</h2>
          <p class="texto-suave">Cuando haya publicaciones, las vas a encontrar acá.</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .titulo-pagina { margin: 0 0 4px; font-size: 28px; font-weight: 500; }
    .vacio { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 40px 16px; }
    .vacio mat-icon { width: 64px; height: 64px; font-size: 64px; color: #9aa4b2; }
    .vacio h2 { margin: 16px 0 4px; font-weight: 500; }
    .vacio p { margin: 0; }
  `,
})
export class Publicaciones {}