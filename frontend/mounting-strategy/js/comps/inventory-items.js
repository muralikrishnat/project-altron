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

class InventoryItem extends HTMLElement {
    constructor(){
        super();
        this.observer = new MutationObserver(() => this.updatedAttributes());
        this.observer.observe(this, { attributes: true });
        this.data = {};
    }
    connectedCallback() {
        console.log("Inventory Item - connected Callback", this.getAttribute('data'), new Date().toLocaleTimeString());
        this.render();
    }
    updatedAttributes() {
        try {
            this.data = JSON.parse(this.getAttribute('data'));
            this.render();
        } catch(e) {
            // swallow
        }
    }
    attributeChangeCallback() {
        console.log("Inventory Item - attribute change Callback", new Date().toLocaleTimeString());
    }
    disconnectedCallback() {
        console.log("Inventory Item - Disconnected Callback", new Date().toLocaleTimeString());
    }
    render() {
        this.innerHTML = `
            <div class="item-card bg-white shadow rounded hover:shadow-md  transform p-1 relative cursor-pointer">
                <div class="w-full h-full bg-gray-200">
                    <div class="img-holder object-cover h-full object-center w-full overflow-hidden">
                    <img src="https://via.placeholder.com/700x500" class="max-h-full max-w-full mx-auto" alt="item img">
                    </div>
                </div>

                <div class="bg-white absolute bottom-0 w-full left-0 rounded-b p-3 flex justify-between">
                    <div>${this.data.name}</div>
                    <div>${this.data.currencyFormat}${(this.data.stockPrice - 0).toFixed(2)}</div>
                </div>

                <div class="absolute top-0 right-0  mr-4 mt-4">
                    <div class="bg-blue-600 px-2 cursor-pointer capitalize shadow rounded text-white hover:shadow-md btn-add-cart">Add to cart</div>
                </div>
            </div>
        `;
        this.querySelector('.btn-add-cart')?.addEventListener('click', (evt) => {
            evt.stopPropagation();
            evt.preventDefault();
            this.dispatchEvent(new CustomEvent('addtocart', { }));
        });
    }
}
customElements.define('inventory-item', InventoryItem);
customElements.define('inventory-items', InventoryItems);