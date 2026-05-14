import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { rentalProducts, salesProducts } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';
import Breadcrumb from '../components/Breadcrumb.jsx';
import ProductCard from '../components/ProductCard.jsx';
import '../css/productdetail.css';

function formatPrice(p) {
  return '₦' + p.toLocaleString('en-NG');
}

const TABS = ['Description', 'Specifications', 'Reviews'];

const placeholderReviews = [
  { name: 'Adaeze O.', rating: 5, text: 'Excellent service! The canopy was spotless and setup was so fast. Highly recommend.' },
  { name: 'Emeka B.', rating: 5, text: 'Great value for money. Will definitely be using BK Option Ventures for my next event.' },
  { name: 'Funmi A.', rating: 4, text: 'Very professional team. Delivery was on time and everything was in perfect condition.' },
];

export default function ProductDetailPage({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const products = type === 'rental' ? rentalProducts : salesProducts;
  const product = products.find(p => p.id === id);

  const [mainImg, setMainImg] = useState(0);
  const [activeTab, setActiveTab] = useState('Description');

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <button className="btn btn-primary btn-md mt-24" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const base = type === 'rental' ? '/rentals' : '/sales';
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: type === 'rental' ? 'Rentals' : 'Sales', href: base },
    { label: product.category, href: `${base}?category=${product.category}` },
    { label: product.name, href: '#' },
  ];

  return (
    <main className="detail-page">
      <div className="container">
        <Breadcrumb crumbs={crumbs} />

        <div className="detail-layout">
          {/* Gallery */}
          <div className="detail-gallery">
            <div className="gallery-main">
              {product.images?.[mainImg]
                ? <img src={product.images[mainImg]} alt={product.name} />
                : <div className="gallery-placeholder">No image</div>
              }
            </div>
            {product.images?.length > 1 && (
              <div className="gallery-thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`thumb-btn${i === mainImg ? ' active' : ''}`}
                    onClick={() => setMainImg(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="detail-info">
            <p className="detail-category">{product.category}</p>
            <h1 className="detail-name">{product.name}</h1>
            <div className="detail-rating">⭐⭐⭐⭐⭐ <span>(3 reviews)</span></div>

            <div className="detail-price">
              {formatPrice(product.price)}
              {type === 'rental' && <span className="price-unit"> / day</span>}
            </div>

            {type === 'sale' && product.stock !== undefined && (
              <p className={`detail-stock ${product.stock > 0 ? 'in' : 'out'}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
              </p>
            )}

            {type === 'rental' && (
              <ul className="detail-rental-info">
                <li>✓ Minimum rental: 1 day</li>
                <li>✓ Delivery within Lagos</li>
                <li>✓ Setup & takedown included</li>
              </ul>
            )}

            <div className="detail-actions">
              {type === 'sale'
                ? <button
                    className="btn btn-primary btn-lg"
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </button>
                : <a
                    href={`/contact`}
                    className="btn btn-primary btn-lg"
                  >
                    Book Now
                  </a>
              }
              <a href="/contact" className="btn btn-secondary btn-lg">Contact for Quote</a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="detail-tabs">
          <div className="tab-nav">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab-btn${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'Description' && (
              <p>{product.description}</p>
            )}
            {activeTab === 'Specifications' && (
              <ul className="spec-list">
                {product.specs.map((s, i) => <li key={i}>✓ {s}</li>)}
              </ul>
            )}
            {activeTab === 'Reviews' && (
              <div className="reviews-list">
                {placeholderReviews.map((r, i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <strong>{r.name}</strong>
                      <span>{'⭐'.repeat(r.rating)}</span>
                    </div>
                    <p>{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="related-section">
            <h3>You Might Also Like</h3>
            <div className="related-grid">
              {related.map(p => (
                <ProductCard key={p.id} product={p} variant={type} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
