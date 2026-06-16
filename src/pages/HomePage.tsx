import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GradientBlinds from '../components/layout/GradientBlinds';
import { HorizontalScrollJourney } from '../components/shop/HorizontalScrollJourney';
import { BentoShowcase } from '../components/shop/BentoShowcase';
import { SocialProofStrip } from '../components/shop/SocialProofStrip';
import { PRODUCTS } from '../data/products';

/**
 * HomePage — pure landing.
 *
 * Sortiment-Grid und Newsletter sind jetzt eigene Seiten unter
 * /sortiment bzw. /news. Hier oben fokussieren wir auf:
 *
 *   1. Hero
 *   2. Horizontal Scroll Journey  (Produktdiscovery, immersiv)
 *   3. Bento Showcase             (Brand-Säulen, modular)
 *   4. Social-proof Strip         (Vertrauen vor finalem CTA)
 *   5. CTA Pair                   (zu /sortiment + /news)
 *
 * Animation: kontinuierliches Stagger-Reveal via Framer Motion. Jede
 * Sektion fadet/slidet beim Eintritt in den Viewport ein, mit
 * gestaffeltem Delay auf den Kindern für ein cinematisches Gefühl.
 * `prefers-reduced-motion` schaltet alle Y-Translates ab (nur Opacity
 * bleibt), damit Vestibular-Trigger respektiert werden.
 */
export function HomePage() {
  const reduce = useReducedMotion();

  // Reusable variants — children share the same easing for visual coherence
  const sectionReveal = {
    hidden: { opacity: 0, y: reduce ? 0 : 32 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  // Hero stagger — orchestrates accent, headline, lead, chips, hint
  const heroContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const heroChild = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <>
      {/* ─── 1. Hero ────────────────────────────────────────────── */}
      <section className="hero hero-xl">
        {/*
          WebGL gradient background (reactbits.dev "gradient-blinds").
          Params mirror the user's reactbits.dev preview URL exactly:
            color1=F97316  color2=753509  noise=0.47
            blindMinWidth=35  spotlightRadius=0.75  blindCount=20
          The component auto-pauses on prefers-reduced-motion and when
          the tab is hidden.
        */}
        <GradientBlinds
          gradientColors={['#F97316', '#753509']}
          noise={0.47}
          blindMinWidth={35}
          blindCount={20}
          spotlightRadius={0.75}
        />
        <motion.div
          className="wrap hero-content"
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={heroChild}>
            <span className="accent">SHOP</span>
            <span className="slash">·</span>
            <br />
            BAUHAUS
            <br />
            GEAR<span className="accent">.</span>
          </motion.h1>
          <motion.p className="lead" variants={heroChild}>
            RITMO Apparel und Gear in geometrischer Klarheit. Schläger, Bälle,
            Trikots und Print-Editionen — entworfen für die, die Padel als
            Kunstform begreifen.
          </motion.p>
          <motion.div className="meta" variants={heroChild}>
            <span className="chip live">Limited Drops</span>
            <span className="chip">Versand DACH frei</span>
            <span className="chip">Made for Padel</span>
          </motion.div>
          <motion.a
            className="scroll-hint"
            href="#journey"
            aria-label="Zur Produkt-Journey"
            variants={heroChild}
          >
            <span>Scroll · Produkte</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </motion.a>
        </motion.div>
      </section>

      {/* ─── 2. Horizontal Scroll Journey ───────────────────────── */}
      <motion.div
        id="journey"
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      >
        <HorizontalScrollJourney
          products={PRODUCTS}
          title="Die Journey"
          titleAccent="."
        />
      </motion.div>

      {/* ─── 3. Bento Showcase ──────────────────────────────────── */}
      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      >
        <BentoShowcase />
      </motion.div>

      {/* ─── 4. Social proof ────────────────────────────────────── */}
      <motion.div
        variants={sectionReveal}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      >
        <SocialProofStrip />
      </motion.div>

      {/* ─── 5. CTA pair → /sortiment + /news ───────────────────── */}
      <CtaPair reduce={reduce ?? false} />
    </>
  );
}

/** Two big tiles linking out to the dedicated catalog + news pages. */
function CtaPair({ reduce }: { reduce: boolean }) {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };
  const tile = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="cta-pair">
      <motion.div
        className="wrap cta-grid"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      >
        <motion.div variants={tile}>
          <Link to="/sortiment" className="cta-tile cta-orange">
            <div className="cta-eyebrow">Stöbern</div>
            <div className="cta-title">
              Zum <span className="accent">Sortiment</span>
            </div>
            <p className="cta-body">
              Alle Schläger, Bälle, Apparel und Print-Editionen — filterbar.
            </p>
            <div className="cta-arrow" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={tile}>
          <Link to="/news" className="cta-tile cta-mono">
            <div className="cta-eyebrow">Bleib im Loop</div>
            <div className="cta-title">
              Drops &amp; <span className="accent">News</span>
            </div>
            <p className="cta-body">
              Editorials, Release-Termine und der Newsletter — alles auf
              einer Seite.
            </p>
            <div className="cta-arrow" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
