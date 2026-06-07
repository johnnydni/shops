# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

React + TypeScript SPA for RITMO Padel — Vite-built, deployed as static files to GitHub Pages on `ritmopadel.shop` (`public/CNAME`). Cart state lives in `localStorage`. Checkout uses **Stripe Hosted Checkout**, backed by a Cloudflare Worker under `worker/` that re-prices the cart and creates the session.

## Local development

```
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # tsc -b --noEmit
npm run build        # tsc -b && vite build && copy index.html → 404.html
npm run preview      # serve dist/ on :4173
```

For real checkout against a local worker:

```
cd worker && npm run dev          # :8787
# then in shops/.env.local:
VITE_CHECKOUT_URL=http://localhost:8787/api/checkout
```

## Deployment

`npm run build` → push `dist/` to GitHub Pages. The `postbuild` script copies `dist/index.html` → `dist/404.html` so Pages serves the SPA for any deep link (`/produkt/x`, `/warenkorb`, etc).

The current repo deploys via "Deploy from a branch" → root. If you want CI-driven deploys, point a GitHub Action at `dist/` on a `gh-pages` branch.

## File layout

```
index.html              Vite SPA shell (just <div id="root">)
vite.config.ts
tsconfig*.json
scripts/postbuild.mjs   dist/index.html → dist/404.html for SPA fallback
public/                 Static passthrough — CNAME + product photos
  CNAME
  assets/products/
    index.txt           ⭐ Asset inventory + naming convention (read first when working with photos)
    <product-slug>/     One directory per product
      <slug>-<farbe>.jpg / .png   One file per colour variant
                                  (placeholders are 0-byte; SVG fallback shows)
src/
  main.tsx              React mount + global stylesheet import
  App.tsx               Routes + shared chrome (header/footer/toast)
  styles/ritmo.css      ONE global stylesheet — design system, all components
  lib/
    types.ts            Product, CartLine, Variant, VideoItem, …
    cart.ts             CartStore — localStorage + useSyncExternalStore-compatible
    checkout.ts         POST to worker, returns Stripe URL
    format.ts           eur(), eurParts()
  hooks/
    useCart.ts          Reactive cart state
    useScrollState.ts   useScrolledPast(threshold)
    useReveal.ts        IntersectionObserver → adds .in
    useStickyBuyBar.ts  PDP buy bar visibility
  components/
    layout/             SiteHeader, SiteFooter, Grain, BauhausLine, AnimatedBg
    ui/                 Button (+Link/Anchor variants), Toast, Crumbs
    shop/               ProductCard, ProductGrid, CategoryFilter, NewsletterBanner, ProductImage
    pdp/                PdpHero, PdpStage, VariantPicker, FeatureBlock, EditorialBleed,
                        VideoGallery, VideoPlaceholder, SpecsTable, CrossSell, StickyBuyBar
    cart/               CartItems, CartRow, CartSummary, EmptyCart
    illustrations/      All 8 product SVGs + feature/story visuals (one file)
  data/products.ts      ⭐ SPA's product catalog (PDP content, story, specs, videos, related)
  pages/                HomePage, ProductPage (one for all 8), CartPage, SuccessPage, CancelPage, NotFoundPage
worker/                 UNCHANGED — Cloudflare Worker (Stripe Checkout backend)
  src/catalog.js        ⭐ Server-side PRICE source of truth
  src/{checkout,webhook,cors,index}.js
  wrangler.toml, README.md
```

## Architecture invariants

- **Two catalogs, one truth on price.** `src/data/products.ts` carries everything the SPA needs (PDP content, story, specs, video slots). `worker/src/catalog.js` carries only what the Worker needs (name, price, variant deltas). **Prices and variant deltas must match.** When you change `price` or any `priceDelta`, change both files. The Worker re-prices at checkout and is authoritative.
- **Cart is `useSyncExternalStore`-backed.** `CartStore` exposes `subscribe`/`getSnapshot`; `useCart()` wraps it. Cross-tab sync via the `storage` event. The snapshot is cached and updated atomically on mutation, so identity stays stable between re-renders.
- **Add-to-cart is hook-driven, not declarative.** Old `data-add-to-cart` attribute pattern is gone. Buttons call `add({ id, name, cat, price, variant, img })` directly from the PDP hero where variant state lives.
- **Single PDP component.** `ProductPage` reads `:slug`, looks up `PRODUCTS`, and composes `PdpHero → FeatureBlock(s) → EditorialBleed → VideoGallery → SpecsTable → CrossSell → StickyBuyBar`. Adding a 9th product = one entry in `products.ts` + one SVG component; **no new page file**.
- **Image fallback pattern preserved.** `ProductImage` renders the SVG illustration always; layers the photo on top with `onError → unmount`. Identical visual behaviour to the old `onerror="this.remove()"` trick.
- **Asset naming convention.** Every product gets a directory under `public/assets/products/<slug>/`. File names follow `<slug>-<farbe>.<ext>` (e.g. `schlaeger-pro-orange.jpg`, `ritmo-ring-pink.png`). Multi-variant products use `<slug>-<spielstil>-<schnitt>-<farbe>.<ext>`. Placeholders are 0-byte files — the SVG fallback above kicks in until a real photo replaces them. **Source of truth for naming is `public/assets/products/index.txt`** (committed) — read it before adding/renaming any image.
- **Local asset inventory.** A working inventory of every file under `public/assets/` lives at `public/assets/index.txt`, **gitignored** (local-only). It's auto-generated by `scripts/asset-index.mjs`, runs on `npm run dev` / `npm run build` / `npm run assets:index`. **Whenever new graphics are added, renamed, or removed, regenerate it** — the file includes byte size, REAL/PLACEHOLDER status per file, and an "Expected but missing" section that diffs disk vs. `src/data/products.ts` (catches typos in `imageSrc` / `imagePattern`).
- **Animated backgrounds are pure CSS.** `<AnimatedBg />` wraps three keyframed Bauhaus blobs. Swap for video/Lottie by replacing the inner JSX — the parent positioning stays.
- **One stylesheet, no Tailwind/CSS Modules.** `src/styles/ritmo.css` is the single design system (~30 KB). Components apply class names defined there (`btn btn-pri btn-lg`, `card-prod`, `pdp-section`, etc). Keeps the Bauhaus look 1:1 with the previous static version and makes design changes trivially global.

