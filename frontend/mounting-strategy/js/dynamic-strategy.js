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
     
    DS.prototype.fetchCart = () => {
        api.get({
            url: `http://localhost:5001/api/cart-items`
        }).then(resp => {
            store.saveStore({
                cartItems: resp.data
            }, 'CART_STORE');
        });
    };
    DS.prototype.init = (items) => {
        _cartItems = items;
        document.querySelector('inventory-items').setAttribute('items', JSON.stringify(_cartItems));
        document.querySelector('inventory-items').addEventListener('itemclick', (evt) => {
            let cartStore = store.getStore('INVENTORY_STORE');
            if (!cartStore) {
                cartStore = {};
            }
            cartStore.selectedInventoryItem = Object.assign({}, evt.detail);
            store.saveStore(cartStore, 'INVENTORY_STORE');
            document.querySelector('#inventory-detail').setAttribute('data', JSON.stringify(evt.detail));
            dynamicStrategy.toggleElem('MODAL');
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
                    let itemId = itemInCart._id['$oid'];
                    api.post({
                        url: `http://localhost:5001/api/cart-items/${itemId}`,
                        data: {
                            quantity: itemInCart.quantity
                        }
                    }).then(resp => {
                        dynamicStrategy.fetchCart();
                    });
                } else {
                    let itemToAdd = {
                        code: evt.detail.code,
                        name: evt.detail.name,
                        quantity: 1,
                        stockPrice: evt.detail.stockPrice,
                        _raw: evt.detail
                    };
                    api.post({
                        url: `http://localhost:5001/api/cart-items`,
                        data: itemToAdd
                    }).then(resp => {
                        dynamicStrategy.fetchCart();
                    });
                }
            }
        });

        document.querySelector('items-cart')?.addEventListener('removeitem', (evt) => {
            let cartStore = store.getStore('CART_STORE');
            console.log("remove item");
            if (evt.detail && cartStore.cartItems) {
                let item = cartStore.cartItems.find(item => item.code === evt.detail);
                let itemId = item._id['$oid'];
                api.delete({
                    url: `http://localhost:5001/api/cart-items/${itemId}`
                }).then(resp => {
                    dynamicStrategy.fetchCart();
                });
            }
        });
        document.querySelector('items-cart')?.addEventListener('removequantity', (evt) => {
            let cartStore = store.getStore('CART_STORE');
            if (evt.detail && cartStore.cartItems) {
                let item = cartStore.cartItems.find(item => item.code === evt.detail);
                let quantity = item.quantity;
                quantity = quantity - 1;
                let itemId = item._id['$oid'];
                if (quantity === 0) {
                  api.delete({
                    url: `http://localhost:5001/api/cart-items/${itemId}`
                  }).then(resp => {
                    dynamicStrategy.fetchCart();
                  });
                } else {
                  api.post({
                    url: `http://localhost:5001/api/cart-items/${itemId}`,
                    data: {
                      quantity: quantity
                    }
                  }).then(resp => {
                    dynamicStrategy.fetchCart();
                  });
                }
            }
        });
        document.querySelector('items-cart')?.addEventListener('addquantity', (evt) => {
            let cartStore = store.getStore('CART_STORE');
            if (evt.detail && cartStore.cartItems) {
                let item = cartStore.cartItems.find(item => item.code === evt.detail);
                let quantity = item.quantity;
                quantity = quantity + 1;
                let itemId = item._id['$oid'];

                api.post({
                    url: `http://localhost:5001/api/cart-items/${itemId}`,
                    data: {
                        quantity: quantity
                    }
                }).then(resp => {
                    dynamicStrategy.fetchCart();
                });
            }
        });
    };
    window.dynamicStrategy = new DS();
})();


api.get({
    url: 'http://localhost:5000/api/inventory'
}).then((jsonResp) => {
    if (jsonResp) {
        window.dynamicStrategy.init(jsonResp);
    }
});
window.dynamicStrategy.fetchCart();