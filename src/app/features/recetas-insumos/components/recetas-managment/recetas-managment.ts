import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { RecetasService } from '../../services/recetas/recetas-service';
import { AuthService } from '../../../../core/auth/services/auth-service';
import { Roles } from '../../../../types/roles';
import { UpdateRecetaDto } from '../../../../interfaces/recetas/dto/updateReceta.dto';
import { CreateRecetaDto } from '../../../../interfaces/recetas/dto/createReceta.dto';
import { Receta } from '../../../../interfaces/recetas/recetas.interface';
import { HandleInsumosModal, SelectedInsumoData } from './modals/handle-insumos-modal/handle-insumos-modal';
import { CreateRecetaInsumoDto } from '../../../../interfaces/recetas/recetaInsumo/dto/createRecetaInsumo.dto';
import { HandleSubrecetasModal, SelectedRecetaData } from './modals/handle-subrecetas-modal/handle-subrecetas-modal';
import { CreateRecetaSubrecetaDto } from '../../../../interfaces/recetas/recetaSubreceta/dto/createRecetaSubreceta.dto';

@Component({
  selector: 'app-recetas-managment',
  standalone: true,
  imports: [
    LucideAngularModule,
    ReactiveFormsModule,
    CommonModule,
    CurrencyPipe,
    HandleInsumosModal,
    HandleSubrecetasModal,
  ],
  templateUrl: './recetas-managment.html',
  styleUrl: './recetas-managment.css',
})
export class RecetasManagment implements OnInit{
  private fb = inject(FormBuilder);
  private recetasService = inject(RecetasService);
  private authService = inject(AuthService);

  isOnSoftDeletedRecetas = signal<boolean>(false);
  isEditingreceta = signal<boolean>(false);
  subrecetasAmount = signal<number>(0);
  insumosAmount = signal<number>(0);
  editingRecetaId: string | null = null;

  showInsumosModal = signal<boolean>(false);
  selectedInsumos = signal<SelectedInsumoData[]>([]);
  showSubrecetasModal = signal<boolean>(false);
  selectedSubrecetas = signal<SelectedRecetaData[]>([]);

  currentUser = this.authService.currentUser;
  recetas = this.recetasService.recetas;
  softDelRecetas = this.recetasService.softDeletedRecetas;
  searchQuery = signal('');

  @Input() set searchTerm(value: string) {
    this.searchQuery.set(value);
  }

  filteredrecetas = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (
      this.currentUser()?.rol === Roles.ADMIN && 
      this.isOnSoftDeletedRecetas()
    ) {
      if (!query) return this.softDelRecetas();
      return this.softDelRecetas().filter(r => r.nombre.toLowerCase().includes(query));
    } else {
      if (!query) return this.recetas();
      return this.recetas().filter(r => r.nombre.toLowerCase().includes(query));
    }
  });

  recetaForm!: FormGroup;

  ngOnInit(): void {
    this.recetaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [null],
      unidad_medida: ['', Validators.required],
      unidades_por_receta: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.recetaForm.valid) {
      const formValues = this.recetaForm.value;

      const insumosDto: CreateRecetaInsumoDto[] = this.selectedInsumos().map(i => ({
        insumo: i.insumo.id,
        cantidad: i.cantidad,
      }));

      const subrecetasDto: CreateRecetaSubrecetaDto[] = this.selectedSubrecetas().map(r => ({
        subreceta: r.subreceta.id,
        cantidad: r.cantidad,
      }));

      const payload = {
        ...formValues,
        unidades_por_receta: String(formValues.unidades_por_receta as number),
        insumos: insumosDto,
        subrecetas: subrecetasDto,
      };

      if (this.isEditingreceta() && typeof this.editingRecetaId === 'string') {
        const dto: UpdateRecetaDto = payload;
        this.recetasService.updateReceta(this.editingRecetaId, dto);
        this.recetaForm.reset();
        this.cancelEdit();
      } else {
        const dto: CreateRecetaDto = payload;
        this.recetasService.createReceta(dto);
        this.recetaForm.reset();
        this.selectedInsumos.set([]);
        this.selectedSubrecetas.set([]);
      }
    }
  }

  cancelEdit() {
    this.isEditingreceta.set(false);
    this.editingRecetaId = null;
    this.recetaForm.reset();
    this.selectedInsumos.set([]);
    this.selectedSubrecetas.set([]);
  }

  onEdit(receta: Receta) {
    this.isEditingreceta.set(true);
    this.editingRecetaId = receta.id;

    this.recetaForm.patchValue({
      nombre: receta.nombre,
      descripcion: receta.descripcion,
      unidad_medida: receta.unidad_medida,
      unidades_por_receta: receta.unidades_por_receta,
    });

    if(receta.insumos) {
      const mappedInsumos: SelectedInsumoData[] = receta.insumos.map(ri => ({
        insumo: ri.insumo,
        cantidad: ri.cantidad,
      }));
      this.selectedInsumos.set(mappedInsumos);
    }
    if(receta.subrecetas) {
      const mappedSubrecetas: SelectedRecetaData[] = receta.subrecetas.map(ri => ({
        subreceta: ri.subreceta,
        cantidad: ri.cantidad,
      }));
      this.selectedSubrecetas.set(mappedSubrecetas);
    }
  }

  async onSoftDelete(r: Receta): Promise<void> {
    await this.recetasService.softDeleteReceta(r.id);
  }
  
  async onHardDelete(r: Receta): Promise<void> {
    await this.recetasService.hardDeleteReceta(r.id);
  }

  async onRestore(r: Receta): Promise<void> {
    await this.recetasService.restoreReceta(r.id);
  }

  onToggleSoftDeleted() {
    this.isOnSoftDeletedRecetas.set(!this.isOnSoftDeletedRecetas());
  }

  onOpenInsumosModal() {
    this.showInsumosModal.set(true);
  }

  onSaveInsumos(insumosGuardados: SelectedInsumoData[]) {
    this.selectedInsumos.set(insumosGuardados);
    this.showInsumosModal.set(false);
  }

  onCloseInsumosModal() {
    this.showInsumosModal.set(false);
  }

  onOpenSubrecetasModal() {
    this.showSubrecetasModal.set(true);
  }

  onSaveSubrecetas(recetasGuardadas: SelectedRecetaData[]) {
    this.selectedSubrecetas.set(recetasGuardadas);
    this.showSubrecetasModal.set(false);
  }

  onCloseSubrecetasModal() {
    this.showSubrecetasModal.set(false);
  }
}
