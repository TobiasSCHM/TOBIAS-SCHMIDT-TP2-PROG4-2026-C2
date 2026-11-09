import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import type { UsuarioPublico } from '../usuarios/usuarios.service.js';
import type { RegistroDto } from './dto/registro.dto.js';

@Injectable()
export class AutenticacionService {
  constructor(private readonly usuarios: UsuariosService) {}

  // registro (sprint 1). devuelve el usuario sin la contrasena
  async registrar(dto: RegistroDto): Promise<UsuarioPublico> {
    if (dto.contrasena !== dto.repetirContrasena) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    const fechaNacimiento = new Date(dto.fechaNacimiento);
    if (Number.isNaN(fechaNacimiento.getTime()) || fechaNacimiento.getTime() > Date.now()) {
      throw new BadRequestException('La fecha de nacimiento no es válida.');
    }

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
      imagenPerfilUrl: null, // la imagen de perfil se agrega en la proxima sesion
    });

    return this.usuarios.publico(usuario);
  }
}