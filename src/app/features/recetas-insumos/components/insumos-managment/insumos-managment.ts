import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InsumosService } from '../../services/insumos/insumos-service';
import { AuthService } from '../../../../core/auth/services/auth-service';
import { Roles } from '../../../../types/roles';
import { UpdateInsumoDto } from '../../../../interfaces/insumos/dto/updateInsumo.dto';
import { CreateInsumoDto } from '../../../../interfaces/insumos/dto/createInsumo.dto';
import { Insumo } from '../../../../interfaces/insumos/insumo.interface';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-insumos-managment',
  standalone: true,
  imports: [
    LucideAngularModule, 
    ReactiveFormsModule, 
    CommonModule, 
    CurrencyPipe
  ],
  templateUrl: './insumos-managment.html',
  styleUrl: './insumos-managment.css',
})
export class InsumosManagment implements OnInit {
  private fb = inject(FormBuilder);
  private insumosService = inject(InsumosService);
  private authService = inject(AuthService);

  isOnSoftDeletedInsumos = signal<boolean>(false);
  isEditingInsumo = signal<boolean>(false);
  editingInsumoId: string | null = null;

  currentUser = this.authService.currentUser;
  insumos = this.insumosService.insumos;
  softDelInsumos = this.insumosService.softDeletedInsumos;
  searchQuery = signal('');

  @Input() set searchTerm(value: string) {
    this.searchQuery.set(value);
  }

  filteredInsumos = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (
      this.currentUser()?.rol === Roles.ADMIN && 
      this.isOnSoftDeletedInsumos()
    ) {
      if (!query) return this.softDelInsumos();
      return this.softDelInsumos().filter(i => i.nombre.toLowerCase().includes(query));
    } else {
      if (!query) return this.insumos();
      return this.insumos().filter(i => i.nombre.toLowerCase().includes(query));
    }
  });

  insumoForm!: FormGroup;

  ngOnInit(): void {
    this.insumoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      descripcion: [null],
      unidad_medida: ['', Validators.required],
      costo_unidad_medida: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.insumoForm.valid) {
      const formValues = this.insumoForm.value;
      const payload = {
        ...formValues,
        costo_unidad_medida: String(formValues.costo_unidad_medida as number),
      };

      if (this.isEditingInsumo() && typeof this.editingInsumoId === 'string') {
        const dto: UpdateInsumoDto = payload;
        this.insumosService.updateInsumo(this.editingInsumoId, dto);
        this.insumoForm.reset();
        this.cancelEdit();
      } else {
        const dto: CreateInsumoDto = payload;
        this.insumosService.createInsumo(dto);
        this.insumoForm.reset();
      }
    }
  }

  cancelEdit() {
    this.isEditingInsumo.set(false);
    this.editingInsumoId = null;
    this.insumoForm.reset();
  }

  onEdit(insumo: Insumo) {
    this.isEditingInsumo.set(true);
    this.editingInsumoId = insumo.id;

    this.insumoForm.patchValue({
      nombre: insumo.nombre,
      descripcion: insumo.descripcion,
      unidad_medida: insumo.unidad_medida,
      costo_unidad_medida: insumo.costo_unidad_medida,
    });
  }

  async onSoftDelete(i: Insumo): Promise<void> {
    await this.insumosService.softDeleteInsumo(i.id);
  }
  
  async onHardDelete(i: Insumo): Promise<void> {
    await this.insumosService.hardDeleteInsumo(i.id);
  }

  async onRestore(i: Insumo): Promise<void> {
    await this.insumosService.restoreInsumo(i.id);
  }

  onToggleSoftDeleted() {
    this.isOnSoftDeletedInsumos.set(!this.isOnSoftDeletedInsumos());
  }
}

