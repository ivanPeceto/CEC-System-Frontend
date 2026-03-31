import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth-service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UiService } from '../../../../core/ui/services/ui.service';
import { Categoria } from '../../../../interfaces/categorias/categoria';
import { Roles } from '../../../../types/roles';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private get apiUrl(): string {
    return (window as any).__env?.apiUrl || 'http://localhost:3000';
  }

  private url = `${this.apiUrl}` + '/categorias';
  private http = inject(HttpClient);
  private authServce = inject(AuthService);
  private ui = inject(UiService);

  private readonly __categorias = signal<Categoria[]>([]);
  private readonly __softDelCategorias = signal<Categoria[]>([]);

  public readonly categorias = this.__categorias.asReadonly();
  public readonly softDelCategorias = this.__softDelCategorias.asReadonly();
  public readonly isAdmin = computed(() => {
    const user = this.authServce.currentUser();
    return user?.rol === Roles.ADMIN;
  });

  constructor() {

  }

  loadCategorias() {
    return this.http.get<Categoria[]>(this.url).subscribe({
      next: (data) => {
        this.__categorias.set(data);
      },
      error: (err: HttpErrorResponse) => {
        this.ui.showError('Error al cargar categorias.', err.error.message || 'Error inesperado.');
      }
    });
  }

  loadSoftDelCategorias() {
    return this.http.get<Categoria[]>(`${this.url}/deleted`).subscribe({
      next: (data) => {
        this.__softDelCategorias.set(data);
      },
      error: (err: HttpErrorResponse) => {
        this.ui.showError('Error al cargar categorias borradas.', err.error.message || 'Error inesperado.');
      }
    });
  }
}
