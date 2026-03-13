import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, Search, Pen, Trash2, Trash } from 'lucide-angular';

export interface Cliente {
  id: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  deletedAt?: Date | null;
}

@Component({
  selector: 'app-clientes-managment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  styleUrl: './clientes-managment.css',
  templateUrl: './clientes-managment.html',
})
export class ClientesManagment implements OnInit {
  private fb = inject(FormBuilder);

  // Icons
  readonly Search = Search;
  readonly Pen = Pen;
  readonly Trash2 = Trash2;
  readonly Trash = Trash;
  //
  
  // Mocks
  currentUser = signal({ name: 'Admin User', role: 'user' }); 
  clientes = signal<Cliente[]>([
    { id: '1', nombre: 'Carlos Rodríguez', telefono: '345-123-4567', direccion: 'Calle Falsa 123' },
    { id: '2', nombre: 'María González', telefono: '345-987-6543' },
    { id: '3', nombre: 'Restaurante El Buen Sabor', direccion: 'Av. Centro 450' },
    { id: '4', nombre: 'Ana López', telefono: '345-555-0000', direccion: 'Barrio Norte Mz 2 Lote 4' },
    { id: '5', nombre: 'Javier Pérez' },
  ]);
  //

  searchQuery = signal('');

  filteredClientes = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.clientes();
    return this.clientes().filter(c => c.nombre.toLowerCase().includes(query));
  });

  clienteForm!: FormGroup;

  ngOnInit(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      telefono: [''],
      direccion: ['']
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const nuevoCliente: Cliente = {
        id: crypto.randomUUID(), 
        ...this.clienteForm.value
      };
      
      console.log('Guardando cliente:', nuevoCliente);
      this.clientes.update(actuales => [nuevoCliente, ...actuales]);
      this.clienteForm.reset();
    }
  }

  onEdit(cliente: Cliente): void {
    console.log('Editando cliente:', cliente.id);
    this.clienteForm.patchValue({
      nombre: cliente.nombre,
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || ''
    });
  }

  onRemove(cliente: Cliente): void {
    console.log('Soft delete aplicado a:', cliente.id);
    this.clientes.update(actuales => 
      actuales.filter(c => c.id !== cliente.id)
    );
  }

  onHardDelete(cliente: Cliente): void {
    console.log('Hard delete (destrucción total) aplicado a:', cliente.id);
    this.clientes.update(actuales => 
      actuales.filter(c => c.id !== cliente.id)
    );
  }
}