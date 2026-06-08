// Standalone sample-PDF generator that mirrors AdminInvoicePage.generatePDF,
// so we can eyeball the layout without driving the browser.
// Run: node scripts/sample-invoice.mjs
import fs from 'node:fs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const DEFAULT_TERMS =
  'Payment due within 7 days of invoice date. Late payments are subject to a 5% monthly interest charge. Equipment remains the property of BK Option Ventures until full payment is received.';

const formatPricePdf = p => 'NGN ' + Math.round(p || 0).toLocaleString('en-NG');

const NAVY = [30, 58, 138], ORANGE = [249, 115, 22], MUTED = [90, 95, 110];
const INK = [25, 25, 35], SLATE = [50, 50, 60], GREY_BG = [243, 244, 246];
const MARGIN = 12, PAGE_W = 210, PAGE_H = 297;

const logoBase64 = 'data:image/png;base64,' +
  fs.readFileSync(new URL('../src/Images/Logo/Logo.png', import.meta.url)).toString('base64');

function statusBadgeColor(status) {
  switch (status) {
    case 'Paid':           return [16, 185, 129];
    case 'Overdue':        return [239, 68, 68];
    case 'Partially Paid': return [20, 184, 166];
    default:               return ORANGE;
  }
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

function renderInvoice(data, outPath) {
  const {
    customer, invoiceNo, invoiceDate, dueDate, eventDate, setupDate,
    lineItems, status, notes, terms, serviceCharge, discount, transportation,
  } = data;

  const subtotalRaw = lineItems.reduce((s, i) => {
    const itemTotal = i.qty * i.unitPrice;
    const dayTotal = (i.days || []).reduce((d, day) => d + (+day.amount || 0), 0);
    return s + itemTotal + dayTotal;
  }, 0);

  const discountActive = +discount > 0;
  const serviceActive  = !discountActive && +serviceCharge > 0;
  const discountAmount      = discountActive ? Math.round(subtotalRaw * (+discount || 0) / 100) : 0;
  const taxableBase         = Math.round(subtotalRaw - discountAmount);
  const tax                 = Math.round(taxableBase * 0.075);
  const serviceChargeAmount = serviceActive ? Math.round(subtotalRaw * (+serviceCharge || 0) / 100) : 0;
  const transportAmount     = Math.round(+transportation || 0);
  const total               = taxableBase + tax + serviceChargeAmount + transportAmount;

  const doc = new jsPDF('p', 'mm', 'a4');

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
    doc.text('BK Option Equipment Ventures  -  Lagos, Nigeria  -  +234 802 393 8469  -  bkventure07@yahoo.com',
      PAGE_W / 2, PAGE_H - 7, { align: 'center' });
  };

  drawCorners();
  doc.addImage(logoBase64, 'PNG', 12, 10, 30, 10);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(...NAVY);
  doc.text('BK OPTION EQUIPMENT VENTURES', 46, 18);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...NAVY);
  doc.text('Address:', PAGE_W - 12, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal'); doc.setTextColor(...SLATE);
  doc.text('20, Daddy Adediran Street,', PAGE_W - 12, 20, { align: 'right' });
  doc.text('Ire-Akari Estate, Isolo.', PAGE_W - 12, 26, { align: 'right' });
  doc.text('Tel/WA: 08023938469, 08080861728', PAGE_W - 12, 32, { align: 'right' });
  doc.text('Email: bkventure07@yahoo.com', PAGE_W - 12, 38, { align: 'right' });

  doc.setDrawColor(...NAVY); doc.setLineWidth(0.5);
  doc.line(12, 44, PAGE_W - 12, 44);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(...ORANGE);
  doc.text('RE: INVOICE', 12, 54);
  doc.setDrawColor(...ORANGE); doc.setLineWidth(0.5);
  doc.line(12, 56, 64, 56);

  doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...MUTED);
  doc.text(invoiceNo, 12, 63);

  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...MUTED);
  doc.text('Date Issued:', 12, 72);
  doc.setFont('helvetica', 'normal'); doc.setTextColor(...INK);
  doc.text(invoiceDate, 44, 72);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(...MUTED);
  doc.text('Due Date:', 12, 79);
  doc.setFont('helvetica', 'normal'); doc.setTextColor(...INK);
  doc.text(dueDate, 44, 79);

  const midX = PAGE_W / 2 + 10;
  const labelOff = 20;
  const valW = PAGE_W - 12 - midX - labelOff - 2;

  doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...NAVY);
  doc.text('Issued To:', midX, 68);

  let itY = 75;
  doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...MUTED);
  doc.text('Name:', midX, itY);
  doc.setFont('helvetica', 'normal'); doc.setTextColor(...INK);
  doc.text(doc.splitTextToSize(customer.name || '-', valW)[0], midX + labelOff, itY);
  itY += 5;
  if (customer.email) {
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...MUTED);
    doc.text('Email:', midX, itY);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...INK);
    doc.text(doc.splitTextToSize(customer.email, valW)[0], midX + labelOff, itY);
    itY += 5;
  }
  if (customer.phone) {
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...MUTED);
    doc.text('Phone:', midX, itY);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...INK);
    doc.text(customer.phone, midX + labelOff, itY);
    itY += 5;
  }
  let issuedToBottom = itY;
  if (customer.address) {
    doc.setFont('helvetica', 'bold'); doc.setTextColor(...MUTED);
    doc.text('Delivery Address:', midX, itY);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...INK);
    const splitAddr = doc.splitTextToSize(customer.address, PAGE_W - 12 - midX);
    doc.text(splitAddr, midX, itY + 5);
    issuedToBottom = itY + 5 + splitAddr.length * 4;
  }

  const badgeRGB = statusBadgeColor(status);
  doc.setFillColor(...badgeRGB);
  doc.roundedRect(PAGE_W - 56, 63, 44, 10, 2, 2, 'F');
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255);
  doc.text(status.toUpperCase(), PAGE_W - 34, 69.5, { align: 'center' });

  // Event / Set-up date band
  const bandY = Math.max(82, issuedToBottom) + 8;
  doc.setFontSize(8.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
  doc.text('Date of Event:', 12, bandY);
  const evLblW = doc.getTextWidth('Date of Event:');
  doc.setFont('helvetica', 'normal'); doc.setTextColor(...INK);
  doc.text(eventDate || '-', 12 + evLblW + 2, bandY);
  const suVal = setupDate || '-';
  doc.setFont('helvetica', 'normal'); doc.setTextColor(...INK);
  doc.text(suVal, PAGE_W - 12, bandY, { align: 'right' });
  const suValW = doc.getTextWidth(suVal);
  doc.setFont('helvetica', 'bold'); doc.setTextColor(...NAVY);
  doc.text('Set Up Date:', PAGE_W - 12 - suValW - 2, bandY, { align: 'right' });
  doc.setDrawColor(...MUTED); doc.setLineWidth(0.2);
  doc.line(12, bandY + 3, PAGE_W - 12, bandY + 3);

  autoTable(doc, {
    startY: bandY + 8,
    head: [['S/N', 'DESCRIPTION', 'QTY', 'RATE', 'TOTAL']],
    body: lineItems.flatMap((item, idx) => [
      [idx + 1, item.description || '-', item.qty,
        Math.round(item.unitPrice).toLocaleString('en-NG'), Math.round(item.qty * item.unitPrice).toLocaleString('en-NG')],
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
        { content: 'Tax (7.5%)', styles: { halign: 'right', fontStyle: 'normal', fillColor: GREY_BG, textColor: SLATE } },
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
    showFoot: 'lastPage',
    alternateRowStyles: { fillColor: [248, 249, 252] },
    columnStyles: {
      0: { cellWidth: 16, halign: 'center' }, 1: { cellWidth: 58 },
      2: { cellWidth: 16, halign: 'center' }, 3: { cellWidth: 42, halign: 'left' },
      4: { cellWidth: 54, halign: 'left' },
    },
    margin: { top: 22, bottom: 22, left: 12, right: 12 },
    didDrawPage: drawFooter,
  });

  const FLOW_BOTTOM = PAGE_H - 36;
  let y = doc.lastAutoTable.finalY + 12;
  const newPage = () => { doc.addPage(); drawCorners(); drawFooter(); return 22; };
  const ensure = needed => { if (y + needed > FLOW_BOTTOM) y = newPage(); };

  const words = numberToWords(total);
  const splitWords = doc.splitTextToSize(words, PAGE_W - 24);
  ensure(10 + splitWords.length * 5);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...NAVY);
  doc.text('Amount in Words:', 12, y);
  doc.setFont('helvetica', 'normal'); doc.setTextColor(...SLATE);
  doc.text(splitWords, 12, y + 6);
  y += 6 + splitWords.length * 5 + 4;

  ensure(8);
  doc.setDrawColor(...MUTED); doc.setLineWidth(0.3);
  doc.line(12, y, PAGE_W - 12, y);
  doc.setFontSize(8); doc.setTextColor(...MUTED);
  const nairaAmt = Math.floor(total);
  const koboAmt = Math.round((total - nairaAmt) * 100);
  doc.text(`Naira: ${nairaAmt.toLocaleString('en-NG')}`, 12, y + 5);
  doc.text(`Kobo: ${String(koboAmt).padStart(2, '0')}`, PAGE_W - 12, y + 5, { align: 'right' });
  y += 14;

  if (notes) {
    const splitNotes = doc.splitTextToSize(notes, PAGE_W - 24);
    ensure(5 + splitNotes.length * 4 + 6);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...NAVY);
    doc.text('Notes:', 12, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...MUTED);
    doc.text(splitNotes, 12, y + 5);
    y += 5 + splitNotes.length * 4 + 6;
  }
  if (terms) {
    const splitTerms = doc.splitTextToSize(terms, PAGE_W - 24);
    ensure(5 + splitTerms.length * 4 + 4);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(...NAVY);
    doc.text('Terms & Conditions:', 12, y);
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...MUTED);
    doc.text(splitTerms, 12, y + 5);
    y += 5 + splitTerms.length * 4 + 4;
  }

  if (y > FLOW_BOTTOM) y = newPage();
  const sigY = PAGE_H - 30;
  doc.setDrawColor(...NAVY); doc.setLineWidth(0.4);
  doc.line(12, sigY, 80, sigY);
  doc.line(PAGE_W - 80, sigY, PAGE_W - 12, sigY);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...SLATE);
  doc.text("Customer's Signature", 12, sigY + 5);
  doc.text('Authorized Signature', PAGE_W - 12, sigY + 5, { align: 'right' });

  fs.writeFileSync(outPath, Buffer.from(doc.output('arraybuffer')));
  console.log('wrote', outPath, '-', doc.getNumberOfPages(), 'page(s)');
}

