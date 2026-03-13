import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `
    <div class="flex flex-col items-center justify-center h-full text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
      <h1 class="text-2xl font-bold text-zinc-200">Sección: {{ currentRoute }}</h1>
      <p>El componente real de esta sección aún está en desarrollo... Vuelva en unos dias :P</p>
    </div>
  `,
  styles: [` :host { display: block; height: 100%; } `]
})
export class Placeholder {
  private router = inject(Router);
  get currentRoute() {
    return this.router.url.replace('/', '').toUpperCase();
  }
}