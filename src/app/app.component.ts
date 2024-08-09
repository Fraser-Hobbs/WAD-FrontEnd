import {Component, inject, OnInit, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from "./components/navbar/navbar.component";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isLoggedIn = signal<boolean>(false);
  authService = inject(AuthService);
  title = 'app';

  ngOnInit() {
    console.log('AppComponent ngOnInit');
    let auth = this.authService.checkAuthState().subscribe((
        response: any) => {
      this.isLoggedIn = response.data.isAuthenticated;
      }
    )

  }
}
