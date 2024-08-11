import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of, Observable } from 'rxjs';
import { ApiResponse, User } from '../models/common.model';
import { ApiEndpoints } from '../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _http = inject(HttpClient);
  currentUser: User | null = null;

  // Get the currently authenticated user's details
  getCurrentUser(): Observable<ApiResponse | null> {
    if (this.currentUser) {
      return of({ data: { user: this.currentUser } } as ApiResponse);
    } else {
      return this._http
        .get<ApiResponse>(ApiEndpoints.Users.GetUserDetails, { withCredentials: true })
        .pipe(
          tap((response) => {
            if (response && response.data?.user) {
              this.currentUser = response.data.user;
              console.log('Current user fetched successfully');
            }
          }),
          catchError((error) => {
            console.error('Error fetching current user', error);
            return of(null);
          })
        );
    }
  }

  // Get all users (for admins and managers)
  getAllUsers(): Observable<ApiResponse | null> {
    return this._http.get<ApiResponse>(ApiEndpoints.Users.GetAllUsers, { withCredentials: true }).pipe(
      tap((response) => {
        if (response && response.data?.users) {
          console.log('All users fetched successfully');
        }
      }),
      catchError((error) => {
        console.error('Error fetching all users', error);
        return of(null);
      })
    );
  }

  // Get users with optional query parameters (e.g., filtering by store)
  getUsers(queryParams?: { [key: string]: string | number }): Observable<ApiResponse | null> {
    let url = `${ApiEndpoints.Users.GetAllUsers}`;

    if (queryParams) {
      const queryString = new URLSearchParams(queryParams as any).toString();
      url = `${url}?${queryString}`;
    }

    return this._http.get<ApiResponse>(url, { withCredentials: true }).pipe(
      tap((response) => {
        if (response && response.data?.users) {
          console.log('Users fetched successfully');
        }
      }),
      catchError((error) => {
        console.error('Error fetching users', error);
        return of(null);
      })
    );
  }

  // Create a new user
  createUser(user: User): Observable<ApiResponse | null> {
    return this._http.post<ApiResponse>(ApiEndpoints.Users.CreateUser, user, { withCredentials: true }).pipe(
      tap((response) => {
        if (response && response.data?.user) {
          console.log('User created successfully');
        }
      }),
      catchError((error) => {
        console.error('Error creating user', error);
        return of(null);
      })
    );
  }

  // Update an existing user
  updateUser(user: User): Observable<ApiResponse | null> {
    return this._http.put<ApiResponse>(`${ApiEndpoints.Users.UpdateUser}/${user._id}`, user, { withCredentials: true }).pipe(
      tap((response) => {
        if (response && response.data?.user) {
          console.log('User updated successfully');
        }
      }),
      catchError((error) => {
        console.error('Error updating user', error);
        return of(null);
      })
    );
  }

  // Delete a user by ID
  deleteUser(userId: string): Observable<ApiResponse | null> {
    return this._http.delete<ApiResponse>(`${ApiEndpoints.Users.DeleteUser}/${userId}`, { withCredentials: true }).pipe(
      tap((response) => {
        if (response && response.message === 'User deleted') {
          console.log('User deleted successfully');
        }
      }),
      catchError((error) => {
        console.error('Error deleting user', error);
        return of(null);
      })
    );
  }

  // Clear the current user's details (e.g., on logout)
  clearCurrentUser(): void {
    this.currentUser = null;
  }
}