## Video system (new)

Every PDP can declare an array of `videos: VideoItem[]` in `products.ts`. The `VideoGallery` renders them as a "Vorschau & Tests" section between the editorial bleed and the spec table. Per-tile rendering depends on `kind`:

| kind          | Renders                                                                   |
|---------------|---------------------------------------------------------------------------|
| `placeholder` | Animated Bauhaus tile with a Play overlay and a "Bald" badge              |
| `mp4`         | Native `<video controls preload="none" poster=…>` self-hosted             |
| `youtube`     | Click-to-load lite embed (poster → iframe swap, `youtube-nocookie.com`)   |
| `vimeo`       | Click-to-load lite embed (poster → iframe swap)                           |

To swap a placeholder for a real video, just change `kind` to `mp4`/`youtube`/`vimeo` and add `src` (full URL for mp4, just the ID for YouTube/Vimeo). Optional `posterSrc`, `tag`, `duration`, `subtitle` shape the tile chrome.

## Checkout architecture (Stripe Hosted + Cloudflare Worker)

End-to-end flow:

```
   PDP CTA  →  CartStore (localStorage)
                  ↓
   /warenkorb "Zur Kasse"  ──POST {id,qty,variant}──▶  CF Worker
                                                            ↓
                                       re-price from catalog.js
                                                            ↓
                                       create Stripe Checkout Session
                                                            ↓
   browser  ←──────────────  { url: stripe.com/c/pay/... }  ─┘
        ↓
   Stripe Hosted Checkout (card, address, payment)
        ↓
   ┌─────────────────────────┬─────────────────┐
   ↓                                            ↓
   /bestellt?session_id=…                      /abbruch
   (CartStore.clear in useEffect)              (cart preserved)
        ↑
   Stripe webhook ──POST──▶ CF Worker /api/webhook
                              (Web-Crypto signature verify, log/dispatch)
```

Security invariants:
- **Client prices are never trusted** — Worker re-resolves every line.
- **Webhook signatures** verified via Web Crypto HMAC-SHA256, replay-protected (5 min window).
- **No PCI scope** on the frontend — all card data lives on stripe.com.
- **Secrets stay out of the repo** — `wrangler secret put` for `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
- **CORS restricted** to `env.ALLOWED_ORIGIN`.

See `worker/README.md` for the full deploy walkthrough.

## Adding a new product

1. **Server (price truth):** add an entry to `worker/src/catalog.js`. For variants that change price, add a `variantPriceMap` keyed by the canonical variant `value` string.
2. **SVG illustration:** add a new component in `src/components/illustrations/index.tsx`.
3. **Frontend catalog:** add an entry to `src/data/products.ts` with matching `id` + `price` + variant `priceDelta`s. Reference the SVG in `illustration`. Define `story`, `specs`, `videos`, `related`.
4. **Done.** No new component, no new page, no new route. `ProductPage` picks it up by slug, `HomePage` grid includes it, `CategoryFilter` finds it via `category`.

## Adding a new variant

1. Add the option to the right `variants[].options` array in `products.ts`. If it affects price, set `priceDelta` (in EUR).
2. Add the same `value` → cents-delta to `worker/src/catalog.js → variantPriceMap`.
3. Optional UI hint: set `label` to override the displayed text (e.g. `'A2 · €25'`).

## Adding a video

```ts
// in products.ts → product.videos
videos: [
  { kind: 'placeholder', title: 'Pro vs. Edge',   tag: 'Test',      duration: '3:21' },
  { kind: 'youtube',     title: 'Unboxing',       tag: 'Unboxing',  src: 'dQw4w9WgXcQ' },
  { kind: 'mp4',         title: 'Stringing-Tut',  src: '/assets/videos/pro-stringing.mp4', posterSrc: '/assets/videos/pro-stringing-poster.jpg' },
],
```
