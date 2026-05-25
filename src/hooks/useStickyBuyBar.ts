import { useEffect, useRef, useState } from 'react';

/**
 * Watches an anchor element (the main PDP CTA row). Returns `true`
 * once the anchor has scrolled OUT of view — the sticky bottom buy
 * bar uses this to slide up.
 */
export function useStickyBuyBar<T extends HTMLElement = HTMLElement>() {
  const anchorRef = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = anchorRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setVisible(!e.isIntersecting));
      },
      { rootMargin: '-80px 0px 0px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { anchorRef, visible };
}
