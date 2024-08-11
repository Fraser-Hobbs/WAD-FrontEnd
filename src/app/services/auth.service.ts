import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { ApiResponse } from '../models/common.model';
import { ApiEndpoints } from '../constants/constants';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal<boolean>(false);
  private router = inject(Router);
  private _http = inject(HttpClient);
  private userService = inject(UserService);

  login(payload: any) {
    return this._http.post<ApiResponse>(ApiEndpoints.Auth.Login, payload, { withCredentials: true }).pipe(
      tap((response) => {
        if (response?.data?.isAuthenticated) {
          this.isLoggedIn.set(true);
          this.userService.getCurrentUser().subscribe(); // Fetch and store the user details
        }
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  logout() {
    this._http.post<ApiResponse>(ApiEndpoints.Auth.Logout, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.isLoggedIn.set(false);
        this.userService.clearCurrentUser(); // Clear the stored user details
        this.router.navigate(['login']);
      }
    });
  }

  refreshToken() {
    return this._http.post<ApiResponse>(ApiEndpoints.Auth.RefreshToken, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.isLoggedIn.set(true);
      }),
      catchError((error) => {
        this.logout();
        return of(null);
      })
    );
  }

  checkAuthState() {
    return this._http.get<ApiResponse>(ApiEndpoints.Auth.CheckAuth, { withCredentials: true }).pipe(
      tap((response) => {
        if (response?.data?.isAuthenticated) {
          this.isLoggedIn.set(true);
          this.userService.getCurrentUser().subscribe(); // Fetch and store the user details
        } else {
          this.isLoggedIn.set(false);
        }
      }),
      catchError(() => {
        this.isLoggedIn.set(false);
        return of(null);
      })
    );
  }
}