const outPath = name =>
  new URL(`../conclusions/${name}`, import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');

// ── Sample 1: single page — event/setup band, discount, delivery address ──
renderInvoice({
  customer: { name: 'Chidinma Okafor', email: '', phone: '0803 123 4567', address: '14 Admiralty Way, Lekki Phase 1, Lagos State' },
  invoiceNo: 'INV-2026-4821',
  invoiceDate: '2026-06-08',
  dueDate: '2026-06-15',
  eventDate: '2026-06-20',
  setupDate: '2026-06-19',
  status: 'Pending',
  discount: '10',
  serviceCharge: '',
  transportation: '15000',
  notes: 'Balance due on the day of setup. Confirm final guest count 48 hours before the event.',
  terms: DEFAULT_TERMS,
  lineItems: [
    { id: 1, description: 'Large Canopy (20x20 ft)', qty: 2, unitPrice: 45000, days: [{ id: 'a', amount: 45000 }] },
    { id: 2, description: 'Banquet Round Tables', qty: 10, unitPrice: 3500, days: [] },
    { id: 3, description: 'Chiavari Chairs', qty: 120, unitPrice: 800, days: [] },
    { id: 4, description: 'Industrial Standing Fans', qty: 6, unitPrice: 5000, days: [] },
    { id: 5, description: 'Mobile Air Conditioner Units', qty: 2, unitPrice: 25000, days: [] },
  ],
}, outPath('sample-invoice.pdf'));

// ── Sample 2: long item list — proves trailing blocks flow to a clean 2nd page ──
renderInvoice({
  customer: { name: 'Chidinma Okafor', email: 'chidi.okafor@example.com', phone: '0803 123 4567', address: '14 Admiralty Way, Lekki Phase 1, Lagos State' },
  invoiceNo: 'INV-2026-4822',
  invoiceDate: '2026-06-08',
  dueDate: '2026-06-15',
  eventDate: '2026-06-22',
  setupDate: '2026-06-21',
  status: 'Partially Paid',
  discount: '',
  serviceCharge: '7.5',
  transportation: '20000',
  notes: 'Setup crew arrives 7am. Breakdown same night after event close.',
  terms: DEFAULT_TERMS,
  lineItems: Array.from({ length: 26 }, (_, i) => ({
    id: i + 1,
    description: `Equipment item line ${i + 1}`,
    qty: (i % 5) + 1,
    unitPrice: 2500 + i * 350,
    days: [],
  })),
}, outPath('sample-invoice-long.pdf'));
