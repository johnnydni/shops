/* ═══════════════════════════════════════════════════════════════════
   POST /api/event/webhook
   ───────────────────────────────────────────────────────────────────
   Stripe webhook receiver for the event ticketing system.

   Verifies the signature (same Web-Crypto HMAC pattern as the shop
   webhook), then dispatches per event type:

     checkout.session.completed
       1. Idempotency check (KV idem:<sessionId>) — bail if already seen
       2. Parse metadata (event_id, tier, quantity, attendees, spielstil_token)
       3. Verify spielstil_token (audience='spielstil') if present
       4. Re-check inventory cap; if oversold (rare race), auto-refund + 500
       5. For each attendee, create a TicketRecord with signed ticket JWT
       6. Persist to KV; update email index; bump counters; release hold
       7. Send confirmation email via Resend (best-effort, async-but-awaited)

     charge.refunded
       - Find tickets linked to the payment_intent and mark refunded
       - Decrement counters

     checkout.session.expired
       - Release any matching hold

   Returns 200 OK to Stripe in all expected cases (otherwise Stripe
   keeps retrying for 3 days — only legitimate signature failures and
   our own bugs should 4xx/5xx).
   ═══════════════════════════════════════════════════════════════════ */

import { getEvent, getTier } from '../eventCatalog.js';
import { signToken, tryVerifyToken, hashEmail } from '../utils/jwt.js';
import {
  putTicket,
  getTicket,
  addToEmailIndex,
  bumpCounts,
  getCounts,
  releaseHold,
  markProcessed,
  getEmailIndex,
} from '../utils/kv.js';
import { sendEmail } from '../utils/resend.js';
import { buildConfirmationEmail } from './emails.js';

const TOLERANCE_SECONDS = 300;  // 5 min

