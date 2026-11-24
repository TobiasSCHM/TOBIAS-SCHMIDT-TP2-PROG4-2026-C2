import { BadRequestException } from '@nestjs/common';

// sprint 4: como se interpretan las fechas de los periodos de las estadisticas
//  - formato AAAA-MM-DD. "desde" y "hasta" se INCLUYEN (el ultimo dia entra completo)
//  - se interpretan en hora de argentina (UTC-3, sin horario de verano), no en la zona del servidor ni la del navegador
//  - el periodo real es [desde 00:00 -03:00, hasta + 1 dia 00:00 -03:00): limite inferior inclusivo y superior exclusivo
//  - si no se mandan: los ultimos 30 dias hasta hoy (hora argentina)
//  - maximo 366 dias
export const OFFSET_ARGENTINA = '-03:00'; // se usa tambien en el $dateToString de las agregaciones
const OFFSET_MS = 3 * 60 * 60 * 1000;
const DIA_MS = 24 * 60 * 60 * 1000;
const MAX_DIAS = 366;
const DIAS_POR_DEFECTO = 30;
const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/;

export interface RangoFechas {
  desde: string; // AAAA-MM-DD, incluido
  hasta: string; // AAAA-MM-DD, incluido
  inicio: Date; // desde 00:00 hora argentina (inclusive)
  finExclusivo: Date; // el dia siguiente a "hasta", 00:00 hora argentina (exclusivo)
}

// true solo si el texto es AAAA-MM-DD Y es una fecha real (rechaza 2026-02-30, 2026-13-01, etc.)
function fechaValida(texto: string): boolean {
  if (!PATRON_FECHA.test(texto)) return false;
  const [anio, mes, dia] = texto.split('-').map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  return fecha.getUTCFullYear() === anio && fecha.getUTCMonth() === mes - 1 && fecha.getUTCDate() === dia;
}

function aTexto(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

// el dia (AAAA-MM-DD) a medianoche UTC, en milisegundos: sirve para contar y recorrer dias sin problemas de zona horaria
function dia(texto: string): number {
  const [anio, mes, d] = texto.split('-').map(Number);
  return Date.UTC(anio, mes - 1, d);
}

// la fecha de hoy en argentina (AAAA-MM-DD)
export function hoyArgentina(ahora: number = Date.now()): string {
  return aTexto(ahora - OFFSET_MS);
}

// valida los parametros y calcula el periodo. lanza 400 si algo no es valido
export function resolverRango(desde?: string, hasta?: string): RangoFechas {
  const hastaFinal = hasta ?? hoyArgentina();
  if (!fechaValida(hastaFinal)) throw new BadRequestException('La fecha "hasta" no es una fecha válida (AAAA-MM-DD).');

  const desdeFinal = desde ?? aTexto(dia(hastaFinal) - (DIAS_POR_DEFECTO - 1) * DIA_MS);
  if (!fechaValida(desdeFinal)) throw new BadRequestException('La fecha "desde" no es una fecha válida (AAAA-MM-DD).');

  const dias = (dia(hastaFinal) - dia(desdeFinal)) / DIA_MS + 1;
  if (dias < 1) throw new BadRequestException('La fecha "desde" no puede ser posterior a "hasta".');
  if (dias > MAX_DIAS) throw new BadRequestException(`El período no puede superar los ${MAX_DIAS} días.`);

  const inicio = new Date(`${desdeFinal}T00:00:00${OFFSET_ARGENTINA}`);
  const finExclusivo = new Date(new Date(`${hastaFinal}T00:00:00${OFFSET_ARGENTINA}`).getTime() + DIA_MS);
  return { desde: desdeFinal, hasta: hastaFinal, inicio, finExclusivo };
}

// todos los dias del periodo (AAAA-MM-DD), de "desde" a "hasta" inclusive: sirve para completar con 0 los dias sin datos
export function diasDelRango(desde: string, hasta: string): string[] {
  const dias: string[] = [];
  for (let ms = dia(desde); ms <= dia(hasta); ms += DIA_MS) dias.push(aTexto(ms));
  return dias;
}