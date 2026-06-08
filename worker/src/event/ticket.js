/* ═══════════════════════════════════════════════════════════════════
   Read endpoints for the personalised ticket display.
   ───────────────────────────────────────────────────────────────────
     GET /api/event/ticket/:token       Verify ticket JWT → return display data
     GET /api/event/session/:sessionId  Lookup tickets for a Stripe session
                                        (used by /event/success polling)
   ═══════════════════════════════════════════════════════════════════ */

import { jsonResponse } from '../cors.js';
import { getEvent } from '../eventCatalog.js';
import { tryVerifyToken, signToken } from '../utils/jwt.js';
import { getTicket, getSessionRecord } from '../utils/kv.js';

/* ───────── GET /api/event/ticket/:token ───────── */

export async function handleTicketRead(request, env, token) {
  if (request.method !== 'GET') return err(request, env, 405, 'method_not_allowed', 'GET required');
  if (!token) return err(request, env, 400, 'missing_token', 'token required');

  const payload = await tryVerifyToken(env, 'ticket', token);
  if (!payload) {
    return err(request, env, 401, 'token_invalid', 'Ticket-Token ungültig oder abgelaufen.');
  }
  const ticketId = String(payload.tid || '');
  const eventId  = String(payload.eid || '');
  if (!ticketId || !eventId) {
    return err(request, env, 400, 'token_malformed', 'Token fehlerhaft.');
  }

  let event;
  try { event = getEvent(eventId); }
  catch { return err(request, env, 404, 'unknown_event', 'Event unbekannt.'); }

  const ticket = await getTicket(env.TICKETS, eventId, ticketId);
  if (!ticket) return err(request, env, 404, 'ticket_not_found', 'Ticket nicht gefunden.');

  return jsonResponse(toTicketView(event, ticket), { status: 200 }, request, env);
}

/* ───────── GET /api/event/session/:sessionId ───────── */

export async function handleSessionLookup(request, env, sessionId) {
  if (request.method !== 'GET') return err(request, env, 405, 'method_not_allowed', 'GET required');
  if (!sessionId || sessionId.length > 200 || !sessionId.startsWith('cs_')) {
    return err(request, env, 400, 'invalid_session', 'session id invalid');
  }

  const record = await getSessionRecord(env.TICKETS, sessionId);
  if (!record) {
    // Webhook hasn't fired yet. Frontend polls; we return 202.
    return jsonResponse(
      { status: 'pending', message: 'Bestätigung läuft …' },
      { status: 202 }, request, env
    );
  }
  if (!record.eventId || !Array.isArray(record.ticketIds) || record.ticketIds.length === 0) {
    return jsonResponse(
      { status: 'processing', message: 'Tickets werden ausgestellt …' },
      { status: 202 }, request, env
    );
  }

  let event;
  try { event = getEvent(record.eventId); }
  catch { return err(request, env, 404, 'unknown_event', 'Event unbekannt.'); }

  const eventDateMs = Date.parse(event.date);
  const ticketExpSec = Math.floor((eventDateMs + 12 * 60 * 60 * 1000) / 1000);

  const tickets = [];
  for (const tid of record.ticketIds) {
    const t = await getTicket(env.TICKETS, record.eventId, tid);
    if (!t) continue;
    const token = await signToken(env, 'ticket',
      { tid: t.id, eid: record.eventId },
      { expiresAt: ticketExpSec }
    );
    tickets.push({
      token,
      ...toTicketView(event, t),
    });
  }

  return jsonResponse({ status: 'ready', tickets }, { status: 200 }, request, env);
}

/* ───────── Helpers ───────── */

/**
 * Serialise a TicketRecord into the public display shape — strictly
 * what's needed to render the ticket card. No PII beyond the
 * attendee name (which is on the printed ticket anyway).
 */
function toTicketView(event, ticket) {
  return {
    ticketId:        ticket.id,
    eventId:         event.id,
    eventName:       event.name,
    eventDateIso:    event.date,
    eventDoorsAt:    event.doorsAt || null,
    venueLine:       'Padel Haus · Großmehring',
    tier:            ticket.tier,
    tierLabel:       event.tiers?.[ticket.tier]?.label || ticket.tier,
    tierExtras:      event.perTierExtras?.[ticket.tier] || [],
    attendeeName:    ticket.attendeeName,
    spielstilId:     ticket.spielstilId || null,
    refunded:        !!ticket.refunded,
    transferred:     !!ticket.transferred,
    checkedIn:       !!ticket.checkedIn,
    createdAt:       ticket.createdAt,
  };
}

function err(request, env, status, code, message) {
  return jsonResponse({ code, error: message }, { status }, request, env);
}
