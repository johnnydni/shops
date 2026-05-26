import { useMemo, useState } from 'react';
import { AnimatedBg } from '../components/layout/AnimatedBg';
import { CategoryFilter } from '../components/shop/CategoryFilter';
import { ProductGrid } from '../components/shop/ProductGrid';
import { NewsletterBanner } from '../components/shop/NewsletterBanner';
import { HorizontalScrollJourney } from '../components/shop/HorizontalScrollJourney';
import { BentoShowcase } from '../components/shop/BentoShowcase';
import { SocialProofStrip } from '../components/shop/SocialProofStrip';
import { PRODUCTS } from '../data/products';
import type { Category } from '../lib/types';

type Chip = Category | 'all';

/**
 * HomePage — rebuilt with ui-ux-pro-max skill recommendations:
 *  1. Hero (vertical intro, upgraded type scale with Lexend Mega)
 *  2. Horizontal Scroll Journey  ← skill pattern: immersive product discovery
 *  3. Bento Showcase             ← skill pattern: modular brand pillars
 *  4. Filter + Grid              ← classic browse fallback
 *  5. Social-proof strip         ← skill rule: trust before final CTA
 *  6. Newsletter banner
 *
 * Style follows "Vibrant & Block-based" (Bauhaus-aligned): bold geometric
 * shapes, 48px+ section gaps, color-shift hover (no layout shift),
 * 200-300ms transitions, prefers-reduced-motion respected globally.
 */
export function HomePage() {
  const [active, setActive] = useState<Chip>('all');

  const filtered = useMemo(
    () =>
      active === 'all'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === active),
    [active]
  );

  return (
    <>
      {/* ─── 1. Hero — bigger type, scroll-hint ──────────────────── */}
      <section className="hero hero-xl">
        <AnimatedBg />
        <div className="wrap hero-content">
          <h1 className="fi d1">
            <span className="accent">SHOP</span>
            <span className="slash">·</span>
            <br />
            BAUHAUS
            <br />
            GEAR<span className="accent">.</span>
          </h1>
          <p className="lead fi d2">
            RITMO Apparel und Gear in geometrischer Klarheit. Schläger, Bälle,
            Trikots und Print-Editionen — entworfen für die, die Padel als
            Kunstform begreifen.
          </p>
          <div className="meta fi d3">
            <span className="chip live">Limited Drops</span>
            <span className="chip">Versand DACH frei</span>
            <span className="chip">Made for Padel</span>
          </div>
          <a className="scroll-hint fi d4" href="#journey" aria-label="Zur Produkt-Journey">
            <span>Scroll · Produkte</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </section>

      {/* ─── 2. Horizontal Scroll Journey ─────────────────────────── */}
      <div id="journey">
        <HorizontalScrollJourney
          products={PRODUCTS}
          title="Die Journey"
          titleAccent="."
        />
      </div>

      {/* ─── 3. Bento Showcase — brand pillars ────────────────────── */}
      <BentoShowcase />

      {/* ─── 4. Browse: filter + full grid ────────────────────────── */}
      <section id="sortiment">
        <div className="wrap">
          <p className="rule">Sortiment</p>
          <CategoryFilter active={active} onChange={setActive} />
        </div>
      </section>
      <section className="products">
        <div className="wrap">
          <ProductGrid products={filtered} />
        </div>
      </section>

      {/* ─── 5. Social proof — anchors trust before CTA ───────────── */}
      <SocialProofStrip />

      {/* ─── 6. Newsletter / final CTA ────────────────────────────── */}
      <NewsletterBanner />
    </>
  );
}
