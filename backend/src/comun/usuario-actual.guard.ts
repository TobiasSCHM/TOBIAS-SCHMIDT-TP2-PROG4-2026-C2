import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { UsuarioDocument } from '../usuarios/usuario.schema.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';

// el pedido de express, con el usuario identificado (lo agrega este guard)
export type SolicitudConUsuario = Request & { usuario?: UsuarioDocument };

// sprint 2 (provisorio): identifica al usuario por el header "x-usuario-id".
// del cliente solo se confia en el id: el perfil (usuario/administrador) y si esta habilitado se leen SIEMPRE de la base.
// en el sprint 3 se reemplaza el interior por la validacion del token jwt; el resto de la app no cambia
@Injectable()
export class UsuarioActualGuard implements CanActivate {
  constructor(private readonly usuarios: UsuariosService) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const solicitud = contexto.switchToHttp().getRequest<SolicitudConUsuario>();
    const encabezado = solicitud.headers['x-usuario-id'];
    const id = Array.isArray(encabezado) ? encabezado[0] : encabezado;

    const usuario = id ? await this.usuarios.buscarPorId(id.trim()) : null;

    // mismo mensaje para "falta el header", "id invalido", "no existe" y "deshabilitado": 401
    if (!usuario || !usuario.habilitado) {
      throw new UnauthorizedException('No se pudo identificar al usuario.');
    }

    solicitud.usuario = usuario;
    return true;
  }
}