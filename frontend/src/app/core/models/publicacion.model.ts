// criterio de orden del listado (el mismo que acepta el backend)
export type OrdenPublicaciones = 'fecha' | 'meGusta';

// datos resumidos del autor que vienen dentro de cada publicacion
export interface AutorPublicacion {
  id: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  imagenPerfilUrl: string | null;
}

export interface Publicacion {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  autor: AutorPublicacion;
  cantidadMeGusta: number;
  // true si el usuario logueado ya le dio me gusta
  meGusta: boolean;
  createdAt: string; // fecha en formato iso
}

// respuesta del listado: la pagina pedida + el total (sirve para armar el paginador)
export interface PaginaPublicaciones {
  datos: Publicacion[];
  total: number;
  offset: number;
  limit: number;
}

// respuesta de dar o quitar un me gusta: el estado nuevo de la publicacion
export interface EstadoMeGusta {
  cantidadMeGusta: number;
  meGusta: boolean;
}

// parametros opcionales del listado
export interface ConsultaPublicaciones {
  orden?: OrdenPublicaciones;
  usuario?: string; // id del autor, para ver solo sus publicaciones
  offset?: number;
  limit?: number;
}