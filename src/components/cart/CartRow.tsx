import type { CartLine } from '../../lib/types';
import { useCart } from '../../hooks/useCart';
import { eur } from '../../lib/format';
import { PRODUCTS } from '../../data/products';
import { ProductImage } from '../shop/ProductImage';

interface Props {
  item: CartLine;
}

/** A single line in the cart. Qty +/-, quantity input, remove link. */
export function CartRow({ item }: Props) {
  const { setQty, remove } = useCart();
  const prod = PRODUCTS.find((p) => p.id === item.id);

  return (
    <div className="cart-row">
      <div className="thumb">
        {prod ? (
          <ProductImage illustration={prod.illustration} src={item.img ?? prod.imageSrc} />
        ) : (
          <div style={{ background: 'var(--card2)', width: '100%', height: '100%' }} />
        )}
      </div>
      <div className="body">
        <span className="cat">{item.cat}</span>
        <span className="name">{item.name}</span>
        {item.variant && <span className="meta">{item.variant}</span>}
        <div className="qty" style={{ marginTop: 8 }}>
          <button
            type="button"
            aria-label="Weniger"
            onClick={() => setQty(item.id, item.variant, Math.max(1, item.qty - 1))}
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={item.qty}
            aria-label="Menge"
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              setQty(item.id, item.variant, Number.isFinite(n) && n >= 1 ? n : 1);
            }}
          />
          <button
            type="button"
            aria-label="Mehr"
            onClick={() => setQty(item.id, item.variant, item.qty + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div className="right">
        <span className="price">{eur(item.price * item.qty)}</span>
        <button
          type="button"
          className="remove"
          onClick={() => remove(item.id, item.variant)}
        >
          Entfernen
        </button>
      </div>
    </div>
  );
}
