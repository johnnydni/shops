/* ═══════════════════════════════════════════════════════════════════
   POST /api/webhook
   ───────────────────────────────────────────────────────────────────
   Stripe webhook receiver. Verifies the signature using the Web
   Crypto API (no Node deps), then dispatches on event type.

   Stripe sends `Stripe-Signature: t=<ts>,v1=<hex>[,v0=...]`.
   Spec: https://stripe.com/docs/webhooks/signatures
   ═══════════════════════════════════════════════════════════════════ */

const TOLERANCE_SECONDS = 300;  // 5 min — matches Stripe's recommendation

export async function handleWebhook(request, env) {
  if (request.method !== 'POST') {
    return new Response('method not allowed', { status: 405 });
  }

  const sig = request.headers.get('Stripe-Signature') || '';
  const rawBody = await request.text();

  const verified = await verifyStripeSignature(rawBody, sig, env.STRIPE_WEBHOOK_SECRET);
  if (!verified.ok) {
    console.warn('webhook signature failed:', verified.reason);
    return new Response('signature verification failed', { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (e) {
    return new Response('invalid json', { status: 400 });
  }

  // Dispatch — extend as needed. For v1 we just log the order summary.
  switch (event.type) {
    case 'checkout.session.completed': {
      const s = event.data.object;
      const email = s.customer_details?.email || s.customer_email || '(no email)';
      const total = ((s.amount_total || 0) / 100).toFixed(2);
      console.log(`✓ ORDER ${s.id} · ${email} · ${total} ${s.currency?.toUpperCase()}`);
      // TODO (next iteration): persist to KV/D1, send merchant email,
      //                       trigger fulfillment, etc.
      break;
    }
    case 'checkout.session.expired':
    case 'payment_intent.payment_failed':
      console.log(`✗ ${event.type} ${event.data.object.id}`);
      break;
    default:
      console.log(`· unhandled event ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

/* ───────── Signature verification (Web Crypto) ─────────────────── */
async function verifyStripeSignature(rawBody, header, secret) {
  if (!secret) return { ok: false, reason: 'no secret configured' };
  if (!header) return { ok: false, reason: 'no signature header' };

  // Parse: "t=123,v1=abc[,v0=...]"
  const parts = Object.fromEntries(
    header.split(',').map(p => {
      const idx = p.indexOf('=');
      return [p.slice(0, idx), p.slice(idx + 1)];
    })
  );
  const ts = parts.t;
  const v1 = parts.v1;
  if (!ts || !v1) return { ok: false, reason: 'malformed header' };

  // Replay-protection: reject if timestamp is too old (or in the future)
  const now = Math.floor(Date.now() / 1000);
  const tsNum = parseInt(ts, 10);
  if (!Number.isFinite(tsNum) || Math.abs(now - tsNum) > TOLERANCE_SECONDS) {
    return { ok: false, reason: 'timestamp outside tolerance' };
  }

  // Compute HMAC-SHA256(secret, `${ts}.${rawBody}`)
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const macBuf = await crypto.subtle.sign('HMAC', key, enc.encode(`${ts}.${rawBody}`));
  const expected = bufferToHex(macBuf);

  if (!timingSafeEqual(expected, v1)) {
    return { ok: false, reason: 'signature mismatch' };
  }
  return { ok: true };
}

function bufferToHex(buf) {
  const bytes = new Uint8Array(buf);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
