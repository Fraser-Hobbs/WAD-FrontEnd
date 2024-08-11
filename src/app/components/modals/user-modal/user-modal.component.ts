import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/common.model';
import { Store } from '../../../models/Store.model';
import { NgForOf, NgIf } from "@angular/common";
import { StoreService } from "../../../services/store.service";

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
  @Input() user: User = {
    firstName: '',
    lastName: '',
    email: '',
    role: 'volunteer',
    storeId: '',
    password: ''
  };
  @Input() isEditing: boolean = false;
  @Input() isAdmin: boolean = false;
  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();

  userForm: FormGroup;
  storeService = inject(StoreService);
  stores: Store[] = [];  // Array of Store objects

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      role: ['volunteer', Validators.required],
      password: [''],
      storeId: ['']
    });
  }

  ngOnInit(): void {
    this.userForm.patchValue({
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      role: this.user.role,
      storeId: this.user.storeId
    });

    if (!this.isEditing) {
      this.userForm.get('password')?.setValidators([Validators.required]);
    }

    this.userForm.get('password')?.updateValueAndValidity();

    if (this.isAdmin) {
      this.loadStores();  // Load stores only if the user is an admin
    }
  }

  loadStores(): void {
    this.storeService.getStores().subscribe({
      next: (response) => {
        this.stores = response.data?.stores || [];
      },
      error: (err: any) => {
        console.error('Error loading stores:', err);
      }
    });
  }

  onSave(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const updatedUser: User = { ...this.user, ...this.userForm.value };

    if (this.isEditing && !this.userForm.get('password')?.value) {
      delete updatedUser.password;
    }

    this.save.emit(updatedUser);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
