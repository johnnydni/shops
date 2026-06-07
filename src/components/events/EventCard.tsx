import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { dayRange, monthShort, fullDate } from '../../lib/dates';
import {
  type EventItem,
  EVENT_TYPE_LABEL,
  EVENT_TYPE_TONE,
} from '../../lib/types';
import { eur } from '../../lib/format';

const cardVariant = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/**
 * One event tile. Date-block left (day + month), content right.
 *
 *   Type-badge / status / tag chips
 *   Title  (+ subtitle below)
 *   Date · Venue meta row
 *   Description
 *   Ticket tiers (when present, otherwise flat price)
 *   Sales-window mini line
 *   Foot: capacity hint + CTA
 *
 * Tone (date-block + type-badge colour) is driven by EVENT_TYPE_TONE.
 */
export function EventCard({ event }: { event: EventItem }) {
  const tone = EVENT_TYPE_TONE[event.type];
  const sold = event.status === 'soldout';
  const wait = event.status === 'waitlist';

  return (
    <motion.article
      className={`event-card${sold ? ' is-sold' : ''}`}
      variants={cardVariant}
    >
      {/* ─── Date block ────────────────────────────────────────── */}
      <div className={`event-date tone-${tone}`}>
        <div className="event-day">{dayRange(event.date, event.endDate)}</div>
        <div className="event-month">{monthShort(event.date)}</div>
      </div>

      {/* ─── Body ──────────────────────────────────────────────── */}
      <div className="event-body">
        <div className="event-meta-top">
          <span className={`event-type-badge tone-${tone}`}>
            {EVENT_TYPE_LABEL[event.type]}
          </span>
          {sold && <span className="event-status sold">Ausverkauft</span>}
          {wait && <span className="event-status wait">Warteliste</span>}
          {event.tags?.map((t) => (
            <span key={t} className="event-tag">{t}</span>
          ))}
        </div>

        <h3 className="event-title">
          <Link to={`/events/${event.id}`} className="event-title-link">
            {event.title}
          </Link>
        </h3>
        {event.subtitle && (
          <p className="event-subtitle">{event.subtitle}</p>
        )}

        <div className="event-meta-row">
          <span className="event-date-long" aria-label="Datum">
            {fullDate(event.date)}
            {event.endDate ? ` – ${fullDate(event.endDate)}` : ''}
          </span>
          <span className="event-sep" aria-hidden>·</span>
          <span className="event-location">
            {event.venue ? <strong>{event.venue}</strong> : null}
            {event.venue && event.venue !== event.location ? ', ' : ''}
            {event.venue !== event.location ? event.location : ''}
          </span>
        </div>

        <p className="event-desc">{event.shortDesc}</p>

        {/* ─── Ticket tiers ─────────────────────────────────────── */}
        {event.tickets && event.tickets.length > 0 ? (
          <ul className="event-tickets" aria-label="Ticket-Kategorien">
            {event.tickets.map((t) => (
              <li
                key={t.name}
                className={`event-tier${t.status === 'soldout' ? ' is-sold' : ''}`}
              >
                <span className="tier-name">{t.name}</span>
                <span className="tier-cap">
                  {t.capacity != null
                    ? `${t.capacity} Spots`
                    : 'Solange Vorrat reicht'}
                </span>
                <span className="tier-price">{eur(t.price)}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {/* ─── Sales window ─────────────────────────────────────── */}
        {(event.salesStart || event.salesEnd) && (
          <p className="event-sales">
            {event.salesStart && event.salesEnd
              ? `Verkauf vom ${fullDate(event.salesStart)} bis ${fullDate(event.salesEnd)}`
              : event.salesStart
              ? `Verkauf ab ${fullDate(event.salesStart)}`
              : `Verkauf endet ${fullDate(event.salesEnd!)}`}
          </p>
        )}

        {/* ─── Foot — fallback flat price (single-tier) + CTA ───── */}
        <div className="event-foot">
          <div className="event-price">
            {event.tickets && event.tickets.length > 0
              ? '' /* tiers shown above; foot stays clean */
              : event.price === 0
              ? 'Eintritt frei'
              : event.price != null
              ? eur(event.price)
              : 'Auf Anfrage'}
            {!event.tickets && event.capacity != null && (
              <span className="event-cap"> · {event.capacity} Plätze</span>
            )}
          </div>
          {event.ctaUrl ? (
            <a
              href={event.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="event-cta"
            >
              {event.ctaLabel ?? 'Mehr erfahren'} →
            </a>
          ) : (
            <Link to={`/events/${event.id}`} className="event-cta">
              Details ansehen →
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
