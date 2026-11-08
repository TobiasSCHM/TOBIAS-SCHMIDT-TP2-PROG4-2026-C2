import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@Controller()
export class AppController {
  constructor(@InjectConnection() private readonly conexion: Connection) {}

  // ruta de salud: sirve para comprobar el deploy y la conexion a mongo
  @Get('salud')
  salud() {
    const conectada = this.conexion.readyState === 1;
    return { estado: 'ok', mongo: conectada ? 'conectado' : 'sin conexion', fecha: new Date().toISOString() };
  }
}