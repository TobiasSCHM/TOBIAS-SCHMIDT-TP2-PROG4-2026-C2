import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlmacenamientoModule } from '../almacenamiento/almacenamiento.module.js';
import { AutenticacionModule } from '../autenticacion/autenticacion.module.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { MeGusta, MeGustaSchema } from './megusta.schema.js';
import { PublicacionesController } from './publicaciones.controllers.js';
import { PublicacionesService } from './publicaciones.service.js';
import { Publicacion, PublicacionSchema } from './publicacion.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
      { name: MeGusta.name, schema: MeGustaSchema },
    ]),
    UsuariosModule, // el guard necesita UsuariosService
    AutenticacionModule, // el guard necesita TokenService para verificar el token
    AlmacenamientoModule, // para subir la imagen a cloudinary
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}