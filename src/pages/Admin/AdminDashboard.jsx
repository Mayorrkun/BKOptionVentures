import { Link } from 'react-router-dom';
import '../../css/adminDashboard.css';

const CARDS = [
  {
    icon: '📦',
    title: 'Product Manager',
    desc: 'Add, edit, and remove rental and sales products. Changes reflect on the website immediately.',
    link: '/admin/products',
    label: 'Manage Products',
    color: '#1e3a8a',
  },
  {
    icon: '🧾',
    title: 'Invoice Generator',
    desc: 'Create branded PDF invoices for customers. Save drafts and download ready-to-send documents.',
    link: '/admin/invoice',
    label: 'Open Invoice Tool',
    color: '#f97316',
  },
];

export default function AdminDashboard() {
  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your product catalogue and generate customer invoices</p>
      </div>

      <div className="admin-dashboard-body container">
        <div className="admin-dash-grid">
          {CARDS.map(card => (
            <div key={card.title} className="admin-dash-card">
              <div className="admin-dash-icon" style={{ background: card.color }}>
                {card.icon}
              </div>
              <h2>{card.title}</h2>
              <p>{card.desc}</p>
              <Link to={card.link} className="btn btn-primary btn-md">
                {card.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
