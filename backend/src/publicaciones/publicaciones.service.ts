import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { Model } from 'mongoose';
import { AlmacenamientoService } from '../almacenamiento/almacenamiento.service.js';
import type { ArchivoSubido } from '../almacenamiento/almacenamiento.service.js';
import type { UsuarioDocument } from '../usuarios/usuario.schema.js';
import type { CrearPublicacionDto } from './dto/crear-publicacion.dto.js';
import type { ListarPublicacionesDto } from './dto/listar-publicaciones.dto.js';
import { MeGusta } from './megusta.schema.js';
import { Publicacion } from './publicacion.schema';
import type { PublicacionDocument } from './publicacion.schema';

// datos del autor que viajan junto a cada publicacion (nunca el correo ni la contrasena)
export interface AutorPublico {
  id: string;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  imagenPerfilUrl: string | null;
}

// lo que sale hacia el cliente
export interface PublicacionPublica {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string | null;
  autor: AutorPublico;
  cantidadMeGusta: number;
  // true si el usuario que hace el pedido ya le dio me gusta a esta publicacion
  meGusta: boolean;
  createdAt: Date;
}

// respuesta del listado: la pagina pedida + el total, para que el front pueda armar el paginador
export interface PaginaPublicaciones {
  datos: PublicacionPublica[];
  total: number;
  offset: number;
  limit: number;
}

// respuesta de dar o quitar un me gusta: el estado nuevo, para que el front actualice la tarjeta sin recargar
export interface EstadoMeGusta {
  cantidadMeGusta: number;
  meGusta: boolean;
}

// solo los campos de la publicacion que usa publica(): sirve tanto para un documento completo
// como para uno al que se le reemplazo "autor" por los datos del usuario (populate)
type PublicacionBase = Pick<
  PublicacionDocument,
  'id' | 'titulo' | 'descripcion' | 'imagenUrl' | 'cantidadMeGusta' | 'createdAt'
>;

