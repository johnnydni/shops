import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NewsletterBanner } from '../components/shop/NewsletterBanner';

/**
 * /news — standalone editorial + newsletter page.
 *
 * Three blocks:
 *  1. Page intro
 *  2. Articles list — Founders Letter + upcoming Event + Summer Drop
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
            Founders &amp; <span className="accent">Drops</span>.
          </h1>
          <p className="page-lead">
            Wer wir sind, was als Nächstes kommt und welche Edition wann
            fällig ist. Newsletter unten — kein Spam, jederzeit abbestellbar.
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
            {ARTICLES.map((a) => (
              <motion.article
                key={a.title}
                className={[
                  'drop-card',
                  a.live ? 'live' : '',
                  a.featured ? 'featured' : '',
                ].filter(Boolean).join(' ')}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <div className="drop-meta">
                  <span className="drop-when">{a.when}</span>
                  {a.live
                    ? <span className="drop-badge">Live</span>
                    : <span className="drop-badge soon">Bald</span>}
                  {a.kind && <span className="drop-kind">{a.kind}</span>}
                </div>
                <h2 className="drop-title">{a.title}</h2>
                <p className="drop-body">{a.body}</p>
                {a.signature && (
                  <p className="drop-signature">{a.signature}</p>
                )}
                {a.cta && (
                  <Link to={a.cta.to} className="drop-cta">
                    {a.cta.label} →
                  </Link>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      <NewsletterBanner />
    </>
  );
}

interface Article {
  when: string;
  title: string;
  body: string;
  live: boolean;
  /** Optional small label after the live/soon badge (e.g. "Founders Letter"). */
  kind?: string;
  /** Optional italic signature line below the body (founders, editorial team, …). */
  signature?: string;
  /** Visual emphasis flag — spans wider on large screens. */
  featured?: boolean;
  /** Optional internal link below the body. */
  cta?: { label: string; to: string };
}

/**
 * Articles list — currently inline. Move to CMS / Markdown later.
 * Ordered as the founders intended: greeting first, upcoming event,
 * then the next product drop.
 */
const ARTICLES: Article[] = [
  {
    when: 'Juni 2026',
    title: 'Willkommen bei RITMO.',
    body:
      'Mit RITMO Padel bringen wir einen neuen Rhythmus auf den Platz. ' +
      'Wir stehen für eine klare Designsprache — Bauhaus-Reduktion statt ' +
      'Logo-Lärm, geometrische Präzision statt Beliebigkeit. Was wir bauen ' +
      'ist simpel. Aber effektiv. Und vor allem: kreativ. RITMO ist für die, ' +
      'die Padel als Bewegung begreifen — auf dem Court und in der Ästhetik.',
    signature: '— Illy, Nadin & Alessandra, Gründerinnen',
    kind: 'Founders Letter',
    live: true,
    featured: true,
  },
  {
    when: 'Juli 2026',
    title: 'RITMO X Padel Haus, Summer Sunset Special',
    body:
      'Founders-Edition des RITMO DNA Cups bei Padel Haus in Großmehring. ' +
      '22 Spieler-Spots im Mexicano-Format, anschließend Knock-Out, Halbfinale ' +
      'und RITMO Grande Finale (Best of 3) auf Court 3 unter Flutlicht. Parallel ' +
      'Ehren-Bracket — niemand sitzt nur rum. Manny’s BBQ, Aperol- und Padelé-Spritz, ' +
      'DJ ANKOE Ready Mix → LNRT House Music. 18 Uhr bis Open End. ' +
      '22 Spieler-Tickets (€39), Zuschauer-Tickets (€15) solange der Vorrat reicht. ' +
      'Verkauf startet 18. Juni 2026.',
    live: true,
    kind: 'Event',
    cta: { label: 'Zum Event', to: '/events/ritmo-x-padel-haus-summer-sunset-2026' },
  },
  {
    when: 'Q3 2026',
    title: 'Summer Collection, Drop I',
    body:
      'Tees, Crew-Hoodies und Caps in einer reduzierten Sommer-Palette. ' +
      'Heavy-Cotton, Bio-zertifiziert, made in Portugal. Inklusive Restock ' +
      'der RITMO-DNA-Print-Editionen und ein neuer A1-Poster-Cut.',
    live: false,
    kind: 'Drop',
    cta: { label: 'Zum Sortiment', to: '/sortiment' },
  },
];
