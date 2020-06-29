import { Component, OnInit } from '@angular/core';
import api from '../../services/api.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  inventoryItems;
  inventoryItem;
  constructor() { }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const itemCode = urlParams.get('code');
    api.get({
      url: 'http://localhost:5000/api/inventory'
    }).then((jsonResp: []) => {
      if (jsonResp) {
        this.inventoryItems = jsonResp;
        this.inventoryItem = jsonResp.find((item: any) => item.code === itemCode);
        console.log('inventory item', this.inventoryItem);
      }
    });
  }

}
