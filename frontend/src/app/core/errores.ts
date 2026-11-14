import { HttpErrorResponse } from '@angular/common/http';

// traduce un error del servidor (o de red) a un mensaje claro para mostrar en un modal
export function mensajeDeError(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'Ocurrió un error inesperado. Probá de nuevo.';

  // status 0: el navegador no pudo comunicarse con el servidor (apagado, sin internet o bloqueado)
  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Si recién se está iniciando, esperá un minuto y probá de nuevo.';
  }
  if (error.status === 413) return 'La imagen supera el tamaño máximo permitido (2 MB).';
  if (error.status === 502) return 'El servicio de imágenes no respondió. Probá de nuevo en unos minutos.';

  // nest responde { statusCode, message: string | string[], error }
  const mensaje = (error.error as { message?: string | string[] } | null)?.message;
  if (Array.isArray(mensaje)) return mensaje.join('\n');
  if (typeof mensaje === 'string' && mensaje.trim() !== '') return mensaje;

  return error.status >= 500 ? 'El servidor tuvo un problema. Probá de nuevo más tarde.' : 'No se pudo completar la acción.';
}