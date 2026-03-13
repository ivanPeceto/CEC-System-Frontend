import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userState = authService.currentUser();

  if (userState !== undefined) {
    if (userState !== null) return true;
    return router.createUrlTree(['/login']);
  }

  return authService.checkAuth().pipe(
    map((user) => {
      if (user) return true;
      return router.createUrlTree(['/login']);
    })
  );
};
