import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common.model';
import { Store } from '../models/Store.model';
import { ApiEndpoints } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private http = inject(HttpClient);

  constructor() {}

  // Fetch all stores
  getStores(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(ApiEndpoints.Stores.GetAll);
  }

  // Fetch a store by ID
  getStoreById(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ApiEndpoints.Stores.GetById}/${id}`);
  }

  // Create a new store
  createStore(store: Store): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(ApiEndpoints.Stores.Create, store);
  }

  // Update an existing store
  updateStore(id: string, store: Partial<Store>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${ApiEndpoints.Stores.Update}/${id}`, store);
  }

  // Delete a store
  deleteStore(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${ApiEndpoints.Stores.Delete}/${id}`);
  }
}
