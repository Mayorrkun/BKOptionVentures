import { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../../css/admin.css';

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

// ── Line item row ──
function LineItemRow({ item, onChange, onRemove }) {
  return (
    <tr>
      <td>
        <input
          type="text"
          value={item.description}
          onChange={e => onChange({ ...item, description: e.target.value })}
          placeholder="Item description"
        />
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

// ── Invoice dashboard ──
export default function AdminInvoicePage() {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [invoiceNo] = useState(generateInvoiceNumber);
  const [invoiceDate] = useState(todayStr);
  const [dueDate] = useState(dueDateStr);
  const [lineItems, setLineItems] = useState([{ id: 1, description: '', qty: 1, unitPrice: 0 }]);
  const [status, setStatus] = useState('Pending');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [nextId, setNextId] = useState(2);

  const subtotal = useMemo(() => lineItems.reduce((s, i) => s + i.qty * i.unitPrice, 0), [lineItems]);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  const addLine = () => {
    setLineItems(prev => [...prev, { id: nextId, description: '', qty: 1, unitPrice: 0 }]);
    setNextId(n => n + 1);
  };
  const updateLine = (id, data) => setLineItems(prev => prev.map(i => i.id === id ? data : i));
  const removeLine = id => setLineItems(prev => prev.filter(i => i.id !== id));

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // ── Header ──
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('BK Option Equipment Ventures', 14, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 110);
    doc.text('Lagos, Nigeria', 14, 27);
    doc.text('Tel: +234 802 393 8469 | bkventure07@yahoo.com', 14, 33);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageW - 14, 20, { align: 'right' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 110);
    doc.text(`Invoice #: ${invoiceNo}`, pageW - 14, 27, { align: 'right' });
    doc.text(`Date: ${invoiceDate}`, pageW - 14, 33, { align: 'right' });
    doc.text(`Due Date: ${dueDate}`, pageW - 14, 39, { align: 'right' });
    doc.setTextColor(0, 0, 0);

    // ── Divider ──
    doc.setDrawColor(220, 225, 235);
    doc.setLineWidth(0.5);
    doc.line(14, 45, pageW - 14, 45);

    // ── Bill To ──
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 14, 53);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(customer.name || 'N/A', 14, 60);
    if (customer.email) doc.text(customer.email, 14, 66);
    if (customer.phone) doc.text(customer.phone, 14, 72);
    if (customer.address) doc.text(customer.address, 14, 78);

    // ── Payment status badge ──
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 110);
    doc.text(`Payment Status: ${status}`, pageW - 14, 60, { align: 'right' });
    doc.setTextColor(0, 0, 0);

    // ── Line items table ──
    autoTable(doc, {
      startY: 88,
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: lineItems.map(i => [
        i.description || '—',
        i.qty,
        i.unitPrice.toLocaleString('en-NG'),
        (i.qty * i.unitPrice).toLocaleString('en-NG'),
      ]),
      styles: { fontSize: 10, cellPadding: 5 },
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 249, 252] },
      columnStyles: {
        0: { cellWidth: 85 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 38, halign: 'right' },
        3: { cellWidth: 38, halign: 'right' },
      },
    });

    const tableBottomY = doc.lastAutoTable.finalY;

    // ── Totals box (right-aligned, contained) ──
    const boxW = 90;
    const boxX = pageW - 14 - boxW;
    const boxPad = 7;
    const lineGap = 8;
    const boxH = boxPad + lineGap + lineGap + 6 + 10 + boxPad; // padding + sub + tax + divider + total + padding
    const boxY = tableBottomY + 12;

    // Background fill
    // doc.setFillColor(248, 249, 252);
    // doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'F');

    // Border
    // doc.setDrawColor(218, 224, 235);
    // doc.setLineWidth(0.3);
    // doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'S');

    // Subtotal row
    const y1 = boxY + boxPad + lineGap;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(90, 95, 105);
    doc.text('Subtotal', boxX + boxPad, y1);
    doc.text(formatPrice(subtotal), boxX + boxW - boxPad, y1, { align: 'right' });

    // Tax row
    const y2 = y1 + lineGap;
    doc.text('Tax (7.5%)', boxX + boxPad, y2);
    doc.text(formatPrice(tax), boxX + boxW - boxPad, y2, { align: 'right' });

    // Separator
    const divY = y2 + 5;
    doc.setDrawColor(210, 215, 225);
    doc.line(boxX + boxPad, divY, boxX + boxW - boxPad, divY);

    // Total row
    const y3 = divY + 9;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(30, 58, 138);
    doc.text('Total', boxX + boxPad, y3);
    doc.text(formatPrice(total), boxX + boxW - boxPad, y3, { align: 'right' });

    // Reset text style
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    // ── Terms & Conditions ──
    const termsY = boxY + boxH + 14;
    if (terms) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Terms & Conditions:', 14, termsY);
      doc.setFont('helvetica', 'normal');
      const splitTerms = doc.splitTextToSize(terms, pageW - 28);
      doc.text(splitTerms, 14, termsY + 7);
    }

    // ── Footer ──
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(130, 130, 140);
    doc.text('Thank you for your business!', pageW / 2, pageH - 15, { align: 'center' });

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
        <h1>Invoice Generator</h1>
        <p>Create and export branded PDF invoices for BK Option Ventures</p>
      </div>

      <div className="admin-body container">
        {/* Customer Info */}
        <section className="admin-section">
          <h3>Customer Information</h3>
          <div className="admin-form-grid">
            {['name', 'email', 'phone', 'address'].map(field => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}{(field === 'name' || field === 'phone') ? ' *' : ''}</label>
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
