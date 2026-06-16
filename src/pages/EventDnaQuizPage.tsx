import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EVENTS } from '../data/events';
import { Crumbs } from '../components/ui/Crumbs';

/**
 * /events/:id/dna-quiz — placeholder page for the DNA Quiz.
 *
 * The full quiz lands in a follow-up PR. This page exists so the
 * Match-Tiers section on the event detail page has a real link target,
 * and so the route is reserved.
 */
export function EventDnaQuizPage() {
  const { id } = useParams<{ id: string }>();
  const event = EVENTS.find((e) => e.id === id);
  if (!event) return <Navigate to="/events" replace />;

  return (
    <main className="dna-quiz-main">
      <Crumbs
        items={[
          { label: 'Events', to: '/events' },
          { label: event.title, to: `/events/${event.id}` },
          { label: 'DNA Quiz' },
        ]}
      />

      <motion.section
        className="dna-quiz-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="wrap">
          <p className="rule">RITMO DNA Quiz</p>
          <h1 className="page-title">
            Finde deinen <span className="accent">Spielstil</span>.
          </h1>
          <p className="page-lead">
            7 Fragen, klare Antwort — dein Spielstil prägt das Bracket-Seeding
            beim DNA Cup und die Match-Tier-Verteilung. Sieben Archetypen:
            CHICO, TORO, INDIVIDUOSO, MURO, FANTASMA, MOTOR, HYSTERICA. Welcher
            bist du?
          </p>

          <div className="dna-quiz-coming">
            <h2 className="dna-quiz-coming-head">Quiz kommt bald</h2>
            <p>
              Das Quiz wird mit dem nächsten Update freigeschaltet. In der
              Zwischenzeit: trag dich auf die Warteliste ein, dann pingen wir
              dich, sobald es live geht.
            </p>
            <div className="dna-quiz-cta-row">
              <Link to={`/events/${event.id}#tickets`} className="btn btn-pri">
                Auf die Warteliste →
              </Link>
              <Link to={`/events/${event.id}`} className="btn btn-out">
                Zurück zum Event
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
