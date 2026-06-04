import type { Product } from '../../lib/types';
import { CATEGORY_LABEL } from '../../lib/types';
import { useCart } from '../../hooks/useCart';
import { toast } from '../ui/Toast';
import { eurParts } from '../../lib/format';
import { isSoldOut } from '../../data/products';

interface Props {
  product: Product;
  visible: boolean;
}

/**
 * Bottom-of-viewport sticky buy bar. Slides up once the main CTA
 * row scrolls out of view. Uses the product's base price + variant
 * defaults — re-selecting variants happens in the hero, not here.
 *
 * When the product is sold out, the CTA flips to a disabled
 * "Ausverkauft" label.
 */
export function StickyBuyBar({ product, visible }: Props) {
  const { add } = useCart();
  const { cur, value } = eurParts(product.price);
  const sold = isSoldOut(product);

  function handleAdd() {
    add({
      id: product.id,
      name: product.name,
      cat: CATEGORY_LABEL[product.category],
      price: product.price,
      img: product.imageSrc,
    });
    toast(`<b>${product.name}</b> in den Warenkorb gelegt.`);
  }

  return (
    <div className={`buy-bar${visible ? ' visible' : ''}`} role="region" aria-label="Schnellkauf">
      <span className="bb-name">{product.name}</span>
      <span className="bb-price">{cur}{value}</span>
      <button
        className="btn btn-pri"
        type="button"
        onClick={handleAdd}
        disabled={sold}
      >
        {sold ? 'Ausverkauft' : 'In den Warenkorb'}
      </button>
    </div>
  );
}
