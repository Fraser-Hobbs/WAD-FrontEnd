import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/common.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  userService = inject(UserService);
  user?: User | null;

  ngOnInit(): void {
    console.log('DashboardComponent initialized, fetching current user...');
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        console.log('Response from getCurrentUser:', response);
        if (response?.data?.user) {
          console.log('User found:', response.data.user);
          this.user = response.data.user ?? null;
        } else {
          console.log('No user found in response data');
          this.user = null;
        }
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.user = null;
      }
    });
  }
}
