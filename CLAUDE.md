# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static, multi-page shop for RITMO Padel — deployed via GitHub Pages to `ritmopadel.shop` (see `CNAME`). No build step, no backend yet, no analytics. Cart state lives in `localStorage`. **Stripe checkout will be wired in a follow-up build** — the cart page already has the integration seam (`#checkout-btn` in `warenkorb.html`).

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
warenkorb.html          Cart page — reads localStorage, qty/remove, totals
404.html                Bauhaus-styled not-found
produkt/
  schlaeger-pro.html        RITMO Pro (flagship — most detailed PDP)
  schlaeger-edge.html       RITMO Edge
  balls-tournament.html     Tournament 12er
  balls-3pack.html          RITMO Ball Set
  tee-schwarz.html          RITMO Tee
  hoodie-crew.html          RITMO Hoodie
  poster-app-live.html      "App ist Live" Print
  print-dna.html            RITMO DNA Print
assets/
  css/ritmo.css         Single shared stylesheet — tokens, components, PDP layout, animations
  js/ritmo.js           Shared client code — cart store, badge sync, reveal, filter, toast
  products/*.jpg        OPTIONAL product photos (see Fallback pattern)
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

## Stripe integration (planned)

`warenkorb.html` has the seam: `#checkout-btn` is currently a stub that fires a toast. The intended flow:

1. Add Stripe.js (`<script src="https://js.stripe.com/v3/">`) only on `warenkorb.html`.
2. POST `RitmoCart.read()` to a serverless endpoint that creates a Checkout Session and returns the session id.
3. `stripe.redirectToCheckout({ sessionId })` and clear the cart on the success URL.

Until that's wired, do NOT enable the checkout button for real money. The button starts `disabled` and is only re-enabled when the cart has items — adding Stripe requires removing the toast-stub in `warenkorb.html` and replacing it with the redirect call.
