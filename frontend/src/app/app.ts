import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SoloAdminDirective } from './shared/directives/solo-admin.directive';

// estructura general de la app: barra superior + la pantalla que corresponde a la ruta.
// sprint 4: los enlaces del panel de administracion usan *appSoloAdmin (solo se muestran a los administradores)
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, SoloAdminDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}