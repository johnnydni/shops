# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static multi-page shop for RITMO Padel — deployed via GitHub Pages to `ritmopadel.shop` (see `CNAME`). No build step on the frontend, no analytics. Cart state lives in `localStorage`. Checkout uses **Stripe Hosted Checkout**, backed by a small **Cloudflare Worker** under `worker/` that re-prices the cart and creates the session.

## Local preview

No build. Open `index.html` directly or serve the folder:

```
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Deployment

GitHub Pages, `main` branch, root. Pushing to `main` deploys. The `CNAME` file pins the custom domain — do not delete it without coordinating a DNS change.

## File layout

```
index.html              Shop home (hero, filter, product grid, newsletter)
warenkorb.html          Cart page — reads localStorage, qty/remove, POST→worker→Stripe
bestellt.html           Stripe success URL — clears cart, shows confirmation
abbruch.html            Stripe cancel URL  — preserves cart, CTA to retry
404.html                Bauhaus-styled not-found
produkt/                8 luxury-style PDPs (one HTML file per product)
assets/
  css/ritmo.css         Single shared stylesheet
  js/ritmo.js           Cart store, badge sync, reveal, filter, toast, variant pricing
  products/*.jpg        OPTIONAL product photos (see Fallback pattern)
worker/                 Cloudflare Worker — Stripe Checkout backend
  src/index.js          Route table
  src/catalog.js        Server-side product catalog (PRICE SOURCE OF TRUTH)
  src/checkout.js       POST /api/checkout — creates Stripe session
  src/webhook.js        POST /api/webhook — Web-Crypto signature verification
  src/cors.js           CORS helper
  wrangler.toml         Worker config (vars; secrets via `wrangler secret put`)
  package.json          wrangler dev/deploy
  README.md             Step-by-step deploy guide
  .dev.vars.example     Template for local-dev secrets
```

## Architecture notes

- **Shared CSS + JS, no CDN.** `assets/css/ritmo.css` and `assets/js/ritmo.js` are loaded by every page. No external fonts, no CDNs, no framework. Page-specific styles/scripts can stay inline (see `warenkorb.html` for an example).
- **Cart is a single localStorage key.** All cart state lives in `localStorage["ritmo.cart.v1"]` as a JSON array of `{id,name,cat,price,qty,variant,img}`. Access only via `window.RitmoCart` (`.add/.setQty/.remove/.clear/.read/.count/.subtotal`). The store auto-syncs badges across tabs via the `storage` event and fires a `ritmo:cart` event on the same tab.
- **Add-to-cart wiring is declarative.** Any `<button data-add-to-cart data-id=... data-name=... data-price=... data-cat=...>` is wired automatically. If the button sits inside `[data-prod-scope]` with `.opt-btn.active` variant pickers in `.opt-row` groups, those variants get joined and stored on the cart line.
- **Product detail pages share one luxury template.** Crumbs → Hero (image + animated bg + info/picker/CTA) → 1–2 alternating story sections → editorial bleed → specs table → cross-sell → sticky buy bar. Copy each existing PDP to add a 9th product; the shared CSS handles all layout.
- **Image fallback pattern (unchanged).** Each image container has an inline Bauhaus SVG `.fallback` underneath an `<img onerror="this.remove()">`. Real photo at the `src` path overlays the SVG; missing file → SVG stays. Never remove the SVG when editing images.
- **Animated backgrounds are CSS placeholders.** `.bg-anim` (hero, 404, editorial bleed) and `.pdp-bg` (PDP stage) are pure-CSS-animated Bauhaus shapes. To swap for video/Lottie: replace the inner `<div class="blob-*">` markup with `<video autoplay muted loop>` or a `<canvas>` — the wrappers already handle sizing/clipping.
- **Sticky PDP buy bar.** Mark the main `.pdp-cta-row` with `[data-buybar-anchor]`. When the anchor scrolls out of view, the fixed `.buy-bar` slides up. The bar's add-to-cart button uses the same `data-add-to-cart` wiring as the hero CTA.

## Design tokens

Defined as CSS custom properties in `:root` (top of `ritmo.css`). Reuse — don't hardcode:

- `--bg #0A0A0A`, `--orange #FF7A1A` (primary CTA), Bauhaus quartet `--yellow / --blue / --red` + white
- Sharp corners (`--radius:0`), italic + 900-weight headlines with negative letter-spacing
- Motion easings: `--ease`, `--ease-out`; respect `prefers-reduced-motion`
- Mobile-first; product grid collapses 4 → 3 → 2 → 1; PDP hero stacks at ≤920px

## Checkout architecture (Stripe Hosted + Cloudflare Worker)

End-to-end flow:

```
   PDP "In den Warenkorb"  →  localStorage (ritmo.cart.v1)
                              ↓
   warenkorb.html "Zur Kasse"  ──POST {id,qty,variant}──▶  CF Worker
                                                                ↓
                                            re-price from catalog.js
                                                                ↓
                                            create Stripe Checkout Session
                                                                ↓
   browser  ←──────────────────  { url: stripe.com/c/pay/... }  ─┘
        ↓
   Stripe Hosted Checkout (card, address, payment)
        ↓
   ┌────────────────┬──────────────────┐
   ↓                                     ↓
   bestellt.html?session_id=…       abbruch.html
   (clears cart)                    (cart preserved)
        ↑
   Stripe webhook ──POST──▶ CF Worker /api/webhook
                              (Web-Crypto signature verify, log/dispatch)
```

**Key invariants:**

- **Client prices are never trusted.** The worker re-resolves every line via `worker/src/catalog.js`. The client only sends `{id, qty, variant}`.
- **`worker/src/catalog.js` is the single source of truth for prices.** Both the displayed PDP price *and* the Stripe charge derive from it (PDPs hard-code base prices in `data-price`; variant deltas live in `data-price-delta` and must match the `variantPriceMap` in the catalog). When you change a price, update both.
- **Variants are "A / B / C" strings.** The cart joins active option buttons with `" / "`. The worker splits on that separator and looks each segment up in `variantPriceMap`.
- **No PCI scope.** All payment data lives on `stripe.com`. The frontend never sees card details.

## Worker deploy (one-time)

See `worker/README.md` for the full walkthrough. TL;DR:

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put STRIPE_SECRET_KEY        # sk_test_... first
npx wrangler secret put STRIPE_WEBHOOK_SECRET    # whsec_... (from Stripe webhook setup)
npx wrangler deploy
```

Then in `warenkorb.html`, set `window.RITMO_CHECKOUT_URL` to the deployed worker URL (or your custom subdomain, e.g. `https://api.ritmopadel.shop/api/checkout`).

Configure the Stripe webhook to POST `checkout.session.completed` to `<worker-url>/api/webhook`.

## Adding a new variant or product

1. **Server (price truth):** add an entry to `worker/src/catalog.js`. For variants that change price, add a `variantPriceMap` keyed by the exact `data-variant` string (not the user-facing label).
2. **PDP markup:** add the option button with `data-variant="…"` and (if price changes) `data-price-delta="<eur>"` matching the catalog entry. The shared JS handles wiring.
3. **Cart card on the home grid:** copy an existing `<article class="card-prod">` block in `index.html`.
4. **Test locally:** `cd worker && npm run dev` and point `window.RITMO_CHECKOUT_URL` at `http://localhost:8787/api/checkout`. Use Stripe test card `4242 4242 4242 4242`.
