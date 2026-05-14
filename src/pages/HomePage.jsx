import { Link } from 'react-router-dom';
import Carousel from '../components/carousel.jsx';
import '../css/homepage.css';

import tent1 from '../Images/Tents/WhatsApp Image 2026-05-13 at 11.59.58 AM.jpeg';
import chair1 from '../Images/ChairTableSets/WhatsApp Image 2026-05-13 at 12.00.03 PM.jpeg';
import table1 from '../Images/ChairTableSets/WhatsApp Image 2026-05-13 at 12.00.07 PM.jpeg';
import event1 from '../Images/EventSets/WhatsApp Image 2026-05-13 at 12.00.12 PM.jpeg';

const categories = [
  { name: 'Canopies', img: tent1, query: 'Canopies', icon: '⛺' },
  { name: 'Chairs', img: chair1, query: 'Chairs', icon: '🪑' },
  { name: 'Tables', img: table1, query: 'Tables', icon: '🪵' },
  { name: 'Fans', img: event1, query: 'Fans', icon: '🌀' },
  { name: 'Air Conditioners', img: null, query: 'Air+Conditioners', icon: '❄️' },
];

const whyUs = [
  { icon: '🏆', title: 'Top Quality', desc: 'All equipment is well-maintained, clean, and inspected before every event.' },
  { icon: '🚚', title: 'On-Time Delivery', desc: 'We deliver, set up, and collect on schedule — no delays, no excuses.' },
  { icon: '💰', title: 'Best Value', desc: 'Competitive pricing with no hidden fees. Packages available for every budget.' },
];

export default function HomePage() {
  return (
    <main>
      <Carousel />

      {/* Welcome */}
      <section className="section welcome-section">
        <div className="container text-center">
          <h2 className="section-title">Welcome to BK Option Ventures</h2>
          <p className="welcome-text">
            We are Lagos's premier event equipment rental and sales company. Whether you're planning
            an intimate birthday party or a large corporate gala, we have everything you need —
            canopies, chairs, tables, fans, and air conditioners — delivered and set up by our team.
          </p>
          <p className="welcome-text">
            With years of experience serving clients across Lagos State, we pride ourselves on
            quality equipment, punctual delivery, and seamless event support.
          </p>
          <div className="welcome-ctas">
            <Link to="/rentals" className="btn btn-primary btn-lg">Browse Rentals</Link>
            <Link to="/sales" className="btn btn-secondary btn-lg">Shop Sales</Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <p className="section-subtitle">Browse our equipment categories</p>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link
                key={cat.name}
                to={`/rentals?category=${cat.query}`}
                className="category-card card"
              >
                {cat.img
                  ? <img src={cat.img} alt={cat.name} className="category-img" />
                  : <div className="category-icon-placeholder">{cat.icon}</div>
                }
                <div className="category-label">
                  <span className="category-icon">{cat.icon}</span>
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="why-grid">
            {whyUs.map(item => (
              <div key={item.title} className="why-card">
                <div className="why-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
