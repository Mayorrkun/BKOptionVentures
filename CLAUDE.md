# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build (outputs to dist/)
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

---

## Architecture

**React + Vite** single-page app (JavaScript, no TypeScript). No routing library — the app is a single static layout.

**Current render tree:**
```
main.jsx → App.jsx → <Nav /> + <Carousel />
```

- `src/components/navbar.jsx` — static navigation bar; menu items (Home, Rentals, Sales, Contacts) are hardcoded with no click handlers yet
- `src/components/carousel.jsx` — auto-advances every 5 seconds using `useState`/`useEffect`; slide images live in `src/Images/Carousel/`
- `src/css/` — plain CSS files, one per component
- `src/Images/` — organized by category (Carousel, ChairTableSets, EventSets, Tents, Logo, Videos)

ESLint uses the flat config format (`eslint.config.js`) with the React Hooks and React Refresh plugins.

---

## Target Architecture

The app needs to grow into a multi-page experience. Introduce **React Router** for client-side routing. The planned component/page tree is:

```
main.jsx
└── App.jsx
    ├── <Navbar />            ← upgrade existing component
    ├── <Routes>
    │   ├── / → <HomePage />
    │   ├── /rentals → <RentalsPage />
    │   ├── /rentals/:id → <ProductDetailPage />
    │   ├── /sales → <SalesPage />
    │   ├── /sales/:id → <ProductDetailPage />
    │   ├── /about → <AboutPage />
    │   ├── /contact → <ContactPage />
    │   └── /admin → <CEODashboard />  ← password-protected
    └── <Footer />
```

Reusable shared components to build in `src/components/`:
- `<Navbar />` — upgrade existing; add React Router `<Link>` handlers, hamburger menu for mobile
- `<Footer />` — contact info, social links, quick nav links
- `<ProductCard />` — shared card used in both Rentals and Sales grids (variant prop: `"rental"` | `"sale"`)
- `<Breadcrumb />` — shared breadcrumb trail
- `<Button />` — primary / secondary / tertiary variants
- `<CategorySidebar />` — filter + sort panel used on Rentals and Sales pages

---

## Brand & Design System

### Color Palette (use CSS custom properties)
```css
:root {
    --color-primary:        #1e3a8a; /* Navy Blue */
    --color-secondary:      #f97316; /* Orange */
    --color-accent:         #14b8a6; /* Teal */
    --color-success:        #10b981; /* Green */
    --color-error:          #ef4444; /* Red */
    --color-gray-dark:      #1f2937;
    --color-gray-mid:       #6b7280;
    --color-gray-light:     #f3f4f6;
    --color-white:          #ffffff;
}
```

### Typography
- **Headings:** Montserrat Bold or Poppins SemiBold (import from Google Fonts)
- **Body:** Inter Regular or Open Sans
- **UI / forms:** system font stack

| Token | Size | Usage |
|-------|------|-------|
| H1 | 48px / 3rem | Page titles |
| H2 | 36px / 2.25rem | Section headers |
| H3 | 28px / 1.75rem | Subsections |
| H4 | 24px / 1.5rem | Card titles |
| Body | 16px / 1rem | Default text |
| Small | 14px / 0.875rem | Captions, labels |
| Tiny | 12px / 0.75rem | Fine print |

### Spacing
- Section vertical padding: `80px`
- Internal section padding: `40px`

### Component Tokens

**Buttons**
```
Primary:   solid --color-primary background, white text
Secondary: outlined, --color-primary border
Tertiary:  text-only, colored text
Heights:   32px (sm) | 40px (md) | 48px (lg)
Border-radius: 6px
Hover: darken/lighten 10%
```

**Cards**
```
Border:        1px solid #e5e7eb
Border-radius: 8px
Shadow:        0 1px 3px rgba(0,0,0,0.1)
Hover:         elevated shadow + scale(1.02)
Padding:       20px
```

**Form inputs**
```
Height:       44px
Border:       1px solid #d1d5db
Border-radius: 6px
Focus:        2px border, --color-primary
Error:        red border + message below
```

