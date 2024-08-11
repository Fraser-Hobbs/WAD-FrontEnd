import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    RouterLink
  ],
  standalone: true
})
export class HomeComponent {

}
