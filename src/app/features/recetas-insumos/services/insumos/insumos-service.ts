import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth-service';
import { UiService } from '../../../../core/ui/services/ui.service';
import { Insumo } from '../../../../interfaces/insumos/insumo.interface';
import { Roles } from '../../../../types/roles';
import { CreateInsumoDto } from '../../../../interfaces/insumos/dto/createInsumo.dto';
import { UpdateInsumoDto } from '../../../../interfaces/insumos/dto/updateInsumo.dto';

@Injectable({
  providedIn: 'root',
})
export class InsumosService {
  private get apiUrl(): string {
    return (window as any).__env?.apiUrl || 'http://localhost:3000';
  }

  private url = `${this.apiUrl}` + '/insumos';
  private http = inject(HttpClient);
  private authServce = inject(AuthService);
  private ui = inject(UiService);

  private readonly __insumos = signal<Insumo[]>([]);
  private readonly __softDeletedInsumos = signal<Insumo[]>([]);
  
  public readonly insumos = this.__insumos.asReadonly();
  public readonly softDeletedInsumos = this.__softDeletedInsumos.asReadonly();
  public readonly isAdmin = computed(() => {
    const user = this.authServce.currentUser();
    return user?.rol === Roles.ADMIN;
  });

  constructor() {
    this.loadInsumos();
    if (this.isAdmin()) {
      this.loadSoftDeletedInsumos();
    }
  }

  loadInsumos() {
    return this.http.get<Insumo[]>(this.url).subscribe({
      next: (data) => {
        this.__insumos.set(data);
      },
      error: (err: HttpErrorResponse) => {
        this.ui.showError('Error al cargar insumos.', err.error.message || 'Error inesperado');
      },
    });
  }

  loadSoftDeletedInsumos() {
    return this.http.get<Insumo[]>(`${this.url}/deleted`).subscribe({
      next: (data) => {
        this.__softDeletedInsumos.set(data);
      },
      error: (err) => {
        this.ui.showError('Error al cargar insumos borrados', err.error.message || 'Error inesperado.');
      }
    });
  }

  createInsumo(createInsumoDto: CreateInsumoDto) {
    return this.http.post<Insumo>(`${this.url}`, createInsumoDto).subscribe({
      next: (data) => {
        this.__insumos.update(insumos => [data, ...insumos]);
        this.ui.showSuccess('Exito', 'Insumo creado exitosamente.')
      },
      error: (err) => {
        this.ui.showError('Error al crear insumo.', err.error.message || 'Error inesperado.');
      }
    });
  }

  updateInsumo(id: string, updateInsumoDto: UpdateInsumoDto) {
    return this.http.patch<Insumo>(`${this.url}/${id}`, updateInsumoDto).subscribe({
      next: (data) => {
        this.__insumos.update(insumos => insumos.filter(i => i.id !== id));
        this.__insumos.update(insumos => [data, ...insumos]);
        this.ui.showSuccess('Exito', 'Insumo actualizado exitosamente.');
      },
      error: (err) => {
        this.ui.showError('Error al actualizar insumo.', err.error.message || 'Error inesperado.');
      }
    });
  }

  async softDeleteInsumo(id: string) {
    const confirmed = await this.ui.showConfirm('Atención', '¿Está seguro de remover el insumo?');
    if (!confirmed) {
      return;
    }
    return this.http.delete(`${this.url}/${id}`).subscribe({
      next: () => {
        const insumo = this.__insumos().find((i) => i.id === id);
        this.__insumos.update(insumos => insumos.filter(i => i.id !== id));
        if (insumo) {
          this.__softDeletedInsumos.update(insumos => [insumo, ...insumos]);
        }
      },
      error: (err) => {
        this.ui.showError('Error al remover insumo', err.error.message || 'Error inesperado.');
      }
    });
  }

  async hardDeleteInsumo(id: string) {
    const confirmed = await this.ui.showConfirm('Atención', '¿Está seguro de eliminar permanentemente el insumo?');
    if (!confirmed) {
      return;
    }
    if (!this.isAdmin()){
      this.ui.showError('Error', 'No tienes los permisos para realizar esta acción.')
      return;
    }
    return this.http.delete(`${this.url}/${id}/hard`).subscribe({
      next: () => {
        const insumo = this.__insumos().find((i) => i.id === id);
        this.__insumos.update(insumos => insumos.filter((i) => i.id !== id));
        if (insumo) {
          this.__softDeletedInsumos.update(insumos => [insumo, ...insumos]);
        }
      },
      error: (err) => {
        this.ui.showError('Error al eliminar definitivamente', err.error.message || 'Error inesperado.');
      },
    });
  }

  async restoreInsumo(id: string) {
    const confirmed = await this.ui.showConfirm('Atención', '¿Está seguro de restaurar el insumo?');
    if (!confirmed) {
      return;
    }
    if (!this.isAdmin()){
      this.ui.showError('Error', 'No tienes los permisos para realizar esta acción.')
      return;
    }
    return this.http.patch<Insumo>(`${this.url}/restore/${id}`, {}).subscribe({
      next: () => {
        const insumo = this.__insumos().find((i) => i.id === id);
        if (insumo) {
          this.__insumos.update(insumos => [insumo, ...insumos]);
        }
        if (this.softDeletedInsumos().length > 0) {
          this.__softDeletedInsumos.update(insumos => insumos.filter((i) => i.id !== id));
        }
      },
      error: (err) => {
        this.ui.showError('Error al restaurar insumo', err.error.message || 'Error inesperado.');
      },
    });
  }
}
