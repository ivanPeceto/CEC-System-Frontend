import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { RecetasService } from '../../../../services/recetas/recetas-service';
import { Receta } from '../../../../../../interfaces/recetas/recetas.interface';

export interface SelectedRecetaData {
  subreceta: Receta;
  cantidad: string;
}

@Component({
  selector: 'app-handle-subrecetas-modal',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './handle-subrecetas-modal.html',
  styleUrl: './handle-subrecetas-modal.css',
})
export class HandleSubrecetasModal {
  private recetasService = inject(RecetasService);

  recetas = this.recetasService.recetas;
  searchQuery = signal('');

  selectionsMap = signal<Map<string, number>>(new Map());

  @Input() set initialSelection(data: SelectedRecetaData[]) {
    const initialMap = new Map<string, number>();
    data.forEach(i => initialMap.set(i.subreceta.id, parseFloat(i.cantidad)));
    this.selectionsMap.set(initialMap);
  }

  @Output() save = new EventEmitter<SelectedRecetaData[]>();
  @Output() close = new EventEmitter<void>();

  filteredRecetas = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.recetas();
    return this.recetas().filter(r => r.nombre.toLowerCase().includes(query));
  });

  getAmount(recetaId: string): number {
    return this.selectionsMap().get(recetaId) || 0;
  }

  private updateAmount(recetaId: string, amount: number) {
    const newMap = new Map(this.selectionsMap());
    if (amount <= 0 || isNaN(amount)) {
      newMap.delete(recetaId);
    } else {
      newMap.set(recetaId, amount);
    }
    this.selectionsMap.set(newMap);
  }

  onAdd(receta: Receta) {
    this.updateAmount(receta.id, this.getAmount(receta.id) + 1);
  }

  onSubstract(receta: Receta) {
    this.updateAmount(receta.id, this.getAmount(receta.id) - 1);
  }

  onRemoveAll(receta: Receta) {
    this.updateAmount(receta.id, 0);
  }

  onSetAmount(receta: Receta, event: Event) {
    const input = event.target as HTMLInputElement;
    const val = parseFloat(input.value);
    
    if (val >= 0) {
      this.updateAmount(receta.id, val);
    } else {
      input.value = this.getAmount(receta.id).toString();
    }
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onSave() {
    const result: SelectedRecetaData[] = [];
    this.selectionsMap().forEach((cantidad, recetaId) => {
      const receta = this.recetas().find(i => i.id === recetaId);
      if (receta) {
        result.push({ subreceta: receta, cantidad: cantidad.toString() });
      }
    });
    this.save.emit(result);
  }

  onClose() {
    this.close.emit();
  }
}
