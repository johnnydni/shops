import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * /event/cancel — Stripe redirected back here without payment.
 *
 * The user's BuyState is preserved in sessionStorage (we don't clear it
 * here), so going back to the buy page restores their selection
 * including names and the Spielstil quiz result. Turnstile + honeypot
 * are NOT preserved — they're re-issued on the next attempt.
 */
export function EventCancelPage() {
  // Best-effort: link back to the most recent event-buy attempt if any.
  // We don't read sessionStorage directly here — the buy page handles
  // its own restore on mount.
  const fallbackEventId = 'ritmo-x-padel-haus-summer-sunset-2026';

  return (
    <main className="evc-main">
      <motion.section
        className="evc-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="wrap evc-wrap">
          <p className="rule">Kauf abgebrochen</p>
          <h1 className="page-title">
            Kein Problem<span className="accent">.</span>
          </h1>
          <p className="page-lead">
            Es wurde keine Zahlung ausgelöst. Deine Auswahl ist gespeichert —
            du kannst direkt da weitermachen, wo du aufgehört hast.
          </p>
          <div className="evc-cta-row">
            <Link to={`/event/buy/${fallbackEventId}`} className="btn btn-pri">
              Weiter zum Kauf →
            </Link>
            <Link to="/events" className="btn btn-out">Alle Events</Link>
          </div>
          <p className="evc-foot-note">
            Wenn du Hilfe brauchst, schreib uns an{' '}
            <a href="mailto:hello@ritmopadel.shop">hello@ritmopadel.shop</a>.
          </p>
        </div>
      </motion.section>
    </main>
  );
}
