# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (frontend only — needs PHP API on /api)
npm run build     # Production build → dist/
npm run preview   # Preview the production build
npm run lint      # ESLint (flat config)
```

There is no test runner configured.

The frontend expects the PHP API at `/api/*.php`. `vite.config.js` already proxies `/api` → `http://localhost`, so in dev just run PHP separately on port 80 (XAMPP/MAMP) and `npm run dev` will forward API calls to it. In production, frontend and API ship to the same domain (typical LAMP host).

**Deployment caveat:** `vercel.json` (SPA fallback rewrites) is committed, but Vercel serves only the static `dist/` — it cannot run the PHP API. A Vercel deploy gives you a frontend with no working backend. Real deployment is a LAMP host serving both `dist/` and `api/` from one docroot.

## Stack

- **Frontend:** React 19 + Vite 8, JavaScript (no TypeScript), React Router 7, plain CSS per component
- **Backend:** PHP + MySQL (mysqli), no framework — see `api/*.php`
- **PDF:** jsPDF + jspdf-autotable (invoice generation, client-side)
- **Forms:** react-hook-form is installed but not yet used everywhere
- **No payment gateway:** checkout builds a `wa.me/...` deep link with the cart pre-filled

`src/firebaseConfig.js` is committed but Firebase is not wired in anywhere — treat it as inert.

## Architecture

### Render tree

```
main.jsx
└── BrowserRouter
    └── ProductsProvider
        └── CartProvider
            └── App.jsx
                ├── <Nav />
                ├── <CartDrawer />        (controlled by CartContext)
                ├── <Routes>
                │   ├── /              → HomePage
                │   ├── /rentals       → RentalsPage
                │   ├── /rentals/:id   → ProductDetailPage type="rental"
                │   ├── /sales         → SalesPage
                │   ├── /sales/:id     → ProductDetailPage type="sale"
                │   ├── /about         → AboutPage
                │   ├── /contact       → ContactPage
                │   └── /admin         → AdminLayout (gated by sessionStorage)
                │       ├── index      → AdminDashboard
                │       ├── products   → AdminProductsPage
                │       └── invoice    → AdminInvoicePage
                └── <Footer />
```

### Data flow — products

`ProductsContext` (`src/context/ProductsContext.jsx`) is the single source of truth for products at runtime.

- On mount it fetches `/api/products.php?type=rental` and `?type=sale`, then **polls every 30 seconds** so the storefront reflects admin edits without a manual refresh. Be mindful: changes will appear on a delay, not instantly.
- `addProduct`, `updateProduct`, `deleteProduct` send `X-Api-Key: ADMIN_PASSWORD` and re-fetch on success.
- `src/data/products.js` is a **legacy static catalog** — it is no longer imported and should not be edited as a way to change live products. The live catalog lives in MySQL.

### Data flow — cart & checkout

`CartContext` (`src/context/CartContext.jsx`) holds an in-memory `[{ product, qty }]` array via `useReducer`. **The cart does not persist** — a refresh empties it. If you add persistence, do it in this provider.

`CartDrawer` builds a WhatsApp message and opens `https://wa.me/${CEO_WHATSAPP}?text=...`. The number lives in `src/config.js`.

### Admin auth — the two-key invariant

Admin auth is **deliberately weak** (single shared password). Two values **must stay in sync**:

| Where | Constant |
|-------|----------|
| `src/config.js` | `ADMIN_PASSWORD` — gates the login modal in `AdminLayout`, sent as `X-Api-Key` header on write requests |
| `api/config.php` | `API_KEY` — checked by `requireApiKey()` in `api/products.php` and `api/upload.php` |

If you rotate one, rotate both. Auth state is `sessionStorage.adminAuth === 'true'` — survives nav but not a tab close. `/admin` is not linked from the public nav.

### Backend (`api/*.php`)

Every endpoint includes `cors.php` (sets JSON + permissive CORS headers, handles OPTIONS preflight) and `config.php` (DB credentials + `db()` singleton + `API_KEY`).

- `api/products.php` — GET (list by `?type=rental|sale`, or single by `?id=`), POST/PUT/DELETE (require API key). On PUT it deletes and re-inserts all `product_images` + `product_specs` for that product.
- `api/upload.php` — POST multipart `image` field, returns `{ url: '/uploads/products/<file>' }`. Validates MIME from file content (not the client header), 5 MB cap. Uploaded files land in `<docroot>/uploads/products/` — make sure that directory exists and is writable when deploying.
- `api/contact.php` — POST contact form into `contact_submissions`.

### Database

Schema in `database/schema.sql`, seed in `database/seed.sql`. There is **no migrations framework** — apply schema changes by editing the SQL files and re-running them by hand. Tables:

- `products` (`id` is a varchar slug, not auto-increment; `stock` is NULL for rentals, int for sales)
- `product_images`, `product_specs` — one-to-many, cascade-deleted with parent
- `contact_submissions`

Connection settings in `api/config.php` are currently the XAMPP defaults (`root` / no password). Change before deploying.

### Image pipeline

Two paths exist:

1. **Bundled images** (`src/Images/**`) — imported as ES modules, included in legacy `products.js` and on home/about pages. Vite fingerprints them.
2. **Uploaded images** — admin uploads via `api/upload.php` → stored URL like `/uploads/products/product_xxx.jpg` saved in `product_images.image_url`.

`src/utils/imageUtils.js` exposes `compressImage(file, maxPx, quality)` — used client-side **before** upload to keep files small.

## Design system (current — don't change without asking)

Colors live as CSS custom properties in `src/css/global.css`. Brand palette:

- `--color-primary: #1e3a8a` (Navy Blue)
- `--color-secondary: #f97316` (Orange)
- `--color-accent: #14b8a6` (Teal)
- success `#10b981`, error `#ef4444`, plus gray scale

Prices format as `₦` + `Number.toLocaleString('en-NG')` (Nigerian Naira, no decimals on rentals).

Breakpoints used in the CSS: mobile `<768px`, tablet `768–1199px`, desktop `1200px+`.

## Things to avoid

- Don't edit `src/data/products.js` to change live catalog data — it's not loaded at runtime. Use the admin UI or the DB.
- Don't add image imports to admin-managed products — those flow through `api/upload.php` and end up as URL strings, not module references.
- Don't change `ADMIN_PASSWORD` without also changing `API_KEY` in `api/config.php`.
- Don't assume the cart persists across refreshes — it doesn't.
- Don't expect admin edits to appear instantly on the storefront — the products context polls every 30 s.
