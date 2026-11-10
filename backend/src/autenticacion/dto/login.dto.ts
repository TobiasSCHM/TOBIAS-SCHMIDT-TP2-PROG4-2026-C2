import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

// recorta espacios al principio y al final antes de validar
const recortar = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class LoginDto {
  // puede ser el correo o el nombre de usuario
  @Transform(recortar)
  @IsString({ message: 'Ingresá tu correo o nombre de usuario.' })
  @IsNotEmpty({ message: 'Ingresá tu correo o nombre de usuario.' })
  identificador!: string;

  @IsString({ message: 'Ingresá tu contraseña.' })
  @IsNotEmpty({ message: 'Ingresá tu contraseña.' })
  contrasena!: string;
}