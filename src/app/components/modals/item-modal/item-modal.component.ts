import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import { Item } from '../../../models/Item.model';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./item-modal.component.scss']
})
export class ItemModalComponent implements OnInit {
  @Input() item: Item | null = null; // Input for editing an item
  @Input() isEditing: boolean = false; // Flag to determine if it's an edit operation
  @Input() userRole: string | undefined = ''; // Role of the current user
  @Output() save = new EventEmitter<Item>(); // Output event for saving the item
  @Output() cancel = new EventEmitter<void>(); // Output event for canceling the operation

  itemName: string = '';
  itemDescription: string = '';
  itemPrice: number | null = null;
  selectedStoreId: string = '';
  stores: any[] = [];

  private storeService = inject(StoreService);

  ngOnInit(): void {
    if (this.item) {
      this.itemName = this.item.name;
      this.itemDescription = this.item.description;
      this.itemPrice = this.item.price;
      this.selectedStoreId = this.item.storeId || '';
    }

    if (this.userRole === 'admin') {
      this.loadStores();
    }
  }

  loadStores(): void {
    this.storeService.getStores().subscribe({
      next: (response) => {
        this.stores = response.data?.stores || [];
      },
      error: (err: any) => {
        console.error('Error loading stores:', err);
      },
    });
  }

  onSave(): void {
    const newItem: Item = {
      ...this.item, // If editing, preserve other properties like `_id`
      name: this.itemName,
      description: this.itemDescription,
      price: this.itemPrice || 0,
      storeId: this.userRole === 'admin' ? this.selectedStoreId : this.item?.storeId || ''
    };

    this.save.emit(newItem); // Emit the save event with the item data
  }

  onCancel(): void {
    this.cancel.emit(); // Emit the cancel event
  }
}
