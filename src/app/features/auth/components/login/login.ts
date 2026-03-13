import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignInDto } from '../../../../interfaces/auth/sign-in.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  errorMessage: string = ''; 

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  handleSubmit() {
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const signIndDto: SignInDto = this.loginForm.getRawValue();
      this.authService.signIn(signIndDto).subscribe({
        next: () => {
          this.router.navigate(['layout']);
          this.authService.checkAuth().subscribe({
            next: (user) => {
              console.log(user);
            },
            error: (err) => {
              console.log(err);
            }
          });
        },
        error: (err: HttpErrorResponse) => {
          this.updateErrorMessage(err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      return;
    }
  }

  updateErrorMessage(error: HttpErrorResponse) {
    switch (error.status) {
      case 404:
        this.errorMessage = 'Usuario no encontrado o credenciales inválidas.';
        break;
      case 401:
        this.errorMessage = 'Error de autorización, cookie inválida.';
        break;
      case 500:
        this.errorMessage = 'Error de servidor inesperado.'
        break;
      default:
        this.errorMessage = 'Error inesperado.'
        return;
    }
  }

}
