import { createContext, useContext, useState } from 'react';
import { rentalProducts as initialRentals, salesProducts as initialSales } from '../data/products.js';

const STORE_KEY = 'bk_products';
const STORE_VERSION = 2; // bump whenever products.js seed data changes (e.g. image renames)

function loadStore() {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.version === STORE_VERSION) {
        const { version: _, ...data } = parsed;
        return data;
      }
      // version mismatch — fall through and re-seed
    }
  } catch {}
  const seed = { version: STORE_VERSION, rentals: initialRentals, sales: initialSales };
  try { localStorage.setItem(STORE_KEY, JSON.stringify(seed)); } catch {}
  return { rentals: initialRentals, sales: initialSales };
}

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [store, setStore] = useState(loadStore);

  function commit(next) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify({ version: STORE_VERSION, ...next })); } catch {}
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
