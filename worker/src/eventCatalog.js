/* ═══════════════════════════════════════════════════════════════════
   Event catalog — server-side source of truth for ticket pricing,
   capacity, sales window, and refund policy.
   ───────────────────────────────────────────────────────────────────
   Frontend `src/data/events.ts` is marketing content. THIS file is what
   the Worker trusts. Prices in CENTS, EUR. When you change a price or
   capacity, change BOTH places. The Worker re-prices every ticket and
   re-checks every cap at checkout.
   ═══════════════════════════════════════════════════════════════════ */

export const EVENTS = {
  'ritmo-x-padel-haus-summer-sunset-2026': {
    name: 'RITMO X Padel Haus · Summer Sunset Special',
    date: '2026-07-18',
    doorsAt: '2026-07-18T18:00:00+02:00',
    salesStart: '2026-06-18T00:00:00+02:00',
    salesEnd:   '2026-07-17T23:59:59+02:00',
    refundCutoffDays: 7,
    tiers: {
      spieler: {
        label: 'Spieler-Ticket',
        priceCents: 3900,
        capacity: 22,
        includesQuiz: true,
        perEmailMax: 1,
      },
      zuschauer: {
        label: 'Zuschauer-Ticket',
        priceCents: 1500,
        capacity: null,        // "solange Vorrat reicht"
        includesQuiz: false,
        perEmailMax: 6,
      },
    },
    perEmailTotalMax: 7,
    perTierExtras: {
      spieler:   ['Welcome Aperol oder Padelé Spritz', 'Großer Burger', 'Refresh-Bar-Zugang'],
      zuschauer: ['Softdrink', 'Kleiner Burger'],
    },
  },
};

export function getEvent(eventId) {
  const ev = EVENTS[eventId];
  if (!ev) throw new EventCatalogError('unknown_event', `unknown event ${eventId}`);
  return { id: eventId, ...ev };
}

export function getTier(event, tierKey) {
  const tier = event.tiers?.[tierKey];
  if (!tier) throw new EventCatalogError('unknown_tier', `unknown tier ${tierKey}`);
  return { tier: tierKey, ...tier };
}

export function checkSalesWindow(event, nowMs = Date.now()) {
  const start = Date.parse(event.salesStart);
  const end   = Date.parse(event.salesEnd);
  if (Number.isFinite(start) && nowMs < start) {
    return { ok: false, reason: 'sales_not_started', until: event.salesStart };
  }
  if (Number.isFinite(end) && nowMs > end) {
    return { ok: false, reason: 'sales_ended', since: event.salesEnd };
  }
  return { ok: true };
}

export function checkRefundWindow(event, nowMs = Date.now()) {
  const evt = Date.parse(event.date);
  if (!Number.isFinite(evt)) return { ok: false, reason: 'bad_event_date' };
  const cutoff = evt - (event.refundCutoffDays || 0) * 24 * 60 * 60 * 1000;
  if (nowMs > cutoff) return { ok: false, reason: 'refund_window_closed', cutoffMs: cutoff };
  return { ok: true, cutoffMs: cutoff };
}

export class EventCatalogError extends Error {
  constructor(code, msg) { super(msg); this.code = code; }
}
