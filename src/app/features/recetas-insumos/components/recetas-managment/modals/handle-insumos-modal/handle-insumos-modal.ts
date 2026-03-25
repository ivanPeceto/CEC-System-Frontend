import { Component, computed, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsumosService } from '../../../../services/insumos/insumos-service';
import { LucideAngularModule, Search, Plus, Minus, X } from 'lucide-angular';
import { Insumo } from '../../../../../../interfaces/insumos/insumo.interface';

export interface SelectedInsumoData {
  insumo: Insumo;
  cantidad: string;
}

@Component({
  selector: 'app-handle-insumos-modal',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './handle-insumos-modal.html',
  styleUrl: './handle-insumos-modal.css',
})
export class HandleInsumosModal {
  private insumosService = inject(InsumosService);

  insumos = this.insumosService.insumos;
  searchQuery = signal('');

  selectionsMap = signal<Map<string, number>>(new Map());

  @Input() set initialSelection(data: SelectedInsumoData[]) {
    const initialMap = new Map<string, number>();
    data.forEach(item => initialMap.set(item.insumo.id, parseFloat(item.cantidad)));
    this.selectionsMap.set(initialMap);
  }

  @Output() save = new EventEmitter<SelectedInsumoData[]>();
  @Output() close = new EventEmitter<void>();

  filteredInsumos = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.insumos();
    return this.insumos().filter(i => i.nombre.toLowerCase().includes(query));
  });

  getAmount(insumoId: string): number {
    return this.selectionsMap().get(insumoId) || 0;
  }

  private updateAmount(insumoId: string, amount: number) {
    const newMap = new Map(this.selectionsMap());
    if (amount <= 0 || isNaN(amount)) {
      newMap.delete(insumoId);
    } else {
      newMap.set(insumoId, amount);
    }
    this.selectionsMap.set(newMap);
  }

  onAdd(insumo: Insumo) {
    this.updateAmount(insumo.id, this.getAmount(insumo.id) + 1);
  }

  onSubstract(insumo: Insumo) {
    this.updateAmount(insumo.id, this.getAmount(insumo.id) - 1);
  }

  onRemoveAll(insumo: Insumo) {
    this.updateAmount(insumo.id, 0);
  }

  onSetAmount(insumo: Insumo, event: Event) {
    const input = event.target as HTMLInputElement;
    const val = parseFloat(input.value);
    
    if (val >= 0) {
      this.updateAmount(insumo.id, val);
    } else {
      input.value = this.getAmount(insumo.id).toString();
    }
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onSave() {
    const result: SelectedInsumoData[] = [];
    this.selectionsMap().forEach((cantidad, insumoId) => {
      const insumo = this.insumos().find(i => i.id === insumoId);
      if (insumo) {
        result.push({ insumo, cantidad: cantidad.toString() });
      }
    });
    this.save.emit(result);
  }

  onClose() {
    this.close.emit();
  }
}