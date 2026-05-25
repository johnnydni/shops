/* ═══════════════════════════════════════════════════════════════════
   POST /api/checkout
   ───────────────────────────────────────────────────────────────────
   Body:  { items: [{ id, qty, variant }] }
   Reply: { url } — Stripe Checkout Session URL to redirect to
   ═══════════════════════════════════════════════════════════════════ */
import { resolveLine } from './catalog.js';
import { jsonResponse } from './cors.js';

export async function handleCheckout(request, env) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'method not allowed' }, { status: 405 }, request, env);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: 'invalid json' }, { status: 400 }, request, env);
  }

  const items = Array.isArray(body?.items) ? body.items : null;
  if (!items || !items.length) {
    return jsonResponse({ error: 'cart is empty' }, { status: 400 }, request, env);
  }
  if (items.length > 50) {
    return jsonResponse({ error: 'too many items' }, { status: 400 }, request, env);
  }

  // Resolve every line against the server catalog. Reject if any fail.
  const resolved = [];
  for (const it of items) {
    const r = resolveLine(it);
    if (!r.ok) {
      return jsonResponse({ error: r.error }, { status: 400 }, request, env);
    }
    resolved.push(r.line);
  }

  // Build the form-encoded body Stripe expects.
  // We use the bare REST API instead of the Stripe SDK to keep the
  // Worker bundle tiny and avoid Node-compat surprises.
  const params = new URLSearchParams();
  params.set('mode', 'payment');
  params.set('success_url', `${env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`);
  params.set('cancel_url',  env.CANCEL_URL);

  // Locale + shipping (DACH free as advertised on the site)
  params.set('locale', 'de');
  params.set('shipping_address_collection[allowed_countries][0]', 'DE');
  params.set('shipping_address_collection[allowed_countries][1]', 'AT');
  params.set('shipping_address_collection[allowed_countries][2]', 'CH');

  // Free DACH shipping (matches "Versand DACH frei" on the site)
  params.set('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
  params.set('shipping_options[0][shipping_rate_data][display_name]', 'DACH-Versand');
  params.set('shipping_options[0][shipping_rate_data][fixed_amount][amount]', '0');
  params.set('shipping_options[0][shipping_rate_data][fixed_amount][currency]', 'eur');
  params.set('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]', 'business_day');
  params.set('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]', '2');
  params.set('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]', 'business_day');
  params.set('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]', '5');

  // Line items
  resolved.forEach((line, i) => {
    params.set(`line_items[${i}][quantity]`, String(line.quantity));
    params.set(`line_items[${i}][price_data][currency]`, line.price_data.currency);
    params.set(`line_items[${i}][price_data][unit_amount]`, String(line.price_data.unit_amount));
    params.set(`line_items[${i}][price_data][product_data][name]`, line.price_data.product_data.name);
    if (line.price_data.product_data.description) {
      params.set(`line_items[${i}][price_data][product_data][description]`,
        line.price_data.product_data.description);
    }
    if (line.price_data.product_data.metadata) {
      for (const [k, v] of Object.entries(line.price_data.product_data.metadata)) {
        params.set(`line_items[${i}][price_data][product_data][metadata][${k}]`, String(v));
      }
    }
  });

  // Helpful for the webhook / downstream order processing
  params.set('metadata[source]', 'ritmopadel.shop');

  // Talk to Stripe
  const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await resp.json();
  if (!resp.ok) {
    console.error('stripe error', data);
    return jsonResponse(
      { error: 'stripe error', detail: data?.error?.message || 'unknown' },
      { status: 502 }, request, env
    );
  }

  return jsonResponse({ url: data.url, id: data.id }, { status: 200 }, request, env);
}
