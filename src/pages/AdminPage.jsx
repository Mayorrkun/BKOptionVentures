import { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ADMIN_PASSWORD } from '../config.js';
import { rentalProducts, salesProducts } from '../data/products.js';
import '../css/admin.css';

const ALL_PRODUCTS = [...rentalProducts, ...salesProducts];
const DEFAULT_TERMS =
  'Payment due within 7 days of invoice date. Late payments are subject to a 5% monthly interest charge. Equipment remains the property of BK Option Ventures until full payment is received.';

function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `INV-${year}-${rand}`;
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}
function dueDateStr() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}

function formatPrice(p) {
  return '₦' + (p || 0).toLocaleString('en-NG');
}

// ── Login ──
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
        <p>Enter your password to access the CEO dashboard.</p>
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

// ── Line item row ──
function LineItemRow({ item, onChange, onRemove }) {
  const selected = ALL_PRODUCTS.find(p => p.id === item.productId);
  return (
    <tr>
      <td>
        {/*<select*/}
        {/*  value={item.productId}*/}
        {/*  onChange={e => {*/}
        {/*    const prod = ALL_PRODUCTS.find(p => p.id === e.target.value);*/}
        {/*    onChange({ ...item, productId: e.target.value, description: prod?.name || '', unitPrice: prod?.price || 0 });*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <option value="">— Select product —</option>*/}
        {/*  {ALL_PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}*/}
        {/*  <option value="custom">+ Custom Item</option>*/}
        {/*</select>*/}
        {/*{item.productId === 'custom' && (*/}
        {/*  <input*/}
        {/*    type="text"*/}
        {/*    placeholder="Item description"*/}
        {/*    value={item.description}*/}
        {/*    onChange={e => onChange({ ...item, description: e.target.value })}*/}
        {/*    className="custom-desc-input"*/}
        {/*  />*/}
        {/*)}*/}
          <input type="text"/>
      </td>
      <td>
        <input
          type="number"
          min={1}
          value={item.qty}
          onChange={e => onChange({ ...item, qty: Math.max(1, +e.target.value) })}
          className="qty-input"
        />
      </td>
      <td>
        <input
          type="number"
          min={0}
          value={item.unitPrice}
          onChange={e => onChange({ ...item, unitPrice: +e.target.value })}
          className="price-input"
        />
      </td>
      <td className="line-total">{formatPrice(item.qty * item.unitPrice)}</td>
      <td>
        <button className="remove-row-btn" onClick={onRemove}>✕</button>
      </td>
    </tr>
  );
}

