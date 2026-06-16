/**
 * Client API for the pre-sales waitlist.
 *
 *   POST /api/event/waitlist  — submit name + email + tier
 *
 * Defense-in-depth on the device side:
 *  - localStorage flag `ritmo.waitlist.<eventId>` blocks a second submit
 *    from the same browser. The Worker also enforces an IP rate-limit,
 *    so this is UX-only — trust boundary is the server.
 *  - Honeypot field travels in the payload (must be empty).
 */

const DEFAULT_BASE = 'https://api.ritmopadel.shop/api/event';

function baseUrl(): string {
  const fromEnv = (import.meta.env.VITE_EVENT_API_BASE as string | undefined) ?? '';
  return (fromEnv || DEFAULT_BASE).replace(/\/$/, '');
}

export type WaitlistTier = 'spieler' | 'zuschauer';

export interface WaitlistPayload {
  eventId: string;
  tier: WaitlistTier;
  firstName: string;
  lastName: string;
  email: string;
  honeypot: string;
}

export interface WaitlistResponse {
  ok: boolean;
  message: string;
  code?: string;
}

export async function submitWaitlist(payload: WaitlistPayload): Promise<WaitlistResponse> {
  const url = `${baseUrl()}/waitlist`;
  let resp: Response;
  try {
    resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    return {
      ok: false,
      message: 'Server nicht erreichbar. Bitte später erneut versuchen.',
    };
  }
  let data: { ok?: boolean; message?: string; code?: string; error?: string } = {};
  try { data = await resp.json(); } catch { /* ignore */ }
  if (!resp.ok) {
    return {
      ok: false,
      code: data.code,
      message: data.error || 'Eintrag fehlgeschlagen. Bitte später erneut versuchen.',
    };
  }
  return {
    ok: true,
    message: data.message || 'Du stehst auf der Warteliste.',
  };
}

/* ───────── Device lock (localStorage) ───────── */

const KEY = (eventId: string) => `ritmo.waitlist.${eventId}`;

export function hasDeviceSignedUp(eventId: string): boolean {
  if (typeof localStorage === 'undefined') return false;
  try { return localStorage.getItem(KEY(eventId)) === '1'; }
  catch { return false; }
}

export function markDeviceSignedUp(eventId: string): void {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.setItem(KEY(eventId), '1'); }
  catch { /* ignore */ }
}
