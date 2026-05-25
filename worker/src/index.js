/* ═══════════════════════════════════════════════════════════════════
   RITMO Shop — Cloudflare Worker entry
   ───────────────────────────────────────────────────────────────────
   Routes:
     OPTIONS *               CORS preflight
     POST /api/checkout      Create Stripe Checkout Session (returns URL)
     POST /api/webhook       Stripe webhook receiver (signature verified)
     GET  /api/health        Liveness probe

   Secrets (set via `wrangler secret put`):
     STRIPE_SECRET_KEY       sk_test_... or sk_live_...
     STRIPE_WEBHOOK_SECRET   whsec_...

   Vars (in wrangler.toml [vars]):
     SUCCESS_URL             https://ritmopadel.shop/bestellt.html
     CANCEL_URL              https://ritmopadel.shop/abbruch.html
     ALLOWED_ORIGIN          https://ritmopadel.shop,https://www.ritmopadel.shop
   ═══════════════════════════════════════════════════════════════════ */
import { handleCheckout } from './checkout.js';
import { handleWebhook  } from './webhook.js';
import { preflight, jsonResponse, corsHeaders } from './cors.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') return preflight(request, env);

    if (url.pathname === '/api/health') {
      return jsonResponse({ ok: true, ts: Date.now() }, {}, request, env);
    }

    if (url.pathname === '/api/checkout') {
      return handleCheckout(request, env);
    }

    // Webhook MUST NOT include CORS headers (Stripe calls it server-side)
    if (url.pathname === '/api/webhook') {
      return handleWebhook(request, env);
    }

    return new Response('not found', {
      status: 404,
      headers: corsHeaders(request, env),
    });
  },
};
