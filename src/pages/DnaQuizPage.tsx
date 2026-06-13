import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  DNA_QUIZ,
  emptyDnaSubmission,
  scoreDnaQuiz,
  toggleDnaPick,
  type DnaQuizSubmission,
} from '../lib/dnaQuiz';
import { SPIELSTILE } from '../lib/spielstile';
import { SpielstilCard } from '../components/spielstil/SpielstilCard';

/**
 * /dna-quiz — RITMO DNA Quiz · standalone community page.
 *
 *  Step 1  →  Name (used in the result line, "Du bist eine TORO, Illy.")
 *  Step 2  →  7 multi-select questions, one card at a time
 *  Step 3  →  Spielstil result · screenshot hint · event + brand CTAs
 *
 * Not gated by the booking-lock flag. No Turnstile, no Worker call,
 * everything is client-side. Pure marketing + community thing.
 */

type Phase = 'name' | 'quiz' | 'result';

/** Placeholder until the event-page CTA gets a real path */
const EVENT_HREF = '/events/ritmo-x-padel-haus-summer-sunset-2026';

export function DnaQuizPage() {
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>('name');
  const [name, setName] = useState('');
  const [qIdx, setQIdx] = useState(0);
  const [submission, setSubmission] = useState<DnaQuizSubmission>(emptyDnaSubmission);

  /* Locked-in result so the reveal animation doesn't recompute on re-render */
  const resultRef = useRef<ReturnType<typeof scoreDnaQuiz> | null>(null);

  const trimmedName = name.trim();
  const totalQs = DNA_QUIZ.length;
  const currentPicks = submission[qIdx] ?? [];
  const canAdvance = currentPicks.length >= 1;
  const isLastQ = qIdx === totalQs - 1;

  function startQuiz() {
    if (!trimmedName) return;
    setPhase('quiz');
    setQIdx(0);
    setSubmission(emptyDnaSubmission());
  }

  function togglePick(answerIdx: number) {
    setSubmission((prev) => toggleDnaPick(prev, qIdx, answerIdx));
  }

  function nextQ() {
    if (!canAdvance) return;
    if (isLastQ) {
      resultRef.current = scoreDnaQuiz(submission);
      setPhase('result');
      return;
    }
    setQIdx((i) => i + 1);
  }

  function prevQ() {
    if (qIdx > 0) setQIdx((i) => i - 1);
    else setPhase('name');
  }

  function restart() {
    resultRef.current = null;
    setSubmission(emptyDnaSubmission());
    setQIdx(0);
    setPhase('name');
  }

  const winner = resultRef.current ? SPIELSTILE[resultRef.current.winner] : null;

  return (
    <main className="dna-main">
      {/* ── Constant accent strip top ── */}
      <div className="dna-stripe" aria-hidden="true" />

      <div className="wrap">
        <AnimatePresence mode="wait" initial={false}>

          {/* ─── Phase 1 · Name ─── */}
          {phase === 'name' && (
            <motion.section
              key="name"
              className="dna-step dna-step-name"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="dna-eyebrow">DNA QUIZ</p>
              <h1 className="dna-headline">
                Find <span className="accent">YOUR</span> RITMO DNA.
              </h1>
              <p className="dna-lead">
                Sieben Fragen. Mehrfachauswahl erlaubt — pick alle Antworten,
                die sich nach dir anfühlen. Am Ende kennst du deinen
                <strong> Spielstil-Archetypen</strong> für RITMO-Turniere.
              </p>

              <label className="dna-name-field">
                <span className="dna-name-label">Wie heißt du auf dem Court?</span>
                <input
                  type="text"
                  autoFocus
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={40}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Illy"
                  onKeyDown={(e) => { if (e.key === 'Enter' && trimmedName) startQuiz(); }}
                />
              </label>

              <div className="dna-actions">
                <button
                  type="button"
                  className="btn btn-pri btn-lg"
                  disabled={!trimmedName}
                  onClick={startQuiz}
                >
                  Quiz starten →
                </button>
              </div>

              <p className="dna-fineprint">
                Reine Spaß-Diagnose. Wir speichern weder Name noch Antworten —
                alles bleibt in deinem Browser.
              </p>
            </motion.section>
          )}

          {/* ─── Phase 2 · Quiz ─── */}
          {phase === 'quiz' && (
            <motion.section
              key="quiz"
              className="dna-step dna-step-quiz"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Progress */}
              <div className="dna-progress-row">
                <span className="dna-progress-count">{qIdx + 1} / {totalQs}</span>
                <div className="dna-progress-bar" aria-hidden="true">
                  <span
                    className="dna-progress-fill"
                    style={{ width: `${((qIdx + 1) / totalQs) * 100}%` }}
                  />
                </div>
              </div>

              <QuestionCard
                key={qIdx}
                qIdx={qIdx}
                picks={currentPicks}
                onToggle={togglePick}
              />

              <div className="dna-nav-row">
                <button
                  type="button"
                  className="btn btn-out"
                  onClick={prevQ}
                >
                  ← Zurück
                </button>
                <button
                  type="button"
                  className="btn btn-pri"
                  disabled={!canAdvance}
                  onClick={nextQ}
                >
                  {isLastQ ? 'Ergebnis sehen →' : 'Weiter →'}
                </button>
              </div>

              <p className="dna-multi-hint">
                Mehrfachauswahl: pick alles, was sich richtig anfühlt.
                Mindestens eine Antwort.
              </p>
            </motion.section>
          )}

          {/* ─── Phase 3 · Result ─── */}
          {phase === 'result' && winner && (
            <motion.section
              key="result"
              className="dna-step dna-step-result"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="dna-eyebrow">Dein Ergebnis</p>
              <motion.h1
                className="dna-result-heading"
                initial={reduce ? false : { y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.1 }}
              >
                {trimmedName}, du bist{' '}
                <span style={{ color: winner.accent }}>{winner.name}</span>.
              </motion.h1>

              <SpielstilCard spielstil={winner} variant="hero" />

              <motion.div
                className="dna-screenshot-hint"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.4 }}
              >
                <div className="dna-screenshot-mark" aria-hidden="true" />
                <div>
                  <strong>Foto oder Screenshot machen!</strong>
                  <p>
                    Merk dir, welcher Spielstil du bist — beim Turnier wird er
                    Teil deines RITMO-Passes.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="dna-result-ctas"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 1.7 }}
              >
                <Link to={EVENT_HREF} className="btn btn-pri btn-lg">
                  Zum RITMO Event →
                </Link>
                <Link to="/" className="btn btn-out btn-lg">
                  RITMO entdecken
                </Link>
              </motion.div>

              <motion.p
                className="dna-result-brand-line"
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.0 }}
              >
                Mehr Infos über RITMO Padel, die anderen Spielstil-Archetypen
                und kommende Events findest du auf{' '}
                <Link to="/">ritmopadel.shop</Link>.
              </motion.p>

              <button
                type="button"
                className="dna-redo-link"
                onClick={restart}
              >
                Quiz nochmal machen
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ───── One question card ───── */
function QuestionCard({
  qIdx,
  picks,
  onToggle,
}: {
  qIdx: number;
  picks: number[];
  onToggle: (answerIdx: number) => void;
}) {
  const question = useMemo(() => DNA_QUIZ[qIdx], [qIdx]);
  const reduce = useReducedMotion();
  const pickedSet = new Set(picks);

  return (
    <motion.div
      key={qIdx}
      className="dna-q-card"
      initial={reduce ? false : { opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -28 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <h2 className="dna-q-title">{question.q}</h2>
      {question.hint && <p className="dna-q-hint">{question.hint}</p>}

      <div className="dna-q-answers">
        {question.answers.map((a, i) => {
          const picked = pickedSet.has(i);
          return (
            <button
              key={i}
              type="button"
              className={`dna-q-ans${picked ? ' is-picked' : ''}`}
              aria-pressed={picked}
              onClick={() => onToggle(i)}
            >
              <span className="dna-q-check" aria-hidden="true">
                {picked && <Checkmark />}
              </span>
              <span className="dna-q-text">{a.label}</span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function Checkmark() {
  return (
    <svg viewBox="0 0 18 18" width="14" height="14">
      <polyline
        points="3,9 7,13 15,4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
    </svg>
  );
}
