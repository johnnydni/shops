import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * Auto-rotating image slideshow with dot pagination.
 *
 * - Cross-fades between slides via AnimatePresence
 * - Auto-advance pauses on hover/focus (UX: lets the reader actually look)
 * - Click a dot or use ←/→ keys to jump
 * - Per-slide `onError` falls back to a Bauhaus gradient tile so missing
 *   placeholders don't break the layout
 *
 * Reused for the event intro image strip + the RITMO DNA Spielstil
 * carousel. Each slide can carry an optional caption (eyebrow + title)
 * that overlays the image bottom-left.
 */
export interface Slide {
  src: string;
  alt: string;
  eyebrow?: string;
  title?: string;
  /** Optional accent colour for the caption rule (defaults to var(--orange)). */
  accent?: string;
}

interface Props {
  slides: Slide[];
  /** Auto-advance interval in ms. Set to 0 to disable auto-rotate. */
  intervalMs?: number;
  /** Aspect ratio of the viewport, e.g. "16 / 9" or "3 / 4". */
  aspect?: string;
}

export function EventSlideshow({
  slides,
  intervalMs = 4500,
  aspect = '16 / 9',
}: Props) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const ref = useRef<HTMLDivElement | null>(null);

  const total = slides.length;
  const go = (next: number) => setIndex(((next % total) + total) % total);

  useEffect(() => {
    if (!intervalMs || reduce || paused || total <= 1) return;
    const t = window.setTimeout(() => go(index + 1), intervalMs);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, intervalMs, reduce, total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!ref.current?.contains(document.activeElement)) return;
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft')  go(index - 1);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total]);

  if (total === 0) return null;
  const current = slides[index];

  return (
    <div
      ref={ref}
      className="evp-slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="evp-slideshow-viewport"
        style={{ aspectRatio: aspect }}
        aria-roledescription="carousel"
        aria-live="polite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            className="evp-slideshow-slide"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: reduce ? 0.05 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {failed[index] ? (
              <div
                className="evp-slideshow-fallback"
                style={{ background: current.accent ?? 'var(--orange)' }}
                aria-label={current.alt}
              />
            ) : (
              <img
                src={current.src}
                alt={current.alt}
                onError={() => setFailed((f) => ({ ...f, [index]: true }))}
                draggable={false}
              />
            )}
            {(current.eyebrow || current.title) && (
              <div
                className="evp-slideshow-caption"
                style={{ '--caption-accent': current.accent ?? 'var(--orange)' } as React.CSSProperties}
              >
                {current.eyebrow && (
                  <span className="evp-slideshow-eyebrow">{current.eyebrow}</span>
                )}
                {current.title && (
                  <span className="evp-slideshow-title">{current.title}</span>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {total > 1 && (
        <div className="evp-slideshow-dots" role="tablist" aria-label="Slideshow">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`evp-slideshow-dot${i === index ? ' is-active' : ''}`}
              onClick={() => go(i)}
              aria-label={`Bild ${i + 1} von ${total}`}
              aria-current={i === index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
