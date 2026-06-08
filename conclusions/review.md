# BK Option Ventures — Code Review

_Reviewed: 2026-06-08 · Branch: `main`_

A storefront (React 19 + Vite) over a PHP/MySQL API, with a WhatsApp-quote checkout
(no payment gateway) and a weakly-gated admin area (products + PDF invoice generator).

This document lists bugs and UI issues found during review, ordered by severity, and
notes which were fixed in the accompanying change set.

---

## 🐞 Bugs

### B1. Product detail page flashes "Product not found" while data loads — **FIXED**
`ProductDetailPage` looks the product up in the context arrays, which start empty and
are filled by an async fetch (and 30 s polling). On a hard refresh or a shared deep
link (`/rentals/:id`), `product` is `undefined` for the first render, so the page
briefly shows the **"Product not found"** error before the data arrives.

**Fix:** consume `loading` from `ProductsContext` and show a loading state until the
first fetch resolves; only show "not found" once loading is complete.

### B2. "Contact for Quote" triggers a full page reload — **FIXED**
`ProductDetailPage` used `<a href="/contact">`, which does a full browser navigation
instead of client-side routing — losing the SPA state (and the cart). Replaced with
React Router `<Link to="/contact">`.

### B3. Invoice "Notes" are collected but never appear on the PDF — **FIXED**
`AdminInvoicePage` has a Notes textarea and includes `notes` in the saved draft, but
`generatePDF` never renders it. Users typing notes would reasonably expect them on the
invoice. Added a Notes block to the PDF (rendered above Terms when present).

### B4. "Save Draft" had no way to reload — **FIXED**
The invoice page wrote a draft to `localStorage` but nothing ever read it back, so the
feature was a dead end. Added a **Load Draft** button that restores a saved draft, and
disabled it when no draft exists.

### B5. Unguarded `product.specs.map` — **FIXED (defensive)**
`ProductDetailPage` rendered `product.specs.map(...)` with no guard. The API currently
always returns `specs: []`, but a malformed/legacy record would crash the page. Guarded
with `(product.specs || [])` and an empty-state message.

### B6. Cart does not survive a refresh — **FIXED (per request)**
`CartContext` held the cart only in memory; any refresh emptied it. Now persisted to
`localStorage` (hydrated on load, written on change).

### B7. `price` / `priceUnit` are dead fields in the product admin — **NOT CHANGED**
`AdminProductsPage` keeps `price` in form state but never renders a price input and
always saves `price: 0`. The storefront never displays a price either (intentional —
quotes happen over WhatsApp). This is consistent but the unused form fields are
confusing. Left as-is since pricing is deliberately out of the storefront; worth a
follow-up cleanup if pricing is truly never shown.

---

## 🎨 UI / UX

### U1. No feedback when adding to cart — **FIXED**
Clicking "Add to Cart" only bumped the (off-screen) cart badge. Buttons now flip to
**"Added ✓"** for ~1.5 s as immediate confirmation (`ProductCard` and the detail page).

### U2. Placeholder social links jumped to top of page — **FIXED (WhatsApp only)**
Footer and Contact had `href="#"` social icons that scrolled to the top / dirtied the
URL. The WhatsApp icon now links to `wa.me/<CEO number>` (from `config.js`) and opens in
a new tab. Facebook/Instagram left as placeholders pending real accounts.

### U3. About page shipped with dead code — **FIXED (removed)**
The entire "Our Story" section was commented out and a `team` array was declared but
never rendered (ESLint flagged it). Removed both to keep the file clean.

### U4. Hardcoded rating / review count on every product — **NOT CHANGED**
The detail page always shows `⭐⭐⭐⭐⭐ (2 reviews)` and two placeholder reviews,
regardless of product. Acceptable as placeholder, but should be wired to real data (or
hidden) before launch to avoid misleading shoppers.

### U5. Sales category filter is a fixed list — **NOT CHANGED**
`SalesPage` hardcodes `['Chairs','Tables','Fans']`. Products in other categories still
render but can't be filtered. Consider deriving categories from the live product set.

---

## 🔒 Security / Ops (informational — not changed)

These reflect the project's documented "deliberately weak" auth model. Listed so they
aren't forgotten before a real launch.

- **S1. Admin password ships in the client bundle.** `ADMIN_PASSWORD` in `src/config.js`
  is the same value sent as `X-Api-Key` and is fully visible in the built JS. Anyone can
  read it and call the write/upload/delete endpoints. A real fix needs a server-side
  session/login rather than a shared constant.
- **S2. `Access-Control-Allow-Origin: *` on write endpoints.** Combined with S1, any
  origin can perform admin writes. Restrict CORS to the site origin once a real auth flow
  exists.
- **S3. DB credentials are committed defaults** (`root` / no password in `api/config.php`).
  Must be changed before deploying — already called out in comments, but easy to miss.
- **S4. `deleteRelations` builds SQL via string concatenation** (with
  `real_escape_string`, so not currently injectable, but inconsistent with the prepared
  statements used everywhere else). Prefer parameterized queries throughout.

---

## 🧹 Lint / housekeeping

`npm run lint` reported 5 errors before this change set:

| File | Issue | Status |
|------|-------|--------|
| `components/carousel.jsx` | `slide4` imported but never used | **FIXED** (removed import) |
| `pages/AboutPage.jsx` | `team` declared but never used | **FIXED** (removed) |
| `context/CartContext.jsx` | react-refresh: hook + component in one file | left (conventional context pattern) |
| `context/ProductsContext.jsx` | react-refresh + set-state-in-effect | left (intended polling pattern) |

---

## Summary of changes applied

- Cart persisted to `localStorage` (B6)
- Product detail: loading state (B1), `<Link>` for quote (B2), specs guard (B5),
  add-to-cart feedback (U1)
- `ProductCard`: add-to-cart "Added ✓" feedback (U1)
- Invoice: notes rendered on PDF (B3), Load Draft button (B4)
- WhatsApp social links wired (U2)
- About page dead code removed (U3)
- Carousel unused import removed (lint)
