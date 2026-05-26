import { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoSrc from '../../Images/Logo/Logo.png';
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

function statusBadgeColor(status) {
  switch (status) {
    case 'Paid':           return [16, 185, 129];
    case 'Overdue':        return [239, 68, 68];
    case 'Partially Paid': return [20, 184, 166];
    default:               return [249, 115, 22];
  }
}

function loadLogoBase64() {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = logoSrc;
  });
}

function numberToWords(amount) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n) {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 1000000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    return convert(Math.floor(n / 1000000)) + ' Million' + (n % 1000000 ? ' ' + convert(n % 1000000) : '');
  }

  const naira = Math.floor(amount);
  const kobo = Math.round((amount - naira) * 100);
  let words = convert(naira) || 'Zero';
  words += ' Naira';
  if (kobo > 0) words += ' and ' + convert(kobo) + ' Kobo';
  return words + ' Only';
}

// ── Line item row (with optional day sub-rows) ──
function LineItemRow({ item, onChange, onRemove, onAddDay, onUpdateDay, onRemoveDay }) {
  const handleAddDay = () => {
    const dayNumber = (item.days || []).length + 2;
    const mirroredAmount = item.qty * item.unitPrice; // auto-mirror Day 1 total
    onAddDay(item.id, { id: `d_${Date.now()}`, label: `Day ${dayNumber}`, amount: mirroredAmount });
  };

  return (
    <>
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
            min={0}
            value={item.qty}
            onChange={e => onChange({ ...item, qty: Math.max(0, +e.target.value) })}
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
          <div className="row-actions">
            <button className="add-day-btn" onClick={handleAddDay} title="Add day cost" type="button">+Day</button>
            <button className="remove-row-btn" onClick={onRemove} type="button">✕</button>
          </div>
        </td>
      </tr>
      {(item.days || []).map(day => (
        <tr key={day.id} className="day-sub-row">
          <td className="day-label-cell">└ {day.label}</td>
          <td colSpan={2}></td>
          <td>
            <input
              type="number"
              min={0}
              value={day.amount}
              onChange={e => onUpdateDay(item.id, day.id, { ...day, amount: +e.target.value })}
              className="price-input"
              placeholder="Amount"
            />
          </td>
          <td>
            <button className="remove-row-btn" onClick={() => onRemoveDay(item.id, day.id)} type="button">✕</button>
          </td>
        </tr>
      ))}
    </>
  );
}

