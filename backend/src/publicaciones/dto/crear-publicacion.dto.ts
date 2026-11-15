import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

// recorta espacios al principio y al final antes de validar
const recortar = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CrearPublicacionDto {
  @Transform(recortar)
  @IsString({ message: 'El título debe ser un texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  @MaxLength(100, { message: 'El título no puede superar los 100 caracteres.' })
  titulo!: string;

  @Transform(recortar)
  @IsString({ message: 'La descripción debe ser un texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  @MaxLength(1000, { message: 'La descripción no puede superar los 1000 caracteres.' })
  descripcion!: string;
}