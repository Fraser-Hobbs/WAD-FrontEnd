import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '../../../models/Store.model';
import { NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-store-modal',
  templateUrl: './store-modal.component.html',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrls: ['./store-modal.component.scss']
})
export class StoreModalComponent implements OnInit {
  @Input() store: Store = { _id: '', name: '', address: '' };
  @Input() isEditing: boolean = false;
  @Output() save = new EventEmitter<Store>();
  @Output() cancel = new EventEmitter<void>();

  storeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.storeForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.storeForm.patchValue({
      name: this.store.name,
      address: this.store.address,
    });
  }

  onSave(): void {
    if (this.storeForm.invalid) {
      this.storeForm.markAllAsTouched();
      return;
    }

    const updatedStore: Store = { ...this.store, ...this.storeForm.value };

    this.save.emit(updatedStore);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
