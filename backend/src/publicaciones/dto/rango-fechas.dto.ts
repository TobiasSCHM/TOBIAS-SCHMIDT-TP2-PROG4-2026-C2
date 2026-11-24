import { IsOptional, Matches } from 'class-validator';

// parametros de la url: GET /estadisticas/comentarios?desde=2026-11-01&hasta=2026-11-23
// los dos son opcionales (por defecto: los ultimos 30 dias). la validacion completa de las fechas
// (que existan, desde <= hasta, maximo 366 dias) esta en estadisticas-fechas.ts. ver ahi como se interpretan
export class RangoFechasDto {
  // primer dia del periodo, incluido (AAAA-MM-DD, hora de argentina)
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha "desde" debe tener el formato AAAA-MM-DD.' })
  desde?: string;

  // ultimo dia del periodo, incluido (AAAA-MM-DD, hora de argentina)
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha "hasta" debe tener el formato AAAA-MM-DD.' })
  hasta?: string;
}