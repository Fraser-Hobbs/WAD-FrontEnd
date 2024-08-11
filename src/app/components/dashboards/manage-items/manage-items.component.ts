import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ItemService } from '../../../services/item.service';
import { UserService } from '../../../services/user.service';
import { Item } from '../../../models/Item.model';
import { User } from '../../../models/common.model';
import { Store } from '../../../models/Store.model';
import { ItemModalComponent } from '../../modals/item-modal/item-modal.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {StoreService} from "../../../services/store.service";

@Component({
  selector: 'app-manage-items',
  templateUrl: './manage-items.component.html',
  standalone: true,
  imports: [
    ItemModalComponent,
    NgIf,
    NgForOf,
    NgClass
  ],
  styleUrls: ['./manage-items.component.scss']
})
export class ManageItemsComponent implements OnInit {
  items: Item[] = [];
  user: User | undefined;
  stores: { [key: string]: string } = {}; // Ensure stores is initialized as an empty object
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedItem: Item | null = null;
  isEditing: boolean = false;
  sortDirection: string = 'asc';
  currentSortField: string = 'name';
  searchQuery: string = '';

  constructor(
    private itemService: ItemService,
    private userService: UserService,
    private storeService: StoreService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        if (response?.data?.user) {
          this.user = response.data.user;
          this.loadStores(); // Load stores after getting user
          this.loadItems();
        } else {
          console.error('No user data found.');
        }
      },
      error: (err: any) => {
        console.error('Error fetching current user:', err);
      }
    });
  }

  loadItems(): void {
    const queryParams: { [key: string]: string | number } = {};

    if (this.user?.role !== 'admin' && this.user?.storeId) {
      queryParams['storeId'] = this.user.storeId;
    }

    this.itemService.getItems(queryParams).subscribe({
      next: (response) => {
        this.items = response.data?.items || [];
        this.sortItems(); // Sort items after loading
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err: any) => {
        console.error('Error loading items:', err);
      },
    });
  }

  loadStores(): void {
    this.storeService.getStores().subscribe({
      next: (response) => {
        const storesArray = response.data?.stores || [];
        this.stores = storesArray.reduce((acc, store) => {
          acc[store._id] = store.name;
          return acc;
        }, {} as { [key: string]: string });
      },
      error: (err: any) => {
        console.error('Error loading stores:', err);
      }
    });
  }

  sortItems(): void {
    this.items.sort((a: Item, b: Item) => {
      let comparison = 0;
      let fieldA: string | undefined | number | Date;
      let fieldB: string | undefined | number | Date;

      if (this.currentSortField === 'storeName') {
        fieldA = a.storeId ? this.stores[a.storeId] : '';
        fieldB = b.storeId ? this.stores[b.storeId] : '';
      } else {
        fieldA = a[this.currentSortField as keyof Item];
        fieldB = b[this.currentSortField as keyof Item];
      }

      if (fieldA! > fieldB!) {
        comparison = 1;
      } else if (fieldA! < fieldB!) {
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
    this.sortItems();
    this.cdr.detectChanges(); // Trigger change detection after sorting
  }

  applySearchFilter(): void {
    this.items = this.items.filter(item => {
      const storeName = item.storeId && this.stores[item.storeId] ? this.stores[item.storeId].toLowerCase() : '';
      return (
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        storeName.includes(this.searchQuery.toLowerCase())
      );
    });
  }


  deleteItem(): void {
    this.itemService.deleteItem(this.selectedItem?._id).subscribe({
      next: () => {
        this.items = this.items.filter(item => item._id !== this.selectedItem?._id);
        this.cdr.detectChanges(); // Manually trigger change detection after deleting item
      },
      error: (err: any) => {
        console.error('Error deleting item:', err);
      },
    });
  }

  confirmDeleteItem(itemId: string | undefined): void {
    this.selectedItem = this.items.find(item => item._id === itemId) || null;
    this.showDeleteModal = true;
  }

  handleCancelDelete(): void {
    this.showDeleteModal = false;
  }

  openAddItemModal(): void {
    this.selectedItem = null;
    this.isEditing = false;
    this.showModal = true;
  }

  openEditItemModal(item: Item): void {
    this.selectedItem = item;
    this.isEditing = true;
    this.showModal = true;
  }

  handleSave(item: Item): void {
    if (this.isEditing && this.selectedItem) {
      // Update the existing item
      this.itemService.updateItem(this.selectedItem._id!, item).subscribe({
        next: (response) => {
          const index = this.items.findIndex((i) => i._id === this.selectedItem?._id);
          if (index > -1) {
            this.items[index] = response.data?.item || this.items[index];
          }
          this.showModal = false;
          this.loadItems(); // Reload items after saving
        },
        error: (err: any) => {
          console.error('Error updating item:', err);
        },
      });
    } else {
      // Add a new item
      this.itemService.createItem(item).subscribe({
        next: (response) => {
          if (response.data?.item) {
            this.items = [...this.items, response.data.item];
          }
          this.showModal = false;
          this.loadItems(); // Reload items after adding
        },
        error: (err: any) => {
          console.error('Error adding item:', err);
        },
      });
    }
  }

  handleCancel(): void {
    this.showModal = false;
  }
}
