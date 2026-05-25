import { useCart } from '../../hooks/useCart';
import { CartRow } from './CartRow';
import { EmptyCart } from './EmptyCart';

export function CartItems() {
  const { items } = useCart();
  if (!items.length) return <EmptyCart />;
  return (
    <div className="cart-items" aria-live="polite">
      {items.map((i) => (
        <CartRow key={`${i.id}::${i.variant ?? ''}`} item={i} />
      ))}
    </div>
  );
}
