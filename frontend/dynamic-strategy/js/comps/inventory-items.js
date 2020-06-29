class InventoryItems extends HTMLElement {
    constructor(){
        super();
        this.observer = new MutationObserver(() => this.updatedAttributes());
        this.observer.observe(this, { attributes: true });
        this.items = [];
    }
    connectedCallback() {
        this.render();
    }
    attributeChangeCallback() {
    }
    disconnectedCallback() {
    }
    updatedAttributes() {
        try {
            this.items = JSON.parse(this.getAttribute('items'));
            this.render();
        } catch(e) {
            // swallow
        }
    }
    render() {
        let items = this.items;
        this.innerHTML = '';
        let doc = document.createElement('DIV');
        doc.innerHTML = '<div class="mt-6 grid-container flex flex-wrap mx-6"></div>';

        let itemsHTML = '';
        items.forEach(item => {
            let itemElem = document.createElement('inventory-item');
            itemElem.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('itemclick', { detail: item }));
            });
            itemElem.addEventListener('addtocart', () => {
                this.dispatchEvent(new CustomEvent('addtocart', { detail: item }));
            });
            itemElem.setAttribute('data', JSON.stringify(item));
            doc.firstElementChild.appendChild(itemElem);
        });
        this.appendChild(doc.firstElementChild);
    }
}


customElements.define('inventory-items', InventoryItems);