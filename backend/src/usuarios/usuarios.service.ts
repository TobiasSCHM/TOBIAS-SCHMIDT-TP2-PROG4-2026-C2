import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
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
  constructor(@InjectModel(Usuario.name) private readonly modelo: Model<Usuario>) {}

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
      });
    } catch (error) {
      throw this.traducirError(error);
    }
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