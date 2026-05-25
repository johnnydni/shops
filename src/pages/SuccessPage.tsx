import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatedBg } from '../components/layout/AnimatedBg';
import { ButtonLink, ButtonAnchor } from '../components/ui/Button';
import { CartStore } from '../lib/cart';

/**
 * Stripe-Hosted success URL target. Clears the cart and surfaces the
 * session id for the customer's reference. Real verification of
 * payment status happens server-side via the webhook.
 */
export function SuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');

  useEffect(() => {
    try {
      CartStore.clear();
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <section className="ok-page">
      <AnimatedBg />
      <div className="ok-inner fu">
        <div className="ok-mark">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            stroke="#FF7A1A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 16 L13 23 L26 9" />
          </svg>
        </div>
        <h1>
          Danke<span className="accent">.</span>
        </h1>
        <p className="lead">
          Deine Bestellung ist bei uns angekommen. Du bekommst gleich eine
          Bestätigung per E-Mail von Stripe — mit allen Details und der
          Rechnung als PDF.
        </p>
        {sessionId && (
          <div className="ok-meta">
            <span className="label">Bestell-Referenz</span>
            <code>{sessionId}</code>
          </div>
        )}
        <div className="ok-links">
          <ButtonLink to="/">Weiter shoppen</ButtonLink>
          <ButtonAnchor variant="out" href="https://ritmopadel.app/" rel="noopener">
            RITMO App öffnen
          </ButtonAnchor>
        </div>
      </div>
    </section>
  );
}
