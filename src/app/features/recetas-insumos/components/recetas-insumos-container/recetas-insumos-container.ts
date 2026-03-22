import { Component, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { InsumosManagment } from '../insumos-managment/insumos-managment';

export enum modules {
  RECETAS = 'recetas',
  INSUMOS = 'insumos'
};

@Component({
  selector: 'app-recetas-insumos-container',
  standalone: true,
  imports: [LucideAngularModule, InsumosManagment],
  templateUrl: './recetas-insumos-container.html',
  styleUrl: './recetas-insumos-container.css',
})
export class RecetasInsumosContainer {

  currentModule = signal<modules>(modules.INSUMOS);
  searchQuery = signal('');

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onChangeCurrentModule() {
    return;
  }
}