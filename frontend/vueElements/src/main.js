import Vue from 'vue';
import wrap from '@vue/web-component-wrapper';
import InventoryItems from './comps/InventoryItems';
const CustomElement = wrap(Vue, InventoryItems);

window.customElements.define('inventory-items', CustomElement);