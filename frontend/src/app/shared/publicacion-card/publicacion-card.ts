import { DatePipe } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import type { Publicacion } from '../../core/models/publicacion.model';

// una publicacion. es un componente "de presentacion": recibe los datos y avisa lo que hace el usuario
// (me gusta, eliminar) mediante eventos. no llama al backend: eso lo decide la pantalla que lo usa
@Component({
  selector: 'app-publicacion-card',
  imports: [DatePipe, RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.css',
})
export class PublicacionCard {
  // entradas
  readonly publicacion = input.required<Publicacion>();
  readonly esPropia = input(false); // si es del usuario logueado: habilita el boton de eliminar
  readonly ocupada = input(false); // mientras se procesa un me gusta, el boton se deshabilita
  readonly conEnlace = input(true); // muestra el boton "Comentarios", que lleva a la pagina de la publicacion
  readonly grande = input(false); // version agrandada, para la pagina de la publicacion

  // salidas
  readonly alternarMeGusta = output<Publicacion>();
  readonly eliminar = output<Publicacion>();

  protected readonly nombreAutor = computed(() => {
    const autor = this.publicacion().autor;
    return `${autor.nombre} ${autor.apellido}`;
  });
}