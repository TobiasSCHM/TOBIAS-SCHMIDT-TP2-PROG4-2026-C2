import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

//"usuario" o "administrador" se transforma "Usuario" | "Administrador" (cualquier otro valor: texto vacio)
@Pipe({ name: 'etiquetaPerfil' })
export class EtiquetaPerfilPipe implements PipeTransform {
  transform(perfil: string | null | undefined): string {
    if (perfil === 'administrador') return 'Administrador';
    if (perfil === 'usuario') return 'Usuario';
    return '';
  }
}