// ── Invoice dashboard ──
export default function AdminInvoicePage() {
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' });
  const [invoiceNo] = useState(generateInvoiceNumber);
  const [invoiceDate, setInvoiceDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(dueDateStr);
  const [lineItems, setLineItems] = useState([{ id: 1, description: '', qty: 0, unitPrice: 0, days: [] }]);
  const [status, setStatus] = useState('Pending');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [nextId, setNextId] = useState(2);
  const [serviceCharge, setServiceCharge] = useState(''); // percentage, e.g. 10 = 10%
  const [transportation, setTransportation] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);

  const subtotal = useMemo(() =>
    lineItems.reduce((s, i) => {
      const itemTotal = i.qty * i.unitPrice;
      const dayTotal = (i.days || []).reduce((d, day) => d + (+day.amount || 0), 0);
      return s + itemTotal + dayTotal;
    }, 0),
  [lineItems]);
  const tax = subtotal * 0.075;
  const serviceChargeAmount = subtotal * (+serviceCharge || 0) / 100;
  const total = subtotal + tax + serviceChargeAmount + (+transportation || 0);

  const addLine = () => {
    setLineItems(prev => [...prev, { id: nextId, description: '', qty: 0, unitPrice: 0, days: [] }]);
    setNextId(n => n + 1);
  };
  const updateLine = (id, data) => setLineItems(prev => prev.map(i => i.id === id ? data : i));
  const removeLine = id => setLineItems(prev => prev.filter(i => i.id !== id));

  const addDay = (itemId, day) =>
    setLineItems(prev => prev.map(i => i.id === itemId ? { ...i, days: [...(i.days || []), day] } : i));
  const updateDay = (itemId, dayId, data) =>
    setLineItems(prev => prev.map(i => i.id === itemId ? { ...i, days: i.days.map(d => d.id === dayId ? data : d) } : i));
  const removeDay = (itemId, dayId) =>
    setLineItems(prev => prev.map(i => i.id === itemId ? { ...i, days: i.days.filter(d => d.id !== dayId) } : i));

  const generatePDF = async () => {
    setPdfLoading(true);
    try {
      const logoBase64 = await loadLogoBase64();
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageW = 210;
      const pageH = 297;

      // ── Corner decorations ──
      doc.setFillColor(249, 115, 22);
      doc.circle(pageW + 12, -12, 38, 'F');
      doc.setFillColor(30, 58, 138);
      doc.circle(-12, pageH + 12, 38, 'F');

      // ── Logo + Company name ──
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 12, 10, 30, 10);
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(30, 58, 138);
      doc.text('BK OPTION EQUIPMENT VENTURES', 46, 18);

      // ── Address block (right side) ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 58, 138);
      doc.text('Address:', pageW - 12, 14, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 60);
      doc.text('20, Daddy Adediran Street,', pageW - 12, 20, { align: 'right' });
      doc.text('Ire-Akari Estate, Isolo.', pageW - 12, 26, { align: 'right' });
      doc.text('Tel/WA: 08023938469, 08080861728', pageW - 12, 32, { align: 'right' });
      doc.text('Email: bkventure07@yahoo.com', pageW - 12, 38, { align: 'right' });

      // ── Divider line ──
      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(0.5);
      doc.line(12, 44, pageW - 12, 44);

      // ── RE: INVOICE label ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(249, 115, 22);
      doc.text('RE: INVOICE', 12, 54);
      doc.setDrawColor(249, 115, 22);
      doc.setLineWidth(0.5);
      doc.line(12, 56, 64, 56);

      // ── Invoice number ──
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(90, 95, 110);
      doc.text(invoiceNo, 12, 63);

      // ── Date / Issued To row ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(90, 95, 110);
      doc.text('Date Issued:', 12, 72);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(25, 25, 35);
      doc.text(invoiceDate, 44, 72);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(90, 95, 110);
      doc.text('Due Date:', 12, 79);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(25, 25, 35);
      doc.text(dueDate, 44, 79);

      // ── Issued To block (labeled format) ──
      const midX = pageW / 2 + 10;
      const labelOff = 20; // mm from label start to value start
      const valW = pageW - 12 - midX - labelOff - 2; // ~56mm available for values

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 58, 138);
      doc.text('Issued To:', midX, 68);

      let itY = 75;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(90, 95, 110);
      doc.text('Name:', midX, itY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(25, 25, 35);
      doc.text(doc.splitTextToSize(customer.name || '—', valW)[0], midX + labelOff, itY);
      itY += 6;

      if (customer.phone) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(90, 95, 110);
        doc.text('Phone:', midX, itY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(25, 25, 35);
        doc.text(customer.phone, midX + labelOff, itY);
        itY += 6;
      }

      if (customer.address) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(90, 95, 110);
        doc.text('Address:', midX, itY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(25, 25, 35);
        const splitAddr = doc.splitTextToSize(customer.address, valW);
        doc.text(splitAddr, midX + labelOff, itY);
      }

      // ── Payment status badge ──
      const badgeRGB = statusBadgeColor(status);
      doc.setFillColor(...badgeRGB);
      doc.roundedRect(pageW - 56, 63, 44, 10, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(status.toUpperCase(), pageW - 34, 69.5, { align: 'center' });

      // ── Line items table ──
      autoTable(doc, {
        startY: 90,
        head: [['S/N', 'DESCRIPTION', 'QTY', 'RATE', 'TOTAL']],
        body: lineItems.flatMap((item, idx) => [
          [
            idx + 1,
            item.description || '—',
            item.qty,
            item.unitPrice.toLocaleString('en-NG'),
            (item.qty * item.unitPrice).toLocaleString('en-NG'),
          ],
          // Day sub-rows: styled with gray italic to distinguish from parent rows
          ...(item.days || []).map(day => [
            { content: '', styles: { fillColor: [245, 246, 248] } },
            { content: `  └ ${day.label}`, styles: { fontStyle: 'italic', textColor: [110, 115, 130], fillColor: [245, 246, 248] } },
            { content: '', styles: { fillColor: [245, 246, 248] } },
            { content: '', styles: { fillColor: [245, 246, 248] } },
            { content: (+day.amount || 0).toLocaleString('en-NG'), styles: { halign: 'right', textColor: [110, 115, 130], fillColor: [245, 246, 248], fontStyle: 'italic' } },
          ]),
        ]),
        foot: [
          [
            { content: '', colSpan: 3 },
            { content: 'Tax (7.5%)', styles: { halign: 'right', fontStyle: 'normal', fillColor: [243, 244, 246], textColor: [50, 50, 60] } },
            { content: formatPrice(tax), styles: { halign: 'left', fillColor: [243, 244, 246], textColor: [50, 50, 60], fontSize: 8 } },
          ],
          ...(+serviceCharge > 0 ? [[
            { content: '', colSpan: 3 },
            { content: `Service Charge (${serviceCharge}%)`, styles: { halign: 'right', fontStyle: 'normal', fillColor: [243, 244, 246], textColor: [50, 50, 60] } },
            { content: formatPrice(serviceChargeAmount), styles: { halign: 'left', fillColor: [243, 244, 246], textColor: [50, 50, 60], fontSize: 8 } },
          ]] : []),
          ...(+transportation > 0 ? [[
            { content: '', colSpan: 3 },
            { content: 'Transportation', styles: { halign: 'right', fontStyle: 'normal', fillColor: [243, 244, 246], textColor: [50, 50, 60] } },
            { content: formatPrice(+transportation), styles: { halign: 'left', fillColor: [243, 244, 246], textColor: [50, 50, 60], fontSize: 8 } },
          ]] : []),
          [
            { content: 'GRAND TOTAL', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', fillColor: [30, 58, 138], textColor: [255, 255, 255], fontSize: 10 } },
            { content: formatPrice(total), styles: { halign: 'left', fontStyle: 'bold', fillColor: [30, 58, 138], textColor: [255, 255, 255], fontSize: 10 } },
          ],
        ],
        styles: { fontSize: 9, cellPadding: 5, textColor: [25, 25, 35] },
        headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
        footStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [248, 249, 252] },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center' },
          1: { cellWidth: 52 },
          2: { cellWidth: 20, halign: 'center' },
          3: { cellWidth: 45, halign: 'left' },
          4: { cellWidth: 60, halign: 'left' },
        },
        margin: { left: 12, right: 12 },
      });

      const tableBottomY = doc.lastAutoTable.finalY;

      // ── Amount in Words ──
      const awY = tableBottomY + 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 58, 138);
      doc.text('Amount in Words:', 12, awY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 60);
      const words = numberToWords(total);
      const splitWords = doc.splitTextToSize(words, pageW - 24);
      doc.text(splitWords, 12, awY + 6);

      const nairaLineY = awY + 6 + splitWords.length * 5 + 4;
      doc.setDrawColor(90, 95, 110);
      doc.setLineWidth(0.3);
      doc.line(12, nairaLineY, pageW - 12, nairaLineY);
      doc.setFontSize(8);
      doc.setTextColor(90, 95, 110);
      const nairaAmt = Math.floor(total);
      const koboAmt  = Math.round((total - nairaAmt) * 100);
      doc.text(`Naira: ${nairaAmt.toLocaleString('en-NG')}`, 12, nairaLineY + 5);
      doc.text(`Kobo: ${String(koboAmt).padStart(2, '0')}`, pageW - 12, nairaLineY + 5, { align: 'right' });

      // ── Terms & Conditions ──
      if (terms) {
        const termsY = nairaLineY + 14;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(30, 58, 138);
        doc.text('Terms & Conditions:', 12, termsY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(90, 95, 110);
        const splitTerms = doc.splitTextToSize(terms, pageW - 24);
        doc.text(splitTerms, 12, termsY + 5);
      }

      // ── Signature lines ──
      const sigY = pageH - 30;
      doc.setDrawColor(30, 58, 138);
      doc.setLineWidth(0.4);
      doc.line(12, sigY, 80, sigY);
      doc.line(pageW - 80, sigY, pageW - 12, sigY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(50, 50, 60);
      doc.text("Customer's Signature", 12, sigY + 5);
      doc.text('Authorized Signature', pageW - 12, sigY + 5, { align: 'right' });

      // ── Orange footer line + company text ──
      doc.setDrawColor(249, 115, 22);
      doc.setLineWidth(0.8);
      doc.line(12, pageH - 12, pageW - 12, pageH - 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(90, 95, 110);
      doc.text(
        'BK Option Equipment Ventures  ·  Lagos, Nigeria  ·  +234 802 393 8469  ·  bkventure07@yahoo.com',
        pageW / 2, pageH - 7, { align: 'center' }
      );

      doc.save(`${invoiceNo}.pdf`);
    } finally {
      setPdfLoading(false);
    }
  };

  const saveDraft = () => {
    const draft = { customer, invoiceNo, invoiceDate, dueDate, lineItems, status, notes, terms, serviceCharge, transportation };
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
              <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
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
                    onAddDay={addDay}
                    onUpdateDay={updateDay}
                    onRemoveDay={removeDay}
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
            <div className="summary-row">
              <span>Tax (7.5%)</span>
              <strong>{formatPrice(tax)}</strong>
            </div>
            <div className="summary-row summary-input-row">
              <span>Service Charge (%)</span>
              <div className="summary-pct-group">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={serviceCharge}
                  onChange={e => setServiceCharge(e.target.value)}
                  className="summary-charge-input"
                  placeholder="0"
                />
                {+serviceCharge > 0 && (
                  <span className="summary-pct-computed">= {formatPrice(serviceChargeAmount)}</span>
                )}
              </div>
            </div>
            <div className="summary-row summary-input-row">
              <span>Transportation (₦)</span>
              <input
                type="number"
                min={0}
                value={transportation}
                onChange={e => setTransportation(e.target.value)}
                className="summary-charge-input"
                placeholder="0"
              />
            </div>
            <div className="summary-row total-row">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
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
          <button
            className="btn btn-primary btn-lg"
            onClick={generatePDF}
            disabled={pdfLoading}
          >
            {pdfLoading ? 'Generating...' : '⬇ Generate PDF'}
          </button>
        </div>
      </div>
    </main>
  );
}
