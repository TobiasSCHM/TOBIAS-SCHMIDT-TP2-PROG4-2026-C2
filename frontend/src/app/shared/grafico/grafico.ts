import { Component, DestroyRef, ElementRef, effect, inject, input, viewChild } from '@angular/core';
import {
  ArcElement, BarController, BarElement, CategoryScale, Chart, DoughnutController, Filler, Legend,
  LinearScale, LineController, LineElement, PointElement, Tooltip,
} from 'chart.js';
import type { ChartConfiguration } from 'chart.js';

// se registra solo lo que usan los 3 graficos (torta/dona, linea y barras): asi el paquete pesa menos
Chart.register(
  ArcElement, BarController, BarElement, CategoryScale, DoughnutController, Filler, Legend,
  LinearScale, LineController, LineElement, PointElement, Tooltip,
);
Chart.defaults.color = '#402e32'; // el color de texto de FireLink

// sprint 4: dibuja un grafico de chart.js con la configuracion que recibe. cada vez que cambia la configuracion
// (por ejemplo al elegir otro periodo) se vuelve a dibujar, y al salir de la pantalla se libera
@Component({
  selector: 'app-grafico',
  template: `<div class="lienzo"><canvas #lienzo role="img" [attr.aria-label]="descripcion()"></canvas></div>`,
  styles: `.lienzo { position: relative; width: 100%; height: 340px; }`,
})
export class Grafico {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly configuracion = input.required<ChartConfiguration<any, any, any>>();
  readonly descripcion = input('Gráfico de estadísticas'); // texto para lectores de pantalla

  private readonly lienzo = viewChild<ElementRef<HTMLCanvasElement>>('lienzo');
  private grafico: Chart | null = null;

  constructor() {
    effect(() => {
      const canvas = this.lienzo()?.nativeElement;
      const configuracion = this.configuracion();
      if (!canvas) return;
      this.grafico?.destroy();
      this.grafico = new Chart(canvas, configuracion);
    });
    inject(DestroyRef).onDestroy(() => this.grafico?.destroy());
  }
}