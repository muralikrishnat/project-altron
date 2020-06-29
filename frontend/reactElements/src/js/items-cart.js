import React from 'react';
import ReactWebComponent from 'react-web-component';

class ItemsCart extends React.Component {
    constructor(){
        super();
        this.state = {
            cartItems: [],
            cartTotal: 0
        };
        // this.observer = new MutationObserver(() => this.updatedAttributes());
        // this.observer.observe(this, { attributes: true });
    }
    webComponentAttributeChanged(){
        console.log("attribute changed callback");
    }
    webComponentConstructed(rawElement) {
        this.rawElement = rawElement;
        rawElement.observer = new MutationObserver(() => this.updatedAttributes(rawElement));
        rawElement.observer.observe(rawElement, { attributes: true });
    }
    updatedAttributes(rawElement) {
        let data = rawElement.getAttribute('data');
        if (data) {
            try {
                this.setState({
                    cartItems: JSON.parse(data)
                });
            } catch (e) {
                // swallow
            }
        }
    }
    removeCartItem(item) {
        this.rawElement.dispatchEvent(new CustomEvent('removeitem', { detail: item.code }));
    }
    addQuantity(item) {
        this.rawElement.dispatchEvent(new CustomEvent('addquantity', { detail: item.code }));
    }
    removeQuantity(item) {
        this.rawElement.dispatchEvent(new CustomEvent('removequantity', { detail: item.code }));
    }
    render() {
        let { cartItems } = this.state;
        let cartTotal = 0;
        if (cartItems && cartItems.length > 0) {
            for (let i = 0; i < cartItems.length; i++) {
                const cartItem = cartItems[i];
                cartTotal = cartItem.quantity * cartItem.stockPrice;
            }
        }
        return (
            <>
                <div className="p-2 flex flex-col flex-auto overflow-y-scroll">
                    {cartItems && cartItems.length > 0 && cartItems.map((item, index) => {
                        return (
                            <div key={'item-cart' + index} className="cart-item border rounded shadow flex justify-between p-2 mb-2">
                                <div className="flex">
                                    <span className="flex items-center mr-2">
                                        <i onClick={(e) => this.removeCartItem(item)} className="btn-remove-item far fa-times-circle text-xl cursor-pointer text-red-700"></i>
                                    </span>
                                    <span>{item.name}</span>
                                </div>
                                <div className="flex">
                                    <div>
                                        <i onClick={(e) => this.removeQuantity(item)} className="btn-remove-quantity fas fa-minus-circle text-blue-600 cursor-pointer"></i>
                                    </div>
                                    <div className="ml-2">{item.currencyFormat}{item.stockPrice}</div>
                                    <div className="mr-2 ml-2 text-xs flex items-center text-gray-500">X</div>
                                    <div className="">{item.quantity}</div>
                                    <div className="ml-2 ">
                                        <i onClick={(e) => this.addQuantity(item)} className="btn-add-quantity fas fa-plus-circle text-blue-600 cursor-pointer"></i>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-2 px-4 bg-blue-600 text-white flex flex-initial h-10 justify-between pr-6">
                    <span>Total</span>
                    <span>{cartTotal.toFixed(2)}</span>
                </div>
            </>
        );
    }
}
ReactWebComponent.create(<ItemsCart />, 'items-cart', false);
