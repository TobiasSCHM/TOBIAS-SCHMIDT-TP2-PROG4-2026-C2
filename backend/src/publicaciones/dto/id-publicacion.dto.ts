import { IsMongoId } from 'class-validator';

// valida el parametro de la ruta (/publicaciones/:id): tiene que ser un id de mongo valido.
// sin esto, un id mal escrito llegaria a la base y fallaria con un error 500 en vez de un 400
export class IdPublicacionDto {
  @IsMongoId({ message: 'El id de la publicación no es válido.' })
  id!: string;
}