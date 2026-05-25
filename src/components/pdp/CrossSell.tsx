import type { Product } from '../../lib/types';
import { ProductCard } from '../shop/ProductCard';

interface Props {
  products: Product[];
  heading?: string;
}

export function CrossSell({ products, heading = 'Dazu passt' }: Props) {
  if (!products.length) return null;
  return (
    <section className="crosssell">
      <div className="wrap">
        <h2>
          {heading}
          <span className="accent">.</span>
        </h2>
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
