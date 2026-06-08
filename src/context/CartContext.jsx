import { createContext, useContext, useReducer, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'bkCart';

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

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
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const [cartOpen, setCartOpen] = useState(false);

  // Persist cart so it survives a refresh
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* storage unavailable (private mode / quota) — ignore */
    }
  }, [cart]);

  const addToCart = product => dispatch({ type: 'ADD', product });
  const removeFromCart = id => dispatch({ type: 'REMOVE', id });
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, cartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
