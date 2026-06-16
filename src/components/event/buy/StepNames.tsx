import { motion } from 'framer-motion';
import { useEffect } from 'react';
import type { BuyState } from '../../../lib/buyState';
import { emptyAttendee, isEmailValid } from '../../../lib/buyState';

/**
 * Step 2 — collect buyer + attendee names.
 *
 * Buyer always provides their own name + email. If `tier === 'zuschauer'`
 * and `quantity > 1`, the first attendee is the buyer themselves (auto-filled
 * from buyer fields) and additional attendee name pairs are collected below.
 *
 * The hidden honeypot field is dropped here as well — invisible to humans,
 * filled by naive bots.
 */
export function StepNames({
  state,
  setState,
}: {
  state: BuyState;
  setState: (next: Partial<BuyState>) => void;
}) {
  /* Keep attendees array length in sync with quantity */
  useEffect(() => {
    if (state.attendees.length !== state.quantity) {
      const next = [...state.attendees];
      while (next.length < state.quantity) next.push(emptyAttendee());
      while (next.length > state.quantity) next.pop();
      setState({ attendees: next });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.quantity]);

  /* Auto-mirror buyer → attendee[0] (the buyer comes themselves) */
  useEffect(() => {
    const a0 = state.attendees[0];
    if (!a0) return;
    const sameFirst = a0.firstName === state.buyer.firstName;
    const sameLast  = a0.lastName  === state.buyer.lastName;
    if (sameFirst && sameLast) return;
    const next = [...state.attendees];
    next[0] = {
      firstName: state.buyer.firstName,
      lastName:  state.buyer.lastName,
    };
    setState({ attendees: next });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.buyer.firstName, state.buyer.lastName]);

  const setBuyer = (patch: Partial<BuyState['buyer']>) =>
    setState({ buyer: { ...state.buyer, ...patch } });

  const setAttendee = (i: number, patch: Partial<BuyState['attendees'][number]>) => {
    const next = [...state.attendees];
    next[i] = { ...next[i], ...patch };
    setState({ attendees: next });
  };

  const emailValid = state.buyer.email === '' || isEmailValid(state.buyer.email);
  const showExtraAttendees = state.quantity > 1;

  return (
    <motion.div
      className="bf-step bf-step-names"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="bf-step-eyebrow">Schritt 2 von 4</p>
      <h2 className="bf-step-title">
        Wer ist <span className="accent">dabei</span>?
      </h2>
      <p className="bf-step-lead">
        Der Name auf dem Ticket muss zum Ausweis am Eingang passen.
        Übertragung später möglich, falls jemand absagen muss.
      </p>

      {/* ── Buyer ──────────────────────────────────────────────── */}
      <fieldset className="bf-fs">
        <legend className="bf-legend">Käufer:in</legend>
        <div className="bf-row-2">
          <Field label="Vorname" required>
            <input
              type="text"
              autoComplete="given-name"
              required
              value={state.buyer.firstName}
              onChange={(e) => setBuyer({ firstName: e.target.value })}
            />
          </Field>
          <Field label="Nachname" required>
            <input
              type="text"
              autoComplete="family-name"
              required
              value={state.buyer.lastName}
              onChange={(e) => setBuyer({ lastName: e.target.value })}
            />
          </Field>
        </div>
        <div className="bf-row-2">
          <Field label="Email" required error={!emailValid ? 'Bitte gültige Email' : null}>
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={state.buyer.email}
              onChange={(e) => setBuyer({ email: e.target.value })}
            />
          </Field>
          <Field label="Telefon (optional)">
            <input
              type="tel"
              autoComplete="tel"
              value={state.buyer.phone || ''}
              onChange={(e) => setBuyer({ phone: e.target.value })}
            />
          </Field>
        </div>
        <label className="bf-checkbox">
          <input
            type="checkbox"
            checked={state.buyer.newsletterOptIn}
            onChange={(e) => setBuyer({ newsletterOptIn: e.target.checked })}
          />
          <span>News &amp; nächste Events von RITMO — kein Spam, jederzeit abbestellbar.</span>
        </label>
      </fieldset>

      {/* ── Additional attendees (only if qty > 1) ────────────── */}
      {showExtraAttendees && (
        <fieldset className="bf-fs">
          <legend className="bf-legend">Weitere Tickets — Namen für die Personalisierung</legend>
          {state.attendees.slice(1).map((a, idx) => {
            const i = idx + 1;
            return (
              <div key={i} className="bf-row-2">
                <Field label={`Vorname, Ticket ${i + 1}`} required>
                  <input
                    type="text"
                    required
                    value={a.firstName}
                    onChange={(e) => setAttendee(i, { firstName: e.target.value })}
                  />
                </Field>
                <Field label={`Nachname, Ticket ${i + 1}`} required>
                  <input
                    type="text"
                    required
                    value={a.lastName}
                    onChange={(e) => setAttendee(i, { lastName: e.target.value })}
                  />
                </Field>
              </div>
            );
          })}
          <p className="bf-fs-hint">
            Die Namen erscheinen als Wasserzeichen auf den Tickets. Übertragung an
            andere Personen ist später per Link möglich (1× pro Ticket).
          </p>
        </fieldset>
      )}

      {/* ── Honeypot — visually hidden, focusable=false ───────── */}
      <div className="bf-honeypot" aria-hidden="true">
        <label>
          Lass dieses Feld leer.
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={state.honeypot}
            onChange={(e) => setState({ honeypot: e.target.value })}
          />
        </label>
      </div>
    </motion.div>
  );
}

/* ───────── Field shell ───────── */
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <label className={`bf-field${error ? ' has-error' : ''}`}>
      <span className="bf-field-label">
        {label}{required ? <em aria-hidden> *</em> : null}
      </span>
      {children}
      {error && <span className="bf-field-error">{error}</span>}
    </label>
  );
}
