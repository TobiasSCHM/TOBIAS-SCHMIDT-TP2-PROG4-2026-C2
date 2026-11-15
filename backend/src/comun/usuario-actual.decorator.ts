import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { UsuarioDocument } from '../usuarios/usuario.schema.js';
import type { SolicitudConUsuario } from './usuario-actual.guard.js';

// devuelve el usuario que dejo el guard en el pedido. solo se usa en rutas protegidas con UsuarioActualGuard:
// @UsuarioActual() usuario: UsuarioDocument
export const UsuarioActual = createParamDecorator((_dato: unknown, contexto: ExecutionContext): UsuarioDocument => {
  const solicitud = contexto.switchToHttp().getRequest<SolicitudConUsuario>();
  return solicitud.usuario as UsuarioDocument;
});