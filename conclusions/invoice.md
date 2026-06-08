# AdminInvoicePage.jsx — Structural Review

_Reviewed: 2026-06-08 · analysis below; a first round of fixes has since been applied._

## ✅ Implemented (2026-06-08)

- **4.9 Single-page overflow — FIXED.** Trailing blocks (Amount in Words, Naira/Kobo,
  Notes, Terms, Signatures) now flow with an `ensure(needed)` page-break helper, the table
  reserves a bottom margin, and a `drawFooter` runs on every page via `didDrawPage` (and on
  manually added pages). Content can no longer pile up and overlap.
- **Smaller line-item rows — DONE.** Table `cellPadding` dropped from `5` to
  `{ top: 2, bottom: 2, left: 5, right: 5 }`, so more items fit per page.
- **4.3 Money rounding — FIXED.** Added `round2()`; tax/service/transport/total are each
  rounded so figures, words, and the Naira/Kobo line agree (no stray 100-kobo).
- **4.7 Day labels — FIXED.** Labels are now derived from index (`Day {i+2}`) in both the
  form and the PDF, so removing/re-adding days never mis-numbers.
- **4.2 Named constants — DONE.** Brand colours (`NAVY`/`ORANGE`/…) and layout
  (`MARGIN`/`PAGE_W`/`PAGE_H`) are named and reused.
- **4.4 / 4.5 — DONE.** `hasDraft` moved up with the other state; `emptyLineItem()` factory
  and `DRAFT_KEY` const remove the duplicated literals; `makeDayId()` replaces inline
  `Date.now()` (4.6).
- **4.8 / 4.10 — DONE.** `generatePDF` now guards on an empty customer name, renders
  `email` in the Issued-To block, and is wrapped in try/catch with a user-facing alert.

Not yet done: **4.1** (extracting `invoicePdf.js` into its own module) and the **4.11**
polish items. The analysis below is kept for reference.

---

_Original review · 640 lines · analysis only, nothing changed_

Goal of this doc: explain what the file does, what it does well, and where its
**structure** can improve — all **within the existing design** (single self-contained
admin page, client-side jsPDF generation, plain `admin.css` classes, `alert()` feedback,
single-page A4 branded invoice, no backend/persistence beyond one localStorage draft).

---

## 1. What it is

A single React component that lets an admin **build an invoice through a form and export
a branded A4 PDF entirely in the browser** (jsPDF + jspdf-autotable). There is no server
round-trip: the only persistence is a single "draft" slot in `localStorage`.

## 2. How it's structured today

```
Module scope
├── DEFAULT_TERMS                         (const)
├── pure helpers: generateInvoiceNumber, todayStr, dueDateStr,
│                 formatPrice, statusBadgeColor, loadLogoBase64, numberToWords
├── LineItemRow                           (presentational sub-component + "+Day" logic)
└── AdminInvoicePage  (default export)
    ├── 12 useState hooks (one — hasDraft — declared at L443, far below the rest)
    ├── derived totals: subtotal (useMemo), tax, serviceChargeAmount, total
    ├── line-item / day CRUD handlers
    ├── generatePDF  (~250 lines of absolute-coordinate layout)
    ├── saveDraft / loadDraft
    └── JSX form (Customer / Details / Line Items / Pricing / Status / Notes / Actions)
```

Three responsibilities live in one file: **pure utilities**, a **row component**, and the
**page + PDF renderer**.

## 3. What's already done well (keep these)

- Pure, side-effect-free helpers hoisted to module scope.
- `subtotal` memoized; totals derived from state rather than stored (single source of truth).
- Clear section comments in both the PDF code and the JSX.
- Thoughtful touches: day sub-rows, `splitTextToSize` for wrapping, status-coloured badge,
  amount-in-words, graceful logo fallback (`loadLogoBase64` resolves `null`).
- Charges (`serviceCharge`, `transportation`) kept as strings so the inputs can be empty —
  a deliberate, correct choice.

---

## 4. Improvement opportunities

Ordered roughly by value. Severity: 🔴 correctness · 🟡 structure/maintainability · 🟢 polish.

### 4.1 🟡 Extract the PDF renderer out of the component _(headline change)_
`generatePDF` is ~250 lines reading 9 state values via closure. It's the single biggest
structural smell. Move it to a pure module, e.g.:

```
src/pages/Admin/invoice/
├── invoicePdf.js     // renderInvoicePdf(data) -> saves PDF; owns all layout + numberToWords + loadLogo
├── invoiceUtils.js   // formatPrice, todayStr, dueDateStr, ids, emptyLineItem, computeTotals, DRAFT_KEY
├── LineItemRow.jsx
└── AdminInvoicePage.jsx  // state + JSX only
```

`renderInvoicePdf({ customer, invoiceNo, ..., totals })` takes a plain object, so it's
testable and reusable, and the component drops to a readable size. **No design change** —
still client-side jsPDF, same output.

### 4.2 🟡 Name the layout constants and brand colours
The PDF is full of magic numbers (`12`, `pageW - 12`, `44`, `54`, `63`, `72`…) and repeated
RGB tuples that are really the brand palette:

- `[30, 58, 138]` = `--color-primary` (navy), appears ~12×
- `[249, 115, 22]` = `--color-secondary` (orange)
- `[90, 95, 110]`, `[50, 50, 60]`, `[25, 25, 35]`, `[243, 244, 246]` = greys

Define once at the top of `invoicePdf.js`:

```js
const NAVY = [30, 58, 138], ORANGE = [249, 115, 22], MUTED = [90, 95, 110];
const MARGIN = 12, PAGE_W = 210, PAGE_H = 297;
```

