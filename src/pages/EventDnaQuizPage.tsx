import { useMemo, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENTS } from '../data/events';
import { Crumbs } from '../components/ui/Crumbs';
import { QUIZ, scoreQuiz } from '../lib/quiz';
import { SPIELSTILE } from '../lib/spielstile';

/**
 * /events/:id/dna-quiz — the 7-question RITMO DNA quiz.
 *
 * State machine is dirt-simple:
 *   answers: (number|null)[7] → submission[7] (no nulls) → result card
 * No persistence — refresh starts you over. Spielstil image at the
 * bottom is a placeholder under `/assets/spielstile/<slug>.jpg`; missing
 * files render the Bauhaus gradient fallback.
 */
export function EventDnaQuizPage() {
  const { id } = useParams<{ id: string }>();
  const event = EVENTS.find((e) => e.id === id);

  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(QUIZ.length).fill(null)
  );
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const result = useMemo(() => {
    if (!done) return null;
    if (answers.some((a) => a === null)) return null;
    return scoreQuiz(answers as number[]);
  }, [done, answers]);
  const winner = result ? SPIELSTILE[result.winner] : null;

  if (!event) return <Navigate to="/events" replace />;

  function pick(idx: number) {
    const next = [...answers];
    next[step] = idx;
    setAnswers(next);
    if (step < QUIZ.length - 1) setStep(step + 1);
    else setDone(true);
  }
  function reset() {
    setAnswers(Array(QUIZ.length).fill(null));
    setStep(0);
    setDone(false);
    setImgFailed(false);
  }

  const progress = ((step + (done ? 1 : 0)) / QUIZ.length) * 100;

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
            7 Fragen, klare Antwort. Dein Archetyp bestimmt Bracket-Seeding
            und Match-Tier beim Sunset Cup.
          </p>

          {!done && (
            <div className="dna-quiz-progress" aria-hidden>
              <div
                className="dna-quiz-progress-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </motion.section>

      <section className="dna-quiz-body">
        <div className="wrap">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.article
                key={`q-${step}`}
                className="dna-quiz-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="dna-quiz-counter">
                  Frage {step + 1} / {QUIZ.length}
                </span>
                <h2 className="dna-quiz-q">{QUIZ[step].q}</h2>
                {QUIZ[step].hint && (
                  <p className="dna-quiz-hint">{QUIZ[step].hint}</p>
                )}
                <ul className="dna-quiz-answers">
                  {QUIZ[step].answers.map((a, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        className="dna-quiz-answer"
                        onClick={() => pick(i)}
                      >
                        <span className="dna-quiz-letter">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="dna-quiz-label">{a.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                {step > 0 && (
                  <button
                    type="button"
                    className="dna-quiz-back"
                    onClick={() => setStep(step - 1)}
                  >
                    ← eine Frage zurück
                  </button>
                )}
              </motion.article>
            ) : winner ? (
              <motion.article
                key="result"
                className="dna-quiz-result"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  borderLeftColor: winner.accent,
                  background: `linear-gradient(135deg, ${winner.accent}1A, var(--card) 55%)`,
                }}
              >
                <div className="dna-quiz-result-head">
                  <span className="dna-quiz-result-eyebrow">Dein Spielstil</span>
                  <h2
                    className="dna-quiz-result-name"
                    style={{ color: winner.accent }}
                  >
                    {winner.name}
                  </h2>
                  <p className="dna-quiz-result-sub">{winner.subtitle}</p>
                </div>

                <div className="dna-quiz-result-image">
                  {imgFailed ? (
                    <div
                      className="dna-quiz-result-fallback"
                      style={{ background: `linear-gradient(135deg, ${winner.accent}, #0A0A0A)` }}
                    />
                  ) : (
                    <img
                      src={`/assets/spielstile/${winner.slug}.jpg`}
                      alt={`${winner.name} — ${winner.subtitle}`}
                      onError={() => setImgFailed(true)}
                    />
                  )}
                </div>

                <p className="dna-quiz-result-tagline">{winner.tagline}</p>
                {winner.desc.split('\n\n').map((para, i) => (
                  <p key={i} className="dna-quiz-result-desc">{para}</p>
                ))}

                <div className="dna-quiz-result-grid">
                  <div>
                    <h4>Kernwerte</h4>
                    <ul>
                      {winner.kernwerte.map((k) => <li key={k}>{k}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4>Stärken</h4>
                    <ul>
                      {winner.strengths.map((k) => <li key={k}>{k}</li>)}
                    </ul>
                  </div>
                </div>

                {result?.tieBreakUsed && (
                  <p className="dna-quiz-result-note">
                    Knappes Rennen — die letzte Frage hat entschieden.
                  </p>
                )}

                <div className="dna-quiz-cta-row">
                  <Link
                    to={`/events/${event.id}#tickets`}
                    className="btn btn-pri"
                  >
                    Zurück zum Event →
                  </Link>
                  <button
                    type="button"
                    className="btn btn-out"
                    onClick={reset}
                  >
                    Quiz neu starten
                  </button>
                </div>
              </motion.article>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
