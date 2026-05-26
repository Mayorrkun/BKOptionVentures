import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ADMIN_PASSWORD } from '../config.js';

const API_BASE = '/api';

const ProductsContext = createContext(null);

async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, options);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'API error');
  return json;
}

export function ProductsProvider({ children }) {
  const [rentalProducts, setRentalProducts] = useState([]);
  const [salesProducts, setSalesProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  async function fetchProducts() {
    try {
      const [rentals, sales] = await Promise.all([
        apiFetch('/products.php?type=rental'),
        apiFetch('/products.php?type=sale'),
      ]);
      setRentalProducts(rentals.data);
      setSalesProducts(sales.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    // Poll every 30 seconds so storefront reflects admin changes
    intervalRef.current = setInterval(fetchProducts, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  async function addProduct(type, product) {
    await apiFetch('/products.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': ADMIN_PASSWORD,
      },
      body: JSON.stringify({ ...product, type }),
    });
    await fetchProducts();
  }

  async function updateProduct(type, id, updates) {
    await apiFetch('/products.php', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': ADMIN_PASSWORD,
      },
      body: JSON.stringify({ ...updates, id, type }),
    });
    await fetchProducts();
  }

  async function deleteProduct(type, id) {
    await apiFetch(`/products.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { 'X-Api-Key': ADMIN_PASSWORD },
    });
    await fetchProducts();
  }

  return (
    <ProductsContext.Provider value={{
      rentalProducts,
      salesProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      loading,
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
