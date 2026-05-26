import type { SVGProps } from 'react';

/* ─── Inline SVG icons (Lucide-style, single source) ───────────────
   Skill rule: no emoji icons. All icons are 24×24 fixed viewBox with
   stroke-current so we can theme via parent color. */
function IconShield(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6l-8-3Z" />
    </svg>
  );
}
function IconTruck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
    </svg>
  );
}
function IconSparkles(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3 14 9l6 2-6 2-2 6-2-6-6-2 6-2 2-6Z" />
      <path d="M19 14v3M17.5 15.5h3" />
    </svg>
  );
}
function IconRefresh(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
function IconMapPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 21s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function IconLayers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="M3 13l9 5 9-5" /><path d="M3 18l9 5 9-5" />
    </svg>
  );
}
function IconLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="11" width="16" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

/**
 * Bento Grid Showcase — second pattern recommended by the ui-ux-pro-max skill.
 * Apple-style modular grid of brand pillars. Hover = color shift only (no
 * layout shift). Largest tile (.t-a) is the lead message; .t-g is the
 * orange-filled stand-out CTA-adjacent tile.
 */
export function BentoShowcase() {
  return (
    <section className="bento" aria-label="Was RITMO ausmacht">
      <div className="bento-header">
        <p className="rule">Warum RITMO</p>
        <h2>
          Padel als
          <br />
          <span className="accent">Kunstform</span>.
        </h2>
        <p>
          Acht Sätze, die zusammenfassen warum wir den Shop überhaupt gebaut
          haben — und was du dir mit jedem Drop in den Schrank legst.
        </p>
      </div>

      <div className="bento-grid">
        {/* a — lead tile, biggest, top-left */}
        <article className="bento-tile t-a">
          <span className="eyebrow">Manifesto</span>
          <div>
            <h3>
              Geometrie ist
              <br />
              <span style={{ color: 'var(--orange)' }}>kein Trend</span>.
              <br />
              Sondern Methode.
            </h3>
            <p>
              Bauhaus liefert die Sprache, Padel den Rhythmus. Jedes Produkt
              entstand aus genau einer Frage: was bleibt übrig wenn man alles
              Unnötige wegnimmt.
            </p>
          </div>
        </article>

        {/* b — Carbon 3K */}
        <article className="bento-tile t-b">
          <IconLayers className="icon" aria-hidden />
          <h3>Carbon 3K</h3>
          <p>Dreilagig, handgelegt. Keine Glasfaser-Tricks.</p>
        </article>

        {/* c — Made in Portugal */}
        <article className="bento-tile t-c">
          <IconMapPin className="icon" aria-hidden />
          <h3>Made in PT</h3>
          <p>Apparel & Prints aus Europa — fair produziert.</p>
        </article>

        {/* d — Limited drops */}
        <article className="bento-tile t-d">
          <IconSparkles className="icon" aria-hidden />
          <h3>Limited Drops</h3>
          <p>Kleine Auflagen, nummeriert. Wer zu spät kommt … weiß es.</p>
        </article>

        {/* e — Stripe secure */}
        <article className="bento-tile t-e">
          <IconLock className="icon" aria-hidden />
          <h3>Stripe Hosted Checkout</h3>
          <p>Zahlung verschlüsselt. Wir sehen deine Kartendaten nie.</p>
        </article>

        {/* f — Free DACH shipping */}
        <article className="bento-tile t-f">
          <IconTruck className="icon" aria-hidden />
          <h3>DACH frei</h3>
          <p>Versand 2–4 Werktage, kostenlos.</p>
        </article>

        {/* g — orange standout, wide */}
        <article className="bento-tile t-g">
          <span className="eyebrow">Drop-Alert</span>
          <h3>
            Sei beim
            <br />
            nächsten Drop dabei.
          </h3>
          <p>
            Newsletter unten → erfährst es als Erste:r, oft 12 h Vorlauf vor
            dem öffentlichen Launch.
          </p>
        </article>

        {/* h — 30 days return */}
        <article className="bento-tile t-h">
          <IconRefresh className="icon" aria-hidden />
          <h3>30 Tage</h3>
          <p>Rückgabe ohne Wenn und Aber.</p>
        </article>
      </div>
    </section>
  );
}

export const BentoIcons = {
  IconShield, IconTruck, IconSparkles, IconRefresh, IconMapPin, IconLayers, IconLock,
};
