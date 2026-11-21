import { Injectable, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ModalService } from '../shared/modal/modal.service';
import { AutenticacionService } from './autenticacion.service';
import { mensajeDeError } from './errores';
import { SesionService } from './sesion.service';
import { vencimientoDelToken } from './token';

// el token dura 15 minutos y el aviso sale 5 minutos antes de que venza: es decir, a los 10 minutos de haberlo recibido
const AVISO_ANTES_MS = 5 * 60 * 1000;

// se ocupa de que la sesion no se corte por sorpresa: avisa antes de que el token venza (y ofrece extenderlo)
// y, si la sesion ya vencio, lleva al login
@Injectable({ providedIn: 'root' })
export class VencimientoSesionService {
  private readonly sesion = inject(SesionService);
  private readonly auth = inject(AutenticacionService);
  private readonly modal = inject(ModalService);
  private readonly router = inject(Router);

  private temporizador: ReturnType<typeof setTimeout> | null = null;
  private avisoAbierto = false; // hay un modal de aviso en pantalla: no se abre otro
  private venciendo = false; // ya se esta llevando al usuario al login: no se repite

  constructor() {
    // cada vez que cambia el token (login, token refrescado, cierre de sesion) se vuelve a programar el aviso.
    // como el calculo sale del vencimiento del token, tambien funciona al recargar la pagina
    effect(() => this.programar(this.sesion.token()));
  }

  // la sesion vencio o el backend la rechazo (401): se cierra, se lleva al login y se avisa con un modal.
  // lo llama el interceptor cuando una peticion devuelve 401
  async sesionExpirada(): Promise<void> {
    if (this.venciendo) return;
    this.venciendo = true;
    this.modal.bloquearErrores(true);
    try {
      this.modal.cerrarTodos(); // por ejemplo, el aviso de "quedan 5 minutos" si estaba abierto
      this.sesion.cerrar();
      await this.router.navigateByUrl('/login', { replaceUrl: true });
      await this.modal.informar('Tu sesión venció. Ingresá de nuevo para continuar.', 'Sesión vencida');
    } finally {
      this.modal.bloquearErrores(false);
      this.venciendo = false;
    }
  }

  // arma el aviso para 5 minutos antes del vencimiento (o ya mismo, si falta menos que eso)
  private programar(token: string | null): void {
    this.detener();
    if (!token) return;

    const vencimiento = vencimientoDelToken(token);
    if (vencimiento === null) return;

    const espera = Math.max(0, vencimiento - AVISO_ANTES_MS - Date.now());
    this.temporizador = setTimeout(() => void this.avisar(token), espera);
  }

  private detener(): void {
    if (this.temporizador !== null) clearTimeout(this.temporizador);
    this.temporizador = null;
  }

  // muestra el modal "queda poco" y, si el usuario acepta, extiende la sesion
  private async avisar(token: string): Promise<void> {
    // si mientras tanto el token cambio (se refresco o se cerro la sesion), este aviso ya no corresponde
    if (this.sesion.token() !== token || this.avisoAbierto) return;

    const restante = (vencimientoDelToken(token) ?? 0) - Date.now();
    // el token ya vencio (por ejemplo, la computadora estuvo suspendida): no hay nada que extender
    if (restante <= 0) {
      await this.sesionExpirada();
      return;
    }

    const minutos = Math.max(1, Math.ceil(restante / 60000));
    this.avisoAbierto = true;
    let extender = false;
    try {
      extender = await this.modal.confirmar(
        `Quedan ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'} de sesión. ¿Querés extenderla?`,
        'Tu sesión está por vencer',
        'Extender sesión',
        'No, gracias',
      );
    } finally {
      this.avisoAbierto = false;
    }

    if (extender && this.sesion.token() === token) await this.extender();
  }

  // pide un token nuevo. al guardarlo, el effect del constructor programa el proximo aviso
  private async extender(): Promise<void> {
    try {
      const { token } = await firstValueFrom(this.auth.refrescar());
      this.sesion.actualizarToken(token);
      await this.modal.informar('Tu sesión se extendió 15 minutos más.', 'Sesión extendida');
    } catch (error) {
      // si el backend respondio 401, el interceptor ya llevo al usuario al login (la sesion ya no esta activa)
      if (!this.sesion.activa()) return;
      await this.modal.error(mensajeDeError(error), 'No se pudo extender la sesión');
    }
  }
}