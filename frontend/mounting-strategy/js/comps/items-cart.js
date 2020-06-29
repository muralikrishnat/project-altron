class ItemCart extends HTMLElement {
    constructor(){
        super();
        this.data = [];
        this.observer = new MutationObserver(() => this.updatedAttributes());
        this.observer.observe(this, { attributes: true });
    }
    connectedCallback() {
        console.log("Items Cart - connected Callback", new Date().toLocaleTimeString());
        this.render();
    }
    attributeChangeCallback() {
        console.log("Items Cart - attribute change Callback", new Date().toLocaleTimeString());
    }
    disconnectedCallback() {
        console.log("Items Cart - Disconnected Callback", new Date().toLocaleTimeString());
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
        let items = [];
        let cartTotal = 0;
        if (this.data && this.data instanceof Array) {
            this.data.forEach(itemData => {
                let elem = document.createElement('DIV');
                elem.innerHTML = `
                    <div class="cart-item border rounded shadow flex justify-between p-2 mb-2">
                        <div class="flex">
                            <span class="flex items-center mr-2">
                                <i data-item-code="${itemData.code}" class="btn-remove-item far fa-times-circle text-xl cursor-pointer text-red-700"></i>
                            </span>
                            <span>${itemData.name}</span>
                        </div>
                        <div class="flex">
                            <div>
                                <i data-item-code="${itemData.code}" class="btn-remove-quantity fas fa-minus-circle text-blue-600 cursor-pointer"></i>
                            </div>
                            <div class="ml-2">${itemData.stockPrice}</div>
                            <div class="mr-2 ml-2 text-xs flex items-center text-gray-500">X</div>
                            <div class="">${itemData.quantity}</div>
                            <div class="ml-2 ">
                                <i data-item-code="${itemData.code}" class="btn-add-quantity fas fa-plus-circle text-blue-600 cursor-pointer"></i>
                            </div>
                        </div>
                    </div>
                `;
                cartTotal += (itemData.quantity * itemData.stockPrice);
                items.push(elem.innerHTML);
            });
        }
        this.innerHTML = `
            <div class="p-2 flex flex-col flex-auto overflow-y-scroll">${items.join('')}</div>

            <div class="p-2 px-4 bg-blue-600 text-white flex flex-initial h-10 justify-between pr-6">
                <span>Total</span>
                <span>$${cartTotal.toFixed(2)}</span>
            </div>
        `;
        console.log("binding elements", this.querySelector('.btn-remove-item'));
        var bindEvents = (selector, fn, eventName) => {
            if (this.querySelectorAll(selector).length > 0) {
                this.querySelectorAll(selector).forEach(elem => {
                    elem.addEventListener(eventName, fn);
                });
            }
        }
        bindEvents('.btn-remove-item', (elem) => {
            let itemCode = elem.target.getAttribute('data-item-code');
            this.dispatchEvent(new CustomEvent('removeitem', { detail: itemCode }));
        }, 'click');
        bindEvents('.btn-remove-quantity', (elem) => {
            let itemCode = elem.target.getAttribute('data-item-code');
            this.dispatchEvent(new CustomEvent('removequantity', { detail: itemCode }));
        }, 'click');
        bindEvents('.btn-add-quantity', (elem) => {
            let itemCode = elem.target.getAttribute('data-item-code');
            this.dispatchEvent(new CustomEvent('addquantity', { detail: itemCode }));
        }, 'click');
    }
}

customElements.define('items-cart', ItemCart);