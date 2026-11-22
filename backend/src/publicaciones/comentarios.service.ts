import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { Model } from 'mongoose';
import type { UsuarioDocument } from '../usuarios/usuario.schema.js';
import { Comentario } from './comentario.schema.js';
import type { ComentarioDocument } from './comentario.schema.js';
import type { CrearComentarioDto } from './dto/crear-comentario.dto.js';
import type { EditarComentarioDto } from './dto/editar-comentario.dto.js';
import type { ListarComentariosDto } from './dto/listar-comentarios.dto.js';
import { PublicacionesService } from './publicaciones.service.js';
import type { AutorPublico } from './publicaciones.service.js';

// lo que sale hacia el cliente
export interface ComentarioPublico {
  id: string;
  mensaje: string;
  autor: AutorPublico;
  // true si el autor lo edito: el front muestra "editado"
  modificado: boolean;
  createdAt: Date;
}

// respuesta del listado: la pagina pedida + el total, para saber si quedan comentarios por traer
export interface PaginaComentarios {
  datos: ComentarioPublico[];
  total: number;
  offset: number;
  limit: number;
}

// solo los campos del comentario que usa publico()
type ComentarioBase = Pick<ComentarioDocument, 'id' | 'mensaje' | 'modificado' | 'createdAt'>;

type AutorResumen = Pick<UsuarioDocument, 'id' | 'nombre' | 'apellido' | 'nombreUsuario' | 'imagenPerfilUrl'>;

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name) private readonly modelo: Model<Comentario>,
    // para comprobar que la publicacion existe y no esta dada de baja
    private readonly publicaciones: PublicacionesService,
  ) {}

  // comentarios de una publicacion, los mas recientes primero. 404 si la publicacion no existe o esta dada de baja
  async listar(idPublicacion: string, consulta: ListarComentariosDto): Promise<PaginaComentarios> {
    const publicacion = await this.publicaciones.buscarHabilitada(idPublicacion);
    const filtro = { publicacion: publicacion._id };

    // la pagina y el total se piden a la vez: no dependen una de la otra
    const [comentarios, total] = await Promise.all([
      this.modelo
        .find(filtro)
        .sort({ createdAt: -1, _id: -1 })
        .skip(consulta.offset)
        .limit(consulta.limit)
        // reemplaza el id guardado en "autor" por los datos del usuario, pidiendo solo los campos publicos
        .populate<{ autor: UsuarioDocument }>('autor', 'nombre apellido nombreUsuario imagenPerfilUrl')
        .exec(),
      this.modelo.countDocuments(filtro).exec(),
    ]);

    return {
      datos: comentarios.map((c) => this.publico(c, c.autor)),
      total,
      offset: consulta.offset,
      limit: consulta.limit,
    };
  }

  // agrega un comentario a la publicacion, a nombre del usuario que hace el pedido
  async crear(idPublicacion: string, dto: CrearComentarioDto, autor: UsuarioDocument): Promise<ComentarioPublico> {
    const publicacion = await this.publicaciones.buscarHabilitada(idPublicacion);

    const comentario = await this.modelo.create({
      publicacion: publicacion._id,
      autor: autor._id,
      mensaje: dto.mensaje,
    });

    return this.publico(comentario, autor);
  }

  // modifica el mensaje de un comentario. solo lo puede hacer quien lo escribio (ni siquiera un administrador)
  async modificar(
    idPublicacion: string,
    idComentario: string,
    dto: EditarComentarioDto,
    usuario: UsuarioDocument,
  ): Promise<ComentarioPublico> {
    const publicacion = await this.publicaciones.buscarHabilitada(idPublicacion);

    // se busca dentro de la publicacion de la ruta: un comentario de otra publicacion tambien da 404
    const comentario = await this.modelo
      .findOne({ _id: new Types.ObjectId(idComentario), publicacion: publicacion._id })
      .exec();
    if (!comentario) throw new NotFoundException('El comentario no existe.');

    if (!comentario.autor.equals(usuario._id)) {
      throw new ForbiddenException('Solo quien escribió el comentario puede editarlo.');
    }

    // si el texto es el mismo no hay nada que cambiar: no se marca como editado
    if (comentario.mensaje !== dto.mensaje) {
      comentario.mensaje = dto.mensaje;
      comentario.modificado = true;
      await comentario.save();
    }

    return this.publico(comentario, usuario);
  }

  // arma la respuesta publica de un comentario junto con los datos resumidos de su autor
  private publico(comentario: ComentarioBase, autor: AutorResumen): ComentarioPublico {
    return {
      id: comentario.id,
      mensaje: comentario.mensaje,
      autor: {
        id: autor.id,
        nombre: autor.nombre,
        apellido: autor.apellido,
        nombreUsuario: autor.nombreUsuario,
        imagenPerfilUrl: autor.imagenPerfilUrl,
      },
      modificado: comentario.modificado,
      createdAt: comentario.createdAt,
    };
  }
}