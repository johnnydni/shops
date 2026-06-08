/**
 * Client → Worker API for the event ticket buy-flow.
 *
 * Two endpoints get called from the SPA:
 *
 *   POST /api/event/checkout
 *     Body: {
 *       eventId, tier, quantity,
 *       buyer: { firstName, lastName, email, phone?, newsletterOptIn },
 *       attendees: [{ firstName, lastName }],
 *       quiz?: { answers, startedAt, finishedAt, winner },
 *       honeypot,                 // must be empty
 *       turnstileToken
 *     }
 *     Returns: { url, sessionId, spielstilToken? }
 *
 *   POST /api/event/quiz/score    (optional pre-flight — Phase 3 may use it)
 *     Body: { answers, startedAt, finishedAt, turnstileToken }
 *     Returns: { winner, spielstilToken }
 *
 * The Worker is authoritative for:
 *   - re-scoring the quiz (don't trust client `winner`)
 *   - re-pricing (don't trust client price)
 *   - Turnstile verification
 *   - email-cap enforcement
 *   - inventory-cap enforcement
 *
 * The client never sees JWTs in plain — they live in Stripe metadata
 * and come back as opaque tokens on the success page.
 */

import type { SpielstilId } from './spielstile';

const DEFAULT_BASE = 'https://api.ritmopadel.shop/api/event';

function baseUrl(): string {
  const fromEnv = (import.meta.env.VITE_EVENT_API_BASE as string | undefined) ?? '';
  return (fromEnv || DEFAULT_BASE).replace(/\/$/, '');
}

export type TicketTierKey = 'spieler' | 'zuschauer';

export interface BuyerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  newsletterOptIn: boolean;
}

export interface AttendeeInfo {
  firstName: string;
  lastName: string;
}

export interface CheckoutPayload {
  eventId: string;
  tier: TicketTierKey;
  quantity: number;
  buyer: BuyerInfo;
  attendees: AttendeeInfo[];
  quiz?: {
    answers: number[];
    startedAt: number;
    finishedAt: number;
    winner: SpielstilId;
  };
  honeypot: string;        // must be empty string
  turnstileToken: string;
  acceptedAgb: boolean;
  acceptedPrivacy: boolean;
  /**
   * Optional pre-sales test bypass code. When the Worker has
   * `EVENT_BYPASS_CODE` set and this value matches, the sales-window
   * check is skipped — all other guards (Turnstile, caps, quiz scoring,
   * Stripe pricing) remain in force.
   */
  bypassCode?: string;
}

export interface CheckoutResponse {
  url: string;             // Stripe Checkout URL — browser redirects here
  sessionId: string;       // Stripe session id (for client-side logging)
  spielstilToken?: string; // signed token, persists into Stripe metadata
}

/**
 * POST /api/event/checkout — server creates Stripe Session, returns URL.
 * Throws `EventCheckoutError` with code + readable message.
 */
export async function createEventCheckout(
  payload: CheckoutPayload
): Promise<CheckoutResponse> {
  const url = `${baseUrl()}/checkout`;
  let resp: Response;
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    throw new EventCheckoutError(
      'network',
      'Wir konnten den Server nicht erreichen. Verbindung prüfen, kurz warten und nochmal probieren.'
    );
  }

  let data: { url?: string; sessionId?: string; spielstilToken?: string; error?: string; code?: string } = {};
  try {
    data = await resp.json();
  } catch {
    /* server returned non-json; fall through */
  }

  if (!resp.ok || !data.url) {
    throw new EventCheckoutError(
      data.code || `http_${resp.status}`,
      data.error || translateCode(data.code, resp.status)
    );
  }

  return {
    url: data.url,
    sessionId: data.sessionId ?? '',
    spielstilToken: data.spielstilToken,
  };
}

/**
 * Structured error with a stable `code` for the UI to switch on
 * (e.g. show different banner for `email_cap_exceeded` vs `inventory_sold_out`).
 */
export class EventCheckoutError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

function translateCode(code: string | undefined, http: number): string {
  switch (code) {
    case 'sales_not_started':
      return 'Der Verkauf hat noch nicht begonnen.';
    case 'sales_ended':
      return 'Der Verkauf ist beendet.';
    case 'inventory_sold_out':
      return 'Die Tickets dieser Kategorie sind ausverkauft.';
    case 'email_cap_exceeded':
      return 'Mit dieser Email-Adresse wurden bereits genügend Tickets gekauft.';
    case 'quiz_required':
      return 'Bitte beantworte zuerst das Spielstil-Quiz.';
    case 'quiz_invalid':
      return 'Quiz-Daten ungültig. Bitte starte das Quiz neu.';
    case 'turnstile_failed':
      return 'Sicherheitsprüfung fehlgeschlagen. Bitte Seite neu laden.';
    case 'honeypot_triggered':
      return 'Antrag konnte nicht verarbeitet werden.';
    default:
      return http >= 500
        ? 'Server-Fehler. Wir schauen uns das an — bitte kurz später erneut versuchen.'
        : 'Antrag konnte nicht verarbeitet werden.';
  }
}
