import { Component, effect, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { ValidatorFn } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAX_DIAS_PERIODO, diasDelPeriodo, periodoUltimosDias } from '../../core/periodo';
import type { Periodo } from '../../core/periodo';
import { fechaDeHoy, fechaNoFutura } from '../../core/validators/validadores';

// "desde" no puede ser posterior a "hasta" y el periodo no puede superar el maximo que acepta el backend
const rangoValido: ValidatorFn = (grupo) => {
  const desde = String(grupo.get('desde')?.value ?? '');
  const hasta = String(grupo.get('hasta')?.value ?? '');
  if (!desde || !hasta) return null;
  if (desde > hasta) return { orden: true }; // con este formato, comparar texto equivale a comparar fechas
  if (diasDelPeriodo({ desde, hasta }) > MAX_DIAS_PERIODO) return { largo: true };
  return null;
};

// sprint 4: elige el periodo de una estadistica (dos fechas y atajos de ultimos dias).
// solo avisa con periodoChange cuando el periodo es valido y distinto del actual
@Component({
  selector: 'app-selector-periodo',
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './selector-periodo.html',
  styleUrl: './selector-periodo.css',
})
export class SelectorPeriodo {
  readonly periodo = input.required<Periodo>();
  readonly periodoChange = output<Periodo>();

  protected readonly hoy = fechaDeHoy();
  protected readonly atajos = [7, 30, 90];

  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly form = this.fb.group(
    {
      desde: ['', [Validators.required, fechaNoFutura]],
      hasta: ['', [Validators.required, fechaNoFutura]],
    },
    { validators: [rangoValido] },
  );

  constructor() {
    // el periodo vigente lo maneja quien usa este componente: el formulario siempre lo refleja
    effect(() => this.form.setValue({ ...this.periodo() }, { emitEvent: false }));

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (this.form.invalid) return; // el motivo se muestra con mensajeError()
      const nuevo = this.form.getRawValue();
      const actual = this.periodo();
      if (nuevo.desde === actual.desde && nuevo.hasta === actual.hasta) return;
      this.periodoChange.emit(nuevo);
    });
  }

  protected elegirUltimos(dias: number): void {
    this.form.setValue(periodoUltimosDias(dias)); // dispara valueChanges, que avisa el cambio
  }

  protected mensajeError(): string {
    const { desde, hasta } = this.form.controls;
    if (desde.hasError('required') || hasta.hasError('required')) return 'Completá las dos fechas del período.';
    if (desde.hasError('fechaFutura') || hasta.hasError('fechaFutura')) return 'Las fechas no pueden ser futuras.';
    if (this.form.hasError('orden')) return 'La fecha "desde" no puede ser posterior a "hasta".';
    if (this.form.hasError('largo')) return `El período no puede superar los ${MAX_DIAS_PERIODO} días.`;
    return '';
  }
}