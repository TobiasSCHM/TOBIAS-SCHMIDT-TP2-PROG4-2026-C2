import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { firstValueFrom } from 'rxjs';
import type { Observable } from 'rxjs';
import { mensajeDeError } from '../../core/errores';
import type { Perfil, Usuario } from '../../core/models/usuario.model';
import { SesionService } from '../../core/sesion.service';
import { UsuariosService } from '../../core/usuarios.service';
import { contrasenaFuerte, fechaDeHoy, fechaNoFutura, igualA } from '../../core/validators/validadores';
import { ModalService } from '../../shared/modal/modal.service';
import { AutoEnfocarDirective } from '../../shared/directives/auto-enfocar.directive';
import { ImagenRespaldoDirective } from '../../shared/directives/imagen-respaldo.directive';
import { EtiquetaPerfilPipe } from '../../shared/pipes/etiqueta-perfil.pipe';
import { NombreCompletoPipe } from '../../shared/pipes/nombre-completo.pipe';

type CampoUsuario =
  | 'nombre' | 'apellido' | 'correo' | 'nombreUsuario'
  | 'contrasena' | 'repetirContrasena' | 'fechaNacimiento' | 'descripcion';

const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANIO_MAXIMO = 2 * 1024 * 1024; // 2 mb, el mismo limite que el backend
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// mismos mensajes que el registro: el alta del administrador usa los mismos datos y validaciones
const MENSAJES: Record<CampoUsuario, Record<string, string>> = {
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

//administracion de usuarios (solo administradores): listado, alta con perfil y baja/alta logica.
// la ruta tiene adminGuard y ademas el backend responde 403 a quien no sea administrador
@Component({
  selector: 'app-dashboard-usuarios',
  imports: [
    ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule,
    MatInputModule, MatProgressSpinnerModule, MatRadioModule,
    AutoEnfocarDirective, EtiquetaPerfilPipe, ImagenRespaldoDirective, NombreCompletoPipe,
  ],
  templateUrl: './dashboard-usuarios.html',
  styleUrl: './dashboard-usuarios.css',
})
export class DashboardUsuarios {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly api = inject(UsuariosService);
  private readonly modal = inject(ModalService);
  private readonly sesion = inject(SesionService);

  // id del administrador logueado: su propia fila no ofrece "deshabilitar" (el backend tambien lo rechaza)
  protected readonly miId = computed(() => this.sesion.usuario()?.id ?? null);

  // null = todavia no se cargaron (muestra el spinner)
  protected readonly usuarios = signal<Usuario[] | null>(null);
  protected readonly error = signal<string | null>(null);
  // ids de los usuarios cuyo cambio de estado se esta procesando (evita doble clic)
  protected readonly procesando = signal<string[]>([]);

  // formulario de alta
  protected readonly mostrarFormulario = signal(false);
  protected readonly guardando = signal(false);
  protected readonly imagen = signal<File | null>(null);
  protected readonly vistaPrevia = signal<string | null>(null);
  protected readonly errorImagen = signal<string | null>(null);
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
    // los dos radio buttons del enunciado. por defecto, usuario comun
    perfil: this.fb.control<Perfil>('usuario', [Validators.required]),
  });

  constructor() {
    // si cambia la contrasena hay que volver a compararla con "repetir contrasena"
    this.form.controls.contrasena.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.controls.repetirContrasena.updateValueAndValidity());

    // al salir de la pantalla se libera la vista previa de la imagen
    inject(DestroyRef).onDestroy(() => this.liberarVistaPrevia());

    void this.cargar();
  }

  protected async cargar(): Promise<void> {
    this.error.set(null);
    try {
      this.usuarios.set(await firstValueFrom(this.api.listar()));
    } catch (error) {
      this.error.set(mensajeDeError(error));
    }
  }

  // texto del primer error del campo (vacio si no tiene errores)
  protected mensajeError(campo: CampoUsuario): string {
    const errores = this.form.controls[campo].errors;
    if (!errores) return '';
    const clave = Object.keys(errores)[0];
    return MENSAJES[campo][clave] ?? 'El valor no es válido.';
  }

  protected alternarFormulario(): void {
    if (this.mostrarFormulario()) this.reiniciarFormulario();
    this.mostrarFormulario.update((abierto) => !abierto);
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

  // alta de un usuario nuevo: mismos datos que el registro + el perfil elegido. el backend decide y valida todo de nuevo
  protected async crear(): Promise<void> {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.guardando()) return;

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
    datos.append('perfil', valores.perfil);
    const imagen = this.imagen();
    if (imagen) datos.append('imagenPerfil', imagen); // el nombre del campo tiene que coincidir con el del backend

    this.guardando.set(true);
    try {
      const nuevo = await firstValueFrom(this.api.crear(datos));
      this.reiniciarFormulario();
      this.mostrarFormulario.set(false);
      const perfil = nuevo.perfil === 'administrador' ? 'administrador' : 'usuario';
      await this.modal.informar(
        `Se creó la cuenta de ${nuevo.nombre} ${nuevo.apellido} (@${nuevo.nombreUsuario}) con perfil ${perfil}.`,
        'Usuario creado',
      );
      await this.cargar();
    } catch (error) {
      await this.modal.error(mensajeDeError(error), 'No se pudo crear el usuario');
    } finally {
      this.guardando.set(false);
    }
  }

  protected async deshabilitar(usuario: Usuario): Promise<void> {
    const confirmo = await this.modal.confirmar(
      `¿Querés deshabilitar a ${usuario.nombre} ${usuario.apellido} (@${usuario.nombreUsuario})? ` +
        'No va a poder ingresar a FireLink hasta que lo vuelvas a habilitar.',
      'Deshabilitar usuario',
      'Deshabilitar',
      'Cancelar',
    );
    if (!confirmo) return;
    await this.cambiarEstado(usuario, this.api.deshabilitar(usuario.id), {
      exito: `@${usuario.nombreUsuario} fue deshabilitado y ya no puede ingresar.`,
      tituloExito: 'Usuario deshabilitado',
      tituloError: 'No se pudo deshabilitar al usuario',
    });
  }

  protected async habilitar(usuario: Usuario): Promise<void> {
    await this.cambiarEstado(usuario, this.api.habilitar(usuario.id), {
      exito: `@${usuario.nombreUsuario} fue habilitado y puede volver a ingresar.`,
      tituloExito: 'Usuario habilitado',
      tituloError: 'No se pudo habilitar al usuario',
    });
  }

  // baja o alta logica: se actualiza solo esa fila con lo que respondio el backend (sin recargar toda la lista)
  private async cambiarEstado(
    usuario: Usuario,
    peticion: Observable<Usuario>,
    textos: { exito: string; tituloExito: string; tituloError: string },
  ): Promise<void> {
    if (this.procesando().includes(usuario.id)) return;
    this.procesando.update((ids) => [...ids, usuario.id]);
    try {
      const actualizado = await firstValueFrom(peticion);
      this.usuarios.update((lista) => lista?.map((u) => (u.id === actualizado.id ? actualizado : u)) ?? null);
      await this.modal.informar(textos.exito, textos.tituloExito);
    } catch (error) {
      await this.modal.error(mensajeDeError(error), textos.tituloError);
      await this.cargar(); // se vuelve a pedir la lista para mostrar el estado real
    } finally {
      this.procesando.update((ids) => ids.filter((id) => id !== usuario.id));
    }
  }

  private reiniciarFormulario(): void {
    this.form.reset(); // vuelve a los valores iniciales (perfil "usuario") y saca el estado "tocado"
    this.liberarVistaPrevia();
    this.imagen.set(null);
    this.vistaPrevia.set(null);
    this.errorImagen.set(null);
  }

  private liberarVistaPrevia(): void {
    const url = this.vistaPrevia();
    if (url) URL.revokeObjectURL(url);
  }
}