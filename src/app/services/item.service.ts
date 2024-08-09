import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { ApiResponse } from '../models/common.model'; // Adjust this import according to your models

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http = inject(HttpClient);
  private baseUrl = '/api/items'; // Adjust the base URL according to your backend

  constructor() {}

  /**
   * Get all items
   */
  getItems(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}`).pipe(
      catchError(this.handleError<ApiResponse>('getItems'))
    );
  }

  /**
   * Get a single item by ID
   */
  getItem(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError<ApiResponse>(`getItem id=${id}`))
    );
  }

  /**
   * Create a new item
   */
  createItem(item: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, item).pipe(
      catchError(this.handleError<ApiResponse>('createItem'))
    );
  }

  /**
   * Update an existing item
   */
  updateItem(id: string, item: any): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.baseUrl}/${id}`, item).pipe(
      catchError(this.handleError<ApiResponse>('updateItem'))
    );
  }

  /**
   * Delete an item
   */
  deleteItem(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError<ApiResponse>('deleteItem'))
    );
  }

  /**
   * Handle HTTP operation failures
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
