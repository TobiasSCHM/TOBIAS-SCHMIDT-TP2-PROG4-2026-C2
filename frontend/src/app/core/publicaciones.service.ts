import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type {
  ConsultaPublicaciones, EstadoMeGusta, PaginaPublicaciones, Publicacion,
} from './models/publicacion.model';

// habla con los endpoints de /publicaciones del backend. el header de identificacion
// lo agrega solo el interceptor: aca no hace falta pasar el usuario
@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/publicaciones`;

  // GET /publicaciones?orden=&usuario=&offset=&limit=  (todos opcionales)
  listar(consulta: ConsultaPublicaciones = {}): Observable<PaginaPublicaciones> {
    let params = new HttpParams();
    if (consulta.orden) params = params.set('orden', consulta.orden);
    if (consulta.usuario) params = params.set('usuario', consulta.usuario);
    if (consulta.offset !== undefined) params = params.set('offset', consulta.offset);
    if (consulta.limit !== undefined) params = params.set('limit', consulta.limit);
    return this.http.get<PaginaPublicaciones>(this.api, { params });
  }

  // GET /publicaciones/:id (una sola publicacion, para su pagina)
  obtener(id: string): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.api}/${id}`);
  }

  // POST /publicaciones (multipart: titulo, descripcion y, opcional, el archivo "imagen")
  crear(datos: FormData): Observable<Publicacion> {
    return this.http.post<Publicacion>(this.api, datos);
  }

  // POST /publicaciones/:id/me-gusta
  darMeGusta(id: string): Observable<EstadoMeGusta> {
    return this.http.post<EstadoMeGusta>(`${this.api}/${id}/me-gusta`, {});
  }

  // DELETE /publicaciones/:id/me-gusta
  quitarMeGusta(id: string): Observable<EstadoMeGusta> {
    return this.http.delete<EstadoMeGusta>(`${this.api}/${id}/me-gusta`);
  }

  // DELETE /publicaciones/:id (baja logica: el backend responde 204 sin contenido)
  eliminar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}