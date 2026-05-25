import { CartItems } from '../components/cart/CartItems';
import { CartSummary } from '../components/cart/CartSummary';

export function CartPage() {
  return (
    <section className="cart-page">
      <div className="wrap">
        <h1>
          Warenkorb<span className="accent">.</span>
        </h1>
        <p className="lead">Prüfe deine Auswahl und gehe zur Kasse.</p>

        <div className="cart-grid">
          <CartItems />
          <CartSummary />
        </div>
      </div>
    </section>
  );
}
