import { AnimatedBg } from '../components/layout/AnimatedBg';
import { ButtonLink } from '../components/ui/Button';

/**
 * Stripe-Hosted cancel URL target. Cart is preserved (we never cleared
 * it — only success does that) so the user can try again with one click.
 */
export function CancelPage() {
  return (
    <section className="cancel-page">
      <AnimatedBg />
      <div className="cancel-inner fu">
        <div className="cancel-mark">
          <svg viewBox="0 0 32 32" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="3" strokeLinecap="round">
            <path d="M9 9 L23 23 M23 9 L9 23" />
          </svg>
        </div>
        <h1>
          Bezahlung <span className="accent">abgebrochen</span>.
        </h1>
        <p className="lead">
          Kein Problem — dein Warenkorb ist noch da. Du kannst die Bestellung
          jederzeit fortsetzen oder weiter stöbern.
        </p>
        <div className="cancel-links">
          <ButtonLink to="/warenkorb">Zurück zum Warenkorb</ButtonLink>
          <ButtonLink variant="out" to="/">Weiter shoppen</ButtonLink>
        </div>
      </div>
    </section>
  );
}
