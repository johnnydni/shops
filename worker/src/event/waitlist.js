/* ═══════════════════════════════════════════════════════════════════
   POST /api/event/waitlist
   GET  /api/event/admin/waitlist.txt
   ───────────────────────────────────────────────────────────────────
   Pre-sales waitlist. Folks drop their name+email and pick a tier
   (Spieler or Zuschauer). When tickets go live on Playtomic, list-
   holders are notified first.

   Storage:
     KV key  wl:<eventId>:<uuid>   → JSON { firstName, lastName,
                                            email, tier, ip, createdAt }
     Stored 12 months. No fancy indexes — for the admin txt export we
     walk the prefix.

   Anti-abuse:
     IP rate-limit:  3 entries per IP per 24h via wl:rate:<ip> (counter)
     Honeypot:       silent OK
     Email regex:    basic shape check, no SMTP verify
     Frontend also stamps a localStorage "device-flag" so the form
     refuses to submit a second time from the same browser. KV-side
     rate-limit is the trust boundary.

   Admin txt-dump:
     GET /api/event/admin/waitlist.txt?event=<id>
     Header: X-Admin-Token: <ADMIN_CSV_SECRET>
     Response: text/plain — one record per line, tab-separated
       <createdAt>\t<tier>\t<firstName>\t<lastName>\t<email>
     Plus a header line. Sorted oldest-first.
   ═══════════════════════════════════════════════════════════════════ */

import { jsonResponse } from '../cors.js';
import { getEvent } from '../eventCatalog.js';
import { sendEmail } from '../utils/resend.js';
import { buildWaitlistNotification } from './emails.js';

const TTL_ENTRY     = 365 * 24 * 60 * 60;  // 12 months
const TTL_RATE      = 24 * 60 * 60;        // 24h window
const MAX_PER_IP    = 3;                   // 3 entries per IP per window
const EMAIL_RE      = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE       = /^[\p{L}\p{M}\s'`’.\-]{1,80}$/u;

/* ───────── POST /api/event/waitlist ───────── */

export async function handleWaitlistSubmit(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ code: 'method_not_allowed', error: 'POST required' }, { status: 405 }, request, env);
  }

  let body;
  try { body = await request.json(); }
  catch { return jsonResponse({ code: 'invalid_json', error: 'invalid json' }, { status: 400 }, request, env); }

  const v = validate(body);
  if (!v.ok) return jsonResponse({ code: v.code, error: v.message }, { status: 400 }, request, env);

  // Honeypot — silent OK so bots don't learn the trap
  if (v.payload.honeypot !== '') {
    return jsonResponse({ ok: true, message: 'Eintrag gespeichert.' }, { status: 200 }, request, env);
  }

  // Event must exist (but don't expose which ids are valid for enumeration)
  let eventCfg;
  try { eventCfg = getEvent(v.payload.eventId); }
  catch {
    return jsonResponse({ code: 'unknown_event', error: 'Unbekanntes Event.' }, { status: 400 }, request, env);
  }

  // Per-IP rate-limit (24h window)
  const ip = clientIp(request);
  const rateKey = `wl:rate:${ip}`;
  const current = parseInt((await env.TICKETS.get(rateKey)) || '0', 10) || 0;
  if (current >= MAX_PER_IP) {
    return jsonResponse(
      { code: 'rate_limited', error: 'Zu viele Anfragen von dieser IP. Bitte später erneut versuchen.' },
      { status: 429 }, request, env
    );
  }

  // Persist entry
  const id = crypto.randomUUID();
  const record = {
    firstName: v.payload.firstName,
    lastName:  v.payload.lastName,
    email:     v.payload.email,
    tier:      v.payload.tier,
    ip,
    createdAt: new Date().toISOString(),
  };
  await env.TICKETS.put(
    `wl:${v.payload.eventId}:${id}`,
    JSON.stringify(record),
    { expirationTtl: TTL_ENTRY }
  );
  await env.TICKETS.put(rateKey, String(current + 1), { expirationTtl: TTL_RATE });

  // Fire-and-forget owner notification (inbox-as-list pattern).
  // KV write above is the source of truth — any Resend hiccup is just
  // logged, never blocks the signup. WAITLIST_NOTIFY_TO unset → skip.
  if (env.WAITLIST_NOTIFY_TO && env.RESEND_API_KEY && env.RESEND_FROM) {
    const mail = buildWaitlistNotification({
      eventId:   v.payload.eventId,
      eventName: eventCfg?.name || v.payload.eventId,
      tier:      v.payload.tier,
      firstName: v.payload.firstName,
      lastName:  v.payload.lastName,
      email:     v.payload.email,
      ip,
      createdAt: record.createdAt,
    });
    try {
      const res = await sendEmail(env, {
        to:             env.WAITLIST_NOTIFY_TO,
        subject:        mail.subject,
        html:           mail.html,
        text:           mail.text,
        tags:           ['waitlist', `event-${v.payload.eventId}`, `tier-${v.payload.tier}`],
        idempotencyKey: `wl-notify-${id}`,
      });
      if (!res.ok) console.error('waitlist notify failed', res.error);
    } catch (e) {
      console.error('waitlist notify threw', e);
    }
  }

  return jsonResponse(
    {
      ok: true,
      message:
        'Du stehst auf der Warteliste. Sobald die Tickets über Playtomic ' +
        'live gehen, schicken wir dir eine Email — bevor der allgemeine ' +
        'Verkauf startet.',
    },
    { status: 200 }, request, env
  );
}

