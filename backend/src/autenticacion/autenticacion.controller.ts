import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service.js';
import { RegistroDto } from './dto/registro.dto.js';

@Controller('auth')
export class AutenticacionController {
  constructor(private readonly autenticacion: AutenticacionService) {}

  // POST /auth/registro -> 201 si se creo, 400 si los datos son invalidos, 409 si ya existe
  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  registro(@Body() dto: RegistroDto) {
    return this.autenticacion.registrar(dto);
  }
}