import { Routes } from '@angular/router';
import { Login } from './features/auth/components/login/login';
import { Signup } from './features/auth/components/signup/signup';
import { Layout } from './core/layout/layout';
import { Placeholder } from './shared/placeholder/placeholder';
import { authGuard } from './core/auth/guards/auth-guard';
import { ClientesManagment } from './features/clientes/components/clientes-managment/clientes-managment';
import { RecetasInsumosContainer } from './features/recetas-insumos/components/recetas-insumos-container/recetas-insumos-container';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'login', component: Login, title: 'Iniciar Sesión - CEC' },
    { path: 'signup', component: Signup, title: 'Registrarse - CEC' },
    { 
      path: 'layout',
      canActivate: [authGuard], 
      component: Layout, 
      title: 'Sistema - CEC',
      children: [
        { path: 'pedidos', component: Placeholder },
        { path: 'productos', component: Placeholder },
        { path: 'recetas', component: RecetasInsumosContainer },
        { path: 'clientes', component: ClientesManagment },
      ]
    },
    { path: '**', redirectTo: '/login', pathMatch: 'full'}
];
