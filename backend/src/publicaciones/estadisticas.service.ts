import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { Comentario } from './comentario.schema.js';
import type { RangoFechasDto } from './dto/rango-fechas.dto.js';
import type { RankingFechasDto } from './dto/ranking-fechas.dto.js';
import { Publicacion } from './publicacion.schema.js';
import { OFFSET_ARGENTINA, diasDelRango, resolverRango } from './estadisticas-fechas.js';

// sprint 4: solo se cuentan publicaciones habilitadas y los comentarios de publicaciones habilitadas:
// lo que se dio de baja deja de existir tambien para las estadisticas
export interface UsuarioConPublicaciones {
  usuarioId: string;
  nombreUsuario?: string;
  nombre?: string;
  apellido?: string;
  cantidad: number;
}

export interface PublicacionesPorUsuario {
  desde: string;
  hasta: string;
  totalPublicaciones: number; // de todo el periodo (no solo de los usuarios devueltos)
  totalUsuarios: number; // usuarios que publicaron en el periodo
  datos: UsuarioConPublicaciones[]; // los "limit" con mas publicaciones, de mayor a menor
}

export interface ComentariosPorDia {
  desde: string;
  hasta: string;
  total: number;
  datos: { fecha: string; cantidad: number }[]; // un elemento por dia del periodo (los dias sin comentarios, en 0)
}

export interface PublicacionConComentarios {
  publicacionId: string;
  titulo: string;
  cantidad: number;
}

export interface ComentariosPorPublicacion {
  desde: string;
  hasta: string;
  totalComentarios: number; // de todo el periodo (no solo de las publicaciones devueltas)
  totalPublicaciones: number; // publicaciones que recibieron comentarios en el periodo
  datos: PublicacionConComentarios[]; // las "limit" con mas comentarios, de mayor a menor
}

// resultado de los $facet: los datos del ranking + una sola fila con los totales
interface ResultadoRanking<T> {
  datos: T[];
  totales: { cantidad: number; elementos: number }[];
}

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacion.name) private readonly publicaciones: Model<Publicacion>,
    @InjectModel(Comentario.name) private readonly comentarios: Model<Comentario>,
  ) {}

  // grafico 1: cantidad de publicaciones de cada usuario en el periodo (una sola agregacion)
  async publicacionesPorUsuario(consulta: RankingFechasDto): Promise<PublicacionesPorUsuario> {
    const rango = resolverRango(consulta.desde, consulta.hasta);

    const [resultado] = await this.publicaciones
      .aggregate<ResultadoRanking<UsuarioConPublicaciones>>([
        { $match: { habilitada: true, createdAt: { $gte: rango.inicio, $lt: rango.finExclusivo } } },
        { $group: { _id: '$autor', cantidad: { $sum: 1 } } },
        { $sort: { cantidad: -1, _id: 1 } }, // el _id desempata: el orden siempre es el mismo
        {
          $facet: {
            // el $lookup de usuarios se hace despues del $limit: solo para los que se muestran
            datos: [
              { $limit: consulta.limit },
              {
                $lookup: {
                  from: 'usuarios',
                  localField: '_id',
                  foreignField: '_id',
                  as: 'usuario',
                  // solo estos campos: nunca la contrasena (el select:false del esquema no aplica en agregaciones)
                  pipeline: [{ $project: { nombreUsuario: 1, nombre: 1, apellido: 1 } }],
                },
              },
              { $unwind: { path: '$usuario', preserveNullAndEmptyArrays: true } },
              {
                $project: {
                  _id: 0,
                  usuarioId: { $toString: '$_id' },
                  nombreUsuario: '$usuario.nombreUsuario',
                  nombre: '$usuario.nombre',
                  apellido: '$usuario.apellido',
                  cantidad: 1,
                },
              },
            ],
            totales: [{ $group: { _id: null, cantidad: { $sum: '$cantidad' }, elementos: { $sum: 1 } } }],
          },
        },
      ])
      .exec();

    return {
      desde: rango.desde,
      hasta: rango.hasta,
      totalPublicaciones: resultado.totales[0]?.cantidad ?? 0,
      totalUsuarios: resultado.totales[0]?.elementos ?? 0,
      datos: resultado.datos,
    };
  }

  // grafico 2: cantidad de comentarios por dia en el periodo (una sola agregacion + se completan con 0 los dias vacios)
  async comentariosPorDia(consulta: RangoFechasDto): Promise<ComentariosPorDia> {
    const rango = resolverRango(consulta.desde, consulta.hasta);

    const filas = await this.comentarios
      .aggregate<{ _id: string; cantidad: number }>([
        { $match: { createdAt: { $gte: rango.inicio, $lt: rango.finExclusivo } } },
        // solo comentarios de publicaciones habilitadas
        {
          $lookup: {
            from: 'publicaciones',
            localField: 'publicacion',
            foreignField: '_id',
            as: 'publicacionHabilitada',
            pipeline: [{ $match: { habilitada: true } }, { $project: { _id: 1 } }],
          },
        },
        { $unwind: '$publicacionHabilitada' }, // descarta los comentarios cuya publicacion esta dada de baja
        {
          $group: {
            // el dia se calcula en hora argentina: un comentario de las 22:30 cuenta ese dia y no el siguiente
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: OFFSET_ARGENTINA } },
            cantidad: { $sum: 1 },
          },
        },
      ])
      .exec();

    const porDia = new Map(filas.map((fila) => [fila._id, fila.cantidad]));
    const datos = diasDelRango(rango.desde, rango.hasta).map((fecha) => ({ fecha, cantidad: porDia.get(fecha) ?? 0 }));
    return {
      desde: rango.desde,
      hasta: rango.hasta,
      total: datos.reduce((suma, dato) => suma + dato.cantidad, 0),
      datos,
    };
  }

  // grafico 3: cantidad de comentarios que recibio cada publicacion en el periodo (una sola agregacion)
  async comentariosPorPublicacion(consulta: RankingFechasDto): Promise<ComentariosPorPublicacion> {
    const rango = resolverRango(consulta.desde, consulta.hasta);

    const [resultado] = await this.comentarios
      .aggregate<ResultadoRanking<PublicacionConComentarios>>([
        { $match: { createdAt: { $gte: rango.inicio, $lt: rango.finExclusivo } } },
        {
          $lookup: {
            from: 'publicaciones',
            localField: 'publicacion',
            foreignField: '_id',
            as: 'publicacionHabilitada',
            pipeline: [{ $match: { habilitada: true } }, { $project: { titulo: 1 } }],
          },
        },
        { $unwind: '$publicacionHabilitada' }, // descarta los comentarios cuya publicacion esta dada de baja
        {
          $group: {
            _id: '$publicacion',
            titulo: { $first: '$publicacionHabilitada.titulo' },
            cantidad: { $sum: 1 },
          },
        },
        { $sort: { cantidad: -1, _id: 1 } },
        {
          $facet: {
            datos: [
              { $limit: consulta.limit },
              { $project: { _id: 0, publicacionId: { $toString: '$_id' }, titulo: 1, cantidad: 1 } },
            ],
            totales: [{ $group: { _id: null, cantidad: { $sum: '$cantidad' }, elementos: { $sum: 1 } } }],
          },
        },
      ])
      .exec();

    return {
      desde: rango.desde,
      hasta: rango.hasta,
      totalComentarios: resultado.totales[0]?.cantidad ?? 0,
      totalPublicaciones: resultado.totales[0]?.elementos ?? 0,
      datos: resultado.datos,
    };
  }
}