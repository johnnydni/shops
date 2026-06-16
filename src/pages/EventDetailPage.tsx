import { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { EVENTS } from '../data/events';
import { Crumbs } from '../components/ui/Crumbs';
import {
  EVENT_TYPE_LABEL,
  EVENT_TYPE_TONE,
  type EventItem,
} from '../lib/types';
import { eur } from '../lib/format';
import { dayRange, monthShort, fullDate } from '../lib/dates';
import { BOOKING_LOCKED } from '../lib/featureFlags';

/**
 * Computes the right CTA flavour for a given event:
 *   - tickets + within sales window → internal Link to /event/buy/<id>
 *   - tickets + before sales start  → disabled button "Verkauf ab <date>"
 *   - tickets + after sales end     → disabled "Verkauf beendet"
 *   - external ctaUrl               → external link
 *   - none                          → disabled "bald verfügbar"
 *
 * Used by all three CTAs on the detail page (hero, tickets block, final bleed).
 */
function TicketCTA({
  event,
  size,
  fallbackLabel,
}: {
  event: EventItem;
  size?: 'btn-lg';
  fallbackLabel?: string;
}) {
  const cls = `btn btn-pri${size ? ' ' + size : ''}`;
  const label = event.ctaLabel ?? fallbackLabel ?? 'Ticket sichern';

  // Global kill switch — overrides every other state. Renders a flat
  // disabled button with no link target.
  if (BOOKING_LOCKED) {
    return <button className={cls} disabled>Bald verfügbar</button>;
  }

  if (event.tickets && event.tickets.length) {
    const now = Date.now();
    const start = event.salesStart ? Date.parse(event.salesStart) : NaN;
    const end   = event.salesEnd   ? Date.parse(event.salesEnd)   : NaN;
    if (Number.isFinite(end) && now > end) {
      return <button className={cls} disabled>Verkauf beendet</button>;
    }
    if (Number.isFinite(start) && now < start) {
      return <button className={cls} disabled>Verkauf ab {fullDate(event.salesStart!)}</button>;
    }
    return <Link to={`/event/buy/${event.id}`} className={cls}>{label} →</Link>;
  }
  if (event.ctaUrl) {
    return (
      <a href={event.ctaUrl} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
      </a>
    );
  }
  return <button className={cls} disabled>{label}, bald verfügbar</button>;
}

/**
 * /events/:id — full detail page for a single event.
 *
 * Composes:
 *   Crumbs, Hero (stage + info + ticket panel)
 *   Story (alternating sections from longDesc)
 *   Programm (high-level phases)
 *   Schedule timeline (time-based row list)
 *   Detail Tickets panel (full breakdown)
 *   Venue (Padel Haus partner info)
 *   FAQ accordion
 *   Final CTA bleed
 */
export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const event = useMemo(
    () => EVENTS.find((e) => e.id === id),
    [id]
  );
  if (!event) return <Navigate to="/events" replace />;

  return (
    <>
      <Crumbs
        items={[
          { label: 'Shop', to: '/' },
          { label: 'Events', to: '/events' },
          { label: event.title },
        ]}
      />
      <Hero event={event} />
      <HighlightsRow />
      <StorySections event={event} />
      <Programm event={event} />
      <ScoringSection event={event} />
      <Schedule event={event} />
      <TicketsBlock event={event} />
      <CateringSection event={event} />
      <MusicSection event={event} />
      <Venue event={event} />
      <Faq event={event} />
      <FinalCta event={event} />
    </>
  );
}

/* ───────────────────────────────────────────────────────────────────
   HERO  — stage left, info + ticket panel right
   ─────────────────────────────────────────────────────────────────── */
