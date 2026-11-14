import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Usuario } from './models/usuario.model';

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
  registrar(datos: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.api}/auth/registro`, datos);
  }

  // login: json simple (no hay archivo). el backend responde los datos del usuario, sin la contrasena
  login(credenciales: CredencialesLogin): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.api}/auth/login`, credenciales);
  }
}