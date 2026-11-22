import { IsMongoId } from 'class-validator';

// valida los parametros de la ruta PUT /publicaciones/:id/comentarios/:comentarioId.
// los dos tienen que ser ids de mongo validos: si no, responde 400 en lugar de un error 500
export class IdComentarioDto {
  @IsMongoId({ message: 'El id de la publicación no es válido.' })
  id!: string;

  @IsMongoId({ message: 'El id del comentario no es válido.' })
  comentarioId!: string;
}