export async function handleEventWebhook(request, env) {
  if (request.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }
  const sig = request.headers.get('Stripe-Signature') || '';
  const rawBody = await request.text();

  const verified = await verifyStripeSignature(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
  if (!verified.ok) {
    console.warn('event webhook signature failed:', verified.reason);
    return new Response('signature verification failed', { status: 400 });
  }

  let event;
  try { event = JSON.parse(rawBody); }
  catch { return new Response('invalid json', { status: 400 }); }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await onCheckoutCompleted(event.data.object, env);
        break;
      case 'checkout.session.expired':
        await onCheckoutExpired(event.data.object, env);
        break;
      case 'charge.refunded':
        await onChargeRefunded(event.data.object, env);
        break;
      default:
        console.log(`· event-webhook unhandled ${event.type}`);
    }
  } catch (e) {
    // We log + 200 so Stripe doesn't retry on our bugs. Real signature
    // failures are 400 above; this branch is "we got a valid event but
    // hit an unexpected exception while processing it".
    console.error('event-webhook handler error', event.type, e?.stack || e);
    return new Response(JSON.stringify({ received: true, warn: 'internal' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/* ───────────────────────────────────────────────────────────────────
   checkout.session.completed — issue tickets
   ─────────────────────────────────────────────────────────────────── */

async function onCheckoutCompleted(session, env) {
  // Only handle sessions that came from our event-buy flow
  const md = session.metadata || {};
  if (md.source !== 'ritmopadel.shop/event') {
    // Shop checkouts use their own webhook handler (kept separate).
    return;
  }

  // Idempotency
  const first = await markProcessed(env.TICKETS, session.id);
  if (!first) {
    console.log(`· event-webhook duplicate ${session.id} — skipping`);
    return;
  }

  const eventId = md.event_id;
  const tier    = md.tier;
  const quantity = parseInt(md.quantity, 10);
  const buyerEmailHash = md.buyer_email_hash;
  const attendeesCompact = md.attendees || '';
  const spielstilToken = md.spielstil_token || '';

  if (!eventId || !tier || !Number.isFinite(quantity) || !buyerEmailHash) {
    console.error('event-webhook missing metadata', session.id, md);
    return;
  }

  let eventDef, tierDef;
  try {
    eventDef = getEvent(eventId);
    tierDef  = getTier(eventDef, tier);
  } catch (e) {
    console.error('event-webhook bad event/tier in metadata', e?.message);
    return;
  }

  // Verify spielstil token (if expected)
  let spielstilId = null;
  if (tierDef.includesQuiz) {
    if (!spielstilToken) {
      console.error('event-webhook spieler ticket without spielstil_token', session.id);
      return;
    }
    const payload = await tryVerifyToken(env, 'spielstil', spielstilToken);
    if (!payload || payload.sub !== buyerEmailHash || payload.eventId !== eventId) {
      console.error('event-webhook spielstil token invalid', session.id);
      return;
    }
    spielstilId = payload.winner;
  }

  // Buyer email — Stripe is the source of truth here (we used customer_email at session create)
  const buyerEmail = (session.customer_details?.email || session.customer_email || '').trim().toLowerCase();
  if (!buyerEmail) {
    console.error('event-webhook missing buyer email', session.id);
    return;
  }

  // Re-check inventory under lock — KV is eventually consistent so a
  // race is rare but possible. If overshoot, refund and bail.
  if (tierDef.capacity != null) {
    const counts = await getCounts(env.TICKETS, eventId);
    const projected = counts[tier] + quantity;
    if (projected > tierDef.capacity) {
      console.warn(`event-webhook OVERSOLD ${eventId}/${tier} — refunding ${session.id}`);
      await refundStripeSession(env, session);
      await releaseHold(env.TICKETS, eventId, buyerEmailHash);
      await bumpCounts(env.TICKETS, eventId, { held: -quantity });
      return;
    }
  }

  // Parse attendees
  const attendees = parseAttendeesCompact(attendeesCompact);
  if (attendees.length !== quantity) {
    console.error('event-webhook attendees mismatch', session.id, attendees.length, quantity);
    return;
  }

  // Pre-compute event-date based JWT expiry
  const eventDateMs = Date.parse(eventDef.date);
  const ticketExpSec = Math.floor((eventDateMs + 12 * 60 * 60 * 1000) / 1000);

  // Mint N tickets
  const customerId = session.customer || '';
  const paymentIntentId = session.payment_intent || '';
  const ticketIds = [];
  const ticketsForEmail = [];

  for (const a of attendees) {
    const id = crypto.randomUUID();
    const ticket = {
      id,
      eventId,
      tier,
      attendeeName: `${a.firstName} ${a.lastName}`.trim(),
      buyerEmail,
      buyerEmailHash,
      stripeSessionId:       session.id,
      stripeCustomerId:      customerId,
      stripePaymentIntentId: paymentIntentId,
      spielstilId:           spielstilId || undefined,
      priceCents:            tierDef.priceCents,
      createdAt:             new Date().toISOString(),
    };
    await putTicket(env.TICKETS, ticket, eventDef.date);
    ticketIds.push(id);

    // Sign ticket JWT for QR code — no PII, only IDs
    const ticketToken = await signToken(env, 'ticket',
      { tid: id, eid: eventId },
      { expiresAt: ticketExpSec }
    );
    ticketsForEmail.push({
      attendeeName: ticket.attendeeName,
      ticketToken,
      spielstilId:  spielstilId || undefined,
    });
  }

  // Email index + counters
  await addToEmailIndex(env.TICKETS, eventId, buyerEmailHash, ticketIds, eventDef.date);
  await bumpCounts(env.TICKETS, eventId, { [tier]: quantity, held: -quantity });
  await releaseHold(env.TICKETS, eventId, buyerEmailHash);

  // Signed refund link — Phase 6 endpoint will accept it
  const refundToken = await signToken(env, 'magic',
    { intent: 'refund', sid: session.id, eid: eventId, sub: buyerEmailHash },
    { expiresIn: '14d' }
  );
  const refundLink = `${env.TICKET_BASE_URL.replace(/\/ticket$/, '')}/ticket/refund/${refundToken}`;

  // Confirmation email
  const buyerFirst = attendees[0]?.firstName || 'dort';
  const eventDateLong = formatEventDate(eventDef.date);
  const venueLine = 'Padel Haus · Großmehring';
  const totalEur = (tierDef.priceCents * quantity) / 100;

  const { subject, html, text } = buildConfirmationEmail({
    eventName: eventDef.name,
    eventDateLong,
    venueLine,
    buyerFirstName: buyerFirst,
    tier,
    ticketBaseUrl: env.TICKET_BASE_URL,
    tickets: ticketsForEmail,
    tierExtras: eventDef.perTierExtras?.[tier] || [],
    refundLink,
    totalEur,
  });

  const sendRes = await sendEmail(env, {
    to: buyerEmail,
    subject,
    html,
    text,
    tags: ['event-confirmation', `event-${eventId}`, `tier-${tier}`],
    idempotencyKey: `confirm:${session.id}`,
  });
  if (!sendRes.ok) {
    console.error('event-webhook resend failed', sendRes.error, session.id);
    // Tickets are persisted — user can resend from /event/ticket/:token later.
  }

  console.log(`✓ event-webhook issued ${ticketIds.length}× ${tier} ticket(s) for ${session.id}`);
}

/* ───────────────────────────────────────────────────────────────────
   charge.refunded — invalidate matching tickets
   ─────────────────────────────────────────────────────────────────── */

async function onChargeRefunded(charge, env) {
  // Find tickets by payment_intent. We don't have a PI → ticket index
  // (would be expensive), so we walk the email index of the customer
  // whose charge this is.
  const piId = charge.payment_intent;
  const customerEmail = charge.billing_details?.email || charge.receipt_email || '';
  if (!piId || !customerEmail) {
    console.warn('charge.refunded missing pi or email');
    return;
  }
  const buyerEmailHash = await hashEmail(env, customerEmail);

  // We don't know which event the ticket belongs to from the charge alone.
  // For RITMO's one-event-at-a-time scope, iterate the catalog.
  const { EVENTS } = await import('../eventCatalog.js');
  let foundAny = false;
  for (const eid of Object.keys(EVENTS)) {
    const idx = await getEmailIndex(env.TICKETS, eid, buyerEmailHash);
    if (!idx?.ticketIds?.length) continue;
    for (const tid of idx.ticketIds) {
      const t = await getTicket(env.TICKETS, eid, tid);
      if (!t || t.refunded) continue;
      if (t.stripePaymentIntentId !== piId) continue;
      const updated = { ...t, refunded: true, refundedAt: new Date().toISOString() };
      await putTicket(env.TICKETS, updated, EVENTS[eid].date);
      await bumpCounts(env.TICKETS, eid, { [t.tier]: -1 });
      foundAny = true;
      console.log(`✓ event-webhook refunded ticket ${tid}`);
    }
  }
  if (!foundAny) console.warn('charge.refunded matched no tickets', piId);
}

/* ───────────────────────────────────────────────────────────────────
   checkout.session.expired — release hold
   ─────────────────────────────────────────────────────────────────── */

async function onCheckoutExpired(session, env) {
  const md = session.metadata || {};
  if (md.source !== 'ritmopadel.shop/event') return;
  const eventId = md.event_id;
  const buyerEmailHash = md.buyer_email_hash;
  const quantity = parseInt(md.quantity, 10);
  if (!eventId || !buyerEmailHash || !Number.isFinite(quantity)) return;
  await releaseHold(env.TICKETS, eventId, buyerEmailHash);
  await bumpCounts(env.TICKETS, eventId, { held: -quantity });
  console.log(`· event-webhook session expired ${session.id} — hold released`);
}

/* ───────────────────────────────────────────────────────────────────
   Helpers
   ─────────────────────────────────────────────────────────────────── */

async function refundStripeSession(env, session) {
  const pi = session.payment_intent;
  if (!pi) { console.warn('cannot refund — no payment_intent'); return; }
  try {
    const form = new URLSearchParams();
    form.set('payment_intent', pi);
    form.set('reason', 'requested_by_customer');
    form.set('metadata[reason]', 'oversold_autorefund');
    const resp = await fetch('https://api.stripe.com/v1/refunds', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: form.toString(),
    });
    if (!resp.ok) console.error('auto-refund failed', await resp.text());
  } catch (e) {
    console.error('auto-refund exception', e);
  }
}

function parseAttendeesCompact(str) {
  if (!str || typeof str !== 'string') return [];
  return str.split(';').map((seg) => {
    const [firstName = '', lastName = ''] = seg.split('|');
    return { firstName: firstName.trim(), lastName: lastName.trim() };
  }).filter((a) => a.firstName || a.lastName);
}

function formatEventDate(iso) {
  const d = new Date(iso);
  const dayNames = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
  const monthNames = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  return `${dayNames[d.getUTCDay()]}, ${d.getUTCDate()}. ${monthNames[d.getUTCMonth()]} ${d.getUTCFullYear()} · ab 18 Uhr`;
}

/* ───────── Stripe signature verification (Web Crypto) ───────── */

async function verifyStripeSignature(rawBody, header, secret) {
  if (!secret) return { ok: false, reason: 'no secret configured' };
  if (!header) return { ok: false, reason: 'no signature header' };
  const parts = Object.fromEntries(
    header.split(',').map((p) => {
      const idx = p.indexOf('=');
      return [p.slice(0, idx), p.slice(idx + 1)];
    })
  );
  const ts = parts.t, v1 = parts.v1;
  if (!ts || !v1) return { ok: false, reason: 'malformed header' };

  const now = Math.floor(Date.now() / 1000);
  const tsNum = parseInt(ts, 10);
  if (!Number.isFinite(tsNum) || Math.abs(now - tsNum) > TOLERANCE_SECONDS) {
    return { ok: false, reason: 'timestamp outside tolerance' };
  }
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const macBuf = await crypto.subtle.sign('HMAC', key, enc.encode(`${ts}.${rawBody}`));
  const expected = bufToHex(macBuf);
  if (!timingSafeEqual(expected, v1)) return { ok: false, reason: 'signature mismatch' };
  return { ok: true };
}

function bufToHex(buf) {
  const b = new Uint8Array(buf);
  let h = '';
  for (let i = 0; i < b.length; i++) h += b[i].toString(16).padStart(2, '0');
  return h;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let mm = 0;
  for (let i = 0; i < a.length; i++) mm |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mm === 0;
}
