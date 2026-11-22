import { CrearComentarioDto } from './crear-comentario.dto.js';

// al editar se manda el mensaje nuevo, con las mismas reglas que al crear
export class EditarComentarioDto extends CrearComentarioDto {}