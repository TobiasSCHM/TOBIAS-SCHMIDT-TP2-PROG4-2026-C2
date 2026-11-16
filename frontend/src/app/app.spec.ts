import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      // la barra usa routerLink: sin un router el componente no se puede crear
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra la marca FireLink en la barra', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compilado = fixture.nativeElement as HTMLElement;
    expect(compilado.querySelector('.nombre')?.textContent).toContain('FireLink');
  });

  it('muestra los enlaces de navegación', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compilado = fixture.nativeElement as HTMLElement;
    const textos = Array.from(compilado.querySelectorAll('nav a')).map((a) => a.textContent?.trim());
    expect(textos).toEqual(['Publicaciones', 'Mi perfil', 'Ingresar', 'Registrarme']);
  });
});