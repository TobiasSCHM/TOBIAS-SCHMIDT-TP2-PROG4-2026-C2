// devuelve cuando vence el token jwt, en milisegundos (como Date.now()), o null si no se puede leer.
// un jwt son tres partes separadas por puntos: encabezado.payload.firma. el payload es un json en base64 con "exp"
// (segundos). aca NO se verifica la firma: eso lo hace el backend. solo se lee para programar el aviso de vencimiento
export function vencimientoDelToken(token: string): number | null {
  try {
    const partes = token.split('.');
    if (partes.length !== 3) return null;

    // el payload usa base64 "url" (- y _ en lugar de + y /, sin relleno): se convierte al base64 normal
    const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));

    const { exp } = JSON.parse(json) as { exp?: unknown };
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null; // token mal formado
  }
}