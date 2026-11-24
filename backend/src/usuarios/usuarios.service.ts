import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs';
import { isObjectIdOrHexString } from 'mongoose';
import type { Model } from 'mongoose';
import { AlmacenamientoService } from '../almacenamiento/almacenamiento.service.js';
import type { ArchivoSubido } from '../almacenamiento/almacenamiento.service.js';
import type { RegistroDto } from '../autenticacion/dto/registro.dto.js';
import { Usuario } from './usuario.schema.js';
import type { Perfil, UsuarioDocument } from './usuario.schema.js';

// datos para crear un usuario (la contrasena ya viene hasheada)
export interface NuevoUsuario {
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  contrasenaHash: string;
  fechaNacimiento: Date;
  descripcion: string;
  imagenPerfilUrl: string | null;
  perfil?: Perfil; // si no se indica, es "usuario"
}

// lo unico que sale hacia el cliente: nunca incluye la contrasena
export interface UsuarioPublico {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: Date;
  descripcion: string;
  imagenPerfilUrl: string | null;
  perfil: Perfil;
  habilitado: boolean;
}

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private readonly modelo: Model<Usuario>,
    private readonly almacenamiento: AlmacenamientoService,
  ) {}

  // sprint 4: unico lugar donde se valida y se da de alta un usuario. lo usan el registro publico
  // (AutenticacionService, perfil "usuario") y el alta del administrador (UsuariosController, con el perfil elegido)
  async registrar(dto: RegistroDto, archivo?: ArchivoSubido, perfil: Perfil = 'usuario'): Promise<UsuarioDocument> {
    if (dto.contrasena !== dto.repetirContrasena) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    const fechaNacimiento = new Date(dto.fechaNacimiento);
    if (Number.isNaN(fechaNacimiento.getTime()) || fechaNacimiento.getTime() > Date.now()) {
      throw new BadRequestException('La fecha de nacimiento no es válida.');
    }

    // se revisa si el correo o el usuario ya existen ANTES de subir la imagen: asi un 409 no deja una imagen huerfana
    await this.verificarDisponibles(dto.correo, dto.nombreUsuario);

    // la imagen de perfil es opcional: sin archivo, la url queda en null
    const imagenPerfilUrl = archivo ? await this.almacenamiento.subirImagen(archivo, 'redsocial/perfiles') : null;

    // se guarda el hash, nunca la contrasena. bcrypt agrega una sal aleatoria propia a cada hash
    const contrasenaHash = await hash(dto.contrasena, 10);

    return this.crear({
      nombre: dto.nombre,
      apellido: dto.apellido,
      correo: dto.correo,
      nombreUsuario: dto.nombreUsuario,
      contrasenaHash,
      fechaNacimiento,
      descripcion: dto.descripcion ?? '',
      imagenPerfilUrl,
      perfil,
    });
  }

  async crear(datos: NuevoUsuario): Promise<UsuarioDocument> {
    try {
      return await this.modelo.create({
        nombre: datos.nombre,
        apellido: datos.apellido,
        correo: datos.correo,
        nombreUsuario: datos.nombreUsuario,
        contrasena: datos.contrasenaHash,
        fechaNacimiento: datos.fechaNacimiento,
        descripcion: datos.descripcion,
        imagenPerfilUrl: datos.imagenPerfilUrl,
        perfil: datos.perfil ?? 'usuario',
      });
    } catch (error) {
      throw this.traducirError(error);
    }
  }

  // sprint 4: todos los usuarios (habilitados y deshabilitados), los mas nuevos primero. la contrasena
  // no sale: el esquema la oculta (select: false) y publico() tampoco la incluye
  async listar(): Promise<UsuarioPublico[]> {
    const usuarios = await this.modelo.find().sort({ createdAt: -1, _id: -1 }).exec();
    return usuarios.map((u) => this.publico(u));
  }

  // sprint 4: baja logica. un administrador no puede deshabilitarse a si mismo (403). 404 si no existe, 409 si ya estaba deshabilitado
  async deshabilitar(id: string, idAdministrador: string): Promise<UsuarioPublico> {
    if (id.toLowerCase() === idAdministrador) {
      throw new ForbiddenException('No podés deshabilitar tu propia cuenta.');
    }
    return this.cambiarEstado(id, false);
  }

  // sprint 4: alta logica. 404 si no existe, 409 si ya estaba habilitado
  habilitar(id: string): Promise<UsuarioPublico> {
    return this.cambiarEstado(id, true);
  }

  // responde 409 si el correo o el nombre de usuario ya existen. se llama ANTES de subir la imagen
  // de perfil, para no dejar imagenes huerfanas. el indice unico de mongo sigue siendo la defensa final
  async verificarDisponibles(correo: string, nombreUsuario: string): Promise<void> {
    const correoNormalizado = correo.trim().toLowerCase();
    const usuarioNormalizado = nombreUsuario.trim().toLowerCase();
    const existente = await this.modelo
      .findOne({ $or: [{ correo: correoNormalizado }, { nombreUsuario: usuarioNormalizado }] })
      .select('correo nombreUsuario')
      .exec();
    if (!existente) return;
    if (existente.correo === correoNormalizado) throw new ConflictException('Ese correo ya está registrado.');
    throw new ConflictException('Ese nombre de usuario ya está en uso.');
  }

  // para el login: acepta correo o nombre de usuario y trae tambien la contrasena hasheada
  // (el esquema la oculta por defecto con select: false)
  buscarParaLogin(identificador: string): Promise<UsuarioDocument | null> {
    const valor = identificador.trim().toLowerCase();
    return this.modelo
      .findOne({ $or: [{ correo: valor }, { nombreUsuario: valor }] })
      .select('+contrasena')
      .exec();
  }

  // sprint 2: busca un usuario por su id. si el texto no tiene forma de id de mongo (24 caracteres hexadecimales)
  // devuelve null directamente: asi findById no lanza un error de conversion (CastError)
  buscarPorId(id: string): Promise<UsuarioDocument | null> {
    if (!isObjectIdOrHexString(id)) return Promise.resolve(null);
    return this.modelo.findById(id).exec();
  }

  publico(usuario: UsuarioDocument): UsuarioPublico {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      nombreUsuario: usuario.nombreUsuario,
      fechaNacimiento: usuario.fechaNacimiento,
      descripcion: usuario.descripcion,
      imagenPerfilUrl: usuario.imagenPerfilUrl,
      perfil: usuario.perfil,
      habilitado: usuario.habilitado,
    };
  }

  // habilita o deshabilita a un usuario. se actualiza con findByIdAndUpdate (solo toca "habilitado")
  private async cambiarEstado(id: string, habilitado: boolean): Promise<UsuarioPublico> {
    const actual = await this.buscarPorId(id);
    if (!actual) throw new NotFoundException('El usuario no existe.');
    if (actual.habilitado === habilitado) {
      throw new ConflictException(habilitado ? 'El usuario ya está habilitado.' : 'El usuario ya está deshabilitado.');
    }

    const actualizado = await this.modelo.findByIdAndUpdate(actual._id, { habilitado }, { new: true }).exec();
    if (!actualizado) throw new NotFoundException('El usuario no existe.');
    return this.publico(actualizado);
  }

  // mongo responde con el codigo 11000 cuando se viola un indice unico (correo o nombre de usuario repetido)
  private traducirError(error: unknown): unknown {
    const e = error as { code?: number; keyPattern?: Record<string, number> };
    if (e?.code === 11000) {
      if (e.keyPattern && 'correo' in e.keyPattern) return new ConflictException('Ese correo ya está registrado.');
      if (e.keyPattern && 'nombreUsuario' in e.keyPattern) return new ConflictException('Ese nombre de usuario ya está en uso.');
      return new ConflictException('El usuario ya existe.');
    }
    return error;
  }
}