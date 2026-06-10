/* ═══════════════════════════════════════════════════════════════════
   POST /api/event/checkout
   ───────────────────────────────────────────────────────────────────
   Body shape (mirrors src/lib/eventCheckout.ts → CheckoutPayload):
   {
     eventId, tier, quantity,
     buyer: { firstName, lastName, email, phone?, newsletterOptIn },
     attendees: [{ firstName, lastName }],
     quiz?: { answers, startedAt, finishedAt, winner },
     honeypot, turnstileToken,
     acceptedAgb, acceptedPrivacy
   }

   Pipeline:
     1. Validate shape + honeypot
     2. Verify Turnstile (fail-closed)
     3. Look up event + tier (server-authoritative pricing)
     4. Check sales window
     5. If spieler: re-score quiz, verify timing
     6. Check per-email cap (KV)
     7. Check inventory cap (KV)
     8. Sign spielstil JWT (15min)
     9. Place 30-min hold (KV)
    10. Create Stripe Checkout Session with metadata
    11. Return { url, sessionId }

   Returns structured `{ code, error }` JSON on failure so the client
   can render specific messages (see eventCheckout.ts → translateCode).
   ═══════════════════════════════════════════════════════════════════ */

import { jsonResponse } from '../cors.js';
import { getEvent, getTier, checkSalesWindow } from '../eventCatalog.js';
import { scoreQuiz, checkQuizTiming } from '../quizCatalog.js';
import { verifyTurnstile } from '../utils/turnstile.js';
import { signToken, hashEmail } from '../utils/jwt.js';
import {
  countTicketsForEmail,
  getCounts,
  placeHold,
  bumpCounts,
} from '../utils/kv.js';

const MAX_ATTENDEES = 6;

