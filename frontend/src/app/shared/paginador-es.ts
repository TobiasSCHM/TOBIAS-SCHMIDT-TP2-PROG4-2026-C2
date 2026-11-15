import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

// textos del paginador de angular material en español
@Injectable()
export class PaginadorEs extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Por página:';
  override firstPageLabel = 'Primera página';
  override previousPageLabel = 'Página anterior';
  override nextPageLabel = 'Página siguiente';
  override lastPageLabel = 'Última página';

  override getRangeLabel = (pagina: number, tamanio: number, total: number): string => {
    if (total === 0) return '0 de 0';
    const inicio = pagina * tamanio;
    const fin = Math.min(inicio + tamanio, total);
    return `${inicio + 1} – ${fin} de ${total}`;
  };
}