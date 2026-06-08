import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchTicket, type TicketView } from '../lib/eventTicket';
import { TicketCard } from '../components/event/ticket/TicketCard';

/**
 * /event/ticket/:token
 *
 * Single-ticket view reached from the confirmation email or the success
 * page. The :token in the URL is a signed JWT (audience='ticket') — the
 * Worker verifies it on /api/event/ticket/:token and returns display data.
 *
 * Print: hitting the OS print dialog cleans the chrome (header, footer,
 * page-level nav) via @media print and renders the ticket card alone.
 */
export function EventTicketPage() {
  const { token } = useParams<{ token: string }>();
  const [ticket, setTicket] = useState<TicketView | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setError({ code: 'missing_token', message: 'Kein Ticket-Token in der URL.' });
      return;
    }
    fetchTicket(token).then((r) => {
      if (cancelled) return;
      if (r.ok) setTicket(r.ticket);
      else setError({ code: r.code, message: r.message });
    });
    return () => { cancelled = true; };
  }, [token]);

  if (error) {
    return (
      <main className="evt-main">
        <div className="wrap evt-wrap">
          <p className="rule">Ticket</p>
          <h1 className="page-title">
            Konnte nicht laden<span className="accent">.</span>
          </h1>
          <p className="page-lead evt-error">{error.message}</p>
          <div className="evt-cta-row">
            <Link to="/events" className="btn btn-pri">Alle Events</Link>
            <a href="mailto:hello@ritmopadel.shop" className="btn btn-out">
              Hilfe anfordern
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!ticket) {
    return (
      <main className="evt-main">
        <div className="wrap evt-wrap">
          <p className="rule">Ticket</p>
          <div className="evt-loading">
            <div className="evs-spinner" aria-hidden="true">
              <span /><span /><span />
            </div>
            <p>Lade dein Ticket …</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="evt-main">
      {/* ─── Header (hidden on print) ─── */}
      <motion.section
        className="evt-head no-print"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="wrap">
          <p className="rule">Ticket</p>
          <h1 className="page-title">
            {ticket.attendeeName}<span className="accent">.</span>
          </h1>
          <p className="page-lead">
            Bitte speicher dieses Ticket als Screenshot oder druck es aus.
            Am Eingang wird der QR-Code gescannt.
          </p>
          <div className="evt-cta-row">
            <button
              type="button"
              className="btn btn-pri"
              onClick={() => window.print()}
            >
              Drucken / PDF speichern
            </button>
            <a
              href="#tkt-anchor"
              className="btn btn-out"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('tkt-anchor');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Zum Ticket springen
            </a>
          </div>
        </div>
      </motion.section>

      {/* ─── Ticket (the print-visible part) ─── */}
      <section className="evt-body" id="tkt-anchor">
        <div className="wrap evt-card-wrap">
          <TicketCard ticket={ticket} qrPayload={token!} variant="live" />
        </div>
      </section>

      {/* ─── Foot info (hidden on print) ─── */}
      <section className="evt-foot no-print">
        <div className="wrap evt-foot-grid">
          <div>
            <h3 className="evt-foot-head">Was ist drin?</h3>
            <ul className="evt-foot-list">
              {ticket.tierExtras.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
          <div>
            <h3 className="evt-foot-head">Stornieren</h3>
            <p>
              Bis 7 Tage vor dem Event kannst du selbst stornieren — der Storno-Link
              steht in deiner Bestätigungs-Email. Nach Ablauf ist nur noch
              Namens-Übertragung möglich (1× pro Ticket).
            </p>
          </div>
          <div>
            <h3 className="evt-foot-head">Hilfe</h3>
            <p>
              Email an{' '}
              <a href="mailto:hello@ritmopadel.shop">hello@ritmopadel.shop</a>{' '}
              — wir antworten meist innerhalb eines Tages.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
