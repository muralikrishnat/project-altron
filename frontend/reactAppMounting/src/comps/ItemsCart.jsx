import React, { useState, useEffect } from 'react';
const ItemsCart = ({cartItems, removeCartItem, removeQuantity, addQuantity}) => {
    const [cartTotal, setcartTotal] = useState(0);
    useEffect(() => {
        setcartTotal(cartItems.reduce((a, b) => {
            return a + (b.quantity * b.stockPrice);
        }, 0));
        return () => {
        };
    }, [cartItems]);
    return (
        <>
            <div className="p-2 flex flex-col flex-auto overflow-y-scroll">
                {cartItems && cartItems.length > 0 && cartItems.map((item, index) => {
                    return (
                        <div key={'item-cart' + index} className="cart-item border rounded shadow flex justify-between p-2 mb-2">
                            <div className="flex">
                                <span className="flex items-center mr-2">
                                    <i onClick={(e) => removeCartItem(item)} className="btn-remove-item far fa-times-circle text-xl cursor-pointer text-red-700"></i>
                                </span>
                                <span>{item.name}</span>
                            </div>
                            <div className="flex">
                                <div>
                                    <i onClick={(e) => removeQuantity(item)} className="btn-remove-quantity fas fa-minus-circle text-blue-600 cursor-pointer"></i>
                                </div>
                                <div className="ml-2">{item.currencyFormat}{item.stockPrice}</div>
                                <div className="mr-2 ml-2 text-xs flex items-center text-gray-500">X</div>
                                <div className="">{item.quantity}</div>
                                <div className="ml-2 ">
                                    <i onClick={(e) => addQuantity(item)} className="btn-add-quantity fas fa-plus-circle text-blue-600 cursor-pointer"></i>
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

export default ItemsCart;