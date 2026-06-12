import { useState, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logoSrc from '../../Images/Logo/Logo.png';
import '../../css/admin.css';

const DEFAULT_TERMS =
  'Payment due within 7 days of invoice date. Late payments are subject to a 5% monthly interest charge. Equipment remains the property of BK Option Ventures until full payment is received.';

const DRAFT_KEY = 'invoiceDraft';

const emptyLineItem = id => ({ id, description: '', qty: 0, unitPrice: 0, days: [] });

const CUSTOMER_FIELDS = [
  { key: 'name',    label: 'Name',             required: true },
  { key: 'email',   label: 'Email' },
  { key: 'phone',   label: 'Phone',            required: true },
  { key: 'address', label: 'Delivery Address' },
];

let _dayCounter = 0;
const makeDayId = () => `d_${Date.now()}_${_dayCounter++}`;

// ── PDF palette (mirrors the CSS brand tokens) + page layout, in mm ──
const NAVY    = [30, 58, 138];   // --color-primary
const ORANGE  = [249, 115, 22];  // --color-secondary
const MUTED   = [90, 95, 110];
const INK     = [25, 25, 35];
const SLATE   = [50, 50, 60];
const GREY_BG = [243, 244, 246];
const MARGIN  = 12;
const PAGE_W  = 210;
const PAGE_H  = 297;

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

// Invoice amounts are shown as whole Naira (no kobo).
function formatPrice(p) {
  return '₦' + Math.round(p || 0).toLocaleString('en-NG');
}

// jsPDF's built-in Helvetica is Latin-1 only and has no ₦ glyph (it renders as a
// broken bar), so the PDF uses the "NGN" ISO code instead.
function formatPricePdf(p) {
  return 'NGN ' + Math.round(p || 0).toLocaleString('en-NG');
}

function statusBadgeColor(status) {
  switch (status) {
    case 'Paid':           return [16, 185, 129];
    case 'Overdue':        return [239, 68, 68];
    case 'Partially Paid': return [20, 184, 166];
    default:               return ORANGE;
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
// Day labels are DERIVED from their index, so removing/re-adding never mis-numbers.
function LineItemRow({ item, onChange, onRemove, onAddDay, onUpdateDay, onRemoveDay }) {
  const handleAddDay = () => {
    const mirroredAmount = item.qty * item.unitPrice; // auto-mirror Day 1 total
    onAddDay(item.id, { id: makeDayId(), amount: mirroredAmount });
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
      {(item.days || []).map((day, di) => (
        <tr key={day.id} className="day-sub-row">
          <td className="day-label-cell">└ Day {di + 2}</td>
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
  const [invoiceNo, setInvoiceNo] = useState(generateInvoiceNumber);
  const [invoiceDate, setInvoiceDate] = useState(todayStr);
  const [dueDate, setDueDate] = useState(dueDateStr);
  const [eventDate, setEventDate] = useState('');
  const [setupDate, setSetupDate] = useState('');
  const [lineItems, setLineItems] = useState([emptyLineItem(1)]);
  const [status, setStatus] = useState('Pending');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(DEFAULT_TERMS);
  const [nextId, setNextId] = useState(2);
  const [serviceCharge, setServiceCharge] = useState(''); // percentage, e.g. 10 = 10%
  const [discount, setDiscount] = useState('');           // percentage; mutually exclusive with service charge
  const [taxRate, setTaxRate] = useState('7.5');          // percentage; editable, defaults to Nigerian VAT
  const [transportation, setTransportation] = useState('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const [hasDraft, setHasDraft] = useState(() => !!localStorage.getItem(DRAFT_KEY));

  // Subtotal is the raw sum; every derived charge is rounded to 2dp so the figures,
  // the words, and the Naira/Kobo line always agree.
  const subtotalRaw = useMemo(() =>
    lineItems.reduce((s, i) => {
      const itemTotal = i.qty * i.unitPrice;
      const dayTotal = (i.days || []).reduce((d, day) => d + (+day.amount || 0), 0);
      return s + itemTotal + dayTotal;
    }, 0),
  [lineItems]);

  const discountActive = +discount > 0;
  const serviceActive  = +serviceCharge > 0;

  // Invoice money is whole Naira: round each component so the displayed charges
  // always sum to the grand total (and the words / Naira line stay in step).
  const discountAmount      = discountActive ? Math.round(subtotalRaw * (+discount || 0) / 100) : 0;
  const taxableBase         = Math.round(subtotalRaw - discountAmount); // discount comes off before tax
  const tax                 = Math.round(taxableBase * (+taxRate || 0) / 100);
  const serviceChargeAmount = serviceActive ? Math.round(subtotalRaw * (+serviceCharge || 0) / 100) : 0;
  const transportAmount     = Math.round(+transportation || 0);
  const total               = taxableBase + tax + serviceChargeAmount + transportAmount;

  const addLine = () => {
    setLineItems(prev => [...prev, emptyLineItem(nextId)]);
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
    if (!customer.name.trim()) {
      alert('Customer name is required before generating an invoice.');
      return;
    }
    setPdfLoading(true);
    try {
      const logoBase64 = await loadLogoBase64();
      const doc = new jsPDF('p', 'mm', 'a4');

      // Page chrome reused on every page so multi-page invoices stay branded.
      const drawCorners = () => {
        doc.setFillColor(...ORANGE);
        doc.circle(PAGE_W + 12, -12, 38, 'F');
        doc.setFillColor(...NAVY);
        doc.circle(-12, PAGE_H + 12, 38, 'F');
      };
      const drawFooter = () => {
        doc.setDrawColor(...ORANGE);
        doc.setLineWidth(0.8);
        doc.line(MARGIN, PAGE_H - 12, PAGE_W - MARGIN, PAGE_H - 12);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(...MUTED);
        doc.text(
          'BK Option Equipment Ventures  ·  Lagos, Nigeria  ·  +234 802 393 8469  ·  bkventure07@yahoo.com',
          PAGE_W / 2, PAGE_H - 7, { align: 'center' }
        );
      };

      // ── Page 1 header ──
      drawCorners();

      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 12, 10, 30, 10);
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...NAVY);
      doc.text('BK OPTION EQUIPMENT VENTURES', 46, 18);

      // ── Address block (right side) ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...NAVY);
      doc.text('Address:', PAGE_W - 12, 14, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...SLATE);
      doc.text('20, Daddy Adediran Street,', PAGE_W - 12, 20, { align: 'right' });
      doc.text('Ire-Akari Estate, Isolo.', PAGE_W - 12, 26, { align: 'right' });
      doc.text('Tel/WA: 08023938469, 08080861728', PAGE_W - 12, 32, { align: 'right' });
      doc.text('Email: bkventure07@yahoo.com', PAGE_W - 12, 38, { align: 'right' });

      // ── Divider line ──
      doc.setDrawColor(...NAVY);
      doc.setLineWidth(0.5);
      doc.line(12, 44, PAGE_W - 12, 44);

      // ── RE: INVOICE label ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...ORANGE);
      doc.text('RE: INVOICE', 12, 54);
      doc.setDrawColor(...ORANGE);
      doc.setLineWidth(0.5);
      doc.line(12, 56, 64, 56);

      // ── Invoice number ──
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      doc.text(invoiceNo, 12, 63);

      // ── Date / Issued To row ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...MUTED);
      doc.text('Date Issued:', 12, 72);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...INK);
      doc.text(invoiceDate, 44, 72);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...MUTED);
      doc.text('Due Date:', 12, 79);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...INK);
      doc.text(dueDate, 44, 79);

      // ── Issued To block (labeled format) ──
      const midX = PAGE_W / 2 + 10;
      const labelOff = 20; // mm from label start to value start
      const valW = PAGE_W - 12 - midX - labelOff - 2; // ~56mm available for values

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...NAVY);
      doc.text('Issued To:', midX, 68);

      let itY = 75;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...MUTED);
      doc.text('Name:', midX, itY);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...INK);
      doc.text(doc.splitTextToSize(customer.name || '—', valW)[0], midX + labelOff, itY);
      itY += 5;

      if (customer.email) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...MUTED);
        doc.text('Email:', midX, itY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...INK);
        doc.text(doc.splitTextToSize(customer.email, valW)[0], midX + labelOff, itY);
        itY += 5;
      }

      if (customer.phone) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...MUTED);
        doc.text('Phone:', midX, itY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...INK);
        doc.text(customer.phone, midX + labelOff, itY);
        itY += 5;
      }

      let issuedToBottom = itY;
      if (customer.address) {
        // "Delivery Address:" is too wide to sit inline, so label on top, value beneath.
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...MUTED);
        doc.text('Delivery Address:', midX, itY);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...INK);
        const splitAddr = doc.splitTextToSize(customer.address, PAGE_W - 12 - midX);
        doc.text(splitAddr, midX, itY + 5);
        issuedToBottom = itY + 5 + splitAddr.length * 4;
      }

      // ── Payment status badge ──
      const badgeRGB = statusBadgeColor(status);
      doc.setFillColor(...badgeRGB);
      doc.roundedRect(PAGE_W - 56, 63, 44, 10, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(status.toUpperCase(), PAGE_W - 34, 69.5, { align: 'center' });

      // ── Event / Set-up date band (sits just above the table, below the header blocks) ──
      const bandY = Math.max(82, issuedToBottom) + 8;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...NAVY);
      doc.text('Date of Event:', 12, bandY);
      const evLblW = doc.getTextWidth('Date of Event:');
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...INK);
      doc.text(eventDate || '—', 12 + evLblW + 2, bandY);

      const suVal = setupDate || '—';
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...INK);
      doc.text(suVal, PAGE_W - 12, bandY, { align: 'right' });
      const suValW = doc.getTextWidth(suVal);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...NAVY);
      doc.text('Set Up Date:', PAGE_W - 12 - suValW - 2, bandY, { align: 'right' });

      doc.setDrawColor(...MUTED);
      doc.setLineWidth(0.2);
      doc.line(12, bandY + 3, PAGE_W - 12, bandY + 3);

      // ── Line items table ──
      // margin.bottom reserves the footer strip; autoTable paginates the rows itself,
      // and didDrawPage stamps the footer on every page it creates.
      autoTable(doc, {
        startY: bandY + 8,
        head: [['S/N', 'DESCRIPTION', 'QTY', 'RATE', 'TOTAL']],
        body: lineItems.flatMap((item, idx) => [
          [
            idx + 1,
            item.description || '—',
            item.qty,
            Math.round(item.unitPrice).toLocaleString('en-NG'),
            Math.round(item.qty * item.unitPrice).toLocaleString('en-NG'),
          ],
          // Day sub-rows: gray italic, labels derived from index to match the form
          ...(item.days || []).map((day, di) => [
            { content: '', styles: { fillColor: [245, 246, 248] } },
            { content: `   - Day ${di + 2}`, styles: { fontStyle: 'italic', textColor: [110, 115, 130], fillColor: [245, 246, 248] } },
            { content: '', styles: { fillColor: [245, 246, 248] } },
            { content: '', styles: { fillColor: [245, 246, 248] } },
            { content: Math.round(+day.amount || 0).toLocaleString('en-NG'), styles: { halign: 'left', textColor: [110, 115, 130], fillColor: [245, 246, 248], fontStyle: 'italic' } },
          ]),
        ]),
        foot: [
          ...(discountActive ? [[
            { content: '', colSpan: 3 },
            { content: `Discount (${discount}%)`, styles: { halign: 'right', fontStyle: 'normal', fillColor: GREY_BG, textColor: SLATE } },
            { content: '- ' + formatPricePdf(discountAmount), styles: { halign: 'left', fillColor: GREY_BG, textColor: SLATE, fontSize: 8 } },
          ]] : []),
          [
            { content: '', colSpan: 3 },
            { content: `Tax (${+taxRate || 0}%)`, styles: { halign: 'right', fontStyle: 'normal', fillColor: GREY_BG, textColor: SLATE } },
            { content: formatPricePdf(tax), styles: { halign: 'left', fillColor: GREY_BG, textColor: SLATE, fontSize: 8 } },
          ],
          ...(serviceActive ? [[
            { content: '', colSpan: 3 },
            { content: `Service Charge (${serviceCharge}%)`, styles: { halign: 'right', fontStyle: 'normal', fillColor: GREY_BG, textColor: SLATE } },
            { content: formatPricePdf(serviceChargeAmount), styles: { halign: 'left', fillColor: GREY_BG, textColor: SLATE, fontSize: 8 } },
          ]] : []),
          ...(transportAmount > 0 ? [[
            { content: '', colSpan: 3 },
            { content: 'Transportation', styles: { halign: 'right', fontStyle: 'normal', fillColor: GREY_BG, textColor: SLATE } },
            { content: formatPricePdf(transportAmount), styles: { halign: 'left', fillColor: GREY_BG, textColor: SLATE, fontSize: 8 } },
          ]] : []),
          [
            { content: 'GRAND TOTAL', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold', fillColor: NAVY, textColor: [255, 255, 255], fontSize: 10 } },
            { content: formatPricePdf(total), styles: { halign: 'left', fontStyle: 'bold', fillColor: NAVY, textColor: [255, 255, 255], fontSize: 10 } },
          ],
        ],
        styles: { fontSize: 9, cellPadding: { top: 2, bottom: 2, left: 5, right: 5 }, textColor: INK },
        headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
        footStyles: { fontSize: 9 },
        showFoot: 'lastPage', // totals print once, on the final page of the table

        alternateRowStyles: { fillColor: [248, 249, 252] },
        // Widths sum to 186mm = 210 page − 24 (12mm margins) so nothing overflows.
        columnStyles: {
          0: { cellWidth: 16, halign: 'center' },
          1: { cellWidth: 58 },
          2: { cellWidth: 16, halign: 'center' },
          3: { cellWidth: 42, halign: 'left' },
          4: { cellWidth: 54, halign: 'left' },
        },
        margin: { top: 22, bottom: 22, left: 12, right: 12 },
        didDrawPage: drawFooter,
      });

      // ── Trailing blocks: flow down the page, breaking to a new page when needed ──
      // so Amount-in-Words / Notes / Terms / Signatures never overlap each other or
      // the footer on long invoices.
      const FLOW_BOTTOM = PAGE_H - 36; // keep content clear of the signature strip
      let y = doc.lastAutoTable.finalY + 12;

      const newPage = () => {
        doc.addPage();
        drawCorners();
        drawFooter();
        return 22;
      };
      const ensure = needed => { if (y + needed > FLOW_BOTTOM) y = newPage(); };

      // Amount in Words
      const words = numberToWords(total);
      const splitWords = doc.splitTextToSize(words, PAGE_W - 24);
      ensure(10 + splitWords.length * 5);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...NAVY);
      doc.text('Amount in Words:', 12, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...SLATE);
      doc.text(splitWords, 12, y + 6);
      y += 6 + splitWords.length * 5 + 4;

      // Naira / Kobo line
      ensure(8);
      doc.setDrawColor(...MUTED);
      doc.setLineWidth(0.3);
      doc.line(12, y, PAGE_W - 12, y);
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      const nairaAmt = Math.floor(total);
      const koboAmt  = Math.round((total - nairaAmt) * 100);
      doc.text(`Naira: ${nairaAmt.toLocaleString('en-NG')}`, 12, y + 5);
      doc.text(`Kobo: ${String(koboAmt).padStart(2, '0')}`, PAGE_W - 12, y + 5, { align: 'right' });
      y += 14;

      // Notes
      if (notes) {
        const splitNotes = doc.splitTextToSize(notes, PAGE_W - 24);
        ensure(5 + splitNotes.length * 4 + 6);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...NAVY);
        doc.text('Notes:', 12, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...MUTED);
        doc.text(splitNotes, 12, y + 5);
        y += 5 + splitNotes.length * 4 + 6;
      }

      // Terms & Conditions
      if (terms) {
        const splitTerms = doc.splitTextToSize(terms, PAGE_W - 24);
        ensure(5 + splitTerms.length * 4 + 4);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(...NAVY);
        doc.text('Terms & Conditions:', 12, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...MUTED);
        doc.text(splitTerms, 12, y + 5);
        y += 5 + splitTerms.length * 4 + 4;
      }

      // ── Signature lines (anchored to the bottom of the final page) ──
      if (y > FLOW_BOTTOM) y = newPage();
      const sigY = PAGE_H - 30;
      doc.setDrawColor(...NAVY);
      doc.setLineWidth(0.4);
      doc.line(12, sigY, 80, sigY);
      doc.line(PAGE_W - 80, sigY, PAGE_W - 12, sigY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...SLATE);
      doc.text("Customer's Signature", 12, sigY + 5);
      doc.text('Authorized Signature', PAGE_W - 12, sigY + 5, { align: 'right' });

      doc.save(`${invoiceNo}.pdf`);
    } catch (err) {
      console.error('Invoice PDF generation failed:', err);
      alert('Could not generate the PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const saveDraft = () => {
    const draft = { customer, invoiceNo, invoiceDate, dueDate, eventDate, setupDate, lineItems, status, notes, terms, serviceCharge, discount, taxRate, transportation };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    setHasDraft(true);
    alert('Draft saved!');
  };

  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      setCustomer(d.customer || { name: '', email: '', phone: '', address: '' });
      if (d.invoiceNo) setInvoiceNo(d.invoiceNo);
      setInvoiceDate(d.invoiceDate || todayStr());
      setDueDate(d.dueDate || dueDateStr());
      setEventDate(d.eventDate ?? '');
      setSetupDate(d.setupDate ?? '');
      const items = Array.isArray(d.lineItems) && d.lineItems.length
        ? d.lineItems
        : [emptyLineItem(1)];
      setLineItems(items);
      setStatus(d.status || 'Pending');
      setNotes(d.notes || '');
      setTerms(d.terms ?? DEFAULT_TERMS);
      setServiceCharge(d.serviceCharge ?? '');
      setDiscount(d.discount ?? '');
      setTaxRate(d.taxRate ?? '7.5');
      setTransportation(d.transportation ?? '');
      const maxId = items.reduce((m, i) => typeof i.id === 'number' ? Math.max(m, i.id) : m, 1);
      setNextId(maxId + 1);
    } catch {
      alert('Could not load the saved draft — it may be corrupted.');
    }
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
            {CUSTOMER_FIELDS.map(({ key, label, required }) => (
              <div className="form-group" key={key}>
                <label>{label}{required ? ' *' : ''}</label>
                <input
                  type={key === 'email' ? 'email' : 'text'}
                  placeholder={label}
                  value={customer[key]}
                  onChange={e => setCustomer(c => ({ ...c, [key]: e.target.value }))}
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
            <div className="form-group">
              <label>Date of Event</label>
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Set Up Date</label>
              <input type="date" value={setupDate} onChange={e => setSetupDate(e.target.value)} />
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
            <div className="summary-row summary-input-row">
              <span>Discount (%)</span>
              <div className="summary-pct-group">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                  className="summary-charge-input"
                  placeholder="0"
                />
                {discountActive && (
                  <span className="summary-pct-computed">− {formatPrice(discountAmount)}</span>
                )}
              </div>
            </div>
            <div className="summary-row summary-input-row">
              <span>Tax (%){discountActive ? ' on discounted subtotal' : ''}</span>
              <div className="summary-pct-group">
                <input
                  type="number"
                  min={0}
                  max={100}
                  step="0.1"
                  value={taxRate}
                  onChange={e => setTaxRate(e.target.value)}
                  className="summary-charge-input"
                  placeholder="0"
                />
                <span className="summary-pct-computed">= {formatPrice(tax)}</span>
              </div>
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
                {serviceActive && (
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
          <button className="btn btn-tertiary btn-lg" onClick={loadDraft} disabled={!hasDraft}>
            Load Draft
          </button>
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
