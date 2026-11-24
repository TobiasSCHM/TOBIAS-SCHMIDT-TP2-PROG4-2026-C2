import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
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
    private readonly tokens: TokenService,
  ) {}

  // registro publico: siempre perfil "usuario". desde el sprint 4 las validaciones y el alta viven en
  // UsuariosService.registrar (las comparte con el alta del administrador). devuelve el token: el usuario queda logueado
  async registrar(dto: RegistroDto, archivo?: ArchivoSubido): Promise<RespuestaAutenticacion> {
    const usuario = await this.usuarios.registrar(dto, archivo);
    return this.respuesta(usuario);
  }

  // login correo o nombre de usuario + contrasena. devuelve ademas el token
  async login(dto: LoginDto): Promise<RespuestaAutenticacion> {
    const usuario = await this.usuarios.buscarParaLogin(dto.identificador);
    // compare hashea lo que escribio el usuario y lo compara con el hash guardado
    const coincide = usuario ? await compare(dto.contrasena, usuario.contrasena) : false;

    // mismo mensaje si el usuario no existe o si la contrasena es incorrecta: no se revela cual de las dos fallo
    if (!usuario || !coincide) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos.');
    }

    // sprint 4: cuenta deshabilitada -> 403 y NO se emite token. se comprueba DESPUES de la contrasena: asi no se
    // le revela a nadie que una cuenta existe y esta deshabilitada sin conocer su contrasena
    if (!usuario.habilitado) {
      throw new ForbiddenException('Tu cuenta está deshabilitada: no estás autorizado a ingresar a FireLink.');
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