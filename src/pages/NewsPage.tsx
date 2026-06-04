import { motion } from 'framer-motion';
import { NewsletterBanner } from '../components/shop/NewsletterBanner';

/**
 * /news — standalone editorial + newsletter page.
 *
 * Three blocks:
 *  1. Intro / page header
 *  2. Drops timeline teaser (placeholder — populate from CMS later)
 *  3. Newsletter sign-up (reused component)
 */
export function NewsPage() {
  return (
    <>
      <motion.section
        className="page-intro"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="wrap">
          <p className="rule">News</p>
          <h1 className="page-title">
            Drops &amp; <span className="accent">Editorials</span>.
          </h1>
          <p className="page-lead">
            Was als Nächstes kommt, was wir gerade entwickeln und welche
            Edition wann fällig ist. Newsletter unten — kein Spam, jederzeit
            abbestellbar.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="drops-timeline"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
        }}
      >
        <div className="wrap">
          <div className="drops-grid">
            {DROPS.map((d) => (
              <motion.article
                key={d.title}
                className={`drop-card${d.live ? ' live' : ''}`}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <div className="drop-meta">
                  <span className="drop-when">{d.when}</span>
                  {d.live ? <span className="drop-badge">Live</span> : <span className="drop-badge soon">Bald</span>}
                </div>
                <h2 className="drop-title">{d.title}</h2>
                <p className="drop-body">{d.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <NewsletterBanner />
    </>
  );
}

/** Placeholder drops — feed from a CMS / Markdown later. */
const DROPS = [
  {
    when: 'Q4 2026',
    title: 'RITMO Pro — Carbon 3K Drop II',
    body: 'Zweite Edition mit nummerierten 200 Stück. Neuer Griff-Tape-Pattern, identischer Rahmen.',
    live: false,
  },
  {
    when: 'Q3 2026',
    title: 'Bauhaus Print Series',
    body: 'Drei A2-Editionen — Kreis · Quadrat · Dreieck. Limitiert. Mattpapier 250 g/m².',
    live: true,
  },
  {
    when: 'Q3 2026',
    title: 'Tournament Ball Restock',
    body: 'Druckslose Wettkampf-Bälle wieder lieferbar. 12er- und 24er-Kits.',
    live: true,
  },
  {
    when: 'Q1 2027',
    title: 'RITMO Apparel SS27',
    body: 'Frühjahr-Sommer Kollektion. Heavy-Cotton Tees, Court-Cap, Wristband-Set.',
    live: false,
  },
];
