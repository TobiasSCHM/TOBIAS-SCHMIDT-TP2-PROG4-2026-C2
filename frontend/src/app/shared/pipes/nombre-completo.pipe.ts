import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

//nombre, apellido se tranforma en "Nombre Apellido" sirve para usuarios y para los autores de publicaciones y comentarios
@Pipe({ name: 'nombreCompleto' })
export class NombreCompletoPipe implements PipeTransform {
  transform(persona: { nombre?: string | null; apellido?: string | null } | null | undefined): string {
    if (!persona) return '';
    return `${persona.nombre ?? ''} ${persona.apellido ?? ''}`.replace(/\s+/g, ' ').trim();
  }
}