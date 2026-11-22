import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// recorta espacios al principio y al final antes de validar
const recortar = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CrearComentarioDto {
  @Transform(recortar)
  @IsString({ message: 'El comentario debe ser un texto.' })
  @IsNotEmpty({ message: 'El comentario no puede estar vacío.' })
  @MaxLength(350, { message: 'El comentario no puede superar los 350 caracteres.' })
  mensaje!: string;
}