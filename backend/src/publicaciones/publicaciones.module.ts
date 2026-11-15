import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AlmacenamientoModule } from '../almacenamiento/almacenamiento.module.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { PublicacionesController } from './publicaciones.controllers.js';
import { PublicacionesService } from './publicaciones.service.js';
import { Publicacion, PublicacionSchema } from './publicacion.schema.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Publicacion.name, schema: PublicacionSchema }]),
    UsuariosModule, // el guard necesita UsuariosService
    AlmacenamientoModule, // para subir la imagen a cloudinary
  ],
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
})
export class PublicacionesModule {}