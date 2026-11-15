import {
  BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { ArchivoSubido } from '../almacenamiento/almacenamiento.service.js';
import { UsuarioActual } from '../comun/usuario-actual.decorator.js';
import { UsuarioActualGuard } from '../comun/usuario-actual.guard.js';
import type { UsuarioDocument } from '../usuarios/usuario.schema.js';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto.js';
import { ListarPublicacionesDto } from './dto/listar-publicaciones.dto.js';
import { PublicacionesService } from './publicaciones.service.js';
import type { PaginaPublicaciones, PublicacionPublica } from './publicaciones.service.js';

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
  listar(@Query() consulta: ListarPublicacionesDto): Promise<PaginaPublicaciones> {
    return this.publicaciones.listar(consulta);
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
}