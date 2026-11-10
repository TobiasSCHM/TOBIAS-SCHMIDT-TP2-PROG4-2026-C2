import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { ArchivoSubido } from '../almacenamiento/almacenamiento.service.js';
import { AutenticacionService } from './autenticacion.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegistroDto } from './dto/registro.dto.js';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANIO_MAXIMO = 2 * 1024 * 1024; // 2 mb

@Controller('auth')
export class AutenticacionController {
  constructor(private readonly autenticacion: AutenticacionService) {}

  // POST /auth/registro (multipart/form-data) -> 201 si se creo, 400 datos invalidos, 409 ya existe, 413 imagen muy pesada
  @Post('registro')
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
  registro(@Body() dto: RegistroDto, @UploadedFile() archivo?: ArchivoSubido) {
    return this.autenticacion.registrar(dto, archivo);
  }

  // POST /auth/login -> 200 con los datos del usuario, 400 datos invalidos, 401 credenciales incorrectas
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) {
    return this.autenticacion.login(dto);
  }
}