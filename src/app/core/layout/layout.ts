import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular'; 
import { AuthService } from '../auth/services/auth-service';

interface NavItem {
  label: string;
  path: string;
  icon: string; 
}

@Component({
  selector: 'layout',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    RouterLink, 
    RouterLinkActive,
    LucideAngularModule 
  ],
  templateUrl: './layout.html',
})
export class Layout {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly navItems: NavItem[] = [
    { label: 'Clientes', path: 'clientes', icon: 'Users' },
    { label: 'Pedidos', path: 'pedidos', icon: 'ShoppingBag' }, 
    { label: 'Productos', path: 'productos', icon: 'Package' },
    { label: 'Recetas', path: 'recetas', icon: 'BookOpen' },
  ];

  currentUser = {
    name: 'Admin',
    role: 'ADMIN'
  };

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['login']);
      }
    });
  }
}