import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

// parametros de la url: GET /publicaciones/:id/comentarios?offset=0&limit=5
// los dos son opcionales. lo que no se manda toma el valor por defecto de abajo
export class ListarComentariosDto {
  // cuantos comentarios se saltean (0 = desde el mas reciente)
  // los parametros de la url llegan como texto: @Type los convierte a numero antes de validar
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El offset debe ser un número entero.' })
  @Min(0, { message: 'El offset no puede ser negativo.' })
  offset: number = 0;

  // cuantos comentarios se devuelven como maximo
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero.' })
  @Min(1, { message: 'El límite debe ser al menos 1.' })
  @Max(50, { message: 'El límite no puede superar 50.' })
  limit: number = 5;
}