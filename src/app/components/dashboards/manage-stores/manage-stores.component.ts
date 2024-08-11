import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { Store } from '../../../models/Store.model';
import { ApiResponse } from '../../../models/common.model';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { StoreModalComponent } from '../../modals/store-modal/store-modal.component';

@Component({
  selector: 'app-manage-stores',
  templateUrl: './manage-stores.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    FormsModule,
    StoreModalComponent,
    ReactiveFormsModule,
  ],
  styleUrls: ['./manage-stores.component.scss']
})
export class ManageStoresComponent implements OnInit {
  stores: Store[] = [];
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedStore: Store | null = null;
  isEditing: boolean = false;
  sortDirection: string = 'asc';
  currentSortField: string = 'name';
  searchQuery: string = '';

  private storeService = inject(StoreService);

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(): void {
    this.storeService.getStores().subscribe({
      next: (response: ApiResponse) => {
        this.stores = response?.data?.stores || [];
        this.sortStores(); // Sort stores after loading
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err: any) => {
        console.error('Error loading stores:', err);
      },
    });
  }

  sortStores(): void {
    this.stores.sort((a: Store, b: Store) => {
      let comparison = 0;
      const fieldA = a[this.currentSortField as keyof Store] || '';
      const fieldB = b[this.currentSortField as keyof Store] || '';

      if (fieldA > fieldB) {
        comparison = 1;
      } else if (fieldA < fieldB) {
        comparison = -1;
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  sortTable(field: string): void {
    if (this.currentSortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortField = field;
      this.sortDirection = 'asc';
    }
    this.sortStores();
    this.cdr.detectChanges(); // Trigger change detection after sorting
  }

  applySearchFilter(): void {
    if (!this.searchQuery.trim()) {
      // If the search query is empty, reload the full list of stores
      this.loadStores();
    } else {
      // Filter the stores based on the search query
      const query = this.searchQuery.toLowerCase();
      this.stores = this.stores.filter(store =>
        store.name.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query)
      );
    }
    this.cdr.detectChanges(); // Trigger change detection to update the view
  }

  deleteStore(): void {
    if (this.selectedStore) {
      this.storeService.deleteStore(this.selectedStore._id).subscribe({
        next: () => {
          this.stores = this.stores.filter(store => store._id !== this.selectedStore?._id);
          this.showDeleteModal = false;
          this.cdr.detectChanges(); // Manually trigger change detection after deleting store
        },
        error: (err: any) => {
          console.error('Error deleting store:', err);
        },
      });
    }
  }

  confirmDeleteStore(storeId: string | undefined): void {
    this.selectedStore = this.stores.find(store => store._id === storeId) || null;
    this.showDeleteModal = true;
  }

  handleCancelDelete(): void {
    this.showDeleteModal = false;
  }

  openAddStoreModal(): void {
    this.selectedStore = { _id: '', name: '', address: '' };
    this.isEditing = false;
    this.showModal = true;
  }

  openEditStoreModal(store: Store): void {
    this.selectedStore = { ...store }; // Clone the store object
    this.isEditing = true;
    this.showModal = true;
  }

  handleSave(store: Store): void {
    if (this.isEditing && this.selectedStore) {
      this.storeService.updateStore(this.selectedStore._id, store).subscribe({
        next: (response: ApiResponse | null) => {
          if (response) {
            const index = this.stores.findIndex((s) => s._id === this.selectedStore?._id);
            if (index > -1) {
              this.stores[index] = response.data?.store || this.stores[index];
            }
            this.showModal = false;
            this.loadStores(); // Reload stores after saving
          }
        },
        error: (err: any) => {
          console.error('Error updating store:', err);
        },
      });
    } else {
      this.storeService.createStore(store).subscribe({
        next: (response: ApiResponse | null) => {
          if (response && response.data?.store) {
            this.stores = [...this.stores, response.data.store];
          }
          this.showModal = false;
          this.loadStores(); // Reload stores after adding
        },
        error: (err: any) => {
          console.error('Error adding store:', err);
        },
      });
    }
  }

  handleCancel(): void {
    this.showModal = false;
  }
}
