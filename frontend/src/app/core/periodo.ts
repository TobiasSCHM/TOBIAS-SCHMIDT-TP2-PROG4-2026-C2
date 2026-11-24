import { fechaDeHoy } from './validators/validadores';

//periodo de una estadistica. fechas aaaa-mm-dd, desde y hasta incluidos, el backend las
// interpreta en hora de argentina
export interface Periodo {
  desde: string;
  hasta: string;
}

export const MAX_DIAS_PERIODO = 366; // el mismo limite que el backend

const DIA_MS = 24 * 60 * 60 * 1000;

// medianoche utc de una fecha aaaa-mm-dd: sirve para contar dias sin problemas de zona horaria
function dia(texto: string): number {
  const [anio, mes, d] = texto.split('-').map(Number);
  return Date.UTC(anio, mes - 1, d);
}

// los ultimos "dias" dias, terminando hoy (incluido)
export function periodoUltimosDias(dias: number): Periodo {
  const hasta = fechaDeHoy();
  return { desde: new Date(dia(hasta) - (dias - 1) * DIA_MS).toISOString().slice(0, 10), hasta };
}

// cantidad de dias del periodo, contando ambos extremos
export function diasDelPeriodo(periodo: Periodo): number {
  return Math.round((dia(periodo.hasta) - dia(periodo.desde)) / DIA_MS) + 1;
}