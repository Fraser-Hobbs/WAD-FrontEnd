import {Component, inject, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {User} from '../../models/common.model';
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  styleUrls: ['./dashboard-sidebar.component.scss']
})
export class DashboardSidebarComponent implements OnInit {
  user: User | null = null;
  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (response) => {
        this.user = response?.data?.user || null;
      },
      error: (err) => {
        console.error('Failed to fetch current user:', err);
      }
    });
  }

  logout(): void {
    this.authService.logout()
  }
}
