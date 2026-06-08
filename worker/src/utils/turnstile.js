/* ═══════════════════════════════════════════════════════════════════
   Cloudflare Turnstile siteverify.
   ───────────────────────────────────────────────────────────────────
   Failure-mode: **fail closed**. Unreachable / malformed / expired
   token → reject. Single-use via per-call idempotency_key.

   Required secret: TURNSTILE_SECRET_KEY.
   ═══════════════════════════════════════════════════════════════════ */

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * @param {object} env
 * @param {string} token        From the cf-turnstile-response field.
 * @param {{ action?: string, ip?: string }} [opts]
 * @returns {Promise<{ ok: boolean, reason?: string, hostname?: string, action?: string }>}
 */
export async function verifyTurnstile(env, token, opts = {}) {
  const secret = env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return { ok: false, reason: 'turnstile not configured' };
  }
  if (!token || typeof token !== 'string' || token.length < 10) {
    return { ok: false, reason: 'missing token' };
  }

  const form = new FormData();
  form.set('secret', secret);
  form.set('response', token);
  form.set('idempotency_key', crypto.randomUUID());
  if (opts.ip) form.set('remoteip', opts.ip);

  let resp;
  try {
    resp = await fetch(SITEVERIFY, { method: 'POST', body: form });
  } catch (e) {
    console.error('turnstile fetch failed', e);
    return { ok: false, reason: 'verify unreachable' };
  }

  let data;
  try { data = await resp.json(); }
  catch { return { ok: false, reason: 'verify malformed response' }; }

  if (!data.success) {
    const codes = Array.isArray(data['error-codes']) ? data['error-codes'].join(',') : '?';
    return { ok: false, reason: `verify rejected (${codes})` };
  }
  if (opts.action && data.action !== opts.action) {
    return { ok: false, reason: `action mismatch (got ${data.action}, want ${opts.action})` };
  }
  return { ok: true, hostname: data.hostname, action: data.action };
}
