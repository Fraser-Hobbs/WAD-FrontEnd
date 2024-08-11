import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/common.model';
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {DashboardSidebarComponent} from "../../components/dashboard-sidebar/dashboard-sidebar.component";

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  standalone: true,
  imports: [
    NavbarComponent,
    DashboardSidebarComponent,
    RouterOutlet
  ],
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {


}
