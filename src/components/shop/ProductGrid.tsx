import type { Product } from '../../lib/types';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
  /** Show staggered animation delays (d1..d8). Defaults to true. */
  stagger?: boolean;
}

export function ProductGrid({ products, stagger = true }: Props) {
  return (
    <div className="grid">
      {products.map((p, i) => (
        <ProductCard
          key={p.id}
          product={p}
          animationDelay={stagger ? ((i % 8) + 1) : undefined}
        />
      ))}
      {products.length === 0 && (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--t3)', fontSize: 14 }}>
          Keine Produkte in dieser Kategorie. Bald mehr.
        </div>
      )}
    </div>
  );
}
