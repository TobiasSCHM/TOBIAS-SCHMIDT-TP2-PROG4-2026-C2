import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';
import type { HydratedDocument } from 'mongoose';
import { Usuario } from '../usuarios/usuario.schema.js';

// coleccion "publicaciones" de mongodb. timestamps agrega createdAt y updatedAt automaticamente
@Schema({ collection: 'publicaciones', timestamps: true })
export class Publicacion {
  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  titulo!: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 1000 })
  descripcion!: string;

  // url de cloudinary. null si la publicacion no tiene imagen
  @Prop({ type: String, default: null })
  imagenUrl!: string | null;

  // referencia al usuario que creo la publicacion (guarda su _id). index: acelera filtrar por autor
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Usuario.name, required: true, index: true })
  autor!: Types.ObjectId;

  // se guarda aparte (en vez de contar cada vez) para poder ordenar por cantidad de me gusta
  @Prop({ type: Number, default: 0, min: 0 })
  cantidadMeGusta!: number;

  // baja logica: una publicacion dada de baja sigue en la base pero deja de listarse
  @Prop({ type: Boolean, default: true })
  habilitada!: boolean;

  // los agrega mongoose por "timestamps". se declaran solo para que typescript los conozca (sin @Prop)
  createdAt!: Date;
  updatedAt!: Date;
}

export type PublicacionDocument = HydratedDocument<Publicacion>;
export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);