import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import '../css/productcard.css';

function formatPrice(p) {
  return '₦' + p.toLocaleString('en-NG');
}

export default function ProductCard({ product, variant = 'rental' }) {
  const { addToCart } = useCart();
  const img = product.images?.[0];
  const base = variant === 'rental' ? '/rentals' : '/sales';

  return (
    <div className="product-card card">
      <Link to={`${base}/${product.id}`} className="product-card-img-wrap">
        {img
          ? <img src={img} alt={product.name} className="product-card-img" />
          : <div className="product-card-img product-card-placeholder">No image</div>
        }
        {variant === 'sale' && (
          <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
            {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
          </span>
        )}
      </Link>

      <div className="product-card-body">
        <h4 className="product-card-name">{product.name}</h4>
        <p className="product-card-price">
          {formatPrice(product.price)}
          {variant === 'rental' && <span className="price-unit"> / day</span>}
        </p>

        {variant === 'rental' ? (
          <Link to={`${base}/${product.id}`} className="btn btn-primary btn-sm product-card-btn">
            View Details →
          </Link>
        ) : (
          <button
            className="btn btn-primary btn-sm product-card-btn"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}
