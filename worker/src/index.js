/* ═══════════════════════════════════════════════════════════════════
   RITMO Shop + Event-Ticketing — Cloudflare Worker entry
   ───────────────────────────────────────────────────────────────────
   Routes:
     OPTIONS *                CORS preflight (all paths)
     GET  /api/health         Liveness probe

     POST /api/checkout       Shop — Stripe Checkout Session
     POST /api/webhook        Shop — Stripe webhook receiver

     POST /api/event/checkout  Event — Stripe Checkout Session w/ ticket metadata
     POST /api/event/webhook   Event — Stripe webhook → ticket issuance

   Secrets (`wrangler secret put …`):
     STRIPE_SECRET_KEY        sk_test_… or sk_live_…
     STRIPE_WEBHOOK_SECRET    whsec_…           (shared by both webhooks)
     EVENT_JWT_SECRET         >=32 random bytes (jose signing key)
     EMAIL_HASH_PEPPER        >=32 random bytes (KV email-index pepper)
     TURNSTILE_SECRET_KEY     CF Turnstile site secret
     RESEND_API_KEY           Resend API key
     ADMIN_CSV_SECRET         doors-day CSV export auth

   Public vars (wrangler.toml [vars]):
     SUCCESS_URL, CANCEL_URL                shop
     EVENT_SUCCESS_URL, EVENT_CANCEL_URL    event flow redirects
     TICKET_BASE_URL                        QR-link base
     ALLOWED_ORIGIN, RESEND_FROM, TURNSTILE_SITE_KEY
   ═══════════════════════════════════════════════════════════════════ */

import { handleCheckout }       from './checkout.js';
import { handleWebhook }        from './webhook.js';
import { handleEventCheckout }  from './event/checkout.js';
import { handleEventWebhook }   from './event/webhook.js';
import { preflight, jsonResponse, corsHeaders } from './cors.js';

export default {
  async fetch(request, env /*, ctx */) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return preflight(request, env);

    if (url.pathname === '/api/health') {
      return jsonResponse({ ok: true, ts: Date.now() }, {}, request, env);
    }

    // Shop endpoints (unchanged)
    if (url.pathname === '/api/checkout') return handleCheckout(request, env);
    if (url.pathname === '/api/webhook')  return handleWebhook(request, env);

    // Event ticket endpoints
    if (url.pathname === '/api/event/checkout') return handleEventCheckout(request, env);
    if (url.pathname === '/api/event/webhook')  return handleEventWebhook(request, env);

    return new Response('not found', {
      status: 404,
      headers: corsHeaders(request, env),
    });
  },
};
