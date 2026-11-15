import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import type { HydratedDocument } from 'mongoose';
import { Usuario } from '../usuarios/usuario.schema.js';
import { Publicacion } from './publicacion.schema.js';

// coleccion "megustas": un documento por cada me gusta. se guarda la fecha (createdAt) para poder
// contar los me gusta otorgados por dia (estadisticas de sprints posteriores). no usa updatedAt
@Schema({ collection: 'megustas', timestamps: { createdAt: true, updatedAt: false } })
export class MeGusta {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Publicacion.name, required: true })
  publicacion!: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Usuario.name, required: true })
  usuario!: Types.ObjectId;

  // lo agrega mongoose por "timestamps"; se declara solo para que typescript lo conozca
  createdAt!: Date;
}

export type MeGustaDocument = HydratedDocument<MeGusta>;
export const MeGustaSchema = SchemaFactory.createForClass(MeGusta);

// indice unico: la base de datos rechaza un segundo me gusta del mismo usuario a la misma publicacion,
// incluso si llegan dos pedidos al mismo tiempo (una validacion hecha solo en el codigo no lo garantiza)
MeGustaSchema.index({ publicacion: 1, usuario: 1 }, { unique: true });