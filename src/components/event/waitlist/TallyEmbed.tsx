import { useEffect } from 'react';

/**
 * Embeds a Tally form (tally.so) as a self-resizing iframe.
 *
 * Tally hosts the form, validation, GDPR consent, throttling, and the
 * submission database — we just point at the form ID. The Bauhaus look
 * is configured in Tally's UI per form (background transparent + font
 * inherit so it blends with the surrounding RITMO card).
 *
 * The embed script (`https://tally.so/widgets/embed.js`) handles
 * `dynamicHeight` postMessage events so the iframe grows/shrinks with
 * the form. We load it once per page, idempotently.
 *
 * No PII ever touches our infrastructure here — the form posts directly
 * to Tally. Means we don't need the worker / KV / Resend pipeline at all
 * for the waitlist case. The selfsame infrastructure still exists for
 * Stripe-backed ticket sales when those go live.
 */

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void };
  }
}

const TALLY_SCRIPT_SRC = 'https://tally.so/widgets/embed.js';

interface TallyEmbedProps {
  /** Form ID from your Tally share URL, e.g. "wMa7zE" from tally.so/r/wMa7zE */
  formId: string;
  /** Iframe title for screen readers. */
  title?: string;
  /** Minimum iframe height in pixels before Tally resizes it. */
  minHeight?: number;
}

export function TallyEmbed({
  formId,
  title = 'Formular',
  minHeight = 420,
}: TallyEmbedProps) {
  useEffect(() => {
    if (window.Tally) {
      window.Tally.loadEmbeds();
      return;
    }
    if (document.querySelector(`script[src="${TALLY_SCRIPT_SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = TALLY_SCRIPT_SRC;
    s.async = true;
    document.body.appendChild(s);
  }, [formId]);

  const params = new URLSearchParams({
    alignLeft: '1',
    hideTitle: '1',
    transparentBackground: '1',
    dynamicHeight: '1',
  });

  return (
    <iframe
      data-tally-src={`https://tally.so/embed/${formId}?${params.toString()}`}
      loading="lazy"
      width="100%"
      height={minHeight}
      title={title}
      className="wl-tally-iframe"
      style={{ border: 0, background: 'transparent' }}
    />
  );
}
