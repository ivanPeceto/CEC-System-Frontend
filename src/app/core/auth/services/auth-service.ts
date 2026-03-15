import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { SignInDto } from '../../../interfaces/auth/sign-in.dto';
import { User } from '../../../interfaces/auth/user';
import { SignUpDto } from '../../../interfaces/auth/sign-up.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private get apiUrl(): string {
    return (window as any).__env?.apiUrl || 'http://localhost:3000';
  }

  private authUrl = `${this.apiUrl}` + '/auth';

  private http = inject(HttpClient);
  currentUser = signal<User | undefined | null>(undefined);

  signIn(signInDto: SignInDto): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, signInDto);
  }

  checkAuth(): Observable<User | null> {
    return this.http.get<User | null>(`${this.authUrl}/me`).pipe(
      tap({
        next: (user) => this.currentUser.set(user as User),
      }),
      catchError(() => {
        this.currentUser.set(null);
        return of(null);
      }),
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.authUrl}/logout`, {}).pipe(
      tap(() => this.currentUser.set(null))
    );
  }

  signUp(signUpDto: SignUpDto): Observable<any> {
    return this.http.post<User | null>(`${this.authUrl}/signup`, signUpDto).pipe(
      tap({
        next: (user) => this.currentUser.set(user),
        error: () => {
          this.currentUser.set(null);
          return of(null);
        },
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.authUrl}/refresh`, {});
  }
}
