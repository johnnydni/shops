import { motion } from 'framer-motion';
import type { EventItem } from '../../../lib/types';
import type { BuyState } from '../../../lib/buyState';
import { eur } from '../../../lib/format';

/**
 * Step 1 — pick ticket type + quantity.
 *
 * Spieler: fixed quantity = 1 (per-email cap).
 * Zuschauer: 1-6 (group buys allowed).
 *
 * Sold-out and capacity warnings are passed in from the page since
 * inventory is server-state.
 */
export function StepType({
  event,
  state,
  setState,
  remainingPlayer,
}: {
  event: EventItem;
  state: BuyState;
  setState: (next: Partial<BuyState>) => void;
  remainingPlayer: number | null;
}) {
  const spielerTier  = event.tickets?.find((t) => t.name === 'Spieler');
  const zuschauerTier = event.tickets?.find((t) => t.name === 'Zuschauer');
  const spielerSold = spielerTier?.status === 'soldout' || remainingPlayer === 0;

  return (
    <motion.div
      className="bf-step bf-step-type"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="bf-step-eyebrow">Schritt 1 von 4</p>
      <h2 className="bf-step-title">
        Wähle deinen <span className="accent">Zugang</span>.
      </h2>
      <p className="bf-step-lead">
        Spieler:innen treten an, Zuschauer:innen erleben das Turnier am
        Court-Rand mit Drinks, Burger und Sunset-Session.
      </p>

      <div className="bf-tier-grid">
        {/* ── Spieler ─────────────────────────────────────────── */}
        {spielerTier && (
          <button
            type="button"
            className={`bf-tier bf-tier-spieler${state.tier === 'spieler' ? ' is-active' : ''}${spielerSold ? ' is-disabled' : ''}`}
            disabled={spielerSold}
            onClick={() => setState({ tier: 'spieler', quantity: 1 })}
          >
            <div className="bf-tier-head">
              <span className="bf-tier-name">Spieler-Ticket</span>
              <span className="bf-tier-price">{eur(spielerTier.price)}</span>
            </div>
            <ul className="bf-tier-perks">
              <li>Startplatz im Turnier (22 Spots gesamt)</li>
              <li>Personalisierter Spielstil-Pass</li>
              <li>Welcome Drink (Aperol oder Padelé Spritz)</li>
              <li>Großer Burger von Manny's BBQ</li>
              <li>Zugang zur RITMO Refresh Bar</li>
            </ul>
            <div className="bf-tier-foot">
              {spielerSold
                ? <span className="bf-cap-note bf-sold">Ausverkauft</span>
                : remainingPlayer != null
                ? <span className="bf-cap-note">{remainingPlayer} Plätze frei</span>
                : <span className="bf-cap-note">22 Plätze gesamt</span>}
            </div>
          </button>
        )}

        {/* ── Zuschauer ───────────────────────────────────────── */}
        {zuschauerTier && (
          <button
            type="button"
            className={`bf-tier bf-tier-zuschauer${state.tier === 'zuschauer' ? ' is-active' : ''}`}
            onClick={() => setState({ tier: 'zuschauer', quantity: Math.max(1, state.quantity) })}
          >
            <div className="bf-tier-head">
              <span className="bf-tier-name">Zuschauer-Ticket</span>
              <span className="bf-tier-price">{eur(zuschauerTier.price)}</span>
            </div>
            <ul className="bf-tier-perks">
              <li>Eintritt zum Spielfeld &amp; Sunset-Session</li>
              <li>Softdrink &amp; kleiner Burger inklusive</li>
              <li>Aperol-Bar offen den ganzen Abend</li>
              <li>DJ ANKOE → LNRT House Music</li>
            </ul>
            <div className="bf-tier-foot">
              <span className="bf-cap-note">Solange Vorrat reicht</span>
            </div>
          </button>
        )}
      </div>

      {/* ── Quantity (zuschauer only) ─────────────────────────── */}
      {state.tier === 'zuschauer' && (
        <motion.div
          className="bf-qty"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <label htmlFor="bf-qty-input" className="bf-qty-label">
            Wie viele Zuschauer-Tickets?
          </label>
          <div className="bf-qty-stepper" role="group" aria-labelledby="bf-qty-input">
            <button
              type="button"
              className="bf-qty-btn"
              aria-label="Weniger"
              onClick={() => setState({ quantity: Math.max(1, state.quantity - 1) })}
              disabled={state.quantity <= 1}
            >−</button>
            <span id="bf-qty-input" className="bf-qty-value">{state.quantity}</span>
            <button
              type="button"
              className="bf-qty-btn"
              aria-label="Mehr"
              onClick={() => setState({ quantity: Math.min(6, state.quantity + 1) })}
              disabled={state.quantity >= 6}
            >+</button>
          </div>
          <p className="bf-qty-hint">Maximal 6 pro Email — danach bitte zweite Email nutzen.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
