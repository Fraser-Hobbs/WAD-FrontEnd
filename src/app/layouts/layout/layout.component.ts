import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {NavbarComponent} from "../../components/navbar/navbar.component";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  

}
