import {
  BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UploadedFile,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { ArchivoSubido } from '../almacenamiento/almacenamiento.service.js';
import { AdministradorGuard } from '../comun/administrador.guard.js';
import { UsuarioActual } from '../comun/usuario-actual.decorator.js';
import { UsuarioActualGuard } from '../comun/usuario-actual.guard.js';
import { CrearUsuarioAdminDto } from './dto/crear-usuario-admin.dto.js';
import { IdUsuarioDto } from './dto/id-usuario.dto.js';
import type { UsuarioDocument } from './usuario.schema.js';
import { UsuariosService } from './usuarios.service.js';
import type { UsuarioPublico } from './usuarios.service.js';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANIO_MAXIMO = 2 * 1024 * 1024; // 2 mb, el mismo limite que el registro

// administracion de usuarios TODAS las rutas exigen un token valido  y que ese usuario
// sea administrador segun la base de datos (AdministradorGuard) un usuario comun recibe 403
@Controller('usuarios')
@UseGuards(UsuarioActualGuard, AdministradorGuard)
export class UsuariosController {
  constructor(private readonly usuarios: UsuariosService) {}

  // GET /usuarios -> 200 con la lista de usuarios (sin contrasena), 401 sin sesion valida, 403 si no es administrador
  @Get()
  listar(): Promise<UsuarioPublico[]> {
    return this.usuarios.listar();
  }

  // POST /usuarios (multipart/form-data: los mismos campos que el registro + perfil)
  // -> 201 con el usuario creado, 400 datos invalidos, 401, 403, 409 correo o usuario repetido, 413 imagen muy pesada
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FileInterceptor('imagenPerfil', {
      limits: { fileSize: TAMANIO_MAXIMO },
      fileFilter: (_req, archivo, cb) => {
        if (!TIPOS_PERMITIDOS.includes(archivo.mimetype)) {
          cb(new BadRequestException('La imagen de perfil debe ser JPG, PNG o WEBP.'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async crear(@Body() dto: CrearUsuarioAdminDto, @UploadedFile() archivo?: ArchivoSubido): Promise<UsuarioPublico> {
    const usuario = await this.usuarios.registrar(dto, archivo, dto.perfil);
    return this.usuarios.publico(usuario);
  }

  // POST /usuarios/:id/habilitar (alta logica) -> 200 con el usuario, 400 id invalido, 401, 403, 404, 409 ya estaba habilitado
  @Post(':id/habilitar')
  @HttpCode(HttpStatus.OK)
  habilitar(@Param() params: IdUsuarioDto): Promise<UsuarioPublico> {
    return this.usuarios.habilitar(params.id);
  }

  // DELETE /usuarios/:id (baja logica) -> 200 con el usuario, 400, 401, 403 (no es administrador o es uno mismo), 404, 409 ya estaba deshabilitado
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deshabilitar(@Param() params: IdUsuarioDto, @UsuarioActual() administrador: UsuarioDocument): Promise<UsuarioPublico> {
    return this.usuarios.deshabilitar(params.id, administrador.id);
  }
}