**Transitions**
```
Duration: 200–300ms
Easing:   ease-in-out
Props:    transform, opacity, box-shadow
```

### Responsive Breakpoints
| Name | Range |
|------|-------|
| Mobile | < 768px |
| Tablet | 768px – 1199px |
| Desktop | 1200px+ |

- Desktop: 3–4 column grids, expanded nav
- Tablet: 2-column grids, collapsible sidebar
- Mobile: single column, hamburger menu, min touch target 44px

---

## Pages & Sections

### 1. Home Page (`/`)

Sections in order:
1. **Navbar** (sticky, white bg, logo 150px wide, links: Home | Rentals | Sales | About | Contact)
2. **Hero Carousel** — full width, min-height 600px, auto-advances every 5s, arrows + dot indicators, CTA overlay text on each slide. Uses existing `<Carousel />` and images in `src/Images/Carousel/`.
3. **Welcome Section** — heading "Welcome to BK Option Ventures", 2–3 paragraph intro, two CTA buttons: "Browse Rentals" → `/rentals`, "Shop Sales" → `/sales`
4. **Featured Categories** — 5-card grid (Canopies, Chairs, Tables, Fans, Air Conditioners); each card shows an image + label, links to the relevant filtered rentals page. Source images from `src/Images/` subdirectories.
5. **Why Choose Us** — 3-column icon strip: Quality | Service | Value, each with short description
6. **Footer**

### 2. Rentals Page (`/rentals`)

Layout: sticky sidebar (250px) + main product grid.

**Sidebar filters:**
- Category checkboxes: Canopies, Chairs, Tables, Fans, A/C Units
- Sort by: Popular | Price: Low–High | Price: High–Low | Name A–Z

**Product grid:** 3 col desktop / 2 col tablet / 1 col mobile, with pagination or "Load More".

**Rental `<ProductCard />`:**
- 4:3 image (280×360px card)
- Product name
- ₦X,XXX per day
- "View Details →" button → `/rentals/:id`
- Hover: shadow lift + scale(1.02)

### 3. Sales Page (`/sales`)

Same layout as Rentals. Sidebar categories will differ.

**Sales `<ProductCard />`:**
- Product image + stock badge
- Product name
- ₦XX,XXX.XX price
- Stock count ("In Stock: 5")
- "Add to Cart" button — triggers cart state

**Checkout flow (no payment gateway):**
When the user clicks "Checkout", build a pre-filled WhatsApp message and open it via `https://wa.me/<CEO_WHATSAPP_NUMBER>?text=<encoded message>`. The message must include:
- "Hello, I'd like to order the following items:"
- Each cart item: name, quantity, unit price, line total
- Order total
- A prompt for the customer to share their name and delivery address

Store the CEO's WhatsApp number in a single constant (e.g. `src/config.js`) so it is easy to update:
```js
// src/config.js
export const CEO_WHATSAPP = '2348XXXXXXXXX'; // number only, no +, no spaces
```

Example generated URL:
```
https://wa.me/2348XXXXXXXXX?text=Hello%2C%20I%27d%20like%20to%20order%3A%0A...
```

The cart UI (slide-out drawer or dedicated `/cart` page) should show:
- Item list with quantities and prices
- Subtotal
- "Checkout via WhatsApp" button (green, WhatsApp icon) — opens the link in a new tab

### 4. Product Detail Page (`/rentals/:id` and `/sales/:id`)

Layout: two-column (image left, info right) + tabs + related products.

- **Image gallery:** main 600×600px + thumbnail strip (100×100px each, 4–6 images)
- **Info panel (400px):** product name (H1), star rating, price, specs list, rental details (min 1 day, delivery, setup), "Book Now / Buy" CTA button, "Contact for Quote" link
- **Tabs:** Description | Specifications | Reviews — underline active state, smooth transition
- **Related products:** 4-card row ("You might also like…")
- **Breadcrumb:** Home > Rentals/Sales > Category > Product Name

### 5. About Page (`/about`)

