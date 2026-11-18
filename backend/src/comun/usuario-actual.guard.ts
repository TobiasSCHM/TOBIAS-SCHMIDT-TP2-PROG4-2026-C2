import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { TokenService } from '../autenticacion/token.service.js';
import type { UsuarioDocument } from '../usuarios/usuario.schema.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';

// el pedido de express, con el usuario identificado (lo agrega este guard)
export type SolicitudConUsuario = Request & { usuario?: UsuarioDocument };

// sprint 3: identifica al usuario por el token jwt del header "Authorization: Bearer <token>".
// del token solo se confia en el id (sub) una vez verificada la firma: el perfil (usuario/administrador)
// y si esta habilitado se leen SIEMPRE de la base, asi un cambio de rol o una baja se nota en el momento
@Injectable()
export class UsuarioActualGuard implements CanActivate {
  constructor(
    private readonly tokens: TokenService,
    private readonly usuarios: UsuariosService,
  ) {}

  async canActivate(contexto: ExecutionContext): Promise<boolean> {
    const solicitud = contexto.switchToHttp().getRequest<SolicitudConUsuario>();

    // el header tiene la forma "Bearer <token>"
    const [tipo, token] = (solicitud.headers.authorization ?? '').split(' ');
    const payload = tipo === 'Bearer' && token ? await this.tokens.verificar(token) : null;
    const usuario = payload ? await this.usuarios.buscarPorId(payload.sub) : null;

    // mismo mensaje para "falta el token", "token invalido o vencido", "no existe" y "deshabilitado": 401
    if (!usuario || !usuario.habilitado) {
      throw new UnauthorizedException('La sesión no es válida o venció. Ingresá de nuevo.');
    }

    solicitud.usuario = usuario;
    return true;
  }
}