import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import type { SolicitudConUsuario } from './usuario-actual.guard.js';

// sprint 4: deja pasar solo a administradores. se usa SIEMPRE despues de UsuarioActualGuard:
// @UseGuards(UsuarioActualGuard, AdministradorGuard). como ese guard ya verifico el token y leyo el usuario
// de la base, el perfil que se comprueba aca es el de la base de datos, no uno que pueda mandar el cliente
@Injectable()
export class AdministradorGuard implements CanActivate {
  canActivate(contexto: ExecutionContext): boolean {
    const usuario = contexto.switchToHttp().getRequest<SolicitudConUsuario>().usuario;

    // sin usuario identificado (el guard anterior no corrio): no hay sesion valida
    if (!usuario) throw new UnauthorizedException('La sesión no es válida o venció. Ingresá de nuevo.');

    if (usuario.perfil !== 'administrador') {
      throw new ForbiddenException('Solo un administrador puede realizar esta acción.');
    }
    return true;
  }
}