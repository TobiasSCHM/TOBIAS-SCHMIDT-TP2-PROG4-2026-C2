// perfil de un usuario por defecto "usuario". "administrador" se asigna desde la base de datos
export type Perfil = 'usuario' | 'administrador';

//nunca incluye contraseña
export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string; // fecha en formato iso
  descripcion: string;
  imagenPerfilUrl: string | null;
  perfil: Perfil;
  habilitado: boolean;
}