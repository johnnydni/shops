import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CategoryFilter } from '../components/shop/CategoryFilter';
import { ProductGrid } from '../components/shop/ProductGrid';
import { PRODUCTS } from '../data/products';
import type { Category } from '../lib/types';

type Chip = Category | 'all';

/**
 * /sortiment — standalone catalog page.
 *
 * Owns the filter + full product grid that used to live on HomePage.
 * Header is a focused page intro (rule strip + headline + lead) so the
 * page reads as a destination, not a section.
 */
export function SortimentPage() {
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
      <motion.section
        className="page-intro"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="wrap">
          <p className="rule">Sortiment</p>
          <h1 className="page-title">
            Alles, was wir <span className="accent">bauen</span>.
          </h1>
          <p className="page-lead">
            Schläger, Bälle, Apparel und Print-Editionen. Filterbar nach
            Kategorie — alle Drops auf einer Seite.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="wrap">
          <CategoryFilter active={active} onChange={setActive} />
        </div>
      </motion.section>

      <section className="products">
        <div className="wrap">
          <ProductGrid products={filtered} />
        </div>
      </section>
    </>
  );
}
