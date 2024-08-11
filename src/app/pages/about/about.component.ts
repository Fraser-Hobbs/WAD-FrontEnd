import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service'
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  stores: any[] = [];

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.storeService.getStores().subscribe((response) => {
      this.stores = response.data?.stores ?? [];
    });
  }
}
