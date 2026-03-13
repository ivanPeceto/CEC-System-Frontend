import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const clonedReq = req.clone({ withCredentials: true });

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Checks if the unauthorized error wasn't given while trying to log in nor refresh
      if ( error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh') ) {
        return handleHTTP401(clonedReq, next, authService);
      }
      // Otherwise, just returns the error
      return throwError(() => error);
    }),
  );
};

function handleHTTP401(req: any, next: HttpHandlerFn, authService: AuthService): Observable<HttpEvent<unknown>> {
  if(!isRefreshing){
    isRefreshing = true;
    refreshTokenSubject.next(null);

    //Try to refresh token
    return authService.refreshToken().pipe(
      switchMap(() => {
        isRefreshing = false;
        refreshTokenSubject.next(true);
        return next(req);
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        //Logout the user if refresh fails
        authService.currentUser.set(null);
        return throwError(() => refreshError);
      })
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((result) => result !== null),
      take(1),
      switchMap(() => next(req)),
    );
  }
}
