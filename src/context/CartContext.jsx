import { createContext, useContext, useReducer, useState } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(item => item.product.id === action.product.id);
      if (existing) {
        return state.map(item =>
          item.product.id === action.product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...state, { product: action.product, qty: 1 }];
    }
    case 'REMOVE':
      return state.filter(item => item.product.id !== action.id);
    case 'UPDATE_QTY':
      return state.map(item =>
        item.product.id === action.id ? { ...item, qty: action.qty } : item
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = product => dispatch({ type: 'ADD', product });
  const removeFromCart = id => dispatch({ type: 'REMOVE', id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, subtotal, cartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
