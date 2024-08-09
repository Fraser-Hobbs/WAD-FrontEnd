import {Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./pages/login/login.component";
import {AboutComponent} from "./pages/about/about.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {authGuard} from "./guards/auth.guard";
import {guestGuard} from "./guards/guest.guard";
import {LayoutComponent} from "./layouts/layout/layout.component";



export const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
      {path: '', component: HomeComponent},
      {path: 'home', redirectTo: ''},
      {path: 'login', canActivate: [guestGuard], component: LoginComponent},
      {path: 'about', component: AboutComponent},
      {path: 'dashboard', canActivate: [authGuard], component: DashboardComponent},
      {path: '**', redirectTo: ''}
    ]},

  ];
