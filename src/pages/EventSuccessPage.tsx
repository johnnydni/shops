import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchSession, type TicketTokenView } from '../lib/eventTicket';
import { TicketCard } from '../components/event/ticket/TicketCard';
import { clearPersisted } from '../lib/buyState';

/**
 * /event/success?session_id=cs_...
 *
 * Polls /api/event/session/:id every 2s for up to 20s. Three render
 * states:
 *
 *   - loading        no session id, or polling in progress
 *   - ready          tickets received → render TicketCard grid +
 *                    Screenshot hint
 *   - timeout        webhook took > 20s — show "Tickets kommen per Email"
 *                    fallback with refresh CTA
 *
 * Cart-like state cleanup: BuyState.clearPersisted() runs ONCE on mount
 * when we have a valid session id — clears the in-tab sessionStorage so
 * the next purchase starts fresh.
 */

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS  = 20_000;

export function EventSuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const [tickets, setTickets] = useState<TicketTokenView[] | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string>('Bestätigung läuft …');
  const [timedOut, setTimedOut] = useState(false);
  const clearedRef = useRef(false);

  /* Clear sessionStorage exactly once when we land here with a real id. */
  useEffect(() => {
    if (sessionId && !clearedRef.current) {
      clearedRef.current = true;
      clearPersisted();
    }
  }, [sessionId]);

  /* Polling loop. Abandon on unmount or `tickets` arrival. */
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    const start = Date.now();

    async function tick(): Promise<void> {
      if (cancelled) return;
      const r = await fetchSession(sessionId);
      if (cancelled) return;
      if (r.status === 'ready') {
        setTickets(r.tickets);
        return;
      }
      setPendingMessage(r.message || (r.status === 'processing' ? 'Tickets werden ausgestellt …' : 'Bestätigung läuft …'));
      if (Date.now() - start > POLL_TIMEOUT_MS) {
        setTimedOut(true);
        return;
      }
      setTimeout(tick, POLL_INTERVAL_MS);
    }
    void tick();

    return () => { cancelled = true; };
  }, [sessionId]);

  /* ─── No session id at all — landed here manually ─── */
  if (!sessionId) {
    return (
      <main className="evs-main">
        <div className="wrap evs-wrap">
          <p className="rule">Erfolg</p>
          <h1 className="page-title">Da fehlt was<span className="accent">.</span></h1>
          <p className="page-lead">
            Diese Seite erscheint normalerweise nach einer erfolgreichen Bezahlung
            mit angehängter Session-ID. Schau in dein Postfach — die Bestätigung
            mit deinen Ticket-Links ist sicher schon unterwegs.
          </p>
          <div className="evs-cta-row">
            <Link to="/events" className="btn btn-pri">Alle Events →</Link>
            <Link to="/" className="btn btn-out">Zur Startseite</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="evs-main">
      {/* ─── Hero ─── */}
      <motion.section
        className="evs-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="wrap">
          <p className="rule">Bestellung bestätigt</p>
          <h1 className="page-title">
            Du bist <span className="accent">dabei</span>.
          </h1>
          <p className="page-lead">
            {tickets
              ? `${tickets.length === 1 ? 'Dein Ticket' : `Deine ${tickets.length} Tickets`} sind ausgestellt — speicher sie als Screenshot oder druck sie aus.`
              : pendingMessage}
          </p>
        </div>
      </motion.section>

      {/* ─── Body ─── */}
      <section className="evs-body">
        <div className="wrap">

          <AnimatePresence mode="wait" initial={false}>
            {!tickets && !timedOut && (
              <motion.div
                key="loading"
                className="evs-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="evs-spinner" aria-hidden="true">
                  <span /><span /><span />
                </div>
                <p>{pendingMessage}</p>
                <p className="evs-loading-note">
                  Das dauert meist nur ein paar Sekunden. Du kannst die Seite
                  offen lassen — sobald die Tickets bereit sind, erscheinen sie hier.
                </p>
              </motion.div>
            )}

            {!tickets && timedOut && (
              <motion.div
                key="timeout"
                className="evs-timeout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h2 className="evs-section-title">Tickets kommen per Email</h2>
                <p>
                  Die Bezahlung ist durch. Die Bestätigung mit deinen Ticket-Links
                  wird gerade ausgestellt — sie landet innerhalb der nächsten Minuten
                  in deinem Postfach. Bei Fragen schreib uns an{' '}
                  <a href="mailto:hello@ritmopadel.shop">hello@ritmopadel.shop</a>.
                </p>
                <div className="evs-cta-row">
                  <button
                    type="button"
                    className="btn btn-pri"
                    onClick={() => window.location.reload()}
                  >
                    Erneut prüfen
                  </button>
                  <Link to="/events" className="btn btn-out">Alle Events</Link>
                </div>
              </motion.div>
            )}

            {tickets && (
              <motion.div
                key="ready"
                className="evs-ready"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="evs-instructions">
                  <h2 className="evs-section-title">Bitte mach jetzt einen Screenshot</h2>
                  <p>
                    Speicher jedes Ticket als Bild oder PDF auf deinem Handy oder
                    druck es aus. Am Eingang wird der QR-Code gescannt — ohne
                    Strom oder Internet auf deinem Handy klappt das nur, wenn du
                    das Ticket schon offline hast.
                  </p>
                </div>

                <div className="evs-tickets">
                  {tickets.map((t, i) => (
                    <motion.div
                      key={t.ticketId}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <TicketCard ticket={t} qrPayload={t.token} variant="live" />
                      <div className="evs-ticket-actions">
                        <Link to={`/event/ticket/${t.token}`} className="btn btn-out">
                          Einzeln öffnen / drucken →
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="evs-foot">
                  <p>
                    Eine Bestätigungs-Email mit allen Links ist parallel an dich raus.
                    Bei Fragen:{' '}
                    <a href="mailto:hello@ritmopadel.shop">hello@ritmopadel.shop</a>.
                  </p>
                  <div className="evs-cta-row">
                    <Link to="/events" className="btn btn-out">Alle Events</Link>
                    <Link to="/" className="btn btn-out">Zur Startseite</Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>
    </main>
  );
}
