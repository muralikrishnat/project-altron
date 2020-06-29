import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.less'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ItemDetailComponent implements OnInit {
  inventoryItem;
  @Input()
  set data(itemData: any) {
    try {
      this.inventoryItem = JSON.parse(itemData);
      if (this.inventoryItem instanceof Array) {
        this.inventoryItem = this.inventoryItem[0];
      }
    } catch (e) {
      // swallow
    }
  }
  constructor() { }

  ngOnInit(): void {
    console.log('Data: ', this.data);
  }
  attributeChangedCallback(attrName: string, oldValue: string, newValue: string, namespace?: string) {
    console.log('Attribute changes', attrName);
  }

}
