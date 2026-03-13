import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/auth/services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignInDto } from '../../../../interfaces/auth/sign-in.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { SignUpDto } from '../../../../interfaces/auth/sign-up.dto';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  authService = inject(AuthService);
  private fb = inject(FormBuilder);

  errorMessage: string = ''; 

  signUpForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  handleSubmit() {
    this.errorMessage = '';

    if (this.signUpForm.valid) {
      const signUpDto: SignUpDto = this.signUpForm.getRawValue();
      this.authService.signUp(signUpDto).subscribe({
        next: (response) => {
          console.log(response);
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
      this.signUpForm.markAllAsTouched();
      return;
    }
  }

  updateErrorMessage(error: HttpErrorResponse) {
    switch (error.status) {
      case 401:
        this.errorMessage = 'Error de autorización, cookie inválida.';
        break;
      case 500:
        this.errorMessage = 'Error de servidor inesperado. Tal vez el nombre email ya está ocupado.'
        break;
      default:
        this.errorMessage = 'Error inesperado.'
        return;
    }
  }

}
