import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import '../css/navbar.css';
import Logo from '../Images/Logo/Logo.png';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/rentals', label: 'Rentals' },
  { to: '/sales', label: 'Sales' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/"><img src={Logo} alt="BK Option Ventures" /></NavLink>
      </div>

      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        {links.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="nav-right">
        <NavLink to="/sales" className="cart-icon" aria-label="Shopping cart">
          🛒
          {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
        </NavLink>
        <button
          className={`hamburger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
