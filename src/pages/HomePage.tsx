import { useMemo, useState } from 'react';
import { AnimatedBg } from '../components/layout/AnimatedBg';
import { CategoryFilter } from '../components/shop/CategoryFilter';
import { ProductGrid } from '../components/shop/ProductGrid';
import { NewsletterBanner } from '../components/shop/NewsletterBanner';
import { PRODUCTS } from '../data/products';
import type { Category } from '../lib/types';

type Chip = Category | 'all';

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
      <section className="hero">
        <AnimatedBg />
        <div className="wrap hero-content">
          <h1 className="fi d1">
            <span className="accent">SHOP</span>.<br />
            BAUHAUS&nbsp;GEAR.
          </h1>
          <p className="lead fi d2">
            RITMO Apparel und Gear in geometrischer Klarheit. Schläger, Bälle,
            Trikots und Print-Editionen — entworfen für die, die Padel als
            Kunstform begreifen.
          </p>
          <div className="meta fi d3">
            <span className="chip live">Limited Drops</span>
            <span className="chip">Versand DACH</span>
            <span className="chip">Made for Padel</span>
          </div>
        </div>
      </section>

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

      <NewsletterBanner />
    </>
  );
}
