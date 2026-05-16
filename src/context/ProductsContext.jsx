import { createContext, useContext, useState } from 'react';
import { rentalProducts as initialRentals, salesProducts as initialSales } from '../data/products.js';

const STORE_KEY = 'bk_products';

function loadStore() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  const seed = { rentals: initialRentals, sales: initialSales };
  try { localStorage.setItem(STORE_KEY, JSON.stringify(seed)); } catch {}
  return seed;
}

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [store, setStore] = useState(loadStore);

  function commit(next) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch {}
    setStore(next);
  }

  function addProduct(type, product) {
    const key = type === 'rental' ? 'rentals' : 'sales';
    commit({ ...store, [key]: [...store[key], product] });
  }

  function updateProduct(type, id, updates) {
    const key = type === 'rental' ? 'rentals' : 'sales';
    commit({ ...store, [key]: store[key].map(p => p.id === id ? { ...p, ...updates } : p) });
  }

  function deleteProduct(type, id) {
    const key = type === 'rental' ? 'rentals' : 'sales';
    commit({ ...store, [key]: store[key].filter(p => p.id !== id) });
  }

  return (
    <ProductsContext.Provider value={{
      rentalProducts: store.rentals,
      salesProducts: store.sales,
      addProduct,
      updateProduct,
      deleteProduct,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
