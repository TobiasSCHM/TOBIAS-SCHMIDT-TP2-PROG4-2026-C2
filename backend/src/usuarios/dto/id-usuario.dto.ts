import { IsMongoId } from 'class-validator';

// valida el parametro de las rutas /usuarios/:id: tiene que ser un id de mongo valido (si no, 400 y no un error 500)
export class IdUsuarioDto {
  @IsMongoId({ message: 'El id del usuario no es válido.' })
  id!: string;
}