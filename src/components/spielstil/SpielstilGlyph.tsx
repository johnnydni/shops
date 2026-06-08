import type { Spielstil } from '../../lib/spielstile';

/**
 * Renders the Bauhaus glyph for a Spielstil's `symbol` token onto an
 * SVG canvas. Pure presentational — no animation here; the parent
 * decides whether to wrap it in motion.div.
 *
 * Token → form:
 *   triangle  — Toro (Wucht, Spitze nach oben)
 *   square    — Chico / Muro (Block, Stabilität)
 *   circle    — Motor (Bewegung, kein Anfang/Ende)
 *   ring      — Fantasma (Hülle ohne Inhalt — leise präsent)
 *   diagonal  — Hysterica (Energie quer durchs Bild)
 *   splash    — Individuoso (gebrochen, asymmetrisch)
 *   cross     — reserved (fallback for unknown symbols)
 *
 * The accent + text colours come from the Spielstil itself, so dropping
 * the same glyph into different result cards stays type-safe.
 */
export function SpielstilGlyph({
  spielstil,
  size = 96,
  className,
}: {
  spielstil: Spielstil;
  size?: number;
  className?: string;
}) {
  const { accent, text, symbol } = spielstil;
  // Inverse-contrast stroke colour for the geometry against the accent fill
  const ink = text === '#000' ? '#000' : '#fff';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <rect x="0" y="0" width="100" height="100" fill={accent} />
      {symbol === 'triangle' && (
        <polygon points="50,15 88,82 12,82" fill={ink} />
      )}
      {symbol === 'square' && (
        <rect x="22" y="22" width="56" height="56" fill={ink} />
      )}
      {symbol === 'circle' && (
        <circle cx="50" cy="50" r="30" fill={ink} />
      )}
      {symbol === 'ring' && (
        <>
          <circle cx="50" cy="50" r="32" fill={ink} />
          <circle cx="50" cy="50" r="18" fill={accent} />
        </>
      )}
      {symbol === 'diagonal' && (
        <>
          <polygon points="10,82 38,82 90,18 62,18" fill={ink} />
          <circle cx="78" cy="30" r="6" fill={ink} />
        </>
      )}
      {symbol === 'splash' && (
        <>
          <polygon
            points="50,12 70,38 92,46 70,58 78,86 50,72 22,86 30,58 8,46 30,38"
            fill={ink}
          />
          <circle cx="50" cy="50" r="6" fill={accent} />
        </>
      )}
      {symbol === 'cross' && (
        <>
          <rect x="42" y="14" width="16" height="72" fill={ink} />
          <rect x="14" y="42" width="72" height="16" fill={ink} />
        </>
      )}
    </svg>
  );
}
