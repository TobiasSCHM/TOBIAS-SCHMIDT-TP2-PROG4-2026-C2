import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import type {
  ComentariosPorDia,
  ComentariosPorPublicacion,
  PublicacionesPorUsuario,
} from './models/estadistica.model';
import type { Periodo } from './periodo';

// sprint 4: datos de los graficos (solo administradores). el token lo agrega el interceptor.
// los datos salen siempre del backend: nada se calcula ni se inventa en el frontend
@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/estadisticas`;

  // GET /estadisticas/publicaciones-por-usuario?desde=&hasta=&limit=
  publicacionesPorUsuario(periodo: Periodo, limit = 10): Observable<PublicacionesPorUsuario> {
    return this.http.get<PublicacionesPorUsuario>(`${this.api}/publicaciones-por-usuario`, {
      params: { desde: periodo.desde, hasta: periodo.hasta, limit },
    });
  }

  // GET /estadisticas/comentarios?desde=&hasta= : comentarios de cada dia del periodo
  comentariosPorDia(periodo: Periodo): Observable<ComentariosPorDia> {
    return this.http.get<ComentariosPorDia>(`${this.api}/comentarios`, {
      params: { desde: periodo.desde, hasta: periodo.hasta },
    });
  }

  // GET /estadisticas/comentarios-por-publicacion?desde=&hasta=&limit=
  comentariosPorPublicacion(periodo: Periodo, limit = 10): Observable<ComentariosPorPublicacion> {
    return this.http.get<ComentariosPorPublicacion>(`${this.api}/comentarios-por-publicacion`, {
      params: { desde: periodo.desde, hasta: periodo.hasta, limit },
    });
  }
}