Mirrors the CSS design tokens, kills duplication, and makes a palette tweak one-line.

### 4.3 🔴 Money math is float-based — rounding drift
`tax = subtotal * 0.075` and `kobo = Math.round((total - naira) * 100)` run on floating
naira. Three concrete risks:

- Displayed line totals (`toLocaleString`) need not sum to the displayed `total`.
- `koboAmt` can round to **100** (e.g. total `x.999` → prints "Kobo: 100" while Naira stays
  at `x`), an off-by-one on the invoice.
- "Amount in words" can disagree with the figure by a kobo.

Within design: add one `round2()` helper (or compute in integer kobo) and build `total`
from **rounded** components so figures, words, and the Naira/Kobo line always agree.

### 4.4 🟡 Consolidate state; move `hasDraft` up
12 `useState` calls, with `hasDraft` declared at **L443** — after `generatePDF`, far from
its siblings. At minimum, move it up with the others. Optional (still within design):
group related fields into objects, e.g. `meta = { invoiceNo, invoiceDate, dueDate, status }`
and `charges = { serviceCharge, transportation }`, matching the existing `customer` object
precedent. (A full `useReducer` is possible but heavier than the current style.)

### 4.5 🟡 De-duplicate repeated literals
- The empty line-item object `{ id, description:'', qty:0, unitPrice:0, days:[] }` appears
  **3×** (initial state, `addLine`, `loadDraft` fallback) → extract `emptyLineItem(id)`.
- The string `'invoiceDraft'` is repeated in `saveDraft`, `loadDraft`, and the `hasDraft`
  initializer → extract `const DRAFT_KEY = 'invoiceDraft'`.

### 4.6 🟡 Two ID schemes / collision risk
Line items use an incrementing numeric `nextId`; day rows use `d_${Date.now()}`. Mixed
schemes, and `Date.now()` can collide if two days are added in the same millisecond. A
small shared `makeId()` (or a monotonic counter) unifies both.

### 4.7 🔴 Day labels are stored, not derived — mis-numbering bug
`LineItemRow.handleAddDay` computes `Day ${days.length + 2}` and **stores** the label in
state. Remove "Day 2" from `[Day 2, Day 3]` and add a new one → `length(1) + 2 = "Day 3"`,
a duplicate. Because labels are persisted rather than derived, removals never relabel.
Fix within design: **derive** `Day {index + 2}` at render/print time instead of storing it.
(Also: the "+Day" mirror of `qty × unitPrice` is business logic sitting in a presentational
row — fine, but worth noting if rows get extracted.)

### 4.8 🟡 No validation gate, and `email` is collected but never printed
Name and Phone show a required `*`, but `generatePDF`/`saveDraft` enforce nothing — you can
export with an empty customer (Name falls back to `—`). Either gate Generate (disable +
inline error when Name is empty) to honour the asterisks, or drop them. Separately,
`customer.email` is captured in the form and the draft but **never rendered on the PDF** —
decide to print it (in the Issued-To block) or remove the asterisk expectation.

### 4.9 🔴 Single-page layout breaks for long invoices
All trailing blocks (Amount in Words, Notes, Terms, Signatures, Footer) are positioned from
`lastAutoTable.finalY` on a **fixed A4 page**. autoTable paginates the table, but the
trailing content has no page-break handling, so a long item list pushes those blocks off the
page or onto the fixed footer (`PAGE_H - 12`). Within design: after the table, check
remaining vertical space and `doc.addPage()` before the trailing blocks (or render footer/
signatures via autoTable's `didDrawPage`). This is the most likely real-world breakage.

### 4.10 🟡 `generatePDF` swallows errors
The body has only a `finally` that resets `pdfLoading`; if jsPDF throws, nothing surfaces to
the user (and it becomes an unhandled rejection). Add a `catch` with an `alert()` —
consistent with the existing alert-based feedback style.

### 4.11 🟢 Minor consistency / polish
- `formatPrice` uses `₦ + toLocaleString` while line totals in the table use bare
  `toLocaleString('en-NG')` (no symbol, and locale may vary fraction digits). Pick one money
  formatter and reuse it everywhere.
- `numberToWords` doesn't handle ≥ 1 billion cleanly ("One Thousand Million"). Low priority
  for this business, but a known edge.
- Empty actions `<th></th>` in the line-items table header — add a visually-hidden label for
  screen readers.
- Tax is always 7.5% with no exemption path; flag only if a zero-VAT invoice is ever needed
  (would be a small feature, not a refactor).

---

## 5. Suggested target layout (optional, illustrative)

```
src/pages/Admin/invoice/
├── AdminInvoicePage.jsx   ~180 lines  (state + JSX)
├── LineItemRow.jsx        ~80         (row, derives day labels)
├── invoiceUtils.js        ~60         (dates, ids, money, emptyLineItem, computeTotals, DRAFT_KEY)
└── invoicePdf.js          ~260        (renderInvoicePdf + layout constants + numberToWords + loadLogo)
```

Same dependencies, same visual output, same UX — just sliced along its existing seams.

## 6. If I were to prioritise

1. **4.3 / 4.9 / 4.7** — the three correctness issues (money rounding, page overflow, day
   labels). These can produce a wrong or broken invoice.
2. **4.1** — extract `invoicePdf.js`; everything else gets easier afterwards.
3. **4.4 / 4.5 / 4.2** — quick maintainability wins (group state, kill duplicated literals,
   name the constants).
4. **4.8 / 4.10 / 4.11** — validation, error surfacing, polish.

---

_Nothing here changes the tool's design — same client-side jsPDF flow, brand styling, and
admin UX. Tell me which of these you'd like me to implement (and what personal changes
you're planning) and I'll scope to that._
