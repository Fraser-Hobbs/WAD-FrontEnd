import {Component, OnInit} from '@angular/core';
import {Item} from "../../models/Item.model";
import {Store} from "../../models/Store.model";
import {ItemService} from "../../services/item.service";
import {StoreService} from "../../services/store.service";
import {of} from "rxjs";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.scss'
})
export class BrowseComponent implements OnInit {
  stores: Store[] = [];

  constructor(
    private itemService: ItemService,
    private storeService: StoreService
  ) {
  }

  ngOnInit(): void {
    // Fetch all stores first
    this.storeService.getStores().subscribe((response) => {
      this.stores = response.data?.stores ?? [];

      // Fetch items and group by store
      this.itemService.getItems().subscribe((itemResponse) => {
        const items = itemResponse.data?.items ?? [];
        this.stores.forEach(store => {
          store.items = items.filter(item => item.storeId === store._id);
        });
      });
    });
  }

}
