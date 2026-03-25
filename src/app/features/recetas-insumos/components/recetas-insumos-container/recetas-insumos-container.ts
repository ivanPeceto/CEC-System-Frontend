import { Component, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { InsumosManagment } from '../insumos-managment/insumos-managment';
import { RecetasManagment } from '../recetas-managment/recetas-managment';

export enum modules {
  RECETAS = 'recetas',
  INSUMOS = 'insumos'
};

@Component({
  selector: 'app-recetas-insumos-container',
  standalone: true,
  imports: [LucideAngularModule, InsumosManagment, RecetasManagment],
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
    if (this.currentModule() === modules.INSUMOS) {
      this.currentModule.set(modules.RECETAS);
    } else {
      this.currentModule.set(modules.INSUMOS);
    }
  }
}