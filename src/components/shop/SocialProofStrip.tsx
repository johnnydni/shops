/**
 * Social-proof strip — 4-up stats band that anchors trust before the
 * newsletter CTA. Skill recommendation: social-proof before final CTA
 * for conversion. Numbers are illustrative — swap with real metrics
 * once analytics is wired.
 */
export function SocialProofStrip() {
  const stats: Array<{ n: string; l: string }> = [
    { n: '1.000+',    l: 'Spieler·innen in DACH' },
    { n: 'FIP-spec',  l: 'Turnier-Standard' },
    { n: '4,9 / 5',   l: 'Customer-Score' },
    { n: '24h',       l: 'Versandzeit · Mo–Fr' },
  ];
  return (
    <section className="proof" aria-label="Social proof">
      <div className="proof-inner">
        {stats.map((s) => (
          <div className="proof-stat" key={s.l}>
            <div className="n">{s.n}</div>
            <div className="l">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
