class InventoryDetail extends HTMLElement {
    constructor(){
        super();
        this.observer = new MutationObserver(() => this.updatedAttributes());
        this.observer.observe(this, { attributes: true });
        this.data = {};
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
            this.data = JSON.parse(this.getAttribute('data'));
            this.render();
        } catch(e) {
            // swallow
        }
    }
    render() {
        // let items = this.items;
        // this.innerHTML = '';
        // let doc = document.createElement('DIV');
        // doc.innerHTML = '<div class="mt-6 grid-container flex flex-wrap mx-6"></div>';

        // let itemsHTML = '';
        // items.forEach(item => {
        //     let itemElem = document.createElement('inventory-item');
        //     itemElem.addEventListener('click', () => {
        //         this.dispatchEvent(new CustomEvent('itemclick', { detail: item }));
        //     });
        //     doc.firstElementChild.appendChild(itemElem);
        // });
        // this.appendChild(doc.firstElementChild);
        this.innerHTML = `
            <div class="inventory-detail-specification">
                <div class="flex h-full">
                    <div class="w-2/5 p-2">
                        <img src="https://via.placeholder.com/700x500" class="max-h-full max-w-full mx-auto" alt="item img">
                    </div>
                    <div class="w-3/5 p-2 overflow-y-scroll">
                        <div class="flex">
                            <div class="w-1/3 font-bold">Product Name </div>
                            <div data-bind="name">: ${this.data.name}</div>
                        </div>
                        <div class="flex">
                            <div class="w-1/3 font-bold">Available Stock</div>
                            <div data-bind="availableCount">: ${this.data.availableCount}</div>
                        </div>
                        <div class="flex">
                            <div class="w-1/3 font-bold">Product Price</div>
                            <div>
                                <span data-bind="currencyFormat">: ${this.data.currencyFormat}${(this.data.stockPrice - 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('inventory-detail', InventoryDetail);