import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth-service';
import { UiService } from '../../../../core/ui/services/ui.service';
import { Roles } from '../../../../types/roles';
import { Receta } from '../../../../interfaces/recetas/recetas.interface';
import { CreateRecetaDto } from '../../../../interfaces/recetas/dto/createReceta.dto';
import { UpdateRecetaDto } from '../../../../interfaces/recetas/dto/updateReceta.dto';

@Injectable({
  providedIn: 'root',
})
export class RecetasService {
  private get apiUrl(): string {
    return (window as any).__env?.apiUrl || 'http://localhost:3000';
  }
  
  private url = `${this.apiUrl}` + '/recetas';
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private ui = inject(UiService);
  
  private readonly __recetas = signal<Receta[]>([]);
  private readonly __softDeletedRecetas = signal<Receta[]>([]);

  public readonly recetas = this.__recetas.asReadonly();
  public readonly softDeletedRecetas = this.__softDeletedRecetas.asReadonly();
  public readonly isAdmin = computed(() => {
    const user = this.authService.currentUser();
    return user?.rol === Roles.ADMIN;
  });

  constructor () {

  }

  loadRecetas() {
    return this.http.get<Receta[]>(this.url).subscribe({
      next: (data) => {
        this.__recetas.set(data);
      },
      error: (err: HttpErrorResponse) => {
        this.ui.showError('Error al cargar recetas.', err.error.message || 'Error inesperado');
      },
    });
  }

  loadSoftDeletedRecetas() {
    return this.http.get<Receta[]>(`${this.url}/deleted`).subscribe({
      next: (data) => {
        this.__softDeletedRecetas.set(data);
      },
      error: (err) => {
        this.ui.showError('Error al cargar recetas borradas', err.error.message || 'Error inesperado.');
      }
    });
  }

  createReceta(createRecetaDto: CreateRecetaDto) {
    return this.http.post<Receta>(`${this.url}`, createRecetaDto).subscribe({
      next: (data) => {
        this.__recetas.update(recetas => [data, ...recetas]);
        this.ui.showSuccess('Exito', 'Receta creada exitosamente.')
      },
      error: (err) => {
        this.ui.showError('Error al crear receta.', err.error.message || 'Error inesperado.');
      }
    });
  }

  updateReceta(id: string, updateRecetaDto: UpdateRecetaDto) {
    return this.http.patch<Receta>(`${this.url}/${id}`, updateRecetaDto).subscribe({
      next: (data) => {
        this.__recetas.update(recetas => recetas.filter((r) => r.id !== id));
        this.__recetas.update(recetas => [data, ...recetas]);
        this.ui.showSuccess('Exito', 'Receta actualizada exitosamente.');
      },
      error: (err) => {
        this.ui.showError('Error al actualizar receta.', err.error.message || 'Error inesperado.');
      }
    });
  }

  async softDeleteReceta(id: string) {
    const confirmed = await this.ui.showConfirm('Atención', '¿Está seguro de remover la receta?');
    if (!confirmed) {
      return;
    }
    return this.http.delete(`${this.url}/${id}`).subscribe({
      next: () => {
        const receta = this.__recetas().find((r) => r.id === id);
        this.__recetas.update(recetas => recetas.filter((r) => r.id !== id));
        if (receta) {
          this.__softDeletedRecetas.update(recetas => [receta, ...recetas]);
        }
      },
      error: (err) => {
        this.ui.showError('Error al remover la receta', err.error.message || 'Error inesperado.');
      }
    });
  }

  async hardDeleteReceta(id: string) {
    const confirmed = await this.ui.showConfirm('Atención', '¿Está seguro de eliminar permanentemente la receta?');
    if (!confirmed) {
      return;
    }
    if (!this.isAdmin()){
      this.ui.showError('Error', 'No tienes los permisos para realizar esta acción.')
      return;
    }
    return this.http.delete(`${this.url}/${id}/hard`).subscribe({
      next: () => {
        this.__recetas.update(recetas => recetas.filter((r) => r.id !== id));
        this.__softDeletedRecetas.update(recetas => recetas.filter((r) => r.id !== id));
      },
      error: (err) => {
        this.ui.showError('Error al eliminar definitivamente', err.error.message || 'Error inesperado.');
      },
    });
  }

  async restoreReceta(id: string) {
    const confirmed = await this.ui.showConfirm('Atención', '¿Está seguro de restaurar la receta?');
    if (!confirmed) {
      return;
    }
    if (!this.isAdmin()){
      this.ui.showError('Error', 'No tienes los permisos para realizar esta acción.')
      return;
    }
    return this.http.patch<Receta>(`${this.url}/restore/${id}`, {}).subscribe({
      next: () => {
        const receta = this.__softDeletedRecetas().find((r) => r.id === id);
        if (receta) {
          this.__recetas.update(recetas => [receta, ...recetas]);
        }
        if (this.softDeletedRecetas().length > 0) {
          this.__softDeletedRecetas.update(recetas => recetas.filter((r) => r.id !== id));
        }
      },
      error: (err) => {
        this.ui.showError('Error al restaurar receta', err.error.message || 'Error inesperado.');
      },
    });
  }
}
