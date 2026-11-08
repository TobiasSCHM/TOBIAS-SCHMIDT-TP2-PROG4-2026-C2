import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

interface EstadoApi {
  estado: string;
  mongo: string;
  fecha: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly http = inject(HttpClient);
  protected readonly estado = signal<EstadoApi | null>(null);
  protected readonly error = signal<string | null>(null);

  constructor() {
    // prueba de punta a punta: front -> backend -> mongo
    this.http.get<EstadoApi>(`${environment.apiUrl}/salud`).subscribe({
      next: (respuesta) => this.estado.set(respuesta),
      error: () => this.error.set('No se pudo conectar con el backend.'),
    });
  }
}