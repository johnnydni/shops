import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  hasDeviceSignedUp,
  markDeviceSignedUp,
  submitWaitlist,
  type WaitlistTier,
} from '../../../lib/waitlist';

/**
 * Single-step waitlist form with a cookie/localStorage device-lock.
 *
 * Earlier iterations had a 4-step flow with double email confirm + "are
 * you sure" gate; the user simplified to just: name + email + tier +
 * GDPR-checkbox + submit. On submit we fire-and-show success, set the
 * device flag, and stop showing the form. On revisit we read the flag
 * and show "Du bist bereits auf der Warteliste".
 *
 * The Worker still receives the data (POST /api/event/waitlist) — the
 * "weg von prüflogik" instruction was about UI gymnastics, not server-
 * side persistence. We trust the user not to typo, accept duplicates,
 * and let the worker rate-limit per IP.
 */
export function WaitlistForm({ eventId }: { eventId: string }) {
  const [alreadyLocked, setAlreadyLocked] = useState(() => hasDeviceSignedUp(eventId));
  // True only for the one render after a successful submit in THIS session.
  // Distinguishes the "you're on the list now" celebration from the quiet
  // revisit copy ("you're already on the list").
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [tier, setTier] = useState<WaitlistTier | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [acceptedDsgvo, setAcceptedDsgvo] = useState(false);
  const [honeypot,  setHoneypot]  = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setAlreadyLocked(hasDeviceSignedUp(eventId)); }, [eventId]);

  const emailValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const canSubmit =
    !!tier &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    emailValid &&
    email.trim().length > 0 &&
    acceptedDsgvo &&
    !busy;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !tier) return;
    setBusy(true);
    setError(null);
    // Fire-and-trust: we set the device flag eagerly so a slow server
    // doesn't keep the form alive.
    markDeviceSignedUp(eventId);
    const res = await submitWaitlist({
      eventId,
      tier,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      honeypot,
    });
    setBusy(false);
    if (res.ok) {
      setJustSubmitted(true);
      setAlreadyLocked(true);
    } else {
      // Server rejected — keep the flag (user already in the local DB)
      // but surface the message so they know what happened. The lock
      // stops nagging on next visit either way.
      setError(res.message);
      setAlreadyLocked(true);
    }
  }

  /* ── Already on the list ── */
  if (alreadyLocked) {
    const headline = justSubmitted
      ? 'Du bist auf der Warteliste!'
      : 'Du stehst bereits auf der Warteliste';
    return (
      <motion.div
        className={`wl-form wl-locked${justSubmitted ? ' wl-just-submitted' : ''}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: justSubmitted ? 0.5 : 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <h4 className="wl-locked-head">{headline}</h4>
        <p>
          Sobald die Tickets über <strong>Playtomic</strong> live gehen,
          schicken wir dir eine Email — du musst nichts weiter tun.
        </p>
        {error && (
          <p className="wl-locked-note">
            Hinweis: <em>{error}</em>
          </p>
        )}
      </motion.div>
    );
  }

  return (
    <form className="wl-form" onSubmit={onSubmit}>
      <div className="wl-tier-row">
        <button
          type="button"
          className={`wl-tier-btn${tier === 'spieler' ? ' is-active' : ''}`}
          onClick={() => setTier('spieler')}
        >
          <span className="wl-tier-name">Spieler-Ticket</span>
          <span className="wl-tier-hint">22 Plätze, €39</span>
        </button>
        <button
          type="button"
          className={`wl-tier-btn${tier === 'zuschauer' ? ' is-active' : ''}`}
          onClick={() => setTier('zuschauer')}
        >
          <span className="wl-tier-name">Zuschauer-Ticket</span>
          <span className="wl-tier-hint">Early-Bird €15</span>
        </button>
      </div>

      <div className="wl-row-2">
        <label className="wl-field">
          <span>Vorname</span>
          <input
            type="text"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(ev) => setFirstName(ev.target.value)}
          />
        </label>
        <label className="wl-field">
          <span>Nachname</span>
          <input
            type="text"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(ev) => setLastName(ev.target.value)}
          />
        </label>
      </div>

      <label className="wl-field">
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
      </label>

      {/* Honeypot — visually hidden */}
      <div className="bf-honeypot" aria-hidden="true">
        <label>
          Lass dieses Feld leer.
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(ev) => setHoneypot(ev.target.value)}
          />
        </label>
      </div>

      {/* GDPR consent */}
      <label className="wl-checkbox">
        <input
          type="checkbox"
          checked={acceptedDsgvo}
          onChange={(ev) => setAcceptedDsgvo(ev.target.checked)}
        />
        <span>
          Ich willige in die Speicherung meiner Daten ein. Diese werden
          ausschließlich genutzt für die Benachrichtigung zu Event-Infos,
          den Versand des Ticket-Kauf-Links sowie der Tickets. Details in
          der <a href="/datenschutz" target="_blank" rel="noopener">Datenschutzerklärung</a>.
        </span>
      </label>

      <button
        type="submit"
        className="btn btn-pri"
        disabled={!canSubmit}
      >
        {busy ? 'Wird gespeichert …' : 'Auf die Warteliste eintragen'}
      </button>
    </form>
  );
}
