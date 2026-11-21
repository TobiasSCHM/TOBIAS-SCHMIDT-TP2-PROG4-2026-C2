import { Injectable, computed, signal } from '@angular/core';
import type { Usuario } from './models/usuario.model';

const CLAVE = 'firelink.sesion';

// lo que se guarda en el navegador: el token jwt y los datos del usuario
interface SesionGuardada {
  token: string;
  usuario: Usuario;
}

// recuerda quien inicio sesion. guarda el token jwt (y los datos del usuario) en el localStorage,
// asi recargar la pagina no cierra la sesion
@Injectable({ providedIn: 'root' })
export class SesionService {
  // signal: las pantallas que lo leen se actualizan solas cuando cambia
  private readonly datos = signal<SesionGuardada | null>(this.leer());

  // solo lectura hacia afuera: para cambiarlos hay que usar iniciar(), actualizarUsuario(), actualizarToken() o cerrar()
  readonly usuario = computed(() => this.datos()?.usuario ?? null);
  readonly token = computed(() => this.datos()?.token ?? null);
  readonly activa = computed(() => this.datos() !== null);

  iniciar(token: string, usuario: Usuario): void {
    this.guardar({ token, usuario });
  }

  // cambia los datos del usuario y conserva el token (lo usa la pantalla "cargando": el backend devuelve
  // los datos actuales del usuario al validar el token). sin sesion iniciada no hace nada
  actualizarUsuario(usuario: Usuario): void {
    const actual = this.datos();
    if (actual) this.guardar({ token: actual.token, usuario });
  }

  // cambia el token y conserva al usuario (lo usa la extension de sesion: el backend entrega un token nuevo
  // con otros 15 minutos). sin sesion iniciada no hace nada
  actualizarToken(token: string): void {
    const actual = this.datos();
    if (actual) this.guardar({ token, usuario: actual.usuario });
  }

  cerrar(): void {
    this.datos.set(null);
    try {
      localStorage.removeItem(CLAVE);
    } catch {
      // nada que limpiar
    }
  }

  private guardar(sesion: SesionGuardada): void {
    this.datos.set(sesion);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(sesion));
    } catch {
      // sin almacenamiento disponible (modo privado, etc.): la sesion dura hasta que se recargue la pagina
    }
  }

  // lee la sesion guardada al abrir la app. si el contenido no tiene token (ej: una sesion vieja del sprint 2,
  // que solo guardaba el usuario) se ignora: hay que volver a ingresar para conseguir un token
  private leer(): SesionGuardada | null {
    try {
      const texto = localStorage.getItem(CLAVE);
      if (!texto) return null;
      const guardada = JSON.parse(texto) as Partial<SesionGuardada> | null;
      return typeof guardada?.token === 'string' && guardada.usuario ? (guardada as SesionGuardada) : null;
    } catch {
      return null; // almacenamiento no disponible o contenido danado
    }
  }
}