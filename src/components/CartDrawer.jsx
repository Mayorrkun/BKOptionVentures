import { useCart } from '../context/CartContext.jsx';
import { CEO_WHATSAPP } from '../config.js';
import '../css/cartdrawer.css';

function buildWhatsAppMessage(cart) {
  const lines = cart
    .map(({ product, qty }) => `• ${product.name} × ${qty}`)
    .join('\n');

  return (
    `Hello, I'd like to enquire about the following items:\n\n${lines}\n\n` +
    `Please reply with your name, delivery address, and (for rentals) your preferred dates so we can confirm availability and provide a quote.`
  );
}

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();

  const handleCheckout = () => {
    const msg = buildWhatsAppMessage(cart);
    window.open(`https://wa.me/${CEO_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      {open && <div className="drawer-backdrop" onClick={onClose} />}
      <div className={`cart-drawer${open ? ' open' : ''}`}>
        <div className="drawer-header">
          <h4>Your Cart</h4>
          <button className="drawer-close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {cart.length === 0 ? (
          <p className="drawer-empty">Your cart is empty.</p>
        ) : (
          <>
            <ul className="drawer-items">
              {cart.map(({ product, qty }) => (
                <li key={product.id} className="drawer-item">
                  <div className="drawer-item-info">
                    <span className="drawer-item-name">{product.name}</span>
                  </div>
                  <div className="drawer-item-controls">
                    <button onClick={() => updateQty(product.id, Math.max(1, qty - 1))}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => updateQty(product.id, qty + 1)}>+</button>
                    <button className="remove-btn" onClick={() => removeFromCart(product.id)}>🗑</button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer-footer">
              <button className="btn btn-success btn-lg checkout-btn" onClick={handleCheckout}>
                💬 Checkout via WhatsApp
              </button>
              <button className="btn btn-tertiary btn-sm" onClick={clearCart}>Clear Cart</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
