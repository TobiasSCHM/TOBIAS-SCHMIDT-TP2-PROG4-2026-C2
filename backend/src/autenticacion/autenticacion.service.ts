import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { AlmacenamientoService } from '../almacenamiento/almacenamiento.service.js';
import type { ArchivoSubido } from '../almacenamiento/almacenamiento.service.js';
import type { UsuarioDocument } from '../usuarios/usuario.schema.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import type { UsuarioPublico } from '../usuarios/usuarios.service.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegistroDto } from './dto/registro.dto.js';
import { TokenService } from './token.service.js';

// respuesta de registro y login: el token jwt + los datos del usuario (sin la contrasena)
export interface RespuestaAutenticacion {
  token: string;
  usuario: UsuarioPublico;
}

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuarios: UsuariosService,
    private readonly almacenamiento: AlmacenamientoService,
    private readonly tokens: TokenService,
  ) {}

  // registro (sprint 1). desde el sprint 3 tambien devuelve el token: el usuario queda logueado al registrarse
  async registrar(dto: RegistroDto, archivo?: ArchivoSubido): Promise<RespuestaAutenticacion> {
    if (dto.contrasena !== dto.repetirContrasena) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    const fechaNacimiento = new Date(dto.fechaNacimiento);
    if (Number.isNaN(fechaNacimiento.getTime()) || fechaNacimiento.getTime() > Date.now()) {
      throw new BadRequestException('La fecha de nacimiento no es válida.');
    }

    // se revisa si el correo o el usuario ya existen ANTES de subir la imagen: asi un 409 no deja una imagen huerfana
    await this.usuarios.verificarDisponibles(dto.correo, dto.nombreUsuario);

    // la imagen de perfil es opcional: sin archivo, la url queda en null
    const imagenPerfilUrl = archivo ? await this.almacenamiento.subirImagen(archivo, 'redsocial/perfiles') : null;

    // se guarda el hash, nunca la contrasena. bcrypt agrega una sal aleatoria propia a cada hash
    const contrasenaHash = await hash(dto.contrasena, 10);

    const usuario = await this.usuarios.crear({
      nombre: dto.nombre,
      apellido: dto.apellido,
      correo: dto.correo,
      nombreUsuario: dto.nombreUsuario,
      contrasenaHash,
      fechaNacimiento,
      descripcion: dto.descripcion ?? '',
      imagenPerfilUrl,
    });

    return this.respuesta(usuario);
  }

  // login correo o nombre de usuario + contrasena. desde el sprint 3 devuelve ademas el token
  async login(dto: LoginDto): Promise<RespuestaAutenticacion> {
    const usuario = await this.usuarios.buscarParaLogin(dto.identificador);
    // compare hashea lo que escribio el usuario y lo compara con el hash guardado
    const coincide = usuario ? await compare(dto.contrasena, usuario.contrasena) : false;

    // mismo mensaje si el usuario no existe o si la contrasena es incorrecta: no se revela cual de las dos fallo
    if (!usuario || !coincide) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }
    return this.respuesta(usuario);
  }

  autorizar(usuario: UsuarioDocument): UsuarioPublico {
    return this.usuarios.publico(usuario);
  }


  async refrescar(usuario: UsuarioDocument): Promise<{ token: string }> {
    return { token: await this.tokens.generar(usuario) };
  }

  // arma la respuesta de registro y login
  private async respuesta(usuario: UsuarioDocument): Promise<RespuestaAutenticacion> {
    return { token: await this.tokens.generar(usuario), usuario: this.usuarios.publico(usuario) };
  }
}