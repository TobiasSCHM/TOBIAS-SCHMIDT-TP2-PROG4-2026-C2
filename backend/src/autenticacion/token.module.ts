import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DURACION_TOKEN_SEGUNDOS, TokenService } from './token.service.js';

//al final la configuracion del jwt y TokenService estan en su propio modulo para que UsuariosModule
// y AutenticacionModule los usen sin depender uno del otro
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      // si falta JWT_SECRET, el arranque falla con un mensaje
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: DURACION_TOKEN_SEGUNDOS },
      }),
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}