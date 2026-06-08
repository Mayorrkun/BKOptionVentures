import { Link } from 'react-router-dom';
import { CEO_WHATSAPP } from '../config.js';
import '../css/footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <h4>BK Option Ventures</h4>
          <p>Your trusted partner for event equipment rentals and sales in Lagos. Quality gear, on-time delivery, professional setup.</p>
        </div>

        <div className="footer-col">
          <h5>Quick Links</h5>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/rentals">Rentals</Link></li>
            <li><Link to="/sales">Sales</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h5>Contact Us</h5>
          <ul className="contact-list">
            <li>📍 Lagos, Nigeria</li>
            <li>📞 <a href="tel:+2348023938469">+234 802 393 8469</a></li>
            <li>✉️ <a href="mailto:bkventure07@yahoo.com">bkventure07@yahoo.com</a></li>
            <li>🕐 Mon–Fri: 8AM–6PM | Sat: 9AM–4PM</li>
          </ul>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a
              href={`https://wa.me/${CEO_WHATSAPP}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >💬</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} BK Option Ventures. All rights reserved.</p>
      </div>
    </footer>
  );
}
