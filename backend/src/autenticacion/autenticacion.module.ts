import { Module } from '@nestjs/common';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { AutenticacionController } from './autenticacion.controller.js';
import { AutenticacionService } from './autenticacion.service.js';
import { TokenModule } from './token.module.js';

@Module({
  imports: [UsuariosModule, TokenModule],
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
  exports: [TokenModule], // los modulos que importan AutenticacionModule siguen recibiendo TokenService (lo usa UsuarioActualGuard)
})
export class AutenticacionModule {}