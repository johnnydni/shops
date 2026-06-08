import { SpielstilGlyph } from '../../spielstil/SpielstilGlyph';
import { SPIELSTILE } from '../../../lib/spielstile';
import { QrCode } from './QrCode';
import type { TicketView } from '../../../lib/eventTicket';

/**
 * The personalised Bauhaus ticket.
 *
 * 5:2 horizontal ratio (e.g. 750×300 at base). Three columns:
 *   1) Left — Spielstil-Glyph + Name (or simple wordmark for Zuschauer)
 *   2) Centre — event meta + attendee name + tier perks
 *   3) Right — QR code + ticket id
 *
 * A diagonal SVG watermark with the attendee name covers the whole
 * card at ~5% opacity, so even a photo of the ticket carries the buyer's
 * name forward and discourages reselling.
 *
 * Theme: Spieler tickets adopt the Spielstil's accent + card background.
 *        Zuschauer tickets use a default dark palette.
 *
 * Props:
 *   ticket     — display data from /api/event/ticket/:token
 *   qrPayload  — the signed token the QR encodes (usually `token` from URL)
 *   variant    — 'live'  default cinematic style
 *                'print' adds bordered black-on-white look
 */
export function TicketCard({
  ticket,
  qrPayload,
  variant = 'live',
}: {
  ticket: TicketView;
  qrPayload: string;
  variant?: 'live' | 'print';
}) {
  const spielstil = ticket.spielstilId ? SPIELSTILE[ticket.spielstilId] : null;

  // Theme
  const isPrint = variant === 'print';
  const accent  = spielstil?.accent ?? '#FF7A1A';
  const card    = isPrint ? '#FFFFFF' : (spielstil?.card ?? '#0A0A0A');
  const onCard  = isPrint ? '#000000' : '#FFFFFF';
  const muted   = isPrint ? '#555555' : 'rgba(255,255,255,0.65)';

  const stateBanner =
    ticket.refunded ? { label: 'STORNIERT', tone: '#E84545' } :
    ticket.transferred ? { label: 'ÜBERTRAGEN', tone: '#FFD60A' } :
    ticket.checkedIn ? { label: 'BEREITS EINGECHECKT', tone: '#3A86FF' } :
    null;

  return (
    <article
      className={`tkt ${isPrint ? 'tkt-print' : 'tkt-live'}`}
      style={{
        ['--tkt-accent' as string]: accent,
        ['--tkt-card' as string]: card,
        ['--tkt-on' as string]: onCard,
        ['--tkt-muted' as string]: muted,
      }}
      aria-label={`Ticket für ${ticket.attendeeName}`}
    >
      {/* ── Watermark with buyer name (full card, diagonal) ── */}
      <svg
        className="tkt-watermark"
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id={`wm-${ticket.ticketId}`} width="320" height="80" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
            <text
              x="0" y="32"
              fill="currentColor"
              fontFamily="'Lexend Mega', 'Public Sans', sans-serif"
              fontWeight="800"
              fontSize="22"
              letterSpacing="0.18em"
            >
              {(ticket.attendeeName || 'RITMO').toUpperCase()}
            </text>
          </pattern>
        </defs>
        <rect x="0" y="0" width="1000" height="400" fill={`url(#wm-${ticket.ticketId})`} />
      </svg>

      {/* ── Top stripe — accent bar with brand + tier ── */}
      <div className="tkt-stripe">
        <div className="tkt-brand">
          <span className="tkt-mark" aria-hidden="true" />
          <span className="tkt-brand-text">RITMO PADEL</span>
        </div>
        <div className="tkt-tier-pill">
          {ticket.tierLabel}
        </div>
      </div>

      {/* ── Main grid: Spielstil · Centre · QR ── */}
      <div className="tkt-grid">

        {/* Spielstil column */}
        <div className="tkt-spst">
          {spielstil ? (
            <>
              <SpielstilGlyph spielstil={spielstil} size={112} className="tkt-glyph" />
              <div className="tkt-spst-name">{spielstil.name}</div>
              <div className="tkt-spst-sub">{spielstil.subtitle}</div>
            </>
          ) : (
            <div className="tkt-spst-zuschauer">
              <div className="tkt-spst-mark" aria-hidden="true" />
              <div className="tkt-spst-name">ZUSCHAUER</div>
              <div className="tkt-spst-sub">Court-Rand · Drinks · DJ</div>
            </div>
          )}
        </div>

        {/* Centre meta */}
        <div className="tkt-meta">
          <div className="tkt-eyebrow">Ticket auf</div>
          <h2 className="tkt-name">{ticket.attendeeName}</h2>

          <div className="tkt-event">
            <div className="tkt-event-title">{ticket.eventName}</div>
            <div className="tkt-event-line">
              {formatGermanDate(ticket.eventDateIso)} · ab 18 Uhr
            </div>
            <div className="tkt-event-line">{ticket.venueLine}</div>
          </div>

          {ticket.tierExtras.length > 0 && (
            <ul className="tkt-perks">
              {ticket.tierExtras.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          )}
        </div>

        {/* QR + id */}
        <div className="tkt-qr">
          <QrCode
            value={qrPayload}
            size={160}
            dark={isPrint ? '#000' : '#000'}
            light="#FFFFFF"
          />
          <div className="tkt-id">#{ticket.ticketId.slice(0, 8).toUpperCase()}</div>
          <div className="tkt-scan-hint">Am Eingang scannen lassen</div>
        </div>
      </div>

      {/* ── State overlay (refunded / transferred / checked-in) ── */}
      {stateBanner && (
        <div
          className="tkt-state"
          style={{ background: stateBanner.tone, color: stateBanner.tone === '#FFD60A' ? '#000' : '#fff' }}
        >
          {stateBanner.label}
        </div>
      )}
    </article>
  );
}

const DAY = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
const MONTH = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

function formatGermanDate(iso: string): string {
  const d = new Date(iso);
  return `${DAY[d.getUTCDay()]}, ${d.getUTCDate()}. ${MONTH[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
