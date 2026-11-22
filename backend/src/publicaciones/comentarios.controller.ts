import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UsuarioActual } from '../comun/usuario-actual.decorator.js';
import { UsuarioActualGuard } from '../comun/usuario-actual.guard.js';
import type { UsuarioDocument } from '../usuarios/usuario.schema.js';
import { ComentariosService } from './comentarios.service.js';
import type { ComentarioPublico, PaginaComentarios } from './comentarios.service.js';
import { CrearComentarioDto } from './dto/crear-comentario.dto.js';
import { EditarComentarioDto } from './dto/editar-comentario.dto.js';
import { IdComentarioDto } from './dto/id-comentario.dto.js';
import { IdPublicacionDto } from './dto/id-publicacion.dto.js';
import { ListarComentariosDto } from './dto/listar-comentarios.dto.js';

// los comentarios cuelgan de una publicacion: /publicaciones/:id/comentarios
// todas las rutas requieren un usuario identificado (UsuarioActualGuard)
@Controller('publicaciones/:id/comentarios')
@UseGuards(UsuarioActualGuard)
export class ComentariosController {
  constructor(private readonly comentarios: ComentariosService) {}

  // GET /publicaciones/:id/comentarios?offset=0&limit=5
  // -> 200 con { datos, total, offset, limit } (los mas recientes primero), 400 parametros invalidos, 401, 404 no existe la publicacion
  @Get()
  listar(@Param() params: IdPublicacionDto, @Query() consulta: ListarComentariosDto): Promise<PaginaComentarios> {
    return this.comentarios.listar(params.id, consulta);
  }

  // POST /publicaciones/:id/comentarios (json: { mensaje }) -> 201 con el comentario, 400 mensaje invalido, 401, 404
  @Post()
  @HttpCode(HttpStatus.CREATED)
  crear(
    @Param() params: IdPublicacionDto,
    @Body() dto: CrearComentarioDto,
    @UsuarioActual() usuario: UsuarioDocument,
  ): Promise<ComentarioPublico> {
    return this.comentarios.crear(params.id, dto, usuario);
  }

  // PUT /publicaciones/:id/comentarios/:comentarioId (json: { mensaje })
  // -> 200 con el comentario (modificado: true), 400, 401, 403 si no lo escribio el usuario, 404
  @Put(':comentarioId')
  modificar(
    @Param() params: IdComentarioDto,
    @Body() dto: EditarComentarioDto,
    @UsuarioActual() usuario: UsuarioDocument,
  ): Promise<ComentarioPublico> {
    return this.comentarios.modificar(params.id, params.comentarioId, dto, usuario);
  }
}