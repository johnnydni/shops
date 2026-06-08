/* ═══════════════════════════════════════════════════════════════════
   KV access layer — RITMO event ticket store.
   ───────────────────────────────────────────────────────────────────
   Namespace binding: TICKETS (declared in wrangler.toml)

   Key schema:
     tkt:<event-id>:<ticket-id>         the ticket itself (JSON)
     em:<event-id>:<email-hash>         email → ticket-ids index (JSON array)
     evt:<event-id>:counts              running counters (JSON) for inventory
     idem:<stripe-session-id>           webhook idempotency marker
     hold:<event-id>:<email-hash>       soft reservation (30 min) during checkout

   TTL strategy:
     tickets        → 6 months after event date
     email-index    → 6 months after event date
     idem markers   → 24h (Stripe retries up to 3 days, 1 day is enough)
     holds          → 1800s (30 min, matches Stripe Session lifetime)

   Consistency note:
     KV is eventually consistent. We use read-modify-write for counters
     and email index. Hard caps (Spieler 22) are also re-checked in the
     webhook before issuance — if overshot, refund automatically.
   ═══════════════════════════════════════════════════════════════════ */

const TTL_HOLD = 1800;             // 30 minutes
const TTL_IDEM = 24 * 60 * 60;     // 24 hours

export const ticketKey      = (eventId, tid)  => `tkt:${eventId}:${tid}`;
export const emailIndexKey  = (eventId, hash) => `em:${eventId}:${hash}`;
export const countsKey      = (eventId)       => `evt:${eventId}:counts`;
export const idemKey        = (sid)           => `idem:${sid}`;
export const holdKey        = (eventId, hash) => `hold:${eventId}:${hash}`;

/* ───────── Tickets ───────── */

/**
 * @typedef {Object} TicketRecord
 * @property {string} id
 * @property {string} eventId
 * @property {'spieler'|'zuschauer'} tier
 * @property {string} attendeeName
 * @property {string} buyerEmail
 * @property {string} buyerEmailHash
 * @property {string} stripeSessionId
 * @property {string} stripeCustomerId
 * @property {string} [stripePaymentIntentId]
 * @property {string} [spielstilId]
 * @property {number} priceCents
 * @property {string} createdAt
 * @property {boolean} [refunded]
 * @property {string} [refundedAt]
 * @property {boolean} [transferred]
 * @property {string} [transferredAt]
 * @property {boolean} [checkedIn]
 * @property {string} [checkedInAt]
 */

export async function getTicket(kv, eventId, ticketId) {
  return /** @type {TicketRecord|null} */ (await kv.get(ticketKey(eventId, ticketId), 'json'));
}

/**
 * Persist a ticket with TTL = event date + 6 months.
 * @param {KVNamespace} kv
 * @param {TicketRecord} ticket
 * @param {string} eventDateIso  yyyy-mm-dd
 */
export async function putTicket(kv, ticket, eventDateIso) {
  const expirationTtl = ttlUntilPostEvent(eventDateIso, 6);
  await kv.put(ticketKey(ticket.eventId, ticket.id), JSON.stringify(ticket), { expirationTtl });
}

/* ───────── Email index ───────── */

export async function getEmailIndex(kv, eventId, emailHash) {
  return /** @type {{ ticketIds: string[] }|null} */ (await kv.get(emailIndexKey(eventId, emailHash), 'json'));
}

export async function addToEmailIndex(kv, eventId, emailHash, ticketIds, eventDateIso) {
  const existing = (await getEmailIndex(kv, eventId, emailHash))?.ticketIds || [];
  const next = Array.from(new Set([...existing, ...ticketIds]));
  await kv.put(
    emailIndexKey(eventId, emailHash),
    JSON.stringify({ ticketIds: next }),
    { expirationTtl: ttlUntilPostEvent(eventDateIso, 6) }
  );
}

/**
 * Counts tickets this email already holds (excludes refunded + transferred).
 * @returns {Promise<{ spieler: number, zuschauer: number, total: number }>}
 */
