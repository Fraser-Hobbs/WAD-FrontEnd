import {inject, Injectable, OnInit, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap, catchError, of} from 'rxjs';
import {ApiResponse} from '../models/common.model';
import {ApiEndpoints} from '../constants/constants';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = signal<boolean>(false);
  private router = inject(Router);

  constructor(private _http: HttpClient) {
  }


  login(payload: any) {
    return this._http.post<ApiResponse>(ApiEndpoints.Auth.Login, payload, {withCredentials: true}).pipe(
      tap((response) => {
        if (response?.data?.isAuthenticated) {
          this.isLoggedIn.set(true);
        }
      }),
      catchError((error) => {
        return of(error);
      })
    );
  }

  logout() {
    this._http.post<ApiResponse>(ApiEndpoints.Auth.Logout, {}, {withCredentials: true}).subscribe({
      next: () => {
        this.isLoggedIn.set(false);
        this.router.navigate(['login']);
      }
    });
  }

  refreshToken() {
    return this._http.post<ApiResponse>(ApiEndpoints.Auth.RefreshToken, {}, {withCredentials: true}).pipe(
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
    return this._http.get<ApiResponse>('/api/auth/check-auth', {withCredentials: true}).pipe(
      tap((response) => {
        if (response?.data?.isAuthenticated) {
          this.isLoggedIn.set(true);
          console.log('User is authenticated');
        } else {
          this.isLoggedIn.set(false);
          console.log('User is not authenticated');
        }
      }),
      catchError(() => {
        this.isLoggedIn.set(false);
        console.log('Error while checking authentication');
        return of(null);
      })
    );
  }

  checkAuthOnInit() {
    this.checkAuthState().subscribe({
      next: (response) => {
        if (response?.data?.isAuthenticated) {
          this.isLoggedIn.set(true);
        } else {
          this.isLoggedIn.set(false);
          this.router.navigate(['login']);
        }
      },
      error: () => {
        this.isLoggedIn.set(false);
        this.router.navigate(['login']);
      }
    });
  }
}
