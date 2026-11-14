import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// contrasena: al menos 8 caracteres, una mayuscula y un numero (misma regla que el backend)
export const contrasenaFuerte: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = String(control.value ?? '');
  if (valor === '') return null; // el campo vacio lo marca Validators.required
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(valor) ? null : { contrasenaDebil: true };
};

// el control tiene que valer lo mismo que otro control hermano del formulario (ej: repetir contrasena)
export function igualA(nombreOtroControl: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const otro = control.parent?.get(nombreOtroControl);
    if (!otro) return null;
    return control.value === otro.value ? null : { noCoinciden: true };
  };
}

// fecha de hoy en formato aaaa-mm-dd, en hora local (no usa toISOString: devuelve la fecha en utc y puede correrse un dia)
export function fechaDeHoy(): string {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

// la fecha (aaaa-mm-dd) no puede ser posterior a hoy. con este formato, comparar texto equivale a comparar fechas
export const fechaNoFutura: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = String(control.value ?? '');
  if (valor === '') return null;
  return valor > fechaDeHoy() ? { fechaFutura: true } : null;
};

// login: el identificador puede ser un correo o un nombre de usuario (3 a 20 caracteres: letras, numeros o guion bajo)
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PATRON_USUARIO = /^[A-Za-z0-9_]{3,20}$/;

export const correoONombreUsuario: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = String(control.value ?? '').trim();
  if (valor === '') return null; // el campo vacio lo marca Validators.required
  return PATRON_CORREO.test(valor) || PATRON_USUARIO.test(valor) ? null : { identificadorInvalido: true };
};