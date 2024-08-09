import { Component, effect, inject, Injector, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NavbarComponent implements OnInit {
  injector = inject(Injector);
  mobileMenuOpen = signal<boolean>(false);
  authService = inject(AuthService);
  router = inject(Router);

  isLoggedIn = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
  }

  ngOnInit(): void {
    effect(() => {
      this.isLoggedIn = this.authService.isLoggedIn();
    }, { injector: this.injector });

    this.router.events.subscribe(() => {
      if (this.mobileMenuOpen()) {
        this.closeMobileMenu();
      }
    });
  }
}
