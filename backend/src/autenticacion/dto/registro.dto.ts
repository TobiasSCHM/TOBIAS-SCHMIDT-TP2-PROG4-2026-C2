import { Transform } from 'class-transformer';
import {
  IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength,
} from 'class-validator';

// recorta espacios al principio y al final antes de validar
const recortar = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class RegistroDto {
  @Transform(recortar)
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  @MaxLength(50, { message: 'El nombre no puede superar los 50 caracteres.' })
  nombre!: string;

  @Transform(recortar)
  @IsString({ message: 'El apellido debe ser un texto.' })
  @IsNotEmpty({ message: 'El apellido es obligatorio.' })
  @MaxLength(50, { message: 'El apellido no puede superar los 50 caracteres.' })
  apellido!: string;

  @Transform(recortar)
  @IsEmail({}, { message: 'El correo no tiene un formato válido.' })
  @MaxLength(100, { message: 'El correo no puede superar los 100 caracteres.' })
  correo!: string;

  @Transform(recortar)
  @Matches(/^[A-Za-z0-9_]{3,20}$/, {
    message: 'El nombre de usuario debe tener entre 3 y 20 caracteres: letras, números o guion bajo.',
  })
  nombreUsuario!: string;

  // al menos 8 caracteres, una mayuscula y un numero (enunciado del sprint 1)
  @IsString({ message: 'La contraseña debe ser un texto.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.',
  })
  contrasena!: string;

  @IsString({ message: 'Repetir la contraseña es obligatorio.' })
  @IsNotEmpty({ message: 'Repetir la contraseña es obligatorio.' })
  repetirContrasena!: string;

  @IsDateString({}, { message: 'La fecha de nacimiento debe tener el formato AAAA-MM-DD.' })
  fechaNacimiento!: string;

  @IsOptional()
  @Transform(recortar)
  @IsString({ message: 'La descripción debe ser un texto.' })
  @MaxLength(200, { message: 'La descripción no puede superar los 200 caracteres.' })
  descripcion?: string;
}