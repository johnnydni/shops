/**
 * Buy-flow state model + sessionStorage persistence.
 *
 * Persistence rules:
 *  - **Identity** (tier, quantity, buyer info, attendee names) → sessionStorage.
 *    Survives a tab refresh, dies with the tab. UX win.
 *  - **Quiz answers** → in-memory only (NOT in sessionStorage).
 *    A refresh resets the quiz. This blocks the "try again until I like the
 *    result" attack, and prevents resuming a stale quiz from another session.
 *  - **Turnstile token** → in-memory only. Tokens are single-use anyway.
 *
 * The state shape is intentionally separate from `CheckoutPayload`
 * (defined in `eventCheckout.ts`) because the latter is a wire format —
 * we build it once at checkout time from BuyState + quiz result.
 */

import type { SpielstilId } from './spielstile';
import type { TicketTierKey, BuyerInfo, AttendeeInfo } from './eventCheckout';

export type BuyStep = 'type' | 'names' | 'quiz' | 'review';

export interface BuyState {
  eventId: string;
  tier: TicketTierKey | null;
  /** 1 for spieler (always), 1-6 for zuschauer. */
  quantity: number;
  buyer: BuyerInfo;
  /** length must equal `quantity` at the time of submission. */
  attendees: AttendeeInfo[];
  /** Filled by Quiz step. Never persisted. */
  quiz: {
    answers: number[];
    startedAt: number;
    finishedAt: number;
    winner: SpielstilId;
  } | null;
  /** Hidden honeypot — must remain empty. Bots fill it. */
  honeypot: string;
  /** Turnstile widget token — set by widget callback, single-use. */
  turnstileToken: string;
  /** AGB + Datenschutz Pflicht-Checkboxen vor Checkout. */
  acceptedAgb: boolean;
  acceptedPrivacy: boolean;
}

export function emptyBuyer(): BuyerInfo {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    newsletterOptIn: false,
  };
}

export function emptyAttendee(): AttendeeInfo {
  return { firstName: '', lastName: '' };
}

export function initialState(eventId: string): BuyState {
  return {
    eventId,
    tier: null,
    quantity: 1,
    buyer: emptyBuyer(),
    attendees: [emptyAttendee()],
    quiz: null,
    honeypot: '',
    turnstileToken: '',
    acceptedAgb: false,
    acceptedPrivacy: false,
  };
}

/* ───────── Validation helpers (used by step guards) ───────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmailValid(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export function isStepTypeComplete(s: BuyState): boolean {
  if (s.tier === 'spieler') return s.quantity === 1;
  if (s.tier === 'zuschauer') return s.quantity >= 1 && s.quantity <= 6;
  return false;
}

export function isStepNamesComplete(s: BuyState): boolean {
  if (!isEmailValid(s.buyer.email)) return false;
  if (!s.buyer.firstName.trim() || !s.buyer.lastName.trim()) return false;
  if (s.attendees.length !== s.quantity) return false;
  return s.attendees.every(
    (a) => a.firstName.trim().length >= 1 && a.lastName.trim().length >= 1
  );
}

export function isStepQuizComplete(s: BuyState): boolean {
  if (s.tier !== 'spieler') return true;  // skipped
  return s.quiz != null && s.quiz.winner != null && s.quiz.answers.length === 7;
}

export function isStepReviewComplete(s: BuyState): boolean {
  if (!s.acceptedAgb || !s.acceptedPrivacy) return false;
  if (!s.turnstileToken) return false;
  if (s.honeypot !== '') return false;
  return true;
}

/* ───────── sessionStorage glue ───────── */

const STORAGE_KEY = 'ritmo.event.buy.v1';

interface PersistedBuyState {
  eventId: string;
  tier: TicketTierKey | null;
  quantity: number;
  buyer: BuyerInfo;
  attendees: AttendeeInfo[];
}

/**
 * Persist non-sensitive identity to sessionStorage.
 * Quiz / Turnstile / honeypot intentionally NOT included.
 */
export function persist(s: BuyState): void {
  if (typeof sessionStorage === 'undefined') return;
  const slim: PersistedBuyState = {
    eventId: s.eventId,
    tier: s.tier,
    quantity: s.quantity,
    buyer: s.buyer,
    attendees: s.attendees,
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
  } catch {
    /* quota or disabled — silently ignore */
  }
}

/** Load persisted slim state for this event. Returns null if none / mismatched event. */
export function loadPersisted(eventId: string): Partial<BuyState> | null {
  if (typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedBuyState;
    if (!parsed?.eventId || parsed.eventId !== eventId) return null;
    return {
      eventId: parsed.eventId,
      tier: parsed.tier ?? null,
      quantity: clampQty(parsed.tier, parsed.quantity),
      buyer: { ...emptyBuyer(), ...(parsed.buyer || {}) },
      attendees: Array.isArray(parsed.attendees) && parsed.attendees.length
        ? parsed.attendees.map((a) => ({
            firstName: String(a.firstName || ''),
            lastName: String(a.lastName || ''),
          }))
        : [emptyAttendee()],
    };
  } catch {
    return null;
  }
}

export function clearPersisted(): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function clampQty(tier: TicketTierKey | null, q: number): number {
  if (tier === 'spieler') return 1;
  if (tier === 'zuschauer') return Math.max(1, Math.min(6, q || 1));
  return Math.max(1, Math.min(6, q || 1));
}

/* ───────── Step transition table ───────── */

export const STEP_ORDER: BuyStep[] = ['type', 'names', 'quiz', 'review'];

/** Next step for the given state — skips `quiz` for zuschauer. */
export function nextStep(s: BuyState, current: BuyStep): BuyStep | null {
  const idx = STEP_ORDER.indexOf(current);
  for (let i = idx + 1; i < STEP_ORDER.length; i++) {
    const step = STEP_ORDER[i];
    if (step === 'quiz' && s.tier !== 'spieler') continue;
    return step;
  }
  return null;
}

export function prevStep(s: BuyState, current: BuyStep): BuyStep | null {
  const idx = STEP_ORDER.indexOf(current);
  for (let i = idx - 1; i >= 0; i--) {
    const step = STEP_ORDER[i];
    if (step === 'quiz' && s.tier !== 'spieler') continue;
    return step;
  }
  return null;
}

export function isStepComplete(s: BuyState, step: BuyStep): boolean {
  switch (step) {
    case 'type':   return isStepTypeComplete(s);
    case 'names':  return isStepNamesComplete(s);
    case 'quiz':   return isStepQuizComplete(s);
    case 'review': return isStepReviewComplete(s);
  }
}
