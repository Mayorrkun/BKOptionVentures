import { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductsContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import CategorySidebar from '../components/CategorySidebar.jsx';
import CartDrawer from '../components/CartDrawer.jsx';
import { useCart } from '../context/CartContext.jsx';
import '../css/listpage.css';

const CATEGORIES = ['Chairs', 'Tables', 'Fans'];
const PAGE_SIZE = 9;

function sortProducts(products, sort) {
  const arr = [...products];
  if (sort === 'price-asc')  return arr.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') return arr.sort((a, b) => b.price - a.price);
  if (sort === 'name-asc')   return arr.sort((a, b) => a.name.localeCompare(b.name));
  return arr;
}

export default function SalesPage() {
  const { salesProducts } = useProducts();
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState('popular');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { totalItems } = useCart();

  const filtered = useMemo(() => {
    let list = salesProducts;
    if (selected.length > 0) list = list.filter(p => selected.includes(p.category));
    return sortProducts(list, sort);
  }, [salesProducts, selected, sort]);

  return (
    <main className="list-page">
      <div className="list-hero">
        <h1>Equipment Sales</h1>
        <p>Buy quality event equipment outright — great for businesses and regular hosts</p>
      </div>

      <div className="container list-layout">
        <CategorySidebar
          categories={CATEGORIES}
          selected={selected}
          onCategoryChange={setSelected}
          sort={sort}
          onSortChange={s => { setSort(s); setVisible(PAGE_SIZE); }}
        />

        <div className="list-main">
          <div className="list-main-header">
            <p className="result-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''} found</p>
            {totalItems > 0 && (
              <button className="btn btn-success btn-md" onClick={() => setDrawerOpen(true)}>
                🛒 View Cart ({totalItems})
              </button>
            )}
          </div>

          <div className="product-grid">
            {filtered.slice(0, visible).map(p => (
              <ProductCard key={p.id} product={p} variant="sale" />
            ))}
          </div>

          {visible < filtered.length && (
            <div className="load-more">
              <button className="btn btn-secondary btn-md" onClick={() => setVisible(v => v + PAGE_SIZE)}>
                Load More
              </button>
            </div>
          )}
          {filtered.length === 0 && (
            <p className="no-results">No products match the selected filters.</p>
          )}
        </div>
      </div>

      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </main>
  );
}
