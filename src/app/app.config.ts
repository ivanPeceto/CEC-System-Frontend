import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AuthService } from './core/auth/services/auth-service';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/intercetpors/auth-interceptor';
import { catchError, of } from 'rxjs';
import { 
  LucideAngularModule, 
  ShoppingBag, 
  Package, 
  BookOpen, 
  Users, 
  LogOut, 
  Store, 
  Search,
  Pen,
  Trash,
  Trash2,
  XCircle,
  AlertTriangle,
  Info,
  CircleCheck,
  History,
} from 'lucide-angular';

export function initializeApp(authService: AuthService) {
  return () => authService.checkAuth();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]),
    ),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.checkAuth().pipe(
        catchError(() => {
          return of(null)
        })
      );
    }),
    importProvidersFrom(
      LucideAngularModule.pick({ 
        ShoppingBag, 
        Package, 
        BookOpen, 
        Users, 
        LogOut, 
        Store,
        Search,
        Pen,
        Trash,
        Trash2,
        XCircle,
        AlertTriangle,
        Info,
        CircleCheck,
        History,
      })
    ),
  ]
};
