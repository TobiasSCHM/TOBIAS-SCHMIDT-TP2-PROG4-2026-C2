import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { RangoFechasDto } from './rango-fechas.dto.js';

// periodo + cuantos elementos del ranking se devuelven: ?desde=2026-11-01&hasta=2026-11-23&limit=10
export class RankingFechasDto extends RangoFechasDto {
  // los parametros de la url llegan como texto: @Type los convierte a numero antes de validar
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero.' })
  @Min(1, { message: 'El límite debe ser al menos 1.' })
  @Max(50, { message: 'El límite no puede superar 50.' })
  limit: number = 10;
}