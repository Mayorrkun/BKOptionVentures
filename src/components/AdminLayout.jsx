import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { ADMIN_PASSWORD } from '../config.js';
import '../css/adminLayout.css';

function LoginModal({ onSuccess }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');

  const attempt = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('adminAuth', 'true');
      onSuccess();
    } else {
      setErr('Incorrect password.');
    }
  };

  return (
    <div className="admin-login-overlay">
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        <p>Enter your password to access the admin panel.</p>
        <div className="form-group mt-16">
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => { setPw(e.target.value); setErr(''); }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            autoFocus
          />
          {err && <span className="error-msg">{err}</span>}
        </div>
        <button className="btn btn-primary btn-md" style={{ width: '100%' }} onClick={attempt}>
          Login
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('adminAuth') === 'true');

  if (!authed) return <LoginModal onSuccess={() => setAuthed(true)} />;

  return (
    <>
      <nav className="admin-subnav">
        <span className="admin-subnav-brand">BK Admin</span>
        <div className="admin-subnav-links">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/invoice">Invoice</NavLink>
        </div>
        <Link to="/" className="admin-subnav-back">← Back to Site</Link>
      </nav>
      <Outlet />
    </>
  );
}
