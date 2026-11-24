import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdministradorGuard } from '../comun/administrador.guard.js';
import { UsuarioActualGuard } from '../comun/usuario-actual.guard.js';
import { RangoFechasDto } from './dto/rango-fechas.dto.js';
import { RankingFechasDto } from './dto/ranking-fechas.dto.js';
import { EstadisticasService } from './estadisticas.service.js';
import type { ComentariosPorDia, ComentariosPorPublicacion, PublicacionesPorUsuario } from './estadisticas.service.js';

// sprint 4: estadisticas para los graficos del dashboard. TODAS las rutas exigen un token valido (UsuarioActualGuard)
// Y que ese usuario sea administrador segun la base de datos (AdministradorGuard). un usuario comun recibe 403.
// periodo: ?desde=AAAA-MM-DD&hasta=AAAA-MM-DD (ambos incluidos, hora de argentina). ver estadisticas-fechas.ts
// respuestas: 200 con los datos, 400 parametros invalidos, 401 sin sesion valida, 403 si no es administrador
@Controller('estadisticas')
@UseGuards(UsuarioActualGuard, AdministradorGuard)
export class EstadisticasController {
  constructor(private readonly estadisticas: EstadisticasService) {}

  // GET /estadisticas/publicaciones-por-usuario?desde=&hasta=&limit=10
  @Get('publicaciones-por-usuario')
  publicacionesPorUsuario(@Query() consulta: RankingFechasDto): Promise<PublicacionesPorUsuario> {
    return this.estadisticas.publicacionesPorUsuario(consulta);
  }

  // GET /estadisticas/comentarios?desde=&hasta= -> cantidad de comentarios de cada dia del periodo
  @Get('comentarios')
  comentarios(@Query() consulta: RangoFechasDto): Promise<ComentariosPorDia> {
    return this.estadisticas.comentariosPorDia(consulta);
  }

  // GET /estadisticas/comentarios-por-publicacion?desde=&hasta=&limit=10
  @Get('comentarios-por-publicacion')
  comentariosPorPublicacion(@Query() consulta: RankingFechasDto): Promise<ComentariosPorPublicacion> {
    return this.estadisticas.comentariosPorPublicacion(consulta);
  }
}