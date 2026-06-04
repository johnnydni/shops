import { motion } from 'framer-motion';
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
 * Tone (badge colour) is driven by the event type token map.
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
      <div className={`event-date tone-${tone}`}>
        <div className="event-day">{dayRange(event.date, event.endDate)}</div>
        <div className="event-month">{monthShort(event.date)}</div>
      </div>

      <div className="event-body">
        <div className="event-meta-top">
          <span className={`event-type-badge tone-${tone}`}>
            {EVENT_TYPE_LABEL[event.type]}
          </span>
          {sold && <span className="event-status sold">Ausverkauft</span>}
          {wait && <span className="event-status wait">Warteliste</span>}
        </div>

        <h3 className="event-title">{event.title}</h3>

        <div className="event-meta-row">
          <span className="event-date-long" aria-label="Datum">
            {fullDate(event.date)}
            {event.endDate ? ` – ${fullDate(event.endDate)}` : ''}
          </span>
          <span className="event-sep" aria-hidden>·</span>
          <span className="event-location">
            {event.venue ? <strong>{event.venue}</strong> : null}
            {event.venue ? ', ' : ''}
            {event.location}
          </span>
        </div>

        <p className="event-desc">{event.shortDesc}</p>

        <div className="event-foot">
          <div className="event-price">
            {event.price === 0
              ? 'Eintritt frei'
              : event.price != null
              ? eur(event.price)
              : 'Auf Anfrage'}
            {event.capacity != null && (
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
          ) : event.ctaLabel ? (
            <span className="event-cta event-cta-static">
              {event.ctaLabel}
            </span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
