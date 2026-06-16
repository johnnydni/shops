import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  hasDeviceSignedUp,
  markDeviceSignedUp,
  submitWaitlist,
  type WaitlistTier,
} from '../../../lib/waitlist';

/**
 * Multi-step waitlist form with a localStorage device-lock.
 *
 * Steps:
 *   0  tier select        (Spieler vs. Zuschauer)
 *   1  identity           (firstName + lastName + email + email-confirm)
 *   2  consent confirm    ("Bist du sicher, dass du diese Email nutzen willst?")
 *   3  done               thank-you state
 *
 * Once a user reaches step 3, `markDeviceSignedUp(eventId)` is called and
 * the form refuses to render again on this device. The Worker also rate-
 * limits per IP, so the device lock is UX-side only — server is the trust
 * boundary.
 */
export function WaitlistForm({ eventId }: { eventId: string }) {
  const [alreadyLocked, setAlreadyLocked] = useState(() => hasDeviceSignedUp(eventId));
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [tier, setTier] = useState<WaitlistTier | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [honeypot,  setHoneypot]  = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* Sync device-lock on mount in case another tab signed up first */
  useEffect(() => { setAlreadyLocked(hasDeviceSignedUp(eventId)); }, [eventId]);

  /* ── Step 0 → 1 ── */
  function selectTier(t: WaitlistTier) {
    setTier(t);
    setStep(1);
    setError(null);
  }

  /* ── Step 1 → 2 (validate locally before showing confirm) ── */
  function gotoConfirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!firstName.trim() || !lastName.trim()) {
      setError('Bitte Vor- und Nachname angeben.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Bitte gültige Email-Adresse.');
      return;
    }
    if (email.trim().toLowerCase() !== emailConfirm.trim().toLowerCase()) {
      setError('Die beiden Email-Felder stimmen nicht überein.');
      return;
    }
    setStep(2);
  }

  /* ── Step 2 → 3 (submit) ── */
  async function confirmAndSubmit() {
    if (!tier) return;
    setBusy(true);
    setError(null);
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
      setSuccessMessage(res.message);
      markDeviceSignedUp(eventId);
      setAlreadyLocked(true);
      setStep(3);
    } else {
      setError(res.message);
      if (res.code === 'rate_limited') {
        // Server says no — accept and lock client too so the field
        // doesn't keep nagging the user.
        markDeviceSignedUp(eventId);
        setAlreadyLocked(true);
      }
    }
  }

  /* ── Already locked from a previous session ── */
  if (alreadyLocked && step !== 3) {
    return (
      <div className="wl-form wl-locked">
        <h4 className="wl-locked-head">Du stehst schon auf der Warteliste</h4>
        <p>
          Von diesem Gerät wurde bereits ein Eintrag gemacht. Sobald die
          Tickets über <strong>Playtomic</strong> live gehen, schicken wir
          dir eine Email — du musst nichts weiter tun.
        </p>
      </div>
    );
  }

  return (
    <div className="wl-form">
      <AnimatePresence mode="wait" initial={false}>
        {step === 0 && (
          <motion.div
            key="step-0"
            className="wl-step"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <h4 className="wl-step-head">Worauf willst du auf die Warteliste?</h4>
            <div className="wl-tier-row">
              <button
                type="button"
                className="wl-tier-btn"
                onClick={() => selectTier('spieler')}
              >
                <span className="wl-tier-name">Spieler-Ticket</span>
                <span className="wl-tier-hint">22 Plätze, €39</span>
              </button>
              <button
                type="button"
                className="wl-tier-btn"
                onClick={() => selectTier('zuschauer')}
              >
                <span className="wl-tier-name">Zuschauer-Ticket</span>
                <span className="wl-tier-hint">Early-Bird €15, mit Upgrade-Option</span>
              </button>
            </div>
            <p className="wl-step-foot">
              Verkauf läuft über <strong>Playtomic</strong>. Wartelisten-Holder
              werden bevorzugt benachrichtigt, bevor der allgemeine Verkauf startet.
            </p>
          </motion.div>
        )}

        {step === 1 && (
          <motion.form
            key="step-1"
            className="wl-step"
            onSubmit={gotoConfirm}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <h4 className="wl-step-head">
              Warteliste für das <strong>{tier === 'spieler' ? 'Spieler-Ticket' : 'Zuschauer-Ticket'}</strong>
            </h4>
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
            <label className="wl-field">
              <span>Email bestätigen</span>
              <input
                type="email"
                autoComplete="off"
                inputMode="email"
                required
                value={emailConfirm}
                onChange={(ev) => setEmailConfirm(ev.target.value)}
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

            {error && <div className="wl-error">{error}</div>}

            <div className="wl-actions">
              <button type="button" className="btn btn-out" onClick={() => setStep(0)}>
                ← Zurück
              </button>
              <button type="submit" className="btn btn-pri">
                Weiter →
              </button>
            </div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.div
            key="step-2"
            className="wl-step wl-step-confirm"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <h4 className="wl-step-head">Sicher mit dieser Email?</h4>
            <p className="wl-confirm-email">
              <strong>{email.trim().toLowerCase()}</strong>
            </p>
            <p className="wl-confirm-note">
              Alle Updates zur Warteliste, Verkaufsstart und Ticket-Vergabe
              landen ausschließlich an dieser Adresse. Mit Tippfehler bekommen
              wir dich nicht erreicht.
            </p>

            {error && <div className="wl-error">{error}</div>}

            <div className="wl-actions">
              <button
                type="button"
                className="btn btn-out"
                onClick={() => setStep(1)}
                disabled={busy}
              >
                ← Email ändern
              </button>
              <button
                type="button"
                className="btn btn-pri"
                disabled={busy}
                onClick={confirmAndSubmit}
              >
                {busy ? 'Wird gespeichert …' : 'Ja, eintragen'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step-3"
            className="wl-step wl-step-done"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="wl-done-mark" aria-hidden="true" />
            <h4 className="wl-step-head">Eingetragen</h4>
            <p>{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
