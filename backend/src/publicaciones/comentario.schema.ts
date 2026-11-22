import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import type { HydratedDocument } from 'mongoose';
import { Usuario } from '../usuarios/usuario.schema.js';
import { Publicacion } from './publicacion.schema.js';

// coleccion "comentarios" de mongodb. timestamps agrega createdAt (la fecha del comentario) y updatedAt
@Schema({ collection: 'comentarios', timestamps: true })
export class Comentario {
  // publicacion a la que pertenece
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Publicacion.name, required: true })
  publicacion!: Types.ObjectId;

  // usuario que escribio el comentario
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Usuario.name, required: true })
  autor!: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 350 })
  mensaje!: string;

  // pasa a true cuando el autor edita el mensaje: el front lo usa para mostrar "editado"
  @Prop({ type: Boolean, default: false })
  modificado!: boolean;

  // los agrega mongoose por "timestamps". se declaran solo para que typescript los conozca (sin @Prop)
  createdAt!: Date;
  updatedAt!: Date;
}

export type ComentarioDocument = HydratedDocument<Comentario>;
export const ComentarioSchema = SchemaFactory.createForClass(Comentario);

// indice para el listado: los comentarios de una publicacion, del mas nuevo al mas viejo.
// el _id al final desempata comentarios con la misma fecha (asi la paginacion no repite ni saltea)
ComentarioSchema.index({ publicacion: 1, createdAt: -1, _id: -1 });