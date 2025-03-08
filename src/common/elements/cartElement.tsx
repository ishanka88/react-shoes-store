import React, { useState, useEffect, useRef } from 'react';
import '../index.css';

export interface CartItem {
  id: string;
  title: string;
  mainImage: string;
  price: number;
  quantity: number;
}

interface CartProps {
  onClose: () => void;
  isOpen: boolean;
}

const Cart: React.FC<CartProps> = ({ onClose, isOpen }) => {
  const [cartList, setCartList] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const cartRef = useRef<HTMLDivElement>(null);

  // Load cart items
  useEffect(() => {
    const savedCartList = localStorage.getItem('myCartList');
    if (savedCartList) {
      const parsedList = JSON.parse(savedCartList);
      setCartList(parsedList);
      setTotalPrice(parsedList.reduce((acc: number, item: CartItem) => 
        acc + item.price * item.quantity, 0));
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const removeFromCart = (id: string) => {
    const updatedCart = cartList.filter(item => item.id !== id);
    setCartList(updatedCart);
    localStorage.setItem('myCartList', JSON.stringify(updatedCart));
    setTotalPrice(updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="cart-shadow" onClick={onClose} />
      <div className="cart-box" ref={cartRef}>
        <div className="cart-header">
          <h3>Cart</h3>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>
        <hr className="cart-hr" />

        {cartList.length === 0 ? (
          <p className="empty-cart">Your cart is empty</p>
        ) : (
          <>
            {cartList.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.mainImage} alt={item.title} className="cart-item-img" />
                <div className="cart-item-info">
                  <p>{item.title}</p>
                  <p>
                    ${item.price} x {item.quantity}
                    <span className="item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="cart-delete"
                >
                  Delete
                </button>
              </div>
            ))}
            <div className="total-price">
              Total: ${totalPrice.toFixed(2)}
            </div>
            <button className="checkout-btn">Checkout</button>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;