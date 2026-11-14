import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AutenticacionService } from '../../core/autenticacion.service';
import { mensajeDeError } from '../../core/errores';
import { contrasenaFuerte, correoONombreUsuario } from '../../core/validators/validadores';
import { ModalService } from '../../shared/modal/modal.service';

type CampoLogin = 'identificador' | 'contrasena';

// mensaje de cada error de cada campo. la clave es el nombre del error que devuelve el validador
const MENSAJES: Record<CampoLogin, Record<string, string>> = {
  identificador: {
    required: 'Ingresá tu correo o nombre de usuario.',
    identificadorInvalido: 'Ingresá un correo válido o un nombre de usuario (3 a 20 caracteres: letras, números o guion bajo).',
  },
  contrasena: {
    required: 'Ingresá tu contraseña.',
    contrasenaDebil: 'La contraseña tiene al menos 8 caracteres, una mayúscula y un número.',
  },
};

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AutenticacionService);
  private readonly modal = inject(ModalService);
  private readonly router = inject(Router);

  protected readonly form = this.fb.group({
    identificador: ['', [Validators.required, correoONombreUsuario]],
    contrasena: ['', [Validators.required, contrasenaFuerte]],
  });

  protected readonly cargando = signal(false);
  protected readonly verContrasena = signal(false);

  // texto del primer error del campo (vacio si no tiene errores)
  protected mensajeError(campo: CampoLogin): string {
    const errores = this.form.controls[campo].errors;
    if (!errores) return '';
    const clave = Object.keys(errores)[0];
    return MENSAJES[campo][clave] ?? 'El valor no es válido.';
  }

  protected async enviar(): Promise<void> {
    // marcar todo como "tocado" hace que aparezcan los errores de todos los campos
    this.form.markAllAsTouched();
    if (this.form.invalid || this.cargando()) return;

    const { identificador, contrasena } = this.form.getRawValue();

    this.cargando.set(true);
    try {
      const usuario = await firstValueFrom(
        // el identificador se recorta; la contrasena no (un espacio puede ser parte de ella)
        this.auth.login({ identificador: identificador.trim(), contrasena }),
      );
      await this.modal.informar(`Hola, ${usuario.nombre}. Ingresaste correctamente.`, 'Ingreso exitoso');
      await this.router.navigateByUrl('/publicaciones');
    } catch (error) {
      await this.modal.error(mensajeDeError(error), 'No se pudo ingresar');
      // se conserva el usuario escrito y se vacia la contrasena (reset tambien oculta su mensaje de error)
      this.form.controls.contrasena.reset('');
    } finally {
      this.cargando.set(false);
    }
  }
}