Sections in order:
1. Hero with background image + overlay: "About BK Option Ventures"
2. Our Story — company history (timeline or narrative)
3. Mission & Vision — two-column card layout
4. Our Team — photo grid (name + title under each)
5. Why Choose Us — bullet list of differentiators (quality, service, pricing, on-time delivery)

### 6. Contact Page (`/contact`)

Two-column layout: form left, info right.

**Form fields:** Name*, Email*, Phone, Message* — with real-time validation, clear error states, success confirmation on submit.

**Info panel:**
- 📍 Address
- 📞 Phone: +234 XXX XXX XXXX
- ✉️ Email: info@bkoption.com
- 🕐 Hours: Mon–Fri 8AM–6PM | Sat 9AM–4PM | Sun Closed
- Social media icons

**Below:** full-width embedded Google Map (400px height).

### 7. CEO Invoice Dashboard (`/admin`)

Password-protected route — redirect to login if unauthenticated. Do not expose this route in the public navbar.

**Sections:**
1. **Customer Information** — Name*, Email, Phone*, Address
2. **Invoice Details** — Auto-generated Invoice # (`INV-YYYY-XXXX`), Date, Due Date
3. **Line Items table** — searchable product dropdown, Qty, Unit Price, auto-calculated line total. Products list:
    - Canopy – Small (10×10)
    - Canopy – Large (20×20)
    - Chairs – Plastic
    - Chairs – Banquet
    - Tables – Round
    - Tables – Rectangular
    - Standing Fan
    - Air Conditioner Unit
    - [+ Add Custom Item]
4. **Pricing Summary** — Subtotal, Tax (7.5%), **Total** — all auto-calculated in real time
5. **Payment Status** dropdown — Pending | Partially Paid | Paid | Overdue
6. **Notes & Terms** — free-text fields; default terms: "Payment due within 7 days. Late payments subject to 5% monthly interest charge."
7. **Action buttons** — Preview Invoice | Save Draft | Generate (PDF download)
8. **Recent Invoices table** — INV# | Customer | Date | Amount | Status

**Invoice PDF output must include:**
- BK Option Ventures logo + address + phone
- Bill To section
- Invoice # and dates
- Itemized line items table
- Subtotal / Tax / Total
- Payment status
- Terms & Conditions
- "Thank you for your business!"

Use **jsPDF** or **PDFMake** for PDF generation.

---

## Key Features Checklist

| Feature | Notes |
|---------|-------|
| React Router | Client-side routing for all pages |
| Navbar upgrade | Add `<Link>` handlers, active state, hamburger menu |
| Hero Carousel | Already exists — add CTA overlays |
| Category filter + sort | Rentals & Sales sidebar |
| Shopping Cart | Global state (Context or Zustand) for Sales items |
| WhatsApp Checkout | On checkout, redirect to CEO WhatsApp with cart summary pre-filled in message |
| Booking system | Date picker + availability check for Rentals |
| Product detail | Image gallery, tabs, related products |
| Admin auth | Password-protected `/admin` route |
| Invoice generation | jsPDF or PDFMake, branded output |
| Contact form | Validation, success state, EmailJS or backend |
| Analytics | Google Analytics or Plausible |
| Accessibility | WCAG AA contrast, focus indicators, alt text, ARIA labels, semantic HTML |

---

## Image Guidelines

| Type | Format | Dimensions |
|------|--------|------------|
| Product images | JPG / WebP | 800×800px min, white/neutral bg, 4–6 angles |
| Hero / banner | JPG / WebP | 1920×800px, compressed |
| Icons | SVG | 24px standard, scalable |

Existing image folders in `src/Images/`: `Carousel/`, `ChairTableSets/`, `EventSets/`, `Tents/`, `Logo/`, `Videos/`

---

## Suggested Package Additions

```bash
npm install react-router-dom          # routing
npm install jspdf jspdf-autotable     # invoice PDF generation
npm install react-hook-form           # form handling + validation
npm install swiper                    # carousel enhancement (optional)
```

No payment gateway package is needed. Checkout is handled entirely via a WhatsApp deep link — no backend or third-party SDK required.