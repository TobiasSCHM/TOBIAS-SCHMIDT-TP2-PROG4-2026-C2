import { Type } from 'class-transformer';
import { IsIn, IsInt, IsMongoId, IsOptional, Max, Min } from 'class-validator';

export const ORDENES = ['fecha', 'meGusta'] as const;
export type Orden = (typeof ORDENES)[number];

// parametros de la url: GET /publicaciones?orden=meGusta&usuario=<id>&offset=0&limit=10
// todos son opcionales. lo que no se manda toma el valor por defecto de abajo
export class ListarPublicacionesDto {
  @IsOptional()
  @IsIn(ORDENES, { message: 'El orden debe ser "fecha" o "meGusta".' })
  orden: Orden = 'fecha';

  // id del usuario cuyas publicaciones se quieren ver
  @IsOptional()
  @IsMongoId({ message: 'El usuario debe ser un id válido.' })
  usuario?: string;

  // cuantas publicaciones se saltean (0 = desde la primera)
  // los parametros de la url llegan como texto: @Type los convierte a numero antes de validar
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El offset debe ser un número entero.' })
  @Min(0, { message: 'El offset no puede ser negativo.' })
  offset: number = 0;

  // cuantas publicaciones se devuelven como maximo
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero.' })
  @Min(1, { message: 'El límite debe ser al menos 1.' })
  @Max(50, { message: 'El límite no puede superar 50.' })
  limit: number = 10;
}