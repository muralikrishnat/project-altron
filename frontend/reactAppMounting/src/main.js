import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import api from './services/api.service';

import ItemsCart from './comps/ItemsCart';
const App = () => {
  const [cartItems, setcartItems] = useState([]);
  const cartItemsState = React.useRef(cartItems);
  useEffect(() => {
    return () => {
      
    };
  });
  useEffect(() => {
    window.addEventListener('message', onMessage);
    pubSub.subscribe('ADD_TO_CART', onAddToCart);
    fetchCartItems();
    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);
  const onMessage = (messageData) => {
    try {
      let jsonData = JSON.parse(messageData.data);
      console.log("message data", jsonData);
      if (jsonData.actionType === 'ADD_TO_CART') {
        addToCart(jsonData.data);
      }
    } catch (e) {
      // swallow
    }
  };
  const onAddToCart = (data) => {
    addToCart(data);
  };
  const fetchCartItems = () => {
    api.get({
      url: 'http://localhost:5001/api/cart-items'
    }).then(resp => {
      cartItemsState.current = resp.data;
      setcartItems(resp.data);
    });
  }
  const changeMe = () => {
    setcartItems([4]);
  }
  const removeCartItem = (item) => {
    let itemId = item._id['$oid'];
    api.delete({
      url: `http://localhost:5001/api/cart-items/${itemId}`
    }).then(resp => {
      fetchCartItems();
    });
  };
  const removeQuantity = (item) => {
    let quantity = item.quantity;
    quantity = quantity - 1;
    let itemId = item._id['$oid'];
    if (quantity === 0) {
      api.delete({
        url: `http://localhost:5001/api/cart-items/${itemId}`
      }).then(resp => {
        fetchCartItems();
      });
    } else {
      api.post({
        url: `http://localhost:5001/api/cart-items/${itemId}`,
        data: {
          quantity: quantity
        }
      }).then(resp => {
        fetchCartItems();
      });
    }
  }
  const addQuantity = (item) => {
    let quantity = item.quantity;
    quantity = quantity + 1;
    let itemId = item._id['$oid'];
    api.post({
      url: `http://localhost:5001/api/cart-items/${itemId}`,
      data: {
        quantity: quantity
      }
    }).then(resp => {
      fetchCartItems();
    });
  }

  const addToCart = (detailData) => {
    let cartItem = cartItemsState.current.find(item => item.code === detailData.code);
    if (cartItem) {
      addQuantity(cartItem);
    } else {
      let itemToAdd = {
        code: detailData.code,
        name: detailData.name,
        quantity: 1,
        stockPrice: detailData.stockPrice,
        _raw: detailData
      };
      api.post({
        url: `http://localhost:5001/api/cart-items`,
        data: itemToAdd
      }).then(resp => {
        fetchCartItems();
      });
    }
  }

  return (
    <div className="h-full flex flex-col">
      <ItemsCart addQuantity={addQuantity} removeQuantity={removeQuantity} removeCartItem={removeCartItem} cartItems={cartItems}></ItemsCart>
    </div>
  );
}
  
ReactDOM.render(
  <App />,
  document.querySelector('.react-app')
);