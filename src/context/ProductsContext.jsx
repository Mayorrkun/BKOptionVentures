import { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, getDocs
} from 'firebase/firestore';
import { db } from '../firebase';
import { rentalProducts as initialRentals, salesProducts as initialSales } from '../data/products.js';

const RENTALS_COL = 'rentalProducts';
const SALES_COL = 'salesProducts';
const FORCE_RESEED = true; // set back to false after one app load

const ProductsContext = createContext(null);

async function seedIfEmpty(colName, initialData) {
  const colRef = collection(db, colName);
  const snapshot = await getDocs(colRef);
  if (snapshot.empty) {
    for (const product of initialData) {
      await setDoc(doc(colRef, product.id), product);
    }
  }
}

async function forceReseed(colName, initialData) {
  const colRef = collection(db, colName);
  const snapshot = await getDocs(colRef);
  await Promise.all(snapshot.docs.map(d => deleteDoc(doc(colRef, d.id))));
  for (const product of initialData) {
    await setDoc(doc(colRef, product.id), product);
  }
}

export function ProductsProvider({ children }) {
  const [rentalProducts, setRentalProducts] = useState([]);
  const [salesProducts, setSalesProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadedCount = useRef(0);
  const seeded = useRef(false);

  function markLoaded() {
    loadedCount.current += 1;
    if (loadedCount.current >= 2) setLoading(false);
  }

  useEffect(() => {
    if (!seeded.current) {
      seeded.current = true;
      if (FORCE_RESEED) {
        forceReseed(RENTALS_COL, initialRentals);
        forceReseed(SALES_COL, initialSales);
      } else {
        seedIfEmpty(RENTALS_COL, initialRentals);
        seedIfEmpty(SALES_COL, initialSales);
      }
    }

    const unsubRentals = onSnapshot(collection(db, RENTALS_COL), (snap) => {
      setRentalProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      markLoaded();
    });

    const unsubSales = onSnapshot(collection(db, SALES_COL), (snap) => {
      setSalesProducts(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      markLoaded();
    });

    return () => {
      unsubRentals();
      unsubSales();
    };
  }, []);

  async function addProduct(type, product) {
    const colRef = collection(db, type === 'rental' ? RENTALS_COL : SALES_COL);
    const id = product.id || `${type === 'rental' ? 'r' : 's'}${Date.now()}`;
    await setDoc(doc(colRef, id), { ...product, id });
  }

  async function updateProduct(type, id, updates) {
    const colRef = collection(db, type === 'rental' ? RENTALS_COL : SALES_COL);
    await updateDoc(doc(colRef, id), updates);
  }

  async function deleteProduct(type, id) {
    const colRef = collection(db, type === 'rental' ? RENTALS_COL : SALES_COL);
    await deleteDoc(doc(colRef, id));
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
