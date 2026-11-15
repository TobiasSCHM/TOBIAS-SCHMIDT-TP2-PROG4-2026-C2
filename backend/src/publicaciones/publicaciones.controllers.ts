import {
  BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, UploadedFile,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { ArchivoSubido } from '../almacenamiento/almacenamiento.service.js';
import { UsuarioActual } from '../comun/usuario-actual.decorator.js';
import { UsuarioActualGuard } from '../comun/usuario-actual.guard.js';
import type { UsuarioDocument } from '../usuarios/usuario.schema.js';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto.js';
import { IdPublicacionDto } from './dto/id-publicacion.dto.js';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto.js';
import { PublicacionesService } from './publicaciones.service.js';
import type { EstadoMeGusta, PaginaPublicaciones, PublicacionPublica } from './publicaciones.service.js';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANIO_MAXIMO = 2 * 1024 * 1024; // 2 mb, el mismo limite que la imagen de perfil

// todas las rutas de publicaciones requieren un usuario identificado (UsuarioActualGuard)
@Controller('publicaciones')
@UseGuards(UsuarioActualGuard)
export class PublicacionesController {
  constructor(private readonly publicaciones: PublicacionesService) {}

  // GET /publicaciones?orden=fecha|meGusta&usuario=<id>&offset=0&limit=10
  // -> 200 con { datos, total, offset, limit }, 400 parametros invalidos, 401 sin usuario
  @Get()
  listar(
    @Query() consulta: ListarPublicacionesDto,
    @UsuarioActual() usuario: UsuarioDocument,
  ): Promise<PaginaPublicaciones> {
    return this.publicaciones.listar(consulta, usuario);
  }

  // POST /publicaciones (multipart/form-data) -> 201 si se creo, 400 datos invalidos, 401 sin usuario, 413 imagen muy pesada
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('imagen', {
      limits: { fileSize: TAMANIO_MAXIMO },
      fileFilter: (_req, archivo, cb) => {
        if (!TIPOS_PERMITIDOS.includes(archivo.mimetype)) {
          cb(new BadRequestException('La imagen debe ser JPG, PNG o WEBP.'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  crear(
    @Body() dto: CrearPublicacionDto,
    @UsuarioActual() autor: UsuarioDocument,
    @UploadedFile() archivo?: ArchivoSubido,
  ): Promise<PublicacionPublica> {
    return this.publicaciones.crear(dto, autor, archivo);
  }

  // POST /publicaciones/:id/me-gusta -> 201 con { cantidadMeGusta, meGusta }, 404 no existe, 409 ya le diste me gusta
  @Post(':id/me-gusta')
  @HttpCode(HttpStatus.CREATED)
  darMeGusta(@Param() params: IdPublicacionDto, @UsuarioActual() usuario: UsuarioDocument): Promise<EstadoMeGusta> {
    return this.publicaciones.darMeGusta(params.id, usuario);
  }

  // DELETE /publicaciones/:id/me-gusta -> 200 con { cantidadMeGusta, meGusta }, 404 si no existe o no le habias dado me gusta
  @Delete(':id/me-gusta')
  quitarMeGusta(@Param() params: IdPublicacionDto, @UsuarioActual() usuario: UsuarioDocument): Promise<EstadoMeGusta> {
    return this.publicaciones.quitarMeGusta(params.id, usuario);
  }

  // DELETE /publicaciones/:id (baja logica) -> 204 sin contenido, 403 si no es el creador ni administrador, 404 no existe
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  eliminar(@Param() params: IdPublicacionDto, @UsuarioActual() usuario: UsuarioDocument): Promise<void> {
    return this.publicaciones.eliminar(params.id, usuario);
  }
}