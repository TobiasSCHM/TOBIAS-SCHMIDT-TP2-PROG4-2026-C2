import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlmacenamientoModule } from '../almacenamiento/almacenamiento.module.js';
import { TokenModule } from '../autenticacion/token.module.js';
import { Usuario, UsuarioSchema } from './usuario.schema.js';
import { UsuariosController } from './usuarios.controller.js';
import { UsuariosService } from './usuarios.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    AlmacenamientoModule, // la imagen de perfil se sube a cloudinary al dar de alta un usuario
    TokenModule, // UsuarioActualGuard (que usa el controller) necesita TokenService
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}