import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

// provisoria: el perfil con los datos del usuario se construye mas adelante
@Component({
  selector: 'app-mi-perfil',
  imports: [MatCardModule],
  template: `
    <div class="contenedor">
      <mat-card>
        <mat-card-header><mat-card-title>Mi perfil</mat-card-title></mat-card-header>
        <mat-card-content><p class="texto-suave">Acá van tus datos y tu foto de perfil.</p></mat-card-content>
      </mat-card>
    </div>
  `,
})
export class MiPerfil {}