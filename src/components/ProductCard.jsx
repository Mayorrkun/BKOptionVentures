import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import '../css/productcard.css';

export default function ProductCard({ product, variant = 'rental' }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const timerRef = useRef(null);
  const img = product.images?.[0];
  const base = variant === 'rental' ? '/rentals' : '/sales';

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setAdded(false), 1500);
  };

  const outOfStock = variant === 'sale' && product.stock === 0;

  return (
    <div className="product-card card">
      <Link to={`${base}/${product.id}`} className="product-card-img-wrap">
        {img
          ? <img src={img} alt={product.name} className="product-card-img" />
          : <div className="product-card-img product-card-placeholder">No image</div>
        }
        {variant === 'sale' && (
          <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        )}
      </Link>

      <div className="product-card-body">
        <h4 className="product-card-name">{product.name}</h4>

        <button
          className={`btn btn-sm product-card-btn ${added ? 'btn-success' : 'btn-primary'}`}
          onClick={handleAdd}
          disabled={outOfStock}
        >
          {outOfStock ? 'Out of Stock' : added ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
