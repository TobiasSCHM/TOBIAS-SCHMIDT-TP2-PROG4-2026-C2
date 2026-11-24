import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Usuario } from './models/usuario.model';

// sprint 4: habla con /usuarios del backend (solo administradores). el token lo agrega el interceptor
@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/usuarios`;

  // GET /usuarios: todos los usuarios, habilitados y deshabilitados
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.api);
  }

  // POST /usuarios (multipart: los mismos campos que el registro + perfil, e "imagenPerfil" opcional)
  crear(datos: FormData): Observable<Usuario> {
    return this.http.post<Usuario>(this.api, datos);
  }

  // DELETE /usuarios/:id (baja logica): responde el usuario actualizado
  deshabilitar(id: string): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.api}/${id}`);
  }

  // POST /usuarios/:id/habilitar (alta logica): responde el usuario actualizado
  habilitar(id: string): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.api}/${id}/habilitar`, {});
  }
}