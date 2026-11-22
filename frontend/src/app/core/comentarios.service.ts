import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type { Comentario, PaginaComentarios } from './models/comentario.model';

// habla con los endpoints de comentarios del backend (/publicaciones/:id/comentarios).
// el header de identificacion lo agrega solo el interceptor
@Injectable({ providedIn: 'root' })
export class ComentariosService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/publicaciones`;

  // GET /publicaciones/:id/comentarios?offset=&limit=  (los mas recientes primero)
  listar(idPublicacion: string, offset: number, limit: number): Observable<PaginaComentarios> {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get<PaginaComentarios>(`${this.api}/${idPublicacion}/comentarios`, { params });
  }

  // POST /publicaciones/:id/comentarios
  crear(idPublicacion: string, mensaje: string): Observable<Comentario> {
    return this.http.post<Comentario>(`${this.api}/${idPublicacion}/comentarios`, { mensaje });
  }

  // PUT /publicaciones/:id/comentarios/:comentarioId (solo el autor del comentario)
  modificar(idPublicacion: string, idComentario: string, mensaje: string): Observable<Comentario> {
    return this.http.put<Comentario>(`${this.api}/${idPublicacion}/comentarios/${idComentario}`, { mensaje });
  }
}