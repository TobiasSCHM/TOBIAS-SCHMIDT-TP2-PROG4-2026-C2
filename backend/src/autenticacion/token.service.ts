import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { UsuarioDocument } from '../usuarios/usuario.schema.js';
import type { Perfil } from '../usuarios/usuario.schema.js';

// lo que va dentro del token: quien es el usuario (sub = su id) y su rol
export interface PayloadToken {
  sub: string;
  nombreUsuario: string;
  perfil: Perfil;
}

// el token vence a los 15 minutos (enunciado del sprint 3)
export const DURACION_TOKEN_SEGUNDOS = 15 * 60;

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  // arma un token nuevo. se vuelve a armar el payload a mano (en vez de copiar uno viejo) porque un token
  // ya firmado trae "iat" y "exp": si se copiaran, jsonwebtoken rechazaria el nuevo vencimiento
  generar(usuario: UsuarioDocument): Promise<string> {
    const payload: PayloadToken = {
      sub: usuario.id,
      nombreUsuario: usuario.nombreUsuario,
      perfil: usuario.perfil,
    };
    return this.jwt.signAsync(payload);
  }

  // devuelve el payload si el token es valido y no esta vencido. si no, null (sin explicar el motivo)
  async verificar(token: string): Promise<PayloadToken | null> {
    try {
      return await this.jwt.verifyAsync<PayloadToken>(token);
    } catch {
      return null; // firma incorrecta, token alterado, mal formado o vencido
    }
  }
}