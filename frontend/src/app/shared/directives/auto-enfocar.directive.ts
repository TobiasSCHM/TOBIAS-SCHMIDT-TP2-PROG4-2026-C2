import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

// sprint 4: <textarea appAutoEnfocar> -> el campo recibe el foco apenas aparece en pantalla.
// en un textarea con texto (por ejemplo al editar un comentario) el cursor queda al final
@Directive({ selector: '[appAutoEnfocar]' })
export class AutoEnfocarDirective {
  constructor() {
    const elemento = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    // despues del primer render: ahi ya esta el valor del formulario y el elemento es visible
    afterNextRender(() => {
      elemento.focus();
      if (elemento instanceof HTMLTextAreaElement) elemento.setSelectionRange(elemento.value.length, elemento.value.length);
    });
  }
}