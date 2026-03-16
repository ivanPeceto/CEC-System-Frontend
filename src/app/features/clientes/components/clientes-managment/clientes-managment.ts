import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Search, Pen, Trash2, Trash } from 'lucide-angular';
import { Cliente } from '../../../../interfaces/clientes/cliente.interface';
import { ClientesService } from '../../services/clientes-service';
import { AuthService } from '../../../../core/auth/services/auth-service';
import { CreateClienteDto } from '../../../../interfaces/clientes/createCliente.dto';
import { UpdateClienteDto } from '../../../../interfaces/clientes/updateCliente.dto';

@Component({
  selector: 'app-clientes-managment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  styleUrl: './clientes-managment.css',
  templateUrl: './clientes-managment.html',
})
export class ClientesManagment implements OnInit {
  private fb = inject(FormBuilder);
  private clienteService = inject(ClientesService);
  private authService = inject(AuthService);

  isEditingCliente = signal<boolean>(false);
  editingClienteId: string | null = null;

  // Icons
  readonly Search = Search;
  readonly Pen = Pen;
  readonly Trash2 = Trash2;
  readonly Trash = Trash;
  //
  
  // Mocks
  currentUser = this.authService.currentUser; 
  clientes = this.clienteService.clientes;
  //

  searchQuery = signal('');

  filteredClientes = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.clientes();
    return this.clientes().filter(c => c.nombre.toLowerCase().includes(query));
  });

  clienteForm!: FormGroup;

  ngOnInit(): void {
    console.log(this.filteredClientes());
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      telefono: [null],
      direccion: [null]
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      if (this.isEditingCliente() && typeof this.editingClienteId === 'string') {
        const updateClienteDto: UpdateClienteDto =
          this.clienteForm.value;
        
          this.clienteService.updateCliente(this.editingClienteId, updateClienteDto);
          this.clienteForm.reset();
          this.cancelEdit();
      } else {
        const createClienteDto: CreateClienteDto = 
          this.clienteForm.value;
        
        this.clienteService.createCliente(createClienteDto);
        this.clienteForm.reset();
      }
    }
  }

  async onEdit(cliente: Cliente): Promise<void> {
    this.isEditingCliente.set(true);
    this.editingClienteId = cliente.id;

    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    });
  }

  cancelEdit(): void {
    this.isEditingCliente.set(false);
    this.editingClienteId = null;
  }

  async onSoftDelete(cliente: Cliente): Promise<void> {
    await this.clienteService.softDeleteCliente(cliente.id);
  }

  async onHardDelete(cliente: Cliente): Promise<void> {
    await this.clienteService.hardDeleteCliente(cliente.id);
  }
}