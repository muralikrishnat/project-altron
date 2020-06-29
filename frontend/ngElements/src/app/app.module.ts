import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';

import {createCustomElement} from '@angular/elements';
import { ItemDetailComponent } from './comps/item-detail/item-detail.component';

@NgModule({
  declarations: [
    ItemDetailComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  entryComponents: [ItemDetailComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    const custom = createCustomElement(ItemDetailComponent, { injector });
    customElements.define('inventory-detail', custom);
  }
  ngDoBootstrap() {}
}
