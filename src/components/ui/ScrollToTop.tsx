import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useScrolledPast } from '../../hooks/useScrollState';

/**
 * Fixed bottom-left arrow that scrolls the window back to the top.
 *
 *  - Appears after 400 px scroll, fades in via Framer Motion.
 *  - Bottom-left positioning so it doesn't collide with the burger
 *    (top-right), PDP buy-bar (bottom-stripe), or sticky CTAs.
 *  - `useReducedMotion` swaps the smooth scroll for an instant jump
 *    and skips the fade.
 */
export function ScrollToTop() {
  const visible = useScrolledPast(400);
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  // Avoid SSR-style flash on first paint
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  function handleClick() {
    window.scrollTo({
      top: 0,
      behavior: reduce ? 'auto' : 'smooth',
    });
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          type="button"
          className="scroll-top"
          aria-label="Nach oben scrollen"
          onClick={handleClick}
          initial={{ opacity: 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : 8 }}
          transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 19V5" />
            <path d="M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
