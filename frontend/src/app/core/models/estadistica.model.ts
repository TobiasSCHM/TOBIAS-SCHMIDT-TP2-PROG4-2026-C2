// sprint 4: lo que responde el backend en /estadisticas/* (se mantienen iguales a EstadisticasService del backend)

export interface UsuarioConPublicaciones {
  usuarioId: string;
  nombreUsuario?: string;
  nombre?: string;
  apellido?: string;
  cantidad: number;
}

export interface PublicacionesPorUsuario {
  desde: string; // AAAA-MM-DD
  hasta: string;
  totalPublicaciones: number; // de todo el periodo, no solo de los usuarios devueltos
  totalUsuarios: number;
  datos: UsuarioConPublicaciones[]; // los que mas publicaron, de mayor a menor
}

export interface ComentariosPorDia {
  desde: string;
  hasta: string;
  total: number;
  datos: { fecha: string; cantidad: number }[]; // un elemento por cada dia del periodo
}

export interface PublicacionConComentarios {
  publicacionId: string;
  titulo: string;
  cantidad: number;
}

export interface ComentariosPorPublicacion {
  desde: string;
  hasta: string;
  totalComentarios: number; // de todo el periodo, no solo de las publicaciones devueltas
  totalPublicaciones: number;
  datos: PublicacionConComentarios[]; // las que mas comentarios recibieron, de mayor a menor
}