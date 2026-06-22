import { useState, type CSSProperties } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { EVENTS } from '../data/events';
import { Crumbs } from '../components/ui/Crumbs';
import {
  SPIELSTILE,
  SPIELSTIL_ORDER,
  type Spielstil,
  type SpielstilId,
} from '../lib/spielstile';

/**
 * /events/:id/spielstile — the RITMO DNA "encyclopedia" page.
 *
 * Long-form reference for the 7 Spielstil archetypes. Each section is
 * tinted with the archetype's own accent colour via a CSS custom
 * property (`--accent`), with alternating image-left / image-right
 * layouts. Cross-linked partner anchors let readers jump between
 * archetypes that play well together.
 *
 * Lives next to /events/:id/dna-quiz — the encyclopedia is for browsing,
 * the quiz is for committing.
 */
export function EventSpielstilePage() {
  const { id } = useParams<{ id: string }>();
  const event = EVENTS.find((e) => e.id === id);
  if (!event) return <Navigate to="/events" replace />;

  return (
    <main className="spst-page">
      <Crumbs
        items={[
          { label: 'Events', to: '/events' },
          { label: event.title, to: `/events/${event.id}` },
          { label: 'Spielstile' },
        ]}
      />
      <SpielstileHero />
      <SpielstileNav />
      {SPIELSTIL_ORDER.map((id, i) => (
        <SpielstilSection key={id} archetypeId={id} index={i} />
      ))}
      <SpielstileFinalCta eventId={event.id} />
    </main>
  );
}

/* ───────────────────────────────────────────────────────────────────
   HERO — title + 3 stat tiles
   ─────────────────────────────────────────────────────────────────── */
function SpielstileHero() {
  return (
    <motion.section
      className="spst-hero"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="wrap">
        <p className="rule">RITMO DNA</p>
        <h1 className="page-title">
          Sieben <span className="accent">Spielstile</span>.
        </h1>
        <p className="page-lead">
          Jeder bringt eine andere Energie auf den Court. Lies dich rein —
          und entdeck den Typ, der dir am nächsten kommt. Am Ende wartet
          das DNA Quiz mit der finalen Antwort.
        </p>
        <div className="spst-hero-stats">
          <div className="spst-hero-stat">
            <b>7</b>
            <span>Archetypen</span>
          </div>
          <div className="spst-hero-stat">
            <b>7</b>
            <span>Fragen</span>
          </div>
          <div className="spst-hero-stat">
            <b>∞</b>
            <span>Kombinationen</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   NAV — chip jump-to-anchor row, each chip tinted with its accent
   ─────────────────────────────────────────────────────────────────── */
function SpielstileNav() {
  return (
    <nav className="spst-nav" aria-label="Spielstil-Übersicht">
      <div className="wrap spst-nav-wrap">
        {SPIELSTIL_ORDER.map((id) => {
          const s = SPIELSTILE[id];
          return (
            <a
              key={id}
              href={`#${s.slug}`}
              className="spst-nav-chip"
              style={{ '--chip-accent': s.accent } as CSSProperties}
            >
              <span className="spst-nav-chip-name">{s.name}</span>
              <span className="spst-nav-chip-sub">{s.subtitle}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

/* ───────────────────────────────────────────────────────────────────
   SECTION — one per archetype
   ─────────────────────────────────────────────────────────────────── */
function SpielstilSection({
  archetypeId,
  index,
}: {
  archetypeId: SpielstilId;
  index: number;
}) {
  const s: Spielstil = SPIELSTILE[archetypeId];
  const reduce = useReducedMotion();
  const [imgFailed, setImgFailed] = useState(false);
  const num = String(index + 1).padStart(2, '0');
  const total = String(SPIELSTIL_ORDER.length).padStart(2, '0');
  const isFlipped = index % 2 === 1;

  return (
    <section
      id={s.slug}
      className={`spst-section${isFlipped ? ' is-flipped' : ''}`}
      style={{ '--accent': s.accent } as CSSProperties}
    >
      <span className="spst-section-bignum" aria-hidden>{num}</span>

      <div className="wrap spst-section-wrap">
        <motion.header
          className="spst-section-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: reduce ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="spst-section-counter">{num} / {total}</span>
          <h2 className="spst-section-name">{s.name}</h2>
          <p className="spst-section-sub">{s.subtitle}</p>
        </motion.header>

        <motion.blockquote
          className="spst-section-tagline"
          initial={{ opacity: 0, x: isFlipped ? 18 : -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: reduce ? 0 : 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          „{s.tagline}"
        </motion.blockquote>

        <motion.div
          className="spst-section-image"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {imgFailed ? (
            <div className="spst-section-fallback" aria-hidden />
          ) : (
            <img
              src={`/assets/spielstile/${s.slug}.jpg`}
              alt={`${s.name} — ${s.subtitle}`}
              onError={() => setImgFailed(true)}
              draggable={false}
            />
          )}
        </motion.div>

        <motion.div
          className="spst-section-desc"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: reduce ? 0 : 0.55, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {s.desc.split('\n\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </motion.div>

        <div className="spst-section-grid">
          <div className="spst-section-grid-col">
            <h4>Kernwerte</h4>
            <ul className="spst-chip-list">
              {s.kernwerte.map((k) => (
                <li key={k} className="spst-chip">{k}</li>
              ))}
            </ul>
          </div>
          <div className="spst-section-grid-col">
            <h4>Stärken</h4>
            <ul className="spst-bullet-list">
              {s.strengths.map((k) => <li key={k}>{k}</li>)}
            </ul>
          </div>
          <div className="spst-section-grid-col">
            <h4>Signature Shots</h4>
            <ul className="spst-bullet-list">
              {s.shots.map((k) => <li key={k}>{k}</li>)}
            </ul>
          </div>
        </div>

        {s.partners.length > 0 && (
          <div className="spst-section-partners">
            <span className="spst-partners-label">Spielt gut mit</span>
            <div className="spst-partners-row">
              {s.partners.map((p) => {
                const pa = SPIELSTILE[p];
                return (
                  <a
                    key={p}
                    href={`#${pa.slug}`}
                    className="spst-partner-link"
                    style={{ '--partner-accent': pa.accent } as CSSProperties}
                  >
                    <span className="spst-partner-name">{pa.name}</span>
                    <span className="spst-partner-arrow" aria-hidden>↓</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────────────────────────────
   FINAL CTA — bleeding bauhaus background, two ctas
   ─────────────────────────────────────────────────────────────────── */
function SpielstileFinalCta({ eventId }: { eventId: string }) {
  return (
    <section className="spst-final pdp-bleed">
      <div className="bleed-bg bg-anim" aria-hidden>
        <div className="blob-y" />
        <div className="blob-b" />
        <div className="blob-r" />
      </div>
      <div className="bleed-inner">
        <h2>
          Welcher <span className="accent">bist du</span>?
        </h2>
        <p>Sieben Archetypen. Sieben Fragen. Eine Antwort.</p>
        <div className="spst-final-ctas">
          <Link
            to={`/events/${eventId}/dna-quiz`}
            className="btn btn-pri btn-lg"
          >
            Zum DNA Quiz →
          </Link>
          <Link
            to={`/events/${eventId}`}
            className="btn btn-out btn-lg"
          >
            Zurück zum Event
          </Link>
        </div>
      </div>
    </section>
  );
}
