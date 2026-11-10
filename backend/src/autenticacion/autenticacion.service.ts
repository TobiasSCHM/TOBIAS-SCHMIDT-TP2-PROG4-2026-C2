import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';
import { AlmacenamientoService } from '../almacenamiento/almacenamiento.service.js';
import type { ArchivoSubido } from '../almacenamiento/almacenamiento.service.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import type { UsuarioPublico } from '../usuarios/usuarios.service.js';
import type { LoginDto } from './dto/login.dto.js';
import type { RegistroDto } from './dto/registro.dto.js';

@Injectable()
export class AutenticacionService {
  constructor(
    private readonly usuarios: UsuariosService,
    private readonly almacenamiento: AlmacenamientoService,
  ) {}

  // registro (sprint 1). devuelve el usuario sin la contrasena
  async registrar(dto: RegistroDto, archivo?: ArchivoSubido): Promise<UsuarioPublico> {
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

    return this.usuarios.publico(usuario);
  }

  // login (sprint 1): correo o nombre de usuario + contrasena. devuelve los datos del usuario (sin la contrasena).
  // el token jwt llega en el sprint 3
  async login(dto: LoginDto): Promise<UsuarioPublico> {
    const usuario = await this.usuarios.buscarParaLogin(dto.identificador);
    // compare hashea lo que escribio el usuario y lo compara con el hash guardado
    const coincide = usuario ? await compare(dto.contrasena, usuario.contrasena) : false;

    // mismo mensaje si el usuario no existe o si la contrasena es incorrecta: no se revela cual de las dos fallo
    if (!usuario || !coincide) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }
    return this.usuarios.publico(usuario);
  }
}