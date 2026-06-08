import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EVENTS } from '../data/events';
import { Crumbs } from '../components/ui/Crumbs';
import { StepProgress } from '../components/event/buy/StepProgress';
import { StepType } from '../components/event/buy/StepType';
import { StepNames } from '../components/event/buy/StepNames';
import { StepQuiz } from '../components/event/buy/StepQuiz';
import { StepReview } from '../components/event/buy/StepReview';
import {
  initialState,
  isStepComplete,
  loadPersisted,
  nextStep,
  persist,
  prevStep,
  STEP_ORDER,
} from '../lib/buyState';
import type { BuyState, BuyStep } from '../lib/buyState';
import {
  createEventCheckout,
  EventCheckoutError,
  type CheckoutPayload,
} from '../lib/eventCheckout';

/**
 * /event/buy/:eventId — multi-step ticket purchase flow.
 *
 * State model:
 *  - One <BuyState> object. Steps mutate slices via `setState(patch)`.
 *  - Identity (tier/quantity/names/email) auto-persisted to sessionStorage
 *    on every change. Quiz answers, turnstile token, and consent flags
 *    are NEVER persisted (see buyState.ts for the rationale).
 *
 * The page guards step-transitions with `isStepComplete()` — Next is
 * disabled until the current step validates. Back is always allowed
 * within the flow, except after submission has been initiated.
 */
export function EventBuyPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const event = eventId ? EVENTS.find((e) => e.id === eventId) : null;

  /* ───── State ───── */
  const [state, setStateRaw] = useState<BuyState>(() => {
    const base = initialState(eventId ?? '');
    const persisted = eventId ? loadPersisted(eventId) : null;
    return persisted ? { ...base, ...persisted } : base;
  });
  const [currentStep, setCurrentStep] = useState<BuyStep>('type');
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /** Patch helper — persists identity automatically. */
  const setState = useCallback((patch: Partial<BuyState>) => {
    setStateRaw((prev) => {
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, []);

  /* ───── Bail if event unknown ───── */
  if (!event) {
    return <Navigate to="/events" replace />;
  }
  // `event` is narrowed to non-null here, but TS doesn't propagate that
  // through the function-scoped `submit()` closure below — alias it.
  const evt = event;

  /* ───── Visible steps (skip quiz for zuschauer) ───── */
  const visibleSteps = useMemo<BuyStep[]>(() => {
    return STEP_ORDER.filter((s) => s !== 'quiz' || state.tier === 'spieler');
  }, [state.tier]);

  /* ───── Skip-quiz cleanup ───── */
  useEffect(() => {
    if (state.tier !== 'spieler' && state.quiz) {
      setState({ quiz: null });
    }
  }, [state.tier, state.quiz, setState]);

  /* ───── Step nav handlers ───── */
  function goNext() {
    setErrorMessage(null);
    if (!isStepComplete(state, currentStep)) return;
    const n = nextStep(state, currentStep);
    if (n) setCurrentStep(n);
  }
  function goBack() {
    setErrorMessage(null);
    const p = prevStep(state, currentStep);
    if (p) setCurrentStep(p);
  }

  /* ───── Submit ───── */
  async function submit() {
    if (busy) return;
    setBusy(true);
    setErrorMessage(null);
    try {
      const payload: CheckoutPayload = {
        eventId: evt.id,
        tier: state.tier!,
        quantity: state.quantity,
        buyer: state.buyer,
        attendees: state.attendees,
        quiz: state.quiz ? {
          answers: state.quiz.answers,
          startedAt: state.quiz.startedAt,
          finishedAt: state.quiz.finishedAt,
          winner: state.quiz.winner,
        } : undefined,
        honeypot: state.honeypot,
        turnstileToken: state.turnstileToken,
        acceptedAgb: state.acceptedAgb,
        acceptedPrivacy: state.acceptedPrivacy,
      };
      const { url } = await createEventCheckout(payload);
      // Redirect away — sessionStorage cleared by the success page,
      // not here, in case Stripe bounces back to /event/cancel.
      window.location.assign(url);
    } catch (e) {
      if (e instanceof EventCheckoutError) {
        setErrorMessage(e.message);
        // If Turnstile failed, force a re-verify by clearing the token
        if (e.code === 'turnstile_failed') {
          setState({ turnstileToken: '' });
        }
      } else {
        setErrorMessage('Unbekannter Fehler. Bitte später erneut versuchen.');
      }
      setBusy(false);
    }
  }

  /* ───── Render ───── */
  return (
    <main className="bf-main">
      <Crumbs
        items={[
          { label: 'Events', to: '/events' },
          { label: event.title, to: `/events/${event.id}` },
          { label: 'Ticket kaufen' },
        ]}
      />

      <motion.section
        className="bf-hero"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="wrap">
          <p className="rule">Ticket-Kauf</p>
          <h1 className="page-title">
            {event.title}
          </h1>
          <StepProgress current={currentStep} visibleSteps={visibleSteps} />
        </div>
      </motion.section>

      <section className="bf-body">
        <div className="wrap">
          {currentStep === 'type' && (
            <StepType
              event={event}
              state={state}
              setState={setState}
              remainingPlayer={null /* Worker has the real count */}
            />
          )}
          {currentStep === 'names' && (
            <StepNames state={state} setState={setState} />
          )}
          {currentStep === 'quiz' && state.tier === 'spieler' && (
            <StepQuiz
              state={state}
              setState={setState}
              turnstileTokenForBuy={state.turnstileToken}
              setTurnstileTokenForBuy={(t) => setState({ turnstileToken: t })}
            />
          )}
          {currentStep === 'review' && (
            <StepReview
              event={event}
              state={state}
              setState={setState}
              busy={busy}
              errorMessage={errorMessage}
              onSubmit={submit}
            />
          )}

          {/* ───── Footer nav ───── */}
          {currentStep !== 'review' && (
            <div className="bf-nav-row">
              <button
                type="button"
                className="btn btn-out"
                onClick={prevStep(state, currentStep) ? goBack : () => navigate(`/events/${event.id}`)}
              >
                {prevStep(state, currentStep) ? '← Zurück' : '← Abbrechen'}
              </button>
              <button
                type="button"
                className="btn btn-pri"
                disabled={!isStepComplete(state, currentStep)}
                onClick={goNext}
              >
                Weiter →
              </button>
            </div>
          )}
          {currentStep === 'review' && (
            <div className="bf-nav-row">
              <button type="button" className="btn btn-out" onClick={goBack}>
                ← Bearbeiten
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
