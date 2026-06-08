import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { TurnstileWidget } from './TurnstileWidget';
import { SpielstilCard } from '../../spielstil/SpielstilCard';
import {
  QUIZ,
  scoreQuiz,
  MIN_QUIZ_DURATION_MS,
  MAX_QUIZ_DURATION_MS,
} from '../../../lib/quiz';
import { SPIELSTILE } from '../../../lib/spielstile';
import type { BuyState } from '../../../lib/buyState';

/**
 * Step 3 — Spielstil quiz.
 *
 * Flow:
 *  1. "Intro" panel with Turnstile widget — once verified, the
 *     quiz starts and we record `startedAt`.
 *  2. 7 questions, one at a time, with AnimatePresence transitions.
 *     User must pick one of 4 answers; auto-advance after 350ms so the
 *     pulse of selection stays visible without dragging the flow.
 *  3. Result reveal — local scoring previews the winning Spielstil;
 *     the Worker re-scores authoritatively on checkout.
 *  4. Re-do button stays available (no resume — fully restart).
 *
 * Anti-bot:
 *  - Turnstile token captured BEFORE quiz start
 *  - startedAt / finishedAt sent to worker for time-gate check
 *  - Min 15s, Max 30min
 */
export function StepQuiz({
  state,
  setState,
  turnstileTokenForBuy,
  setTurnstileTokenForBuy,
}: {
  state: BuyState;
  setState: (next: Partial<BuyState>) => void;
  turnstileTokenForBuy: string;
  setTurnstileTokenForBuy: (t: string) => void;
}) {
  const reduce = useReducedMotion();

  /** UI phase: ready (intro) → asking → done */
  const [phase, setPhase] = useState<'ready' | 'asking' | 'done'>(
    state.quiz ? 'done' : 'ready'
  );
  const [qIdx, setQIdx] = useState(0);
  /** Locally-tracked answers; only committed to BuyState on finish. */
  const [answers, setAnswers] = useState<number[]>(state.quiz?.answers ?? []);
  /** Timestamp the quiz officially started (set when user verifies + clicks Start). */
  const startedAtRef = useRef<number>(state.quiz?.startedAt ?? 0);
  /** Whether the user's timing looks suspiciously fast — surfaced as a subtle warning. */
  const [tooFast, setTooFast] = useState(false);

  // We use a separate Turnstile token here from the one in BuyState
  // because Turnstile tokens are single-use AND we want the buy-flow
  // submission to ALSO carry a fresh token. So: this widget gates the
  // quiz start, then the review step renders a SECOND widget for the
  // checkout submission. Less suspicious to CF than reusing one.
  const [quizTurnstileToken, setQuizTurnstileToken] = useState('');

  /* Push quizTurnstileToken further up if it's the FIRST one acquired,
     so the review step doesn't have to wait for a second widget on
     slow connections — but only as a fallback; review widget overrides. */
  useEffect(() => {
    if (quizTurnstileToken && !turnstileTokenForBuy) {
      setTurnstileTokenForBuy(quizTurnstileToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizTurnstileToken]);

  /* ───── Intro start handler ───── */
  function startQuiz() {
    startedAtRef.current = Date.now();
    setPhase('asking');
    setQIdx(0);
    setAnswers([]);
  }

  /* ───── Answer handler ───── */
  function handleAnswer(answerIdx: number) {
    const next = [...answers, answerIdx];
    setAnswers(next);
    // Auto-advance after a brief pulse
    setTimeout(() => {
      if (next.length >= QUIZ.length) {
        finishQuiz(next);
      } else {
        setQIdx((i) => i + 1);
      }
    }, reduce ? 0 : 350);
  }

  /* ───── Finish ───── */
  function finishQuiz(finalAnswers: number[]) {
    const finishedAt = Date.now();
    const elapsed = finishedAt - startedAtRef.current;
    if (elapsed < MIN_QUIZ_DURATION_MS) setTooFast(true);
    if (elapsed > MAX_QUIZ_DURATION_MS) {
      // Force a restart — quiz was open way too long, possibly stale
      restart();
      return;
    }
    const result = scoreQuiz(finalAnswers);
    setState({
      quiz: {
        answers: finalAnswers,
        startedAt: startedAtRef.current,
        finishedAt,
        winner: result.winner,
      },
    });
    setPhase('done');
  }

  function restart() {
    setState({ quiz: null });
    setAnswers([]);
    setQIdx(0);
    startedAtRef.current = 0;
    setTooFast(false);
    setPhase('ready');
  }

  /* ───── Render ───── */
  const winner = state.quiz?.winner ? SPIELSTILE[state.quiz.winner] : null;

  return (
    <div className="bf-step bf-step-quiz">
      <p className="bf-step-eyebrow">Schritt 3 von 4</p>
      <h2 className="bf-step-title">
        Wer bist du <span className="accent">auf dem Court</span>?
      </h2>
      <p className="bf-step-lead">
        7 kurze Fragen. Kein richtig oder falsch — wir bilden deinen Spielstil
        ab. Das Resultat landet personalisiert auf deinem Ticket und im RITMO
        Match-Tier-System.
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {phase === 'ready' && (
          <motion.div
            key="ready"
            className="bf-quiz-intro"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <p className="bf-quiz-intro-note">
              Bevor du startest: kurzer Sicherheits-Check, damit kein Bot durch das
              Quiz rauscht.
            </p>
            <TurnstileWidget
              action="quiz-start"
              onToken={setQuizTurnstileToken}
            />
            <button
              type="button"
              className="btn btn-pri btn-lg bf-quiz-start"
              disabled={!quizTurnstileToken}
              onClick={startQuiz}
            >
              {quizTurnstileToken ? 'Quiz starten' : 'Sicherheits-Check läuft …'}
            </button>
          </motion.div>
        )}

        {phase === 'asking' && (
          <Question
            key={`q-${qIdx}`}
            index={qIdx}
            onAnswer={handleAnswer}
            selectedIdx={answers[qIdx]}
          />
        )}

        {phase === 'done' && winner && (
          <motion.div
            key="done"
            className="bf-quiz-result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {tooFast && (
              <p className="bf-quiz-warn">
                Sehr schnell durchgeklickt — der Server prüft das Quiz nochmal,
                bei Auffälligkeit musst du ggf. wiederholen.
              </p>
            )}
            <SpielstilCard spielstil={winner} variant="hero" />
            <div className="bf-quiz-result-actions">
              <button
                type="button"
                className="btn btn-out"
                onClick={restart}
              >
                Quiz wiederholen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress mini-bar — only during asking */}
      {phase === 'asking' && (
        <div className="bf-quiz-progress" aria-hidden="true">
          <div
            className="bf-quiz-progress-fill"
            style={{ width: `${((qIdx) / QUIZ.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

/* ───────── One question ───────── */
function Question({
  index,
  onAnswer,
  selectedIdx,
}: {
  index: number;
  onAnswer: (idx: number) => void;
  selectedIdx: number | undefined;
}) {
  const question = useMemo(() => QUIZ[index], [index]);
  return (
    <motion.div
      className="bf-quiz-card"
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -32 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="bf-quiz-count">Frage {index + 1} / {QUIZ.length}</div>
      <h3 className="bf-quiz-q">{question.q}</h3>
      {question.hint && <p className="bf-quiz-hint">{question.hint}</p>}
      <div className="bf-quiz-answers">
        {question.answers.map((a: { label: string }, i: number) => (
          <button
            key={i}
            type="button"
            className={`bf-quiz-ans${selectedIdx === i ? ' is-picked' : ''}`}
            onClick={() => onAnswer(i)}
            disabled={selectedIdx != null}
          >
            <span className="bf-quiz-ans-letter">{String.fromCharCode(65 + i)}</span>
            <span className="bf-quiz-ans-text">{a.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