function Hero({ event }: { event: EventItem }) {
  const reduce = useReducedMotion();
  const tone = EVENT_TYPE_TONE[event.type];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.1, delayChildren: 0.1 } },
  };
  const child = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section className="evp-hero">
      <div className="wrap evp-hero-grid">

        {/* Stage — large date block + animated bauhaus + image placeholder */}
        <motion.div
          className="evp-stage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Date column */}
          <div className={`evp-stage-date tone-${tone}`}>
            <div className="evp-stage-day">{dayRange(event.date, event.endDate)}</div>
            <div className="evp-stage-month">{monthShort(event.date)}</div>
            <div className="evp-stage-year">{event.date.slice(0, 4)}</div>
          </div>

          {/* Visual — image OR animated bauhaus placeholder */}
          <div className="evp-stage-visual">
            <BauhausVisual />
            {event.heroImageSrc && (
              <img
                src={event.heroImageSrc}
                alt={event.title}
                onError={(e) => { (e.currentTarget as HTMLImageElement).remove(); }}
              />
            )}
            <div className="evp-stage-meta">
              <span className={`event-type-badge tone-${tone}`}>
                {EVENT_TYPE_LABEL[event.type]}
              </span>
              {event.partner && (
                <span className="evp-partner-badge">
                  in Kooperation mit <b>{event.partner.name}</b>
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Info column */}
        <motion.div
          className="evp-info"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span className="evp-eyebrow" variants={child}>
            {fullDate(event.date)}
            {event.endDate ? ` – ${fullDate(event.endDate)}` : ''}
          </motion.span>
          <motion.h1 className="evp-title" variants={child}>
            {event.title}
          </motion.h1>
          {event.subtitle && (
            <motion.p className="evp-subtitle" variants={child}>
              {event.subtitle}
            </motion.p>
          )}
          <motion.div className="evp-venue-line" variants={child}>
            {event.venue && <strong>{event.venue}</strong>}
            {event.venue && event.location !== event.venue ? `, ${event.location}` : ''}
          </motion.div>

          {event.tags && event.tags.length > 0 && (
            <motion.div className="evp-tags" variants={child}>
              {event.tags.map((t) => (
                <span key={t} className="event-tag">{t}</span>
              ))}
            </motion.div>
          )}

          {/* Ticket panel — compact preview */}
          <motion.div className="evp-ticket-panel" variants={child}>
            {event.tickets && event.tickets.map((t) => (
              <div key={t.name} className="evp-ticket-line">
                <span className="evp-ticket-name">{t.name}</span>
                <span className="evp-ticket-cap">
                  {t.capacity != null ? `${t.capacity} Spots` : 'Solange Vorrat reicht'}
                </span>
                <span className="evp-ticket-price">{eur(t.price)}</span>
              </div>
            ))}

            {(event.salesStart || event.salesEnd) && (
              <p className="evp-sales-note">
                {event.salesStart && event.salesEnd
                  ? `Verkauf vom ${fullDate(event.salesStart)} bis ${fullDate(event.salesEnd)}`
                  : event.salesStart
                  ? `Verkauf ab ${fullDate(event.salesStart)}`
                  : `Verkauf endet ${fullDate(event.salesEnd!)}`}
              </p>
            )}

            <div className="evp-cta-row">
              <TicketCTA event={event} size="btn-lg" />
              <a href="#programm" className="btn btn-out btn-lg">
                Programm ansehen
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   STORY — long description paragraphs rendered as alternating blocks
   ─────────────────────────────────────────────────────────────────── */
/* ───────────────────────────────────────────────────────────────────
   HIGHLIGHTS ROW — animated bauhaus dots with key facts above the
   story. Sits between the hero and the long description.
   ─────────────────────────────────────────────────────────────────── */
function HighlightsRow() {
  const reduce = useReducedMotion();
  const items = [
    { tone: 'orange', value: '22',         label: 'Spieler-Spots'   },
    { tone: 'yellow', value: '3',          label: 'Courts in Padel Haus' },
    { tone: 'blue',   value: '18 → Open',  label: 'Sunset bis Mitternacht+' },
    { tone: 'red',    value: 'Founders',   label: 'Edition, RITMO DNA Cup' },
  ];

  return (
    <section className="evp-highlights">
      <motion.div
        className="wrap evp-highlights-row"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: reduce ? 0 : 0.14, delayChildren: 0.08 } },
        }}
      >
        {items.map((h) => (
          <motion.div
            key={h.label}
            className={`evp-highlight tone-${h.tone}`}
            variants={{
              hidden: { opacity: 0, y: reduce ? 0 : 18 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
              },
            }}
          >
            <span className="evp-highlight-dot" aria-hidden />
            <span className="evp-highlight-value">{h.value}</span>
            <span className="evp-highlight-label">{h.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function StorySections({ event }: { event: EventItem }) {
  if (!event.longDesc || event.longDesc.length === 0) return null;
  return (
    <section className="evp-story" id="story">
      <div className="wrap">
        {event.longDesc.map((p, i) => (
          <motion.p
            key={i}
            className={`evp-story-p ${i % 2 === 0 ? 'left' : 'right'}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            {p}
          </motion.p>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   PROGRAMM — high-level phase tiles (numbered)
   ─────────────────────────────────────────────────────────────────── */
function Programm({ event }: { event: EventItem }) {
  if (!event.program || event.program.length === 0) return null;
  const reduce = useReducedMotion();
  return (
    <section className="evp-program" id="programm">
      <div className="wrap">
        <header className="evp-section-head">
          <p className="rule">Programm</p>
          <h2 className="evp-section-title">
            So läuft der <span className="accent">Cup</span>.
          </h2>
        </header>
        <motion.div
          className="evp-program-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
          }}
        >
          {event.program.map((p) => (
            <motion.article
              key={p.phase}
              className="evp-program-card"
              variants={{
                hidden: { opacity: 0, y: 28 },
                show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <h3 className="evp-program-phase">{p.phase}</h3>
              <p className="evp-program-detail">{p.details}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   SCHEDULE — vertical time timeline
   ─────────────────────────────────────────────────────────────────── */
function Schedule({ event }: { event: EventItem }) {
  if (!event.schedule || event.schedule.length === 0) return null;
  const reduce = useReducedMotion();
  return (
    <section className="evp-schedule alt">
      <div className="wrap">
        <header className="evp-section-head">
          <p className="rule">Ablauf</p>
          <h2 className="evp-section-title">
            Ein <span className="accent">Tag</span>, eine Nacht.
          </h2>
        </header>
        <motion.ol
          className="evp-schedule-list"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
          }}
        >
          {event.schedule.map((row, i) => (
            <motion.li
              key={i}
              className="evp-schedule-row"
              variants={{
                hidden: { opacity: 0, x: reduce ? 0 : -16 },
                show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <div className="evp-schedule-time">{row.time}</div>
              <div className="evp-schedule-body">
                <div className="evp-schedule-title">{row.title}</div>
                {row.note && <div className="evp-schedule-note">{row.note}</div>}
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   TICKETS — detailed breakdown panel
   ─────────────────────────────────────────────────────────────────── */
function TicketsBlock({ event }: { event: EventItem }) {
  if (!event.tickets || event.tickets.length === 0) return null;
  return (
    <section className="evp-tickets-detail" id="tickets">
      <div className="wrap">
        <header className="evp-section-head">
          <p className="rule">Tickets</p>
          <h2 className="evp-section-title">
            Spielen oder <span className="accent">zuschauen</span>.
          </h2>
        </header>
        <div className="evp-tickets-grid">
          {event.tickets.map((t) => (
            <motion.article
              key={t.name}
              className={`evp-ticket-card${t.status === 'soldout' ? ' is-sold' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="evp-ticket-card-name">{t.name}</h3>
              <div className="evp-ticket-card-price">{eur(t.price)}</div>
              <div className="evp-ticket-card-cap">
                {t.capacity != null ? `${t.capacity} Spots verfügbar` : 'Solange der Vorrat reicht'}
              </div>
              <ul className="evp-ticket-card-list">
                {t.name === 'Spieler' ? (
                  <>
                    <li>Turnier-Teilnahme (Gruppe + KO oder Courage Phase)</li>
                    <li>Court-Zeit garantiert, mehrere Matches</li>
                    <li><b>1 Welcome-Drink</b>, Aperol Spritz, Padelé Spritz oder non-alk.</li>
                    <li><b>1 großer Burger</b>, Manny&apos;s BBQ</li>
                    <li><b>Zugang RITMO Refresh Bar</b>, Obst & Säfte</li>
                    <li>After-Party mit DJ Scoop live, Open End ab 23 Uhr</li>
                  </>
                ) : (
                  <>
                    <li>Eintritt ab 17:30 (Kick the Doors)</li>
                    <li><b>1 Welcome-Drink</b>, Softdrink oder non-alk.</li>
                    <li><b>1 kleiner Burger</b>, Manny&apos;s BBQ</li>
                    <li>Sunset Session &amp; Live-Matches</li>
                    <li>After-Party mit DJ Scoop live, Open End ab 23 Uhr</li>
                    <li>Aperol &amp; weitere Drinks separat</li>
                  </>
                )}
              </ul>
              <TicketCTA event={event} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   VENUE — Padel Haus block with mini SVG illustration
   ─────────────────────────────────────────────────────────────────── */
function Venue({ event }: { event: EventItem }) {
  if (!event.venueInfo) return null;
  const v = event.venueInfo;
  return (
    <section className="evp-venue alt">
      <div className="wrap evp-venue-grid">
        <div className="evp-venue-info">
          <p className="rule">Venue</p>
          <h2 className="evp-section-title">
            {v.name}<span className="accent">.</span>
          </h2>
          {v.blurb && <p className="evp-venue-blurb">{v.blurb}</p>}
          <div className="evp-venue-meta">
            {v.address && (
              <div>
                <span className="label">Adresse</span>
                <span className="value">{v.address}</span>
              </div>
            )}
            {v.web && (
              <div>
                <span className="label">Web</span>
                <a className="value evp-venue-link" href={v.web} target="_blank" rel="noopener noreferrer">
                  {v.web.replace(/^https?:\/\//, '')} ↗
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="evp-venue-visual">
          <CourtSVG />
          {v.imageSrc && (
            <img
              src={v.imageSrc}
              alt={v.name}
              onError={(e) => { (e.currentTarget as HTMLImageElement).remove(); }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   FAQ — uncontrolled <details> accordion
   ─────────────────────────────────────────────────────────────────── */
function Faq({ event }: { event: EventItem }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  if (!event.faq || event.faq.length === 0) return null;
  return (
    <section className="evp-faq" id="faq">
      <div className="wrap">
        <header className="evp-section-head">
          <p className="rule">Häufige Fragen</p>
          <h2 className="evp-section-title">
            FAQ<span className="accent">.</span>
          </h2>
        </header>
        <ul className="evp-faq-list">
          {event.faq.map((f, i) => {
            const open = openIdx === i;
            return (
              <li key={i} className={`evp-faq-item${open ? ' open' : ''}`}>
                <button
                  type="button"
                  className="evp-faq-q"
                  onClick={() => setOpenIdx(open ? null : i)}
                  aria-expanded={open}
                >
                  <span>{f.q}</span>
                  <span className="evp-faq-toggle" aria-hidden>{open ? '−' : '+'}</span>
                </button>
                {open && (
                  <div className="evp-faq-a">
                    {f.a.split('\n\n').map((p, j) => (
                      <p key={j}>{p}</p>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   SCORING — RITMO Match Tiers table
   ─────────────────────────────────────────────────────────────────── */
function ScoringSection({ event }: { event: EventItem }) {
  const s = event.scoring;
  if (!s || s.tiers.length === 0) return null;
  return (
    <section className="evp-scoring" id="scoring">
      <div className="wrap">
        <header className="evp-section-head">
          <p className="rule">Scoring</p>
          <h2 className="evp-section-title">
            {s.title}<span className="accent">.</span>
          </h2>
        </header>
        <p className="evp-scoring-blurb">{s.description}</p>
        <motion.ul
          className="evp-tier-list"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06 } },
          }}
        >
          {s.tiers.map((t) => (
            <motion.li
              key={t.tier}
              className={`evp-tier evp-tier-${t.tier.toLowerCase()}`}
              variants={{
                hidden: { opacity: 0, x: -12 },
                show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <span className="evp-tier-badge">{t.tier}</span>
              <span className="evp-tier-bonus">
                {t.bonus > 0 ? '+' : ''}{t.bonus}
                <span className="evp-tier-bonus-suffix"> Pkt.</span>
              </span>
              <span className="evp-tier-label">{t.label ?? `${t.tier}-Tier`}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   CATERING — Verpflegung stations
   ─────────────────────────────────────────────────────────────────── */
function CateringSection({ event }: { event: EventItem }) {
  const stations = event.catering;
  if (!stations || stations.length === 0) return null;
  return (
    <section className="evp-catering alt" id="verpflegung">
      <div className="wrap">
        <header className="evp-section-head">
          <p className="rule">Verpflegung</p>
          <h2 className="evp-section-title">
            Drei Stationen<span className="accent">.</span>
          </h2>
        </header>
        <motion.div
          className="evp-catering-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {stations.map((c) => (
            <motion.article
              key={c.name}
              className="evp-catering-card"
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <div className="evp-catering-visual">
                <CateringBauhaus name={c.name} />
                {c.imageSrc && (
                  <img
                    src={c.imageSrc}
                    alt={c.name}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).remove(); }}
                  />
                )}
              </div>
              <div className="evp-catering-body">
                {c.tagline && <span className="evp-catering-tagline">{c.tagline}</span>}
                <h3 className="evp-catering-name">{c.name}</h3>
                <p className="evp-catering-desc">{c.description}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   MUSIC — DJ headliner + follow-up
   ─────────────────────────────────────────────────────────────────── */
function MusicSection({ event }: { event: EventItem }) {
  const m = event.music;
  if (!m) return null;
  return (
    <section className="evp-music" id="musik">
      <div className="wrap evp-music-grid">
        <div className="evp-music-visual">
          <MusicBauhaus />
          {m.imageSrc && (
            <img
              src={m.imageSrc}
              alt={m.djName}
              onError={(e) => { (e.currentTarget as HTMLImageElement).remove(); }}
            />
          )}
        </div>
        <div className="evp-music-body">
          <p className="rule">Musik</p>
          <h2 className="evp-section-title">
            {m.djName}<span className="accent">.</span>
          </h2>
          {m.setTitle && <p className="evp-music-set">{m.setTitle}</p>}
          <p className="evp-music-desc">{m.description}</p>
          {m.followUp && (
            <p className="evp-music-followup">{m.followUp}</p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   FINAL CTA — bleed with reminder + tickets link
   ─────────────────────────────────────────────────────────────────── */
function FinalCta({ event }: { event: EventItem }) {
  return (
    <section className="evp-final pdp-bleed">
      <div className="bleed-bg bg-anim" aria-hidden>
        <div className="blob-y" />
        <div className="blob-b" />
        <div className="blob-r" />
      </div>
      <div className="bleed-inner">
        <h2>
          Sei <span className="accent">dabei</span>.
        </h2>
        <p>{event.subtitle ?? event.title}, {fullDate(event.date)}</p>
        <div className="evp-final-ctas">
          <TicketCTA event={event} size="btn-lg" />
          <Link to="/events" className="btn btn-out btn-lg">
            Alle Events
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Inline SVGs (placeholders for real photo / hero art) ──────── */
function BauhausVisual() {
  return (
    <svg
      className="evp-stage-bauhaus"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="800" height="600" fill="#0A0A0A" />
      {/* Sunset gradient backdrop */}
      <defs>
        <linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF7A1A" stopOpacity=".22" />
          <stop offset="1" stopColor="#0A0A0A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sunset)" />
      {/* Big circle (sun) */}
      <circle cx="560" cy="280" r="180" fill="#FFD60A" opacity=".9" />
      {/* Diamond (KO bracket) */}
      <polygon points="160,150 280,280 160,410 40,280" fill="#0A84FF" opacity=".85" />
      {/* Triangle (cup) */}
      <polygon points="400,360 540,560 260,560" fill="#E84545" opacity=".85" />
      {/* Court line */}
      <rect x="0" y="540" width="800" height="3" fill="#FF7A1A" />
      <text x="32" y="588" fontFamily="sans-serif" fontWeight="900" fontStyle="italic"
            fontSize="14" fill="#fff" letterSpacing="4">RITMO X PADEL HAUS, SUMMER SUNSET</text>
    </svg>
  );
}

function CourtSVG() {
  return (
    <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid meet" aria-hidden>
      <rect width="400" height="320" fill="#0A0A0A" />
      {/* Court outline */}
      <rect x="60" y="60" width="280" height="200" fill="none" stroke="#FF7A1A" strokeWidth="2.5" />
      {/* Service lines */}
      <line x1="60"  y1="120" x2="340" y2="120" stroke="#FF7A1A" strokeWidth="1.5" />
      <line x1="60"  y1="200" x2="340" y2="200" stroke="#FF7A1A" strokeWidth="1.5" />
      {/* Net */}
      <line x1="200" y1="60"  x2="200" y2="260" stroke="#FFD60A" strokeWidth="2.5" strokeDasharray="4 5" />
      {/* Walls indication */}
      <rect x="40" y="40" width="320" height="240" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="3 6" opacity=".4" />
      <text x="22" y="304" fontFamily="sans-serif" fontWeight="900" fontStyle="italic"
            fontSize="13" fill="#fff" letterSpacing="3">PADEL HAUS, COURT</text>
    </svg>
  );
}

function CateringBauhaus({ name }: { name: string }) {
  // Pick a tone per station name so the three cards read as distinct
  const tone =
    /refresh/i.test(name) ? '#FFD60A' :
    /bbq|burger|manny/i.test(name) ? '#E84545' :
    /aperol|spritz/i.test(name) ? '#FF7A1A' :
    '#0A84FF';
  return (
    <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="400" height="320" fill="#0A0A0A" />
      <circle cx="280" cy="120" r="100" fill={tone} opacity=".9" />
      <rect x="60" y="180" width="120" height="120" fill="#fff" opacity=".06" />
      <polygon points="40,300 160,120 280,300" fill={tone} opacity=".18" />
      <rect x="0" y="298" width="400" height="3" fill="#FF7A1A" />
    </svg>
  );
}

function MusicBauhaus() {
  return (
    <svg viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="400" height="320" fill="#0A0A0A" />
      <defs>
        <linearGradient id="djSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0"  stopColor="#FF7A1A" stopOpacity=".26" />
          <stop offset="1"  stopColor="#0A0A0A" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill="url(#djSky)" />
      {/* turntable disc */}
      <circle cx="200" cy="170" r="90" fill="#0A84FF" opacity=".85" />
      <circle cx="200" cy="170" r="56" fill="#0A0A0A" />
      <circle cx="200" cy="170" r="10" fill="#FF7A1A" />
      {/* needle arm */}
      <line x1="312" y1="84" x2="232" y2="148" stroke="#FFD60A" strokeWidth="3" />
      <circle cx="312" cy="84" r="6" fill="#FFD60A" />
      <text x="22" y="304" fontFamily="sans-serif" fontWeight="900" fontStyle="italic"
            fontSize="13" fill="#fff" letterSpacing="3">SUNSET, DJ-SET</text>
    </svg>
  );
}