type AutorResumen = Pick<UsuarioDocument, 'id' | 'nombre' | 'apellido' | 'nombreUsuario' | 'imagenPerfilUrl'>;

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name) private readonly modelo: Model<Publicacion>,
    @InjectModel(MeGusta.name) private readonly meGustas: Model<MeGusta>,
    private readonly almacenamiento: AlmacenamientoService,
  ) {}

  // alta de una publicacion. la imagen es opcional: sin archivo, imagenUrl queda en null
  async crear(dto: CrearPublicacionDto, autor: UsuarioDocument, archivo?: ArchivoSubido): Promise<PublicacionPublica> {
    // los datos ya llegaron validados (ValidationPipe corre antes que el controller): una peticion
    // invalida responde 400 sin haber subido nada a cloudinary
    const imagenUrl = archivo ? await this.almacenamiento.subirImagen(archivo, 'redsocial/publicaciones') : null;

    const publicacion = await this.modelo.create({
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      imagenUrl,
      autor: autor._id,
    });

    // una publicacion recien creada no tiene me gusta de nadie
    return this.publica(publicacion, autor, false);
  }

  // listado paginado. ordena por fecha (por defecto) o por cantidad de me gusta, y puede filtrar por autor.
  // "usuario" es quien hace el pedido: se usa para marcar cuales publicaciones ya tienen su me gusta
  async listar(consulta: ListarPublicacionesDto, usuario: UsuarioDocument): Promise<PaginaPublicaciones> {
    // las dadas de baja (habilitada: false) nunca se listan
    const filtro = {
      habilitada: true,
      ...(consulta.usuario ? { autor: new Types.ObjectId(consulta.usuario) } : {}),
    };

    const orden: Record<string, 1 | -1> =
      consulta.orden === 'meGusta'
        ? { cantidadMeGusta: -1, createdAt: -1, _id: -1 }
        : { createdAt: -1, _id: -1 };
    // la pagina y el total se piden a la vez: no dependen una de la otra
    const [publicaciones, total] = await Promise.all([
      this.modelo
        .find(filtro)
        .sort(orden)
        .skip(consulta.offset)
        .limit(consulta.limit)
        // reemplaza el id guardado en "autor" por los datos del usuario, pidiendo solo los campos publicos
        .populate<{ autor: UsuarioDocument }>('autor', 'nombre apellido nombreUsuario imagenPerfilUrl')
        .exec(),
      this.modelo.countDocuments(filtro).exec(),
    ]);

    // una sola consulta trae los me gusta del usuario sobre TODAS las publicaciones de la pagina
    // (en vez de preguntar publicacion por publicacion)
    const propios = await this.meGustas
      .find({ usuario: usuario._id, publicacion: { $in: publicaciones.map((p) => p._id) } })
      .select('publicacion')
      .exec();
    const idsConMeGusta = new Set(propios.map((m) => m.publicacion.toString()));

    return {
      datos: publicaciones.map((p) => this.publica(p, p.autor, idsConMeGusta.has(p.id))),
      total,
      offset: consulta.offset,
      limit: consulta.limit,
    };
  }

  // dar me gusta. 404 si la publicacion no existe o esta dada de baja, 409 si ya le habia dado me gusta
  async darMeGusta(idPublicacion: string, usuario: UsuarioDocument): Promise<EstadoMeGusta> {
    const publicacion = await this.buscarHabilitada(idPublicacion);

    try {
      await this.meGustas.create({ publicacion: publicacion._id, usuario: usuario._id });
    } catch (error) {
      // 11000: el indice unico (publicacion + usuario) rechazo un me gusta repetido
      if ((error as { code?: number }).code === 11000) {
        throw new ConflictException('Ya le diste Me gusta a esta publicación.');
      }
      throw error;
    }

    return { cantidadMeGusta: await this.ajustarCantidad(publicacion._id, 1), meGusta: true };
  }

  // quitar me gusta. solo se puede si el usuario lo habia dado: si no, 404
  async quitarMeGusta(idPublicacion: string, usuario: UsuarioDocument): Promise<EstadoMeGusta> {
    const publicacion = await this.buscarHabilitada(idPublicacion);

    // findOneAndDelete borra y devuelve el documento borrado (o null si no existia): una sola operacion
    const borrado = await this.meGustas
      .findOneAndDelete({ publicacion: publicacion._id, usuario: usuario._id })
      .exec();
    if (!borrado) throw new NotFoundException('No le habías dado Me gusta a esta publicación.');

    return { cantidadMeGusta: await this.ajustarCantidad(publicacion._id, -1), meGusta: false };
  }

  // baja logica: la publicacion no se borra, queda con habilitada: false. solo el creador o un administrador
  async eliminar(idPublicacion: string, usuario: UsuarioDocument): Promise<void> {
    const publicacion = await this.buscarHabilitada(idPublicacion);

    const esCreador = publicacion.autor.equals(usuario._id);
    const esAdministrador = usuario.perfil === 'administrador';
    if (!esCreador && !esAdministrador) {
      throw new ForbiddenException('Solo el creador o un administrador pueden eliminar esta publicación.');
    }

    publicacion.habilitada = false;
    await publicacion.save();
  }

  // busca una publicacion que exista y no este dada de baja. si no, 404
  private async buscarHabilitada(id: string): Promise<PublicacionDocument> {
    const publicacion = await this.modelo.findOne({ _id: new Types.ObjectId(id), habilitada: true }).exec();
    if (!publicacion) throw new NotFoundException('La publicación no existe.');
    return publicacion;
  }

  // suma o resta en la base con $inc (operacion atomica: dos me gusta simultaneos no se pisan, como pasaria
  // si se leyera el numero, se le sumara 1 y se guardara). devuelve la cantidad actualizada
  private async ajustarCantidad(idPublicacion: Types.ObjectId, delta: 1 | -1): Promise<number> {
    const actualizada = await this.modelo
      .findByIdAndUpdate(idPublicacion, { $inc: { cantidadMeGusta: delta } }, { new: true })
      .select('cantidadMeGusta')
      .exec();
    return actualizada?.cantidadMeGusta ?? 0;
  }

  // arma la respuesta publica de una publicacion junto con los datos resumidos de su autor
  private publica(publicacion: PublicacionBase, autor: AutorResumen, meGusta: boolean): PublicacionPublica {
    return {
      id: publicacion.id,
      titulo: publicacion.titulo,
      descripcion: publicacion.descripcion,
      imagenUrl: publicacion.imagenUrl,
      autor: {
        id: autor.id,
        nombre: autor.nombre,
        apellido: autor.apellido,
        nombreUsuario: autor.nombreUsuario,
        imagenPerfilUrl: autor.imagenPerfilUrl,
      },
      cantidadMeGusta: publicacion.cantidadMeGusta,
      meGusta,
      createdAt: publicacion.createdAt,
    };
  }
}