import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Cliente } from '../../../interfaces/clientes/cliente.interface';
import { CreateClienteDto } from '../../../interfaces/clientes/createCliente.dto';
import { UpdateClienteDto } from '../../../interfaces/clientes/updateCliente.dto';
import { AuthService } from '../../../core/auth/services/auth-service';
import { Roles } from '../../../types/roles';
import { UiService } from '../../../core/ui/services/ui.service';


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
  private ui = inject(UiService);

  private readonly _clientes = signal<Cliente[]>([]);
  private readonly _softDeltedClientes = signal<Cliente[]>([]);
  private readonly _isLoading = signal<boolean>(false);

  public readonly clientes = this._clientes.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly isAdmin = computed(() => {
    const user = this.authService.currentUser();
    return user?.rol === Roles.ADMIN;
  });
  public readonly softDeletedClientes = this._softDeltedClientes.asReadonly();

  constructor() {
    this.loadClientes();
    if (this.isAdmin()) {
      this.loadSoftDeletedClientes();
    } 
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
        this.ui.showError('Error al cargar clientes', err.message || 'Ocurrió un  error inesperado.');
      }
    });
  }

  loadSoftDeletedClientes() {
    if (this.isAdmin()) {
      return this.http.get<Cliente[]>(`${this.clientesUrl}/deleted`).subscribe({
        next: (data) => {
          this._softDeltedClientes.set(data);
        },
        error: (err) => {
          this.ui.showError('Error al cargar clientes borrados', err.message || 'Ocurrió un error inesperado');
        }
      });
    } else {
      this._softDeltedClientes.set([]);
      return;
    }
  }

  createCliente(createClienteDto: CreateClienteDto) {
    return this.http.post<Cliente>(`${this.clientesUrl}`, createClienteDto).subscribe({
      next: (data) => {
        this._clientes.update(clientes => [data, ...clientes]);
        this.ui.showSuccess('Exito', 'Cliente creado exitosamente.');
      },
      error: (err) => {`${err}`
        this.ui.showError('Error al crear cliente', err.message || 'Ocurrió un  error inesperado.');
      },
    });
  }

  updateCliente(id: string, updateClienteDto: UpdateClienteDto) {
    return this.http.patch<Cliente>(`${this.clientesUrl}/${id}`, updateClienteDto)
    .subscribe({
      next: (data) => {
        this._clientes.update(clientes => clientes.filter(c => c.id !== id));
        this._clientes.update(clientes => [data, ...clientes]);
        this.ui.showSuccess('Exito', 'Cliente actualizado exitosamente.');
      },
      error: (err) => {
        this.ui.showError('Error al actualizar cliente', err.message || 'Ocurrió un  error inesperado.');
      },
    });
  }

  async softDeleteCliente(id: string) {
    const confirmed = await this.ui.showConfirm('Atención', '¿Está seguro de remover el cliente?');
    if (!confirmed) {
      return;
    }  
    return this.http.delete(`${this.clientesUrl}/${id}`).subscribe({
      next: () => {
        const cliente = this._clientes().find((c) => c.id === id);
        this._clientes.update(clientes => clientes.filter(c => c.id !== id));
        if (cliente) {
          this._softDeltedClientes.update(clientes => [cliente, ...clientes])
        }
      },
      error: (err) => {
        this.ui.showError('Error al remover cliente', err.message || 'Ocurrió un  error inesperado.')
      }
    });
  }

  async hardDeleteCliente(id: string) {
    const confirmed = await this.ui.showConfirm('Atención', '¿Está seguro de remover definitivamente el cliente?');
    if (!confirmed) {
      return;
    }

    if (this.isAdmin()) {
      return this.http.delete(`${this.clientesUrl}/${id}/hard`).subscribe({
        next: () => {
          this._clientes.update(clientes => clientes.filter(c => c.id !== id));
          if (this._softDeltedClientes.length > 0) {
            this._softDeltedClientes.update(clientes => clientes.filter(c => c.id !== id));
          }
        },
        error: (err) => {
          this.ui.showError('Error al eliminar definitivamente el cliente', err.message || 'Ocurrió un  error inesperado.');
        }
      });
    } else {
      this.ui.showError('Error', 'No tienes los permisos para realizar esta accion.');
      return;
    }
  }

  async restoreCliente(id: string) {
    const confirmed = await this.ui.showConfirm('Atención', '¿Está seguro de restaurar el cliente?');
    if (!confirmed) {
      return;
    }
    if (this.isAdmin()) {
      return this.http.patch<Cliente>(`${this.clientesUrl}/restore/${id}`, {}).subscribe({
        next: (data) => {
          const cliente = this._softDeltedClientes().find((c) => c.id === id);
          if (cliente) {
            this._clientes.update(clientes => [cliente, ...clientes]);
          }
          if (this._softDeltedClientes().length > 0) {
            this._softDeltedClientes.update(clientes => clientes.filter(c => c.id !== id));
          }
        },
        error: (err) => {
          this.ui.showError('Error al restaurar cliente', err.message || 'Ocurrió un  error inesperado.');
        }
      });
    } else {
      this.ui.showError('Error', 'No tienes los permisos para realizar esta accion');
      return;
    }
  }
}
