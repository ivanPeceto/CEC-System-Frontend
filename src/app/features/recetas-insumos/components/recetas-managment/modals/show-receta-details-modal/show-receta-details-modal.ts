import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Receta } from '../../../../../../interfaces/recetas/recetas.interface';

@Component({
  selector: 'app-show-receta-details-modal',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule, 
    CurrencyPipe
  ],
  templateUrl: './show-receta-details-modal.html',
  styleUrl: './show-receta-details-modal.css'
})
export class ShowRecetaDetailsModal {
  receta = signal<Receta | undefined>(undefined);
  isDescriptionExpanded = signal<boolean>(false);

  @Input() set setReceta(r: Receta | undefined) {
    this.receta.set(r);
    this.isDescriptionExpanded.set(false); 
  }

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  toggleDescription() {
    this.isDescriptionExpanded.set(!this.isDescriptionExpanded());
  }

  toNumber(value: string | number): number {
    return Number(value) || 0;
  }
}