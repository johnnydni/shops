import { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { eur, eurParts } from '../../lib/format';
import { createCheckoutSession } from '../../lib/checkout';

/**
 * Sticky summary card on the cart page. Kicks off the Stripe Checkout
 * flow via the worker on click. On success: redirects to Stripe URL.
 * On failure: surfaces the error inline.
 */
export function CartSummary() {
  const { items, subtotal } = useCart();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // German VAT (19%) is included in the displayed prices
  const vat = subtotal - subtotal / 1.19;
  const { cur, value } = eurParts(subtotal);
  const disabled = busy || items.length === 0;

  async function handleCheckout() {
    if (!items.length) return;
    setBusy(true);
    setErr(null);
    try {
      const { url } = await createCheckoutSession(items);
      window.location.href = url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'unbekannter Fehler');
      setBusy(false);
    }
  }

  return (
    <aside className="cart-summary">
      <h3>Zusammenfassung</h3>
      <div className="line">
        <span>Zwischensumme</span>
        <span>{eur(subtotal)}</span>
      </div>
      <div className="line">
        <span>Versand</span>
        <span>Frei</span>
      </div>
      <div className="line">
        <span>MwSt. (19% enthalten)</span>
        <span>{eur(vat)}</span>
      </div>
      <div className="line total">
        <span>Gesamt</span>
        <span>
          <span className="cur">{cur}</span>
          {value}
        </span>
      </div>

      <button
        type="button"
        className="btn btn-pri btn-lg"
        disabled={disabled}
        onClick={handleCheckout}
      >
        {busy ? 'Weiterleitung zu Stripe…' : 'Zur Kasse, Stripe'}
      </button>

      {err && (
        <p className="secure" style={{ color: 'var(--red)' }}>
          Checkout fehlgeschlagen: {err}
        </p>
      )}

      <p className="secure">
        🔒 Bezahlung läuft verschlüsselt über Stripe Hosted Checkout. Es werden
        keine Zahlungsdaten auf dieser Seite gespeichert.
      </p>
    </aside>
  );
}
