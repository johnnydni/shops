import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TurnstileWidget } from './TurnstileWidget';
import { SpielstilCard } from '../../spielstil/SpielstilCard';
import { SPIELSTILE } from '../../../lib/spielstile';
import { eur } from '../../../lib/format';
import type { BuyState } from '../../../lib/buyState';
import type { EventItem } from '../../../lib/types';

/**
 * Step 4 — final review before redirect to Stripe.
 *
 * Shows:
 *  - Selected tier + quantity + price total
 *  - Buyer + attendee summary
 *  - Spielstil reveal (compact, only for spieler)
 *  - AGB + Datenschutz checkboxes (required)
 *  - Turnstile widget (required — separate from quiz-start widget)
 *  - "Sicher bezahlen" CTA (disabled until everything green)
 *
 * Parent handles the actual submission.
 */
export function StepReview({
  event,
  state,
  setState,
  busy,
  errorMessage,
  onSubmit,
}: {
  event: EventItem;
  state: BuyState;
  setState: (next: Partial<BuyState>) => void;
  busy: boolean;
  errorMessage: string | null;
  onSubmit: () => void;
}) {
  const tier = event.tickets?.find(
    (t) => t.name.toLowerCase() === state.tier
  );
  const unit = tier?.price ?? 0;
  const total = unit * state.quantity;

  const spielstil = state.quiz?.winner ? SPIELSTILE[state.quiz.winner] : null;

  const canSubmit =
    state.acceptedAgb &&
    state.acceptedPrivacy &&
    state.turnstileToken &&
    state.honeypot === '' &&
    !busy;

  return (
    <motion.div
      className="bf-step bf-step-review"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="bf-step-eyebrow">Schritt 4 von 4</p>
      <h2 className="bf-step-title">
        Alles richtig? <span className="accent">Auf zur Kasse.</span>
      </h2>
      <p className="bf-step-lead">
        Letzter Check. Im nächsten Schritt landest du sicher bei Stripe für
        die Zahlung. RITMO sieht deine Kartendaten zu keinem Zeitpunkt.
      </p>

      <div className="bf-review">
        {/* ── Order summary ─────────────────────────────────────── */}
        <section className="bf-review-block">
          <h3 className="bf-review-head">Deine Auswahl</h3>
          <table className="bf-review-table">
            <tbody>
              <tr>
                <th>Event</th>
                <td>{event.title}</td>
              </tr>
              <tr>
                <th>Datum</th>
                <td>{new Intl.DateTimeFormat('de-DE', {
                  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
                }).format(new Date(event.date))}, ab 18:00</td>
              </tr>
              <tr>
                <th>Ticket-Typ</th>
                <td>
                  {state.tier === 'spieler' ? 'Spieler-Ticket' : 'Zuschauer-Ticket'}
                  {state.quantity > 1 && ` × ${state.quantity}`}
                </td>
              </tr>
              <tr className="bf-review-total">
                <th>Summe</th>
                <td><strong>{eur(total)}</strong></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ── People ─────────────────────────────────────────────── */}
        <section className="bf-review-block">
          <h3 className="bf-review-head">Personen</h3>
          <ul className="bf-review-people">
            {state.attendees.map((a, i) => (
              <li key={i}>
                <span className="bf-person-name">{a.firstName} {a.lastName}</span>
                {i === 0 && <span className="bf-person-tag">Käufer:in</span>}
              </li>
            ))}
          </ul>
          <p className="bf-review-email">
            Bestätigung &amp; Tickets gehen an <strong>{state.buyer.email}</strong>.
          </p>
        </section>

        {/* ── Spielstil (spieler only) ────────────────────────── */}
        {spielstil && (
          <section className="bf-review-block">
            <h3 className="bf-review-head">Dein Spielstil</h3>
            <SpielstilCard spielstil={spielstil} variant="compact" />
            <p className="bf-review-hint">
              Wird auf das Ticket gedruckt und im RITMO-App-Tier-System
              für Turnier-Pairings genutzt.
            </p>
          </section>
        )}

        {/* ── Consent ────────────────────────────────────────── */}
        <section className="bf-review-block">
          <h3 className="bf-review-head">Einverständnis</h3>
          <label className="bf-checkbox">
            <input
              type="checkbox"
              checked={state.acceptedAgb}
              onChange={(e) => setState({ acceptedAgb: e.target.checked })}
            />
            <span>
              Ich akzeptiere die{' '}
              <Link to="/agb" target="_blank">AGB</Link>{' '}
              und die{' '}
              <Link to="/teilnahmebedingungen" target="_blank">Teilnahmebedingungen</Link>.
            </span>
          </label>
          <label className="bf-checkbox">
            <input
              type="checkbox"
              checked={state.acceptedPrivacy}
              onChange={(e) => setState({ acceptedPrivacy: e.target.checked })}
            />
            <span>
              Ich habe die{' '}
              <Link to="/datenschutz" target="_blank">Datenschutzerklärung</Link>{' '}
              gelesen und stimme der Verarbeitung meiner Daten zu.
            </span>
          </label>
        </section>

        {/* ── Turnstile ────────────────────────────────────────── */}
        <section className="bf-review-block">
          <h3 className="bf-review-head">Sicherheits-Check</h3>
          <TurnstileWidget
            action="event-checkout"
            onToken={(t) => setState({ turnstileToken: t })}
          />
        </section>

        {errorMessage && (
          <div className="bf-error" role="alert">{errorMessage}</div>
        )}

        {/* ── Submit ────────────────────────────────────────── */}
        <div className="bf-submit-row">
          <button
            type="button"
            className="btn btn-pri btn-lg bf-submit"
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            {busy ? 'Wird vorbereitet …' : `Sicher bezahlen, ${eur(total)}`}
          </button>
          <p className="bf-submit-note">
            Du wirst zu <strong>stripe.com</strong> weitergeleitet. Bezahlbar mit
            Karte, Klarna, Giropay, Apple/Google Pay, SEPA.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
