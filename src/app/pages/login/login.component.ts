import {Component, effect, inject, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string | null = null;
  showEmailError = false;
  showPasswordError = false;
  authService = inject(AuthService);
  router = inject(Router);
  injector = inject(Injector);

  constructor(
    private fb: FormBuilder,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {

    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/dashboard']);
      }
    }, {injector: this.injector});


    this.loginForm.get('email')?.statusChanges.subscribe(() => {
      setTimeout(() => {
        this.showEmailError = true;
      }, 2000);
    });

    this.loginForm.get('password')?.statusChanges.subscribe(() => {
      setTimeout(() => {
        this.showPasswordError = true;
      }, 2000);
    });
  }

  onSubmit(): void {
    this.loginError = null;
    console.log('onSubmit called with form value:', this.loginForm.value);

    if (this.loginForm.valid
    ) {
      console.log('Form is valid:', this.loginForm);
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Full login response:', response);
          if (response?.data?.isAuthenticated) {
            this.router.navigate(['/dashboard']);
          } else {
            this.loginError = 'Login failed. Please check your credentials.';
            console.log('Login failed. Response:', response);
          }
        },
        error: (err) => {
          console.error('Error during login:', err);
          this.loginError = err.error?.message || 'Invalid login details';
        }
      });
    } else {
      console.log('Form is invalid:', this.loginForm);
      this.loginError = 'Please enter valid email and password';
    }
  }


}
