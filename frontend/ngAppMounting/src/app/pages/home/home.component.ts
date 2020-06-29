import { Component, OnInit, NgZone } from '@angular/core';
import api from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  inventoryItems;
  inventoryItem;
  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    if (window['pubSub']) {
        window['pubSub'].subscribe('OPEN_DETAIL', (data) => {
            this.ngZone.run(() => {
                this.inventoryItem = data;
            });
        });
    }
  }

  checkInventoryItem() {
    console.log('inventory item', this.inventoryItem);
  }

}
