/**
 * Client API for ticket display.
 *
 *   GET /api/event/ticket/:token    → fetchTicket(token)
 *   GET /api/event/session/:id      → fetchSession(sessionId)
 *
 * Both endpoints are public-read but the JWT in `/ticket/:token` keeps
 * the payload non-enumerable (no PII in the token, expires shortly
 * after the event date).
 */

import type { SpielstilId } from './spielstile';

const DEFAULT_BASE = 'https://api.ritmopadel.shop/api/event';

function baseUrl(): string {
  const fromEnv = (import.meta.env.VITE_EVENT_API_BASE as string | undefined) ?? '';
  return (fromEnv || DEFAULT_BASE).replace(/\/$/, '');
}

export interface TicketView {
  ticketId: string;
  eventId: string;
  eventName: string;
  eventDateIso: string;
  eventDoorsAt: string | null;
  venueLine: string;
  tier: 'spieler' | 'zuschauer';
  tierLabel: string;
  tierExtras: string[];
  attendeeName: string;
  spielstilId: SpielstilId | null;
  refunded: boolean;
  transferred: boolean;
  checkedIn: boolean;
  createdAt: string;
}

export interface TicketTokenView extends TicketView {
  token: string;
}

export type SessionResponse =
  | { status: 'pending'; message: string }
  | { status: 'processing'; message: string }
  | { status: 'ready'; tickets: TicketTokenView[] };

/**
 * Fetch ticket display data given a signed token (from URL or QR).
 * Returns null if 401/404 — caller decides how to render the error.
 */
export async function fetchTicket(token: string): Promise<
  { ok: true; ticket: TicketView } | { ok: false; code: string; message: string }
> {
  const url = `${baseUrl()}/ticket/${encodeURIComponent(token)}`;
  let resp: Response;
  try { resp = await fetch(url); }
  catch { return { ok: false, code: 'network', message: 'Server nicht erreichbar.' }; }
  const data = await safeJson(resp);
  if (!resp.ok || !data?.ticketId) {
    return { ok: false, code: data?.code || `http_${resp.status}`, message: data?.error || 'Ticket nicht gefunden.' };
  }
  return { ok: true, ticket: data as TicketView };
}

/**
 * Poll a Stripe session for its issued tickets. Returns the latest
 * status. Frontend should loop until `status === 'ready'` or it gives up.
 */
export async function fetchSession(sessionId: string): Promise<SessionResponse> {
  const url = `${baseUrl()}/session/${encodeURIComponent(sessionId)}`;
  let resp: Response;
  try { resp = await fetch(url); }
  catch { return { status: 'pending', message: 'Server nicht erreichbar.' }; }
  const data = await safeJson(resp);
  if (resp.status === 202) {
    return { status: data?.status === 'processing' ? 'processing' : 'pending', message: data?.message || '' };
  }
  if (resp.ok && Array.isArray(data?.tickets)) {
    return { status: 'ready', tickets: data.tickets };
  }
  // Treat any other failure as "pending" so the page keeps polling — eventual consistency.
  return { status: 'pending', message: data?.error || 'Unbekannter Status.' };
}

async function safeJson(resp: Response): Promise<any> {
  try { return await resp.json(); }
  catch { return null; }
}
