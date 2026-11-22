import type { AutorPublicacion } from './publicacion.model';

export interface Comentario {
  id: string;
  mensaje: string;
  autor: AutorPublicacion; // mismos datos resumidos que el autor de una publicacion
  // true si el autor lo edito: la pantalla muestra "(editado)"
  modificado: boolean;
  createdAt: string; // fecha en formato iso
}

// respuesta del listado: la pagina pedida + el total (sirve para saber si quedan comentarios por traer)
export interface PaginaComentarios {
  datos: Comentario[];
  total: number;
  offset: number;
  limit: number;
}