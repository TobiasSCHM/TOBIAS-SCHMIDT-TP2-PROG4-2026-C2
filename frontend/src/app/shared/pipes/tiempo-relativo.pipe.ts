import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

function dosDigitos(numero: number): string {
  return String(numero).padStart(2, '0');
}

// sprint 4: fecha -> texto relativo ("hace 5 minutos"). desde los 7 dias muestra la fecha dd/mm/aaaa.
// es una pipe pura: el texto no se actualiza solo con el paso del tiempo, se recalcula cuando cambian los datos
@Pipe({ name: 'tiempoRelativo' })
export class TiempoRelativoPipe implements PipeTransform {
  // "ahora" se puede indicar para probar la pipe con una hora fija
  transform(valor: string | Date | null | undefined, ahora: number = Date.now()): string {
    if (!valor) return '';
    const fecha = new Date(valor);
    const ms = fecha.getTime();
    if (Number.isNaN(ms)) return '';

    const segundos = Math.floor((ahora - ms) / 1000);
    if (segundos < 60) return 'hace instantes'; // tambien cubre fechas apenas futuras por diferencia de relojes

    const minutos = Math.floor(segundos / 60);
    if (minutos < 60) return minutos === 1 ? 'hace 1 minuto' : `hace ${minutos} minutos`;

    const horas = Math.floor(minutos / 60);
    if (horas < 24) return horas === 1 ? 'hace 1 hora' : `hace ${horas} horas`;

    const dias = Math.floor(horas / 24);
    if (dias < 7) return dias === 1 ? 'hace 1 día' : `hace ${dias} días`;

    return `${dosDigitos(fecha.getDate())}/${dosDigitos(fecha.getMonth() + 1)}/${fecha.getFullYear()}`;
  }
}