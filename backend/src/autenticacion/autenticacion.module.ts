import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AlmacenamientoModule } from '../almacenamiento/almacenamiento.module.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { AutenticacionController } from './autenticacion.controller.js';
import { AutenticacionService } from './autenticacion.service.js';
import { DURACION_TOKEN_SEGUNDOS, TokenService } from './token.service.js';

@Module({
  imports: [
    UsuariosModule,
    AlmacenamientoModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      // si falta JWT_SECRET, el arranque falla con un mensaje
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: DURACION_TOKEN_SEGUNDOS },
      }),
    }),
  ],
  controllers: [AutenticacionController],
  providers: [AutenticacionService, TokenService],
  exports: [TokenService], // lo usa UsuarioActualGuard en los demas modulos
})
export class AutenticacionModule {}