import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type Perfil = 'usuario' | 'administrador';

// coleccion "usuarios" de mongodb. timestamps agrega createdAt y updatedAt automaticamente
@Schema({ collection: 'usuarios', timestamps: true })
export class Usuario {
  @Prop({ type: String, required: true, trim: true })
  nombre!: string;

  @Prop({ type: String, required: true, trim: true })
  apellido!: string;

  // lowercase: se guarda en minusculas. unique: la base rechaza duplicados con un indice unico
  @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true })
  correo!: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true })
  nombreUsuario!: string;

  // select: false -> las consultas NO devuelven este campo salvo que se pida explicitamente (login)
  @Prop({ type: String, required: true, select: false })
  contrasena!: string;

  @Prop({ type: Date, required: true })
  fechaNacimiento!: Date;

  @Prop({ type: String, default: '', trim: true })
  descripcion!: string;

  @Prop({ type: String, default: null })
  imagenPerfilUrl!: string | null;

  // por defecto todos son "usuario". el registro publico nunca permite elegir otro perfil
  @Prop({ type: String, enum: ['usuario', 'administrador'], default: 'usuario' })
  perfil!: Perfil;

  // baja logica de usuarios: por ahora siempre true
  @Prop({ type: Boolean, default: true })
  habilitado!: boolean;
}

export type UsuarioDocument = HydratedDocument<Usuario>;
export const UsuarioSchema = SchemaFactory.createForClass(Usuario);