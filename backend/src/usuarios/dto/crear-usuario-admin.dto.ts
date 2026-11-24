import { IsIn } from 'class-validator';
import { RegistroDto } from '../../autenticacion/dto/registro.dto.js';
import type { Perfil } from '../usuario.schema.js';

export const PERFILES = ['usuario', 'administrador'] as const;

// alta de un usuario hecha por un administrador: exactamente los mismos datos y validaciones que el registro
//  mas el perfil elegido
export class CrearUsuarioAdminDto extends RegistroDto {
  @IsIn(PERFILES, { message: 'El perfil debe ser "usuario" o "administrador".' })
  perfil!: Perfil;
}