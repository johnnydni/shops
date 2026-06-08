import { motion, useReducedMotion } from 'framer-motion';
import type { Spielstil } from '../../lib/spielstile';
import { SpielstilGlyph } from './SpielstilGlyph';

/**
 * The dramatic reveal card. Used in three places:
 *  - end of the Spielstil-Quiz (Step 3 of the buy-flow)
 *  - standalone /spielstil-quiz result page (Phase 7)
 *  - personal ticket render (`compact` variant)
 *
 * Variants:
 *  - `hero`     — full reveal card, ~600px tall, glyph + name + tagline
 *                  + kernwerte chips + description + strengths/shots
 *  - `compact`  — small horizontal stripe for the ticket page
 *
 * Animation: glyph scales in from 0.6 → 1, with a slight rotate;
 * name fades up; chips stagger. Honors `prefers-reduced-motion`.
 */
export function SpielstilCard({
  spielstil,
  variant = 'hero',
}: {
  spielstil: Spielstil;
  variant?: 'hero' | 'compact';
}) {
  const reduce = useReducedMotion();
  const style = {
    background: spielstil.card,
    borderColor: spielstil.accent,
  };

  if (variant === 'compact') {
    return (
      <div className="spst-card spst-compact" style={style}>
        <SpielstilGlyph spielstil={spielstil} size={56} />
        <div className="spst-compact-meta">
          <div className="spst-name" style={{ color: spielstil.accent }}>
            {spielstil.name}
          </div>
          <div className="spst-subtitle">{spielstil.subtitle}</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="spst-card spst-hero"
      style={style}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Glyph reveal ────────────────────────────────────────── */}
      <motion.div
        className="spst-glyph"
        initial={reduce ? false : { scale: 0.4, rotate: -8, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      >
        <SpielstilGlyph spielstil={spielstil} size={140} />
      </motion.div>

      {/* ── Name + tagline ──────────────────────────────────────── */}
      <motion.div
        className="spst-headline"
        initial={reduce ? false : { y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.45 }}
      >
        <div className="spst-eyebrow">Dein Spielstil</div>
        <h2 className="spst-name-xl" style={{ color: spielstil.accent }}>
          {spielstil.name}
        </h2>
        <p className="spst-subtitle">{spielstil.subtitle}</p>
        <p className="spst-tagline">„{spielstil.tagline}"</p>
      </motion.div>

      {/* ── Kernwerte chips ─────────────────────────────────────── */}
      <motion.div
        className="spst-chips"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08, delayChildren: 0.7 } },
        }}
      >
        {spielstil.kernwerte.map((w: string) => (
          <motion.span
            key={w}
            className="spst-chip"
            style={{ borderColor: spielstil.accent, color: spielstil.accent }}
            variants={{
              hidden: { opacity: 0, y: 8 },
              show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
            }}
          >
            {w}
          </motion.span>
        ))}
      </motion.div>

      {/* ── Description + lists ─────────────────────────────────── */}
      <motion.div
        className="spst-body"
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <p className="spst-desc">{spielstil.desc}</p>

        <div className="spst-lists">
          <div>
            <div className="spst-list-head">Stärken</div>
            <ul className="spst-list">
              {spielstil.strengths.map((s: string) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="spst-list-head">Signature-Schläge</div>
            <ul className="spst-list">
              {spielstil.shots.map((s: string) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
