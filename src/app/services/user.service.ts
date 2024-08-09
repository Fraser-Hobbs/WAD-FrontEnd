import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { ApiResponse, User } from '../models/common.model';
import { ApiEndpoints } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private _http: HttpClient) {}

  getCurrentUser() {
    return this._http.get<ApiResponse>(ApiEndpoints.Users.GetUserDetails, { withCredentials: true }).pipe(
      tap((response) => {
        if (response?.data?.user) {
          console.log('Current user fetched successfully');
        }
      }),
      catchError((error) => {
        console.error('Error fetching current user', error);
        return of(null);
      })
    );
  }

  getAllUsers() {
    return this._http.get<ApiResponse>(ApiEndpoints.Users.GetAllUsers, { withCredentials: true }).pipe(
      tap((response) => {
        if (response?.data?.users) {
          console.log('All users fetched successfully');
        }
      }),
      catchError((error) => {
        console.error('Error fetching all users', error);
        return of(null);
      })
    );
  }

  createUser(user: User) {
    return this._http.post<ApiResponse>(ApiEndpoints.Users.CreateUser, user, { withCredentials: true }).pipe(
      tap((response) => {
        if (response?.data?.user) {
          console.log('User created successfully');
        }
      }),
      catchError((error) => {
        console.error('Error creating user', error);
        return of(null);
      })
    );
  }

  updateUser(user: User) {
    return this._http.put<ApiResponse>(ApiEndpoints.Users.UpdateUser, user, { withCredentials: true }).pipe(
      tap((response) => {
        if (response?.data?.user) {
          console.log('User updated successfully');
        }
      }),
      catchError((error) => {
        console.error('Error updating user', error);
        return of(null);
      })
    );
  }

  deleteUser() {
    return this._http.delete<ApiResponse>(ApiEndpoints.Users.DeleteUser, { withCredentials: true }).pipe(
      tap((response) => {
        if (response?.message === 'User deleted') {
          console.log('User deleted successfully');
        }
      }),
      catchError((error) => {
        console.error('Error deleting user', error);
        return of(null);
      })
    );
  }
}
