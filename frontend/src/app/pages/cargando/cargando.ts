import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AutenticacionService } from '../../core/autenticacion.service';
import { mensajeDeError } from '../../core/errores';
import { SesionService } from '../../core/sesion.service';

// pantalla de inicio de la app: mientras muestra un spinner, le pregunta al backend si el token guardado
// sigue siendo valido. si lo es va a publicaciones; si no, al login
@Component({
  selector: 'app-cargando',
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './cargando.html',
  styleUrl: './cargando.css',
})
export class Cargando {
  private readonly auth = inject(AutenticacionService);
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);

  // mensaje cuando no se pudo hacer la validacion (por ejemplo, el servidor no responde)
  protected readonly error = signal<string | null>(null);

  constructor() {
    void this.validar();
  }

  protected async validar(): Promise<void> {
    this.error.set(null);

    // sin token no hay nada que validar: se va directo al login
    if (!this.sesion.token()) {
      await this.irA('/login');
      return;
    }

    try {
      const usuario = await firstValueFrom(this.auth.autorizar());
      // el backend devuelve los datos actuales del usuario: se guardan por si cambiaron
      this.sesion.actualizarUsuario(usuario);
      await this.irA('/publicaciones');
    } catch (error) {
      // 401: el token no sirve o vencio. se borra la sesion guardada y se pide ingresar de nuevo
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.sesion.cerrar();
        await this.irA('/login');
        return;
      }
      // cualquier otro problema (servidor dormido, sin internet) no dice nada sobre el token:
      // se conserva la sesion y se ofrece reintentar
      this.error.set(mensajeDeError(error));
    }
  }

  // replaceUrl: esta pantalla no queda en el historial (el boton "atras" no vuelve a un spinner)
  private irA(ruta: string): Promise<boolean> {
    return this.router.navigateByUrl(ruta, { replaceUrl: true });
  }
}