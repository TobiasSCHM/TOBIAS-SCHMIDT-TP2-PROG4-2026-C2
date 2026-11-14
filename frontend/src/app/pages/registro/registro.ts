import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { contrasenaFuerte, fechaDeHoy, fechaNoFutura, igualA } from '../../core/validators/validadores';
import { ModalService } from '../../shared/modal/modal.service';

type CampoRegistro =
  | 'nombre' | 'apellido' | 'correo' | 'nombreUsuario'
  | 'contrasena' | 'repetirContrasena' | 'fechaNacimiento' | 'descripcion';

const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANIO_MAXIMO = 2 * 1024 * 1024; // 2 mb, el mismo limite que el backend
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// mensaje de cada error de cada campo. la clave es el nombre del error que devuelve el validador
const MENSAJES: Record<CampoRegistro, Record<string, string>> = {
  nombre: { required: 'El nombre es obligatorio.', maxlength: 'Máximo 50 caracteres.' },
  apellido: { required: 'El apellido es obligatorio.', maxlength: 'Máximo 50 caracteres.' },
  correo: {
    required: 'El correo es obligatorio.',
    pattern: 'Ingresá un correo válido, por ejemplo nombre@mail.com.',
    maxlength: 'Máximo 100 caracteres.',
  },
  nombreUsuario: {
    required: 'El nombre de usuario es obligatorio.',
    pattern: 'De 3 a 20 caracteres: letras, números o guion bajo.',
  },
  contrasena: {
    required: 'La contraseña es obligatoria.',
    contrasenaDebil: 'Mínimo 8 caracteres, con una mayúscula y un número.',
  },
  repetirContrasena: { required: 'Repetí la contraseña.', noCoinciden: 'Las contraseñas no coinciden.' },
  fechaNacimiento: {
    required: 'La fecha de nacimiento es obligatoria.',
    fechaFutura: 'La fecha de nacimiento no puede ser futura.',
  },
  descripcion: { maxlength: 'Máximo 200 caracteres.' },
};

@Component({
  selector: 'app-registro',
  imports: [
    ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AutenticacionService);
  private readonly modal = inject(ModalService);
  private readonly router = inject(Router);

  // la fecha de nacimiento no puede ser posterior a hoy: se usa como "max" del selector
  protected readonly hoy = fechaDeHoy();

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    apellido: ['', [Validators.required, Validators.maxLength(50)]],
    correo: ['', [Validators.required, Validators.pattern(PATRON_CORREO), Validators.maxLength(100)]],
    nombreUsuario: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9_]{3,20}$/)]],
    contrasena: ['', [Validators.required, contrasenaFuerte]],
    repetirContrasena: ['', [Validators.required, igualA('contrasena')]],
    fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
    descripcion: ['', [Validators.maxLength(200)]],
  });

  protected readonly cargando = signal(false);
  protected readonly imagen = signal<File | null>(null);
  protected readonly vistaPrevia = signal<string | null>(null);
  protected readonly errorImagen = signal<string | null>(null);

  constructor() {
    // si cambia la contrasena hay que volver a compararla con "repetir contrasena"
    this.form.controls.contrasena.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.controls.repetirContrasena.updateValueAndValidity());

    // al salir de la pantalla se libera la vista previa de la imagen
    inject(DestroyRef).onDestroy(() => this.liberarVistaPrevia());
  }

  // texto del primer error del campo (vacio si no tiene errores)
  protected mensajeError(campo: CampoRegistro): string {
    const errores = this.form.controls[campo].errors;
    if (!errores) return '';
    const clave = Object.keys(errores)[0];
    return MENSAJES[campo][clave] ?? 'El valor no es válido.';
  }

  protected elegirImagen(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    const archivo = entrada.files?.[0] ?? null;
    this.errorImagen.set(null);
    if (!archivo) return;

    // se revisa tipo y tamano ANTES de aceptar el archivo (el backend vuelve a revisarlos)
    if (!TIPOS_IMAGEN.includes(archivo.type)) {
      this.errorImagen.set('La imagen debe ser JPG, PNG o WEBP.');
      entrada.value = '';
      return;
    }
    if (archivo.size > TAMANIO_MAXIMO) {
      this.errorImagen.set('La imagen no puede superar los 2 MB.');
      entrada.value = '';
      return;
    }

    this.liberarVistaPrevia();
    this.imagen.set(archivo);
    this.vistaPrevia.set(URL.createObjectURL(archivo));
  }

  protected quitarImagen(entrada: HTMLInputElement): void {
    this.liberarVistaPrevia();
    this.imagen.set(null);
    this.vistaPrevia.set(null);
    this.errorImagen.set(null);
    entrada.value = ''; // permite volver a elegir el mismo archivo
  }

  protected async enviar(): Promise<void> {
    // marcar todo como "tocado" hace que aparezcan los errores de todos los campos
    this.form.markAllAsTouched();
    if (this.form.invalid || this.cargando()) return;

    const valores = this.form.getRawValue();
    const datos = new FormData();
    datos.append('nombre', valores.nombre.trim());
    datos.append('apellido', valores.apellido.trim());
    datos.append('correo', valores.correo.trim());
    datos.append('nombreUsuario', valores.nombreUsuario.trim());
    datos.append('contrasena', valores.contrasena); // la contrasena no se recorta
    datos.append('repetirContrasena', valores.repetirContrasena);
    datos.append('fechaNacimiento', valores.fechaNacimiento);
    if (valores.descripcion.trim() !== '') datos.append('descripcion', valores.descripcion.trim());
    const imagen = this.imagen();
    if (imagen) datos.append('imagenPerfil', imagen); // el nombre del campo tiene que coincidir con el del backend

    this.cargando.set(true);
    try {
      await firstValueFrom(this.auth.registrar(datos));
      await this.modal.informar('Tu cuenta fue creada correctamente. Ahora podés iniciar sesión.', 'Registro exitoso');
      await this.router.navigateByUrl('/login');
    } catch (error) {
      await this.modal.error(mensajeDeError(error), 'No se pudo completar el registro');
    } finally {
      this.cargando.set(false);
    }
  }

  private liberarVistaPrevia(): void {
    const url = this.vistaPrevia();
    if (url) URL.revokeObjectURL(url);
  }
}