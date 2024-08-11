import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AboutComponent } from './pages/about/about.component';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { LayoutComponent } from './layouts/layout/layout.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { ManageItemsComponent } from './components/dashboards/manage-items/manage-items.component';
import { ManageUsersComponent } from './components/dashboards/manage-users/manage-users.component';
import { ManageStoresComponent } from './components/dashboards/manage-stores/manage-stores.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      { path: 'about', component: AboutComponent },
      { path: 'browse', component: BrowseComponent },
      { path: 'login', canActivate: [guestGuard], component: LoginComponent },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard], // Ensure only authenticated users can access the dashboard
    children: [
      { path: 'items', component: ManageItemsComponent }, // Accessible to all authenticated users
      { path: 'users', component: ManageUsersComponent }, // Accessible to all authenticated users
      { path: 'stores', component: ManageStoresComponent }, // Accessible to all authenticated users
      { path: '', redirectTo: 'items', pathMatch: 'full' }, // Default route for dashboard
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirect unknown paths to home
];