// ── Main dashboard ──
function Dashboard() {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [invoiceNo] = useState(generateInvoiceNumber);
  const [invoiceDate] = useState(todayStr);
  const [dueDate] = useState(dueDateStr);
  const [lineItems, setLineItems] = useState([{ id: 1, productId: '', description: '', qty: 1, unitPrice: 0 }]);
  const [status, setStatus] = useState('Pending');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [nextId, setNextId] = useState(2);

  const subtotal = useMemo(() => lineItems.reduce((s, i) => s + i.qty * i.unitPrice, 0), [lineItems]);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  const addLine = () => {
    setLineItems(prev => [...prev, { id: nextId, productId: '', description: '', qty: 1, unitPrice: 0 }]);
    setNextId(n => n + 1);
  };
  const updateLine = (id, data) => setLineItems(prev => prev.map(i => i.id === id ? data : i));
  const removeLine = id => setLineItems(prev => prev.filter(i => i.id !== id));

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('BK Option Ventures', 14, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Lagos, Nigeria', 14, 27);
    doc.text('Tel: +234 800 000 0000 | info@bkoption.com', 14, 33);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageW - 14, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice #: ${invoiceNo}`, pageW - 14, 27, { align: 'right' });
    doc.text(`Date: ${invoiceDate}`, pageW - 14, 33, { align: 'right' });
    doc.text(`Due Date: ${dueDate}`, pageW - 14, 39, { align: 'right' });

    // Divider
    doc.setLineWidth(0.5);
    doc.line(14, 45, pageW - 14, 45);

    // Bill To
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 14, 53);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(customer.name || 'N/A', 14, 60);
    if (customer.email) doc.text(customer.email, 14, 66);
    if (customer.phone) doc.text(customer.phone, 14, 72);
    if (customer.address) doc.text(customer.address, 14, 78);

    // Status
    doc.setFont('helvetica', 'bold');
    doc.text(`Payment Status: ${status}`, pageW - 14, 60, { align: 'right' });

    // Line items table
    autoTable(doc, {
      startY: 88,
      head: [['Description', 'Qty', 'Unit Price (₦)', 'Total (₦)']],
      body: lineItems.map(i => [
        i.description || '—',
        i.qty,
        (i.unitPrice).toLocaleString('en-NG'),
        (i.qty * i.unitPrice).toLocaleString('en-NG'),
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [30, 58, 138] },
      columnStyles: { 0: { cellWidth: 80 } },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Totals
    doc.setFontSize(10);
    doc.text(`Subtotal: ${formatPrice(subtotal)}`, pageW - 14, finalY, { align: 'right' });
    doc.text(`Tax (7.5%): ${formatPrice(tax)}`, pageW - 14, finalY + 7, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Total: ${formatPrice(total)}`, pageW - 14, finalY + 16, { align: 'right' });

    // Terms
    if (terms) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Terms & Conditions:', 14, finalY + 28);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(terms, pageW - 28);
      doc.text(lines, 14, finalY + 35);
    }

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Thank you for your business!', pageW / 2, doc.internal.pageSize.getHeight() - 15, { align: 'center' });

    doc.save(`${invoiceNo}.pdf`);
  };

  const saveDraft = () => {
    const draft = { customer, invoiceNo, invoiceDate, dueDate, lineItems, status, notes, terms };
    localStorage.setItem('invoiceDraft', JSON.stringify(draft));
    alert('Draft saved!');
  };

  return (
    <main className="admin-page">
      <div className="admin-header">
        <h1>CEO Invoice Dashboard</h1>
        <p>Create and manage invoices for BK Option Ventures</p>
      </div>

      <div className="admin-body container">
        {/* Customer Info */}
        <section className="admin-section">
          <h3>Customer Information</h3>
          <div className="admin-form-grid">
            {['name', 'email', 'phone', 'address'].map(field => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}{field !== 'email' && field !== 'address' ? ' *' : ''}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={customer[field]}
                  onChange={e => setCustomer(c => ({ ...c, [field]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Invoice Meta */}
        <section className="admin-section">
          <h3>Invoice Details</h3>
          <div className="admin-form-grid three-col">
            <div className="form-group">
              <label>Invoice #</label>
              <input value={invoiceNo} readOnly />
            </div>
            <div className="form-group">
              <label>Invoice Date</label>
              <input value={invoiceDate} readOnly />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input value={dueDate} readOnly />
            </div>
          </div>
        </section>

        {/* Line Items */}
        <section className="admin-section">
          <h3>Line Items</h3>
          <div className="table-wrap">
            <table className="line-items-table">
              <thead>
                <tr>
                  <th>Product / Description</th>
                  <th>Qty</th>
                  <th>Unit Price (₦)</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map(item => (
                  <LineItemRow
                    key={item.id}
                    item={item}
                    onChange={data => updateLine(item.id, data)}
                    onRemove={() => removeLine(item.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-secondary btn-sm mt-16" onClick={addLine}>+ Add Line Item</button>
        </section>

        {/* Pricing Summary */}
        <section className="admin-section pricing-summary">
          <h3>Pricing Summary</h3>
          <div className="summary-rows">
            <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            <div className="summary-row"><span>Tax (7.5%)</span><strong>{formatPrice(tax)}</strong></div>
            <div className="summary-row total-row"><span>Total</span><strong>{formatPrice(total)}</strong></div>
          </div>
        </section>

        {/* Payment Status */}
        <section className="admin-section">
          <h3>Payment Status</h3>
          <div className="form-group" style={{ maxWidth: 280 }}>
            <select value={status} onChange={e => setStatus(e.target.value)}>
              {['Pending', 'Partially Paid', 'Paid', 'Overdue'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Notes & Terms */}
        <section className="admin-section">
          <h3>Notes & Terms</h3>
          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea rows={3} placeholder="Internal notes..." value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Terms & Conditions</label>
            <textarea rows={4} value={terms} onChange={e => setTerms(e.target.value)} />
          </div>
        </section>

        {/* Actions */}
        <div className="admin-actions">
          <button className="btn btn-secondary btn-lg" onClick={saveDraft}>Save Draft</button>
          <button className="btn btn-primary btn-lg" onClick={generatePDF}>⬇ Generate PDF</button>
        </div>
      </div>
    </main>
  );
}

// ── Page entry point ──
export default function AdminPage() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('adminAuth') === 'true');
  if (!authed) return <LoginModal onSuccess={() => setAuthed(true)} />;
  return <Dashboard />;
}
