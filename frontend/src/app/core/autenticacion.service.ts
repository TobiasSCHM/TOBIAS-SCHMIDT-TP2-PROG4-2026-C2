import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { RespuestaAutenticacion, Usuario } from './models/usuario.model';

export interface CredencialesLogin {
  identificador: string; // correo o nombre de usuario
  contrasena: string;
}

@Injectable({ providedIn: 'root' })
export class AutenticacionService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  // multipart/form-data: campos de texto + el archivo "imagenPerfil".
  // no se fija el content-type a mano: el navegador agrega el boundary que el servidor necesita para leer el archivo
  registrar(datos: FormData): Observable<RespuestaAutenticacion> {
    return this.http.post<RespuestaAutenticacion>(`${this.api}/auth/registro`, datos);
  }

  // login: json simple (no hay archivo). el backend responde el token y los datos del usuario, sin la contrasena
  login(credenciales: CredencialesLogin): Observable<RespuestaAutenticacion> {
    return this.http.post<RespuestaAutenticacion>(`${this.api}/auth/login`, credenciales);
  }

  // pregunta al backend si el token guardado sigue siendo valido (el interceptor agrega el header).
  // 200 con los datos actuales del usuario, o 401 si el token no sirve o vencio
  autorizar(): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.api}/auth/autorizar`, {});
  }
}