/* ───────── GET /api/event/admin/waitlist.txt ───────── */

export async function handleWaitlistExport(request, env) {
  if (request.method !== 'GET') {
    return new Response('method not allowed', { status: 405 });
  }
  const url = new URL(request.url);
  const eventId = url.searchParams.get('event') || '';
  const tokenIn = request.headers.get('x-admin-token') || '';

  // Admin auth — constant-time compare on short string
  const expected = env.ADMIN_CSV_SECRET || '';
  if (!expected || !timingSafeStrEqual(tokenIn, expected)) {
    return new Response('unauthorized', { status: 401 });
  }
  if (!eventId) return new Response('missing ?event=', { status: 400 });

  // Walk the prefix
  const prefix = `wl:${eventId}:`;
  const records = [];
  let cursor;
  do {
    const list = await env.TICKETS.list({ prefix, cursor, limit: 1000 });
    cursor = list.list_complete ? undefined : list.cursor;
    for (const k of list.keys) {
      const v = await env.TICKETS.get(k.name, 'json');
      if (v) records.push(v);
    }
  } while (cursor);

  records.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));

  const lines = [
    `# RITMO waitlist — event=${eventId} — ${records.length} entries — exported ${new Date().toISOString()}`,
    `# createdAt\ttier\tfirstName\tlastName\temail`,
    ...records.map((r) => [
      r.createdAt, r.tier, r.firstName, r.lastName, r.email,
    ].map((x) => String(x ?? '').replace(/\t|\n/g, ' ')).join('\t')),
  ];

  return new Response(lines.join('\n') + '\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="waitinglist-${eventId}.txt"`,
    },
  });
}

/* ───────── Helpers ───────── */

function clientIp(request) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '0.0.0.0';
}

function validate(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, code: 'invalid_payload', message: 'Eintrag ungültig.' };
  }
  const { eventId, tier, firstName, lastName, email, honeypot } = body;

  if (typeof eventId !== 'string' || eventId.length > 200) {
    return { ok: false, code: 'invalid_event', message: 'Event-ID ungültig.' };
  }
  if (tier !== 'spieler' && tier !== 'zuschauer') {
    return { ok: false, code: 'invalid_tier', message: 'Bitte Ticket-Typ wählen.' };
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return { ok: false, code: 'invalid_email', message: 'Bitte gültige Email-Adresse.' };
  }
  if (!nameOk(firstName) || !nameOk(lastName)) {
    return { ok: false, code: 'invalid_name', message: 'Bitte Vor- und Nachname angeben.' };
  }
  if (typeof honeypot !== 'string') {
    return { ok: false, code: 'invalid_payload', message: 'Eintrag unvollständig.' };
  }

  return {
    ok: true,
    payload: {
      eventId,
      tier,
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      email:     email.trim().toLowerCase(),
      honeypot,
    },
  };
}

function nameOk(s) {
  if (typeof s !== 'string') return false;
  const t = s.trim();
  if (t.length < 1 || t.length > 80) return false;
  return NAME_RE.test(t);
}

function timingSafeStrEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mm = 0;
  for (let i = 0; i < a.length; i++) mm |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mm === 0;
}
