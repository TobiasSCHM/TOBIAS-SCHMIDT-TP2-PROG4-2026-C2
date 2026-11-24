import { EtiquetaPerfilPipe } from './etiqueta-perfil.pipe';
import { NombreCompletoPipe } from './nombre-completo.pipe';
import { TiempoRelativoPipe } from './tiempo-relativo.pipe';

describe('TiempoRelativoPipe', () => {
  const pipe = new TiempoRelativoPipe();
  const ahora = Date.parse('2026-11-23T15:00:00Z');
  const hace = (segundos: number) => new Date(ahora - segundos * 1000).toISOString();

  it('muestra "hace instantes" durante el primer minuto', () => {
    expect(pipe.transform(hace(10), ahora)).toBe('hace instantes');
    expect(pipe.transform(hace(59), ahora)).toBe('hace instantes');
  });

  it('muestra minutos, horas y días', () => {
    expect(pipe.transform(hace(60), ahora)).toBe('hace 1 minuto');
    expect(pipe.transform(hace(5 * 60), ahora)).toBe('hace 5 minutos');
    expect(pipe.transform(hace(3600), ahora)).toBe('hace 1 hora');
    expect(pipe.transform(hace(3 * 3600), ahora)).toBe('hace 3 horas');
    expect(pipe.transform(hace(86400), ahora)).toBe('hace 1 día');
    expect(pipe.transform(hace(3 * 86400), ahora)).toBe('hace 3 días');
  });

  it('desde los 7 días muestra la fecha', () => {
    expect(pipe.transform(hace(30 * 86400), ahora)).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('devuelve texto vacío si la fecha falta o es inválida', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform('no es una fecha')).toBe('');
  });
});

describe('NombreCompletoPipe', () => {
  const pipe = new NombreCompletoPipe();

  it('une nombre y apellido sin espacios sobrantes', () => {
    expect(pipe.transform({ nombre: '  Ana ', apellido: 'Pérez  ' })).toBe('Ana Pérez');
  });

  it('tolera datos faltantes', () => {
    expect(pipe.transform({ nombre: 'Ana' })).toBe('Ana');
    expect(pipe.transform(null)).toBe('');
  });
});

describe('EtiquetaPerfilPipe', () => {
  const pipe = new EtiquetaPerfilPipe();

  it('traduce los dos perfiles', () => {
    expect(pipe.transform('administrador')).toBe('Administrador');
    expect(pipe.transform('usuario')).toBe('Usuario');
  });

  it('devuelve texto vacío para cualquier otro valor', () => {
    expect(pipe.transform('otro')).toBe('');
    expect(pipe.transform(null)).toBe('');
  });
});