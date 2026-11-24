import { Directive, ElementRef, input } from '@angular/core';
import { inject } from '@angular/core';

function svg(contenido: string): string {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#7e564b">${contenido}</svg>`)
  );
}

//silueta de usuario (avatar) e icono de imagen (para las imagenes de las publicaciones), con el marron de FireLink
const AVATAR = svg(
  '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>',
);
const IMAGEN = svg(
  '<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>',
);

//<img [src]="url" appImagenRespaldo> (avatar) o appImagenRespaldo="imagen" (imagen de publicacion).
//si la imagen no carga, se muestra la de respaldo en lugar del icono de imagen rota
@Directive({
  selector: 'img[appImagenRespaldo]',
  host: { '(error)': 'alFallar()' },
})
export class ImagenRespaldoDirective {
  readonly appImagenRespaldo = input<'avatar' | 'imagen' | ''>('');
  private readonly imagen = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;

  alFallar(): void {
    const respaldo = this.appImagenRespaldo() === 'imagen' ? IMAGEN : AVATAR;
    //si la que fallo ya es la de respaldo no se vuelve a asignar (evita un bucle de errores)
    if (this.imagen.getAttribute('src') === respaldo) return;
    this.imagen.src = respaldo;
  }
}