import { Injectable, computed, signal } from '@angular/core';
import type { Usuario } from './models/usuario.model';

const CLAVE = 'firelink.sesion';

// recuerda quien inicio sesion. es PROVISORIO: guarda los datos del usuario en el navegador.
// en el sprint 3 se reemplaza por el token jwt
@Injectable({ providedIn: 'root' })
export class SesionService {
  // signal: las pantallas que lo leen se actualizan solas cuando cambia
  private readonly datos = signal<Usuario | null>(this.leer());

  // solo lectura hacia afuera: para cambiarlo hay que usar iniciar() o cerrar()
  readonly usuario = this.datos.asReadonly();
  readonly activa = computed(() => this.datos() !== null);

  iniciar(usuario: Usuario): void {
    this.datos.set(usuario);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(usuario));
    } catch {
      // sin almacenamiento disponible (modo privado, etc.): la sesion dura hasta que se recargue la pagina
    }
  }

  cerrar(): void {
    this.datos.set(null);
    try {
      localStorage.removeItem(CLAVE);
    } catch {
      // nada que limpiar
    }
  }

  // lee la sesion guardada al abrir la app, para que recargar la pagina no cierre la sesion
  private leer(): Usuario | null {
    try {
      const texto = localStorage.getItem(CLAVE);
      return texto ? (JSON.parse(texto) as Usuario) : null;
    } catch {
      return null; // almacenamiento no disponible o contenido danado
    }
  }
}