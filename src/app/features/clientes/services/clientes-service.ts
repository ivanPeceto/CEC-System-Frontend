import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Cliente } from '../../../interfaces/clientes/cliente.interface';
import { CreateClienteDto } from '../../../interfaces/clientes/createCliente.dto';
import { UpdateClienteDto } from '../../../interfaces/clientes/updateCliente.dto';
import { AuthService } from '../../../core/auth/services/auth-service';
import { Roles } from '../../../types/roles';


@Injectable({
  providedIn: 'root',
})
export class ClientesService {
  private get apiUrl(): string {
    return (window as any).__env?.apiUrl || 'http://localhost:3000';
  }

  private clientesUrl = `${this.apiUrl}` +  '/clientes';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly _clientes = signal<Cliente[]>([]);
  private readonly _isLoading = signal<boolean>(false);

  public readonly clientes = this._clientes.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly isAdmin = computed(() => {
    const user = this.authService.currentUser();
    return user?.rol === Roles.ADMIN;
  });

  constructor() {
    this.loadClientes();
  }

  loadClientes() {
    this._isLoading.set(false);
    return this.http.get<Cliente[]>(`${this.clientesUrl}`).subscribe({
      next: (data) => {
        this._clientes.set(data);
        this._isLoading.set(false);
      },
      error: (err) => {
        this._isLoading.set(false);
        console.log("Error", err);
        // Complete when error component is implemented
      }
    });
  }

  createCliente(createClienteDto: CreateClienteDto) {
    return this.http.post<Cliente>(`${this.clientesUrl}`, createClienteDto).subscribe({
      next: (data) => {
        this._clientes.update(clientes => [data, ...clientes]);
      },
      error: (err) => {
        // Complete when error component is implemented
      },
    });
  }

  updateCliente(id: string, updateClienteDto: UpdateClienteDto) {
    return this.http.patch<Cliente>(`${this.clientesUrl}/${id}`, updateClienteDto)
    .subscribe({
      next: (data) => {
        this._clientes.update(clientes => [data, ...clientes]);
      },
      error: (err) => {
        // Complete when error component is implemented
      },
    });
  }

  softDeleteCliente(id: string) {
    return this.http.delete(`${this.clientesUrl}/${id}`).subscribe({
      next: () => {
        this._clientes.update(clientes => clientes.filter(c => c.id !== id));
      },
      error: (err) => {
        // Complete when error component is implemented
      }
    });
  }

  hardDeleteCliente(id: string) {
    if (this.isAdmin()) {
      return this.http.delete(`${this.clientesUrl}/${id}/hard`).subscribe({
        next: () => {
          this._clientes.update(clientes => clientes.filter(c => c.id !== id));
        },
        error: (err) => {
          // Complete when error component is implemented
        }
      });
    } else {
      return;
      // Complete when error component is implemented
    }
  }

  restoreCliente(id: string) {
    if (this.isAdmin()) {
      return this.http.patch<Cliente>(`${this.clientesUrl}/restore/${id}`, {}).subscribe({
        next: (data) => {
          this._clientes.update(clientes => [data, ...clientes]);
        },
        error: (err) => {
          // Complete when error component is implemented
        }
      });
    } else {
      return;
      // Complete when error component is implemented
    }
  }
}