export async function countTicketsForEmail(kv, eventId, emailHash) {
  const idx = await getEmailIndex(kv, eventId, emailHash);
  const out = { spieler: 0, zuschauer: 0, total: 0 };
  if (!idx?.ticketIds?.length) return out;
  for (const tid of idx.ticketIds) {
    const t = await getTicket(kv, eventId, tid);
    if (!t || t.refunded || t.transferred) continue;
    if (t.tier === 'spieler') out.spieler++;
    else if (t.tier === 'zuschauer') out.zuschauer++;
    out.total++;
  }
  return out;
}

/* ───────── Inventory counters ───────── */

/**
 * @typedef {Object} Counts
 * @property {number} spieler    sold (not refunded)
 * @property {number} zuschauer  sold (not refunded)
 * @property {number} held       currently in checkout-hold
 */

export async function getCounts(kv, eventId) {
  return /** @type {Counts} */ ((await kv.get(countsKey(eventId), 'json')) || { spieler: 0, zuschauer: 0, held: 0 });
}

/** Read-modify-write counter bump. Deltas can be negative. */
export async function bumpCounts(kv, eventId, delta) {
  const current = await getCounts(kv, eventId);
  const next = {
    spieler:   Math.max(0, (current.spieler   || 0) + (delta.spieler   || 0)),
    zuschauer: Math.max(0, (current.zuschauer || 0) + (delta.zuschauer || 0)),
    held:      Math.max(0, (current.held      || 0) + (delta.held      || 0)),
  };
  await kv.put(countsKey(eventId), JSON.stringify(next));
  return next;
}

/* ───────── Holds ───────── */

export async function placeHold(kv, eventId, emailHash, hold) {
  await kv.put(holdKey(eventId, emailHash), JSON.stringify(hold), { expirationTtl: TTL_HOLD });
  return { ok: true };
}
export async function readHold(kv, eventId, emailHash) {
  return await kv.get(holdKey(eventId, emailHash), 'json');
}
export async function releaseHold(kv, eventId, emailHash) {
  await kv.delete(holdKey(eventId, emailHash));
}

/* ───────── Webhook idempotency ───────── */

/**
 * Atomic-ish "claim this Stripe session" marker.
 * Returns true if this was the first call (proceed with issuance).
 * Returns false if already seen (skip — duplicate webhook delivery).
 *
 * NOTE: KV has no compare-and-swap — we read then write. Two webhook
 * deliveries arriving truly simultaneously could both see "not set"
 * and both proceed. The window is small (low-ms) and Stripe spaces its
 * retries by seconds. As a second line of defense, ticket records are
 * scoped per-attendee with deterministic IDs based on session+index
 * (see issuance code).
 */
export async function markProcessed(kv, stripeSessionId) {
  const k = idemKey(stripeSessionId);
  const prior = await kv.get(k);
  if (prior) return false;
  await kv.put(k, JSON.stringify({ at: new Date().toISOString() }), { expirationTtl: TTL_IDEM });
  return true;
}

/**
 * Update the idem record with the issued ticket IDs + which event they
 * belong to. Lets the success page poll `/api/event/session/:id` and
 * learn which tickets to display.
 *
 * @param {KVNamespace} kv
 * @param {string} stripeSessionId
 * @param {string} eventId
 * @param {string[]} ticketIds
 */
export async function setSessionTickets(kv, stripeSessionId, eventId, ticketIds) {
  const k = idemKey(stripeSessionId);
  await kv.put(
    k,
    JSON.stringify({ at: new Date().toISOString(), eventId, ticketIds }),
    { expirationTtl: TTL_IDEM }
  );
}

/**
 * @returns {Promise<{ at: string, eventId?: string, ticketIds?: string[] } | null>}
 */
export async function getSessionRecord(kv, stripeSessionId) {
  return await kv.get(idemKey(stripeSessionId), 'json');
}

/* ───────── TTL helper ───────── */

function ttlUntilPostEvent(eventDateIso, months) {
  const event = Date.parse(eventDateIso);
  if (!Number.isFinite(event)) return 30 * 24 * 60 * 60;  // defensive 30d fallback
  const targetMs = event + months * 30 * 24 * 60 * 60 * 1000;
  const ttl = Math.floor((targetMs - Date.now()) / 1000);
  return Math.max(60, ttl);
}
