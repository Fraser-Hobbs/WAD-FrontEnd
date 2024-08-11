import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { StoreService } from '../../../services/store.service';
import { ApiResponse, User } from '../../../models/common.model';
import { FormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { UserModalComponent } from "../../modals/user-modal/user-modal.component";

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    FormsModule,
    UserModalComponent
  ],
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  stores: { [key: string]: string } = {};
  user: User | undefined;
  showModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedUser: User | null = null;
  isEditing: boolean = false;
  sortDirection: string = 'asc';
  currentSortField: string = 'storeName';
  searchQuery: string = '';
  isAdmin: boolean = false;

  private storeService = inject(StoreService);

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadStores();
    this.isAdmin = this.userService.currentUser?.role === 'admin';
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response?.data?.users || [];
        this.sortUsers(); // Sort users after loading
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err: any) => {
        console.error('Error loading users:', err);
      },
    });
  }

  loadStores(): void {
    this.storeService.getStores().subscribe({
      next: (response: ApiResponse) => {
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

  sortUsers(): void {
    this.users.sort((a: User, b: User) => {
      let comparison = 0;

      if (this.currentSortField === 'storeName') {
        const storeA = this.stores[a.storeId] || '';
        const storeB = this.stores[b.storeId] || '';

        if (storeA > storeB) {
          comparison = 1;
        } else if (storeA < storeB) {
          comparison = -1;
        }
      } else {
        const fieldA = a[this.currentSortField as keyof User] || '';
        const fieldB = b[this.currentSortField as keyof User] || '';

        if (fieldA > fieldB) {
          comparison = 1;
        } else if (fieldA < fieldB) {
          comparison = -1;
        }
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
    this.sortUsers();
    this.cdr.detectChanges(); // Trigger change detection after sorting
  }

  applySearchFilter(): void {
    if (!this.searchQuery.trim()) {
      // If the search query is empty, reload the full list of users
      this.loadUsers();
    } else {
      // Filter the users based on the search query
      const query = this.searchQuery.toLowerCase();
      this.users = this.users.filter(user =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    }
    this.cdr.detectChanges(); // Trigger change detection to update the view
  }

  deleteUser(): void {
    console.log('Deleting user:', this.selectedUser);
    this.userService.deleteUser(this.selectedUser?._id!).subscribe({
      next: () => {
        this.users = this.users.filter(user => user._id !== this.selectedUser?._id);
        this.showDeleteModal = false;
        this.cdr.detectChanges(); // Manually trigger change detection after deleting user
      },
      error: (err: any) => {
        console.error('Error deleting user:', err);
      },
    });
  }

  confirmDeleteUser(userId: string | undefined): void {
    this.selectedUser = this.users.find(user => user._id === userId) || null;
    this.showDeleteModal = true;
  }

  handleCancelDelete(): void {
    this.showDeleteModal = false;
  }

  openAddUserModal(): void {
    this.selectedUser = {
      firstName: '',
      lastName: '',
      email: '',
      role: 'volunteer',
      storeId: '',
      password: ''
    };
    this.isEditing = false;
    this.showModal = true;
  }

  openEditUserModal(user: User): void {
    this.selectedUser = { ...user }; // Clone the user object
    this.isEditing = true;
    this.showModal = true;
  }

  handleSave(user: User): void {
    if (this.isEditing && this.selectedUser) {
      // Update the existing user
      this.userService.updateUser(user).subscribe({
        next: (response: ApiResponse | null) => {
          if (response) {
            const index = this.users.findIndex((u) => u._id === this.selectedUser?._id);
            if (index > -1) {
              this.users[index] = response.data?.user || this.users[index];
            }
            this.showModal = false;
            this.loadUsers(); // Reload users after saving
          }
        },
        error: (err: any) => {
          console.error('Error updating user:', err);
        },
      });
    } else {
      // Add a new user
      this.userService.createUser(user).subscribe({
        next: (response: ApiResponse | null) => {
          if (response && response.data?.user) {
            this.users = [...this.users, response.data.user];
          }
          this.showModal = false;
          this.loadUsers(); // Reload users after adding
        },
        error: (err: any) => {
          console.error('Error adding user:', err);
        },
      });
    }
  }

  handleCancel(): void {
    this.showModal = false;
  }
}
