import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import type { ChartConfiguration } from 'chart.js';
import { firstValueFrom } from 'rxjs';
import type { Observable } from 'rxjs';
import { mensajeDeError } from '../../core/errores';
import { EstadisticasService } from '../../core/estadisticas.service';
import type {
  ComentariosPorDia,
  ComentariosPorPublicacion,
  PublicacionesPorUsuario,
} from '../../core/models/estadistica.model';
import { periodoUltimosDias } from '../../core/periodo';
import type { Periodo } from '../../core/periodo';
import { Grafico } from '../../shared/grafico/grafico';
import { SelectorPeriodo } from '../../shared/selector-periodo/selector-periodo';

// colores de la paleta de FireLink (los de la dona y las barras)
const COLORES = ['#cd7c24', '#7e564b', '#402e32', '#e0a45e', '#a67a6d', '#b9663a', '#cdb8ae', '#8a6a3a', '#d9b99b', '#5e3b33'];

// una consulta de estadistica: su periodo, sus datos y su estado. cada grafico tiene la suya, asi cada uno
// puede cambiar de periodo sin afectar a los demas
class Consulta<T> {
  readonly periodo = signal<Periodo>(periodoUltimosDias(30));
  readonly datos = signal<T | null>(null);
  readonly cargando = signal(false);
  readonly error = signal<string | null>(null);
  private pedido = 0; // si se pide otro periodo antes de que llegue la respuesta anterior, se descarta la vieja

  constructor(private readonly pedir: (periodo: Periodo) => Observable<T>) {}

  async cargar(): Promise<void> {
    const mio = ++this.pedido;
    this.cargando.set(true);
    this.error.set(null);
    try {
      const respuesta = await firstValueFrom(this.pedir(this.periodo()));
      if (mio === this.pedido) this.datos.set(respuesta);
    } catch (error) {
      if (mio === this.pedido) this.error.set(mensajeDeError(error));
    } finally {
      if (mio === this.pedido) this.cargando.set(false);
    }
  }

  cambiarPeriodo(periodo: Periodo): void {
    this.periodo.set(periodo);
    void this.cargar();
  }
}

// aaaa-mm-dd -> dd/mm
function diaYMes(fecha: string): string {
  return `${fecha.slice(8, 10)}/${fecha.slice(5, 7)}`;
}

// aaaa-mm-dd -> dd/mm/aaaa
function fechaCompleta(fecha: string): string {
  return `${diaYMes(fecha)}/${fecha.slice(0, 4)}`;
}

function recortar(texto: string, maximo = 28): string {
  return texto.length > maximo ? `${texto.slice(0, maximo - 1)}…` : texto;
}

// sprint 4: estadisticas (solo administradores). tres graficos de tipos distintos, cada uno con su periodo.
// los datos vienen del backend (/estadisticas/*), que tambien valida que el token sea de un administrador
@Component({
  selector: 'app-dashboard-estadisticas',
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, Grafico, SelectorPeriodo],
  templateUrl: './dashboard-estadisticas.html',
  styleUrl: './dashboard-estadisticas.css',
})
export class DashboardEstadisticas {
  private readonly api = inject(EstadisticasService);

  protected readonly porUsuario = new Consulta<PublicacionesPorUsuario>((p) => this.api.publicacionesPorUsuario(p));
  protected readonly porDia = new Consulta<ComentariosPorDia>((p) => this.api.comentariosPorDia(p));
  protected readonly porPublicacion = new Consulta<ComentariosPorPublicacion>((p) => this.api.comentariosPorPublicacion(p));

  // grafico 1: publicaciones por usuario -> DONA (null = no hay datos en el periodo)
  protected readonly graficoPorUsuario = computed<ChartConfiguration<'doughnut', number[], string> | null>(() => {
    const respuesta = this.porUsuario.datos();
    if (!respuesta || respuesta.datos.length === 0) return null;
    return {
      type: 'doughnut',
      data: {
        labels: respuesta.datos.map((d) => (d.nombreUsuario ? `@${d.nombreUsuario}` : 'Usuario desconocido')),
        datasets: [
          {
            label: 'Publicaciones',
            data: respuesta.datos.map((d) => d.cantidad),
            backgroundColor: respuesta.datos.map((_, i) => COLORES[i % COLORES.length]),
            borderColor: '#fffdfa',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: { legend: { position: 'bottom' } },
      },
    };
  });

  // grafico 2: comentarios por dia -> LINEA
  protected readonly graficoPorDia = computed<ChartConfiguration<'line', number[], string> | null>(() => {
    const respuesta = this.porDia.datos();
    if (!respuesta || respuesta.total === 0) return null; // todos los dias en 0 = sin datos
    const fechas = respuesta.datos.map((d) => d.fecha);
    return {
      type: 'line',
      data: {
        labels: fechas.map(diaYMes),
        datasets: [
          {
            label: 'Comentarios',
            data: respuesta.datos.map((d) => d.cantidad),
            borderColor: '#cd7c24',
            backgroundColor: 'rgba(205, 124, 36, 0.2)',
            fill: true,
            tension: 0.3,
            pointRadius: fechas.length <= 31 ? 3 : 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          // el eje muestra dd/mm; al pasar el mouse se ve la fecha completa
          tooltip: { callbacks: { title: (items) => fechaCompleta(fechas[items[0].dataIndex]) } },
        },
        scales: {
          x: { ticks: { maxRotation: 0, autoSkip: true } },
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
      },
    };
  });

  // grafico 3: comentarios por publicacion -> BARRAS HORIZONTALES
  protected readonly graficoPorPublicacion = computed<ChartConfiguration<'bar', number[], string> | null>(() => {
    const respuesta = this.porPublicacion.datos();
    if (!respuesta || respuesta.datos.length === 0) return null;
    return {
      type: 'bar',
      data: {
        labels: respuesta.datos.map((d) => recortar(d.titulo)),
        datasets: [
          {
            label: 'Comentarios',
            data: respuesta.datos.map((d) => d.cantidad),
            backgroundColor: '#7e564b',
            borderColor: '#402e32',
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          // el titulo se recorta en el eje; al pasar el mouse se ve completo
          tooltip: { callbacks: { title: (items) => respuesta.datos[items[0].dataIndex].titulo } },
        },
        scales: { x: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    };
  });

  constructor() {
    // los tres graficos se piden a la vez al entrar (cada uno con su periodo por defecto: ultimos 30 dias)
    void this.porUsuario.cargar();
    void this.porDia.cargar();
    void this.porPublicacion.cargar();
  }
}