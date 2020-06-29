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
        this.querySelector('.btn-remove-item')?.addEventListener('click', (ev) => {
            let itemCode = ev.target.getAttribute('data-item-code');
            this.dispatchEvent(new CustomEvent('removeitem', { detail: itemCode }));
        });
        this.querySelector('.btn-remove-quantity')?.addEventListener('click', (ev) => {
            let itemCode = ev.target.getAttribute('data-item-code');
            this.dispatchEvent(new CustomEvent('removequantity', { detail: itemCode }));
        });
        this.querySelector('.btn-add-quantity')?.addEventListener('click', (ev) => {
            let itemCode = ev.target.getAttribute('data-item-code');
            this.dispatchEvent(new CustomEvent('addquantity', { detail: itemCode }));
        });
    }
}

customElements.define('items-cart', ItemCart);
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
(function() {
    let pubSubhash = {};
    var PubSub = function(){};
    PubSub.prototype.subscribe = function(eventName, eventFn) {
        if (!pubSubhash[eventName]) {
            pubSubhash[eventName] = [];
        }
        pubSubhash[eventName].push(eventFn);
    };
    PubSub.prototype.publish = function(eventName, eventData) {
        if (pubSubhash[eventName]) {
            pubSubhash[eventName].forEach(eventFn => {
                eventFn(eventData);
            });
        }
    }
    window.pubSub = new PubSub();
})();
(function() {
    var store = {};
    var storeHash = {};
    var SM = function(){};
    SM.prototype.saveStore = function(dataToSave, moduleName) {
        if (moduleName) {
            store[moduleName] = Object.assign({}, store[moduleName], dataToSave);
            if (storeHash[moduleName]) {
                storeHash[moduleName].forEach(eventFn => {
                    eventFn(store[moduleName]);
                });
            }
        }
    };
    SM.prototype.getStore = function(moduleName) {
        return store[moduleName]
    };
    SM.prototype.subscribe = function(moduleName, eventFn) {
        if (!storeHash[moduleName]) {
            storeHash[moduleName] = [];
        }
        storeHash[moduleName].push(eventFn);
    }
    window.store = new SM();
})();
function handleOnItemClick (e) {
    e.preventDefault();
}

function handleOnAddToCartClick(e) {
    e.preventDefault();
    e.stopPropagation();
    console.log("add to cart");
}

store.subscribe('CART_STORE', (data) => {
    let { cartItems } = data;
    if (cartItems && cartItems instanceof Array) {
        document.querySelector('items-cart')?.setAttribute('data', JSON.stringify(cartItems));
    }
});

(function() {
    let _cartItems = [];
    var DS = function() {
        _cartItems = [
            {
                "name" : "OnePlus 8",
                "code" : "OP8",
                "itemType" : "Mobile",
                "availableCount" : 10,
                "stockPrice" : 100,
                "currencyFormat" : "$",
                "discountAmount" : 2,
                "availableCoupons" : [ 
                    "abc", 
                    "abc2"
                ],
                "images" : [ 
                    "https://via.placeholder.com/700x500", 
                    "https://via.placeholder.com/700x500", 
                    "https://via.placeholder.com/700x500"
                ]
            },
            {
                "name" : "MI TV",
                "code" : "MITV",
                "itemType" : "TV",
                "availableCount" : 10,
                "stockPrice" : 1000,
                "currencyFormat" : "$",
                "discountAmount" : 2,
                "availableCoupons" : [ 
                    "abc", 
                    "abc2"
                ],
                "images" : [ 
                    "https://via.placeholder.com/700x500", 
                    "https://via.placeholder.com/700x500", 
                    "https://via.placeholder.com/700x500"
                ]
            }
        ];
        document.querySelector('inventory-items').setAttribute('items', JSON.stringify(_cartItems));
        document.querySelector('inventory-items').addEventListener('itemclick', (evt) => {
            let cartStore = store.getStore('INVENTORY_STORE');
            if (!cartStore) {
                cartStore = {};
            }
            cartStore.selectedInventoryItem = Object.assign({}, evt.detail);
            store.saveStore(cartStore, 'INVENTORY_STORE');
            document.querySelector('#inventory-detail').setAttribute('data', JSON.stringify(evt.detail));
            this.toggleElem('MODAL');
        });
        document.querySelector('inventory-items').addEventListener('addtocart', (evt) => {
            let cartStore = store.getStore('CART_STORE');
            if (!cartStore) {
                cartStore = {
                    cartItems: []
                };
            }
            if (evt.detail && cartStore.cartItems) {
                let itemInCart = cartStore.cartItems.find(item => item.code === evt.detail.code);
                if (itemInCart) {
                    itemInCart.quantity += 1;
                } else {
                    cartStore.cartItems.push({
                        code: evt.detail.code,
                        name: evt.detail.name,
                        quantity: 1,
                        stockPrice: evt.detail.stockPrice,
                        _raw: evt.detail
                    });
                }
            }
            store.saveStore(cartStore, 'CART_STORE');
        });

        document.querySelector('items-cart')?.addEventListener('removeitem', (evt) => {
            let cartStore = store.getStore('CART_STORE');
            if (evt.detail && cartStore.cartItems) {
                let items = [];
                for (let i = 0; i < cartStore.cartItems.length; i++) {
                    const cartItem = cartStore.cartItems[i];
                    if (cartItem.code !== evt.detail) {
                        items.push(cartItem);
                    }
                }
                cartStore.cartItems = items;
                store.saveStore(cartStore, 'CART_STORE');
            }
        });
        document.querySelector('items-cart')?.addEventListener('removequantity', (evt) => {
            let cartStore = store.getStore('CART_STORE');
            if (evt.detail && cartStore.cartItems) {
                let items = [];
                for (let i = 0; i < cartStore.cartItems.length; i++) {
                    const cartItem = cartStore.cartItems[i];
                    if (cartItem.code === evt.detail) {
                        cartItem.quantity -= 1;
                        if (cartItem.quantity > 0) {
                            items.push(cartItem); 
                        }
                    } else {
                        items.push(cartItem); 
                    }
                }
                cartStore.cartItems = items;
                store.saveStore(cartStore, 'CART_STORE');
            }
        });
        document.querySelector('items-cart')?.addEventListener('addquantity', (evt) => {
            let cartStore = store.getStore('CART_STORE');
            if (evt.detail && cartStore.cartItems) {
                let items = [];
                for (let i = 0; i < cartStore.cartItems.length; i++) {
                    const cartItem = cartStore.cartItems[i];
                    if (cartItem.code === evt.detail) {
                        cartItem.quantity += 1;
                    }
                    items.push(cartItem);
                }
                cartStore.cartItems = items;
                store.saveStore(cartStore, 'CART_STORE');
            }
        });
    };
    DS.prototype.handleClickCart = function(toggleTarget) {
        let toggleTargetElem = document.querySelector('[data-toggle-target="' + toggleTarget +'"]');
        if (toggleTargetElem) {
            toggleTargetElem.classList.toggle('hidden');
        }
    };

    DS.prototype.toggleElem = function(toggleTarget) {
        let toggleTargetElem = document.querySelector('[data-toggle-target="' + toggleTarget +'"]');
        if (toggleTargetElem) {
            toggleTargetElem.classList.toggle('hidden');
        }
    }
    DS.prototype.addToCart = (item) => {
        
    };
    window.dynamicStrategy = new DS();
})();