export async function handleEventCheckout(request, env) {
  if (request.method !== 'POST') {
    return errJson(request, env, 405, 'method_not_allowed', 'POST required');
  }

  /* ── 0) Global kill switch ── */
  // BOOKING_LOCKED takes precedence over everything — including a valid
  // bypass code. Flip via wrangler.toml [vars] BOOKING_LOCKED = "1" / "".
  // The frontend mirrors this in src/lib/featureFlags.ts so the SPA
  // doesn't even render the buy flow, but a determined caller could still
  // POST to this endpoint — this guard ensures we 503 even then.
  if (String(env.BOOKING_LOCKED || '') === '1') {
    return errJson(request, env, 503, 'booking_locked',
      'Ticketverkauf aktuell gesperrt. Bitte später erneut versuchen.');
  }

  /* ── 1) Parse body ── */
  let body;
  try { body = await request.json(); }
  catch { return errJson(request, env, 400, 'invalid_json', 'invalid json'); }

  const v = validatePayload(body);
  if (!v.ok) return errJson(request, env, 400, v.code, v.message);

  /* ── 2) Honeypot ── */
  if (v.payload.honeypot !== '') {
    console.warn('honeypot triggered', { ip: clientIp(request) });
    // Return generic 400 — don't reveal the trap.
    return errJson(request, env, 400, 'honeypot_triggered', 'invalid form');
  }

  /* ── 3) Turnstile ── */
  const ts = await verifyTurnstile(env, v.payload.turnstileToken, {
    action: 'event-checkout',
    ip: clientIp(request),
  });
  if (!ts.ok) {
    return errJson(request, env, 403, 'turnstile_failed', `Sicherheits-Check: ${ts.reason}`);
  }

  /* ── 4) Event + tier ── */
  let event, tier;
  try {
    event = getEvent(v.payload.eventId);
    tier  = getTier(event, v.payload.tier);
  } catch (e) {
    return errJson(request, env, 400, e.code || 'unknown_event', e.message);
  }

  /* ── 5) Sales window (+ optional test bypass) ── */
  const sw = checkSalesWindow(event);
  if (!sw.ok) {
    const bypass = env.EVENT_BYPASS_CODE;
    const provided = typeof v.payload.bypassCode === 'string' ? v.payload.bypassCode.trim() : '';
    const bypassed = bypass && provided && timingSafeStrEqual(provided, bypass);
    if (!bypassed) {
      return errJson(request, env, 403, sw.reason, sw.reason);
    }
    console.log(`· event-checkout: sales-window bypass used (${sw.reason}) for ${v.payload.buyer.email}`);
  }

  /* ── 6) Quantity rules ── */
  const qty = v.payload.quantity;
  if (tier.tier === 'spieler' && qty !== 1) {
    return errJson(request, env, 400, 'invalid_quantity', 'Spieler: max 1 pro Email');
  }
  if (tier.tier === 'zuschauer' && (qty < 1 || qty > MAX_ATTENDEES)) {
    return errJson(request, env, 400, 'invalid_quantity', `Zuschauer: 1 bis ${MAX_ATTENDEES} pro Email`);
  }
  if (v.payload.attendees.length !== qty) {
    return errJson(request, env, 400, 'attendees_mismatch', 'Anzahl Personen passt nicht zur Menge');
  }

  /* ── 7) Quiz re-score (spieler only) ── */
  let serverSpielstil = null;
  if (tier.includesQuiz) {
    if (!v.payload.quiz) {
      return errJson(request, env, 400, 'quiz_required', 'Spielstil-Quiz erforderlich');
    }
    const timing = checkQuizTiming(v.payload.quiz.startedAt, v.payload.quiz.finishedAt);
    if (!timing.ok) {
      return errJson(request, env, 400, 'quiz_invalid', `Quiz-Timing: ${timing.reason}`);
    }
    let result;
    try { result = scoreQuiz(v.payload.quiz.answers); }
    catch { return errJson(request, env, 400, 'quiz_invalid', 'Quiz-Antworten ungültig'); }
    serverSpielstil = result.winner;
  }

  /* ── 8) Email cap (KV) ── */
  const emailHash = await hashEmail(env, v.payload.buyer.email);
  const existing = await countTicketsForEmail(env.TICKETS, event.id, emailHash);
  const wouldBeSpieler   = existing.spieler   + (tier.tier === 'spieler'   ? qty : 0);
  const wouldBeZuschauer = existing.zuschauer + (tier.tier === 'zuschauer' ? qty : 0);
  const wouldBeTotal     = existing.total     + qty;
  if (wouldBeSpieler   > event.tiers.spieler.perEmailMax)   return errJson(request, env, 409, 'email_cap_exceeded', 'Mit dieser Email wurde bereits ein Spieler-Ticket gekauft.');
  if (wouldBeZuschauer > event.tiers.zuschauer.perEmailMax) return errJson(request, env, 409, 'email_cap_exceeded', `Mit dieser Email wurden bereits genug Zuschauer-Tickets gekauft (max ${event.tiers.zuschauer.perEmailMax}).`);
  if (wouldBeTotal     > event.perEmailTotalMax)            return errJson(request, env, 409, 'email_cap_exceeded', `Mit dieser Email wurden bereits genug Tickets gekauft (max ${event.perEmailTotalMax} gesamt).`);

  /* ── 9) Inventory cap (KV counts) ── */
  const counts = await getCounts(env.TICKETS, event.id);
  if (tier.tier === 'spieler' && tier.capacity != null) {
    const projected = counts.spieler + counts.held + qty;
    if (projected > tier.capacity) {
      return errJson(request, env, 409, 'inventory_sold_out', 'Spieler-Tickets ausverkauft.');
    }
  }

  /* ── 10) Sign spielstil token ── */
  let spielstilToken = '';
  if (serverSpielstil) {
    spielstilToken = await signToken(env, 'spielstil', {
      winner:  serverSpielstil,
      sub:     emailHash,        // subject = email hash, not plaintext
      eventId: event.id,
    });
  }

  /* ── 11) Place hold (KV, 30 min TTL) ── */
  await placeHold(env.TICKETS, event.id, emailHash, {
    tier: tier.tier,
    quantity: qty,
    createdAt: new Date().toISOString(),
  });
  await bumpCounts(env.TICKETS, event.id, { held: qty });

  /* ── 12) Create Stripe Session ── */
  // Compact attendee payload for metadata (Stripe metadata is per-key
  // 500-char limit; one ticket is ~50 chars so we fit 6 comfortably).
  const attendeesCompact = v.payload.attendees
    .map((a) => `${(a.firstName || '').trim()}|${(a.lastName || '').trim()}`)
    .join(';');

  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('locale', 'de');
  params.set('customer_email', v.payload.buyer.email);
  params.set('payment_intent_data[statement_descriptor]', 'RITMO X PADEL');
  params.set('payment_intent_data[receipt_email]', v.payload.buyer.email);
  params.set('billing_address_collection', 'auto');
  params.set('success_url', `${env.EVENT_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`);
  params.set('cancel_url',  env.EVENT_CANCEL_URL);

  // Single line item — N tickets at tier price
  params.set('line_items[0][quantity]', String(qty));
  params.set('line_items[0][price_data][currency]', 'eur');
  params.set('line_items[0][price_data][unit_amount]', String(tier.priceCents));
  params.set('line_items[0][price_data][product_data][name]',
    `${event.name} · ${tier.label}`);
  params.set('line_items[0][price_data][product_data][description]',
    serverSpielstil ? `Spielstil: ${serverSpielstil.toUpperCase()}` : tier.label);

  // Metadata that the webhook will use to mint tickets
  params.set('metadata[source]',         'ritmopadel.shop/event');
  params.set('metadata[event_id]',       event.id);
  params.set('metadata[tier]',           tier.tier);
  params.set('metadata[quantity]',       String(qty));
  params.set('metadata[buyer_email_hash]', emailHash);
  params.set('metadata[attendees]',      attendeesCompact);
  params.set('metadata[newsletter_opt_in]', v.payload.buyer.newsletterOptIn ? '1' : '0');
  if (spielstilToken) {
    params.set('metadata[spielstil_token]', spielstilToken);
    params.set('metadata[spielstil]', serverSpielstil);
  }

  // Talk to Stripe
  let resp;
  try {
    resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
  } catch (e) {
    // Rollback hold — Stripe unreachable
    await bumpCounts(env.TICKETS, event.id, { held: -qty });
    console.error('stripe fetch failed', e);
    return errJson(request, env, 502, 'stripe_unreachable', 'Zahlungsanbieter aktuell nicht erreichbar.');
  }

  const data = await resp.json();
  if (!resp.ok) {
    await bumpCounts(env.TICKETS, event.id, { held: -qty });
    console.error('stripe error', data);
    return errJson(request, env, 502, 'stripe_error', data?.error?.message || 'Stripe-Fehler');
  }

  return jsonResponse(
    { url: data.url, sessionId: data.id, spielstilToken: spielstilToken || undefined },
    { status: 200 },
    request, env
  );
}

/* ───────── Helpers ───────── */

function errJson(request, env, status, code, message) {
  return jsonResponse({ code, error: message }, { status }, request, env);
}

function clientIp(request) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '';
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE  = /^[\p{L}\p{M}\s'`’.\-]{1,80}$/u;

function validatePayload(body) {
  if (!body || typeof body !== 'object') return { ok: false, code: 'invalid_payload', message: 'body required' };

  const { eventId, tier, quantity, buyer, attendees, quiz, honeypot, turnstileToken, acceptedAgb, acceptedPrivacy, bypassCode } = body;
  if (bypassCode != null && (typeof bypassCode !== 'string' || bypassCode.length > 64)) {
    return { ok: false, code: 'invalid_payload', message: 'bypassCode invalid' };
  }

  if (typeof eventId !== 'string' || eventId.length > 200) return { ok: false, code: 'invalid_event', message: 'eventId invalid' };
  if (tier !== 'spieler' && tier !== 'zuschauer')          return { ok: false, code: 'invalid_tier',  message: 'tier invalid' };
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_ATTENDEES) {
    return { ok: false, code: 'invalid_quantity', message: 'quantity invalid' };
  }

  if (!buyer || typeof buyer !== 'object') return { ok: false, code: 'invalid_buyer', message: 'buyer required' };
  if (typeof buyer.email !== 'string' || !EMAIL_RE.test(buyer.email.trim())) {
    return { ok: false, code: 'invalid_email', message: 'Bitte gültige Email-Adresse.' };
  }
  if (!nameOk(buyer.firstName) || !nameOk(buyer.lastName)) {
    return { ok: false, code: 'invalid_name', message: 'Bitte vollständigen Namen angeben.' };
  }
  if (buyer.phone != null && typeof buyer.phone !== 'string') {
    return { ok: false, code: 'invalid_buyer', message: 'phone must be string' };
  }
  if (typeof buyer.newsletterOptIn !== 'boolean') {
    return { ok: false, code: 'invalid_buyer', message: 'newsletterOptIn must be boolean' };
  }

  if (!Array.isArray(attendees) || attendees.length !== quantity) {
    return { ok: false, code: 'attendees_mismatch', message: 'attendees length must match quantity' };
  }
  for (const a of attendees) {
    if (!a || !nameOk(a.firstName) || !nameOk(a.lastName)) {
      return { ok: false, code: 'invalid_attendee', message: 'Bitte alle Namen ausfüllen.' };
    }
  }

  if (typeof honeypot !== 'string')        return { ok: false, code: 'invalid_payload', message: 'honeypot required' };
  if (typeof turnstileToken !== 'string')  return { ok: false, code: 'invalid_payload', message: 'turnstileToken required' };
  if (acceptedAgb !== true)                return { ok: false, code: 'invalid_consent', message: 'AGB-Zustimmung erforderlich.' };
  if (acceptedPrivacy !== true)            return { ok: false, code: 'invalid_consent', message: 'Datenschutz-Zustimmung erforderlich.' };

  if (quiz != null) {
    if (!Array.isArray(quiz.answers) || quiz.answers.length !== 7) {
      return { ok: false, code: 'quiz_invalid', message: 'Quiz-Antworten ungültig.' };
    }
    if (!Number.isFinite(quiz.startedAt) || !Number.isFinite(quiz.finishedAt)) {
      return { ok: false, code: 'quiz_invalid', message: 'Quiz-Timing ungültig.' };
    }
  }

  // Normalise + return
  return {
    ok: true,
    payload: {
      eventId,
      tier,
      quantity,
      buyer: {
        firstName: buyer.firstName.trim(),
        lastName:  buyer.lastName.trim(),
        email:     buyer.email.trim().toLowerCase(),
        phone:     (buyer.phone || '').trim(),
        newsletterOptIn: !!buyer.newsletterOptIn,
      },
      attendees: attendees.map((a) => ({
        firstName: a.firstName.trim(),
        lastName:  a.lastName.trim(),
      })),
      quiz: quiz ? {
        answers:    quiz.answers,
        startedAt:  quiz.startedAt,
        finishedAt: quiz.finishedAt,
      } : null,
      honeypot,
      turnstileToken,
      bypassCode: typeof bypassCode === 'string' ? bypassCode : '',
    },
  };
}

function nameOk(s) {
  if (typeof s !== 'string') return false;
  const t = s.trim();
  if (t.length < 1 || t.length > 80) return false;
  return NAME_RE.test(t);
}

/** Constant-time string compare for short codes — protects bypass code lookup. */
function timingSafeStrEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mm = 0;
  for (let i = 0; i < a.length; i++) mm |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mm === 0;
}
