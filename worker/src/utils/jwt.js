/* ═══════════════════════════════════════════════════════════════════
   JWT utilities for the RITMO event ticket system.
   ───────────────────────────────────────────────────────────────────
   Uses `jose` (Web-Crypto native — runs in Workers).

   Three distinct token audiences, so a token leaked from one channel
   cannot be misused in another:

     - spielstil   15 min — passed from Worker back to client after
                   the quiz; attached to Stripe Checkout Session
                   metadata; verified+consumed in webhook.
     - ticket      until event date + 12h — embedded in the QR code.
                   NO PII in the payload, only IDs.
     - magic       7 days — used in refund / transfer email links.

   Secret: `EVENT_JWT_SECRET` (>=32 random bytes, base64).
   Email-hash pepper: `EMAIL_HASH_PEPPER` (separate from JWT secret so
   rotating one doesn't invalidate the other).
   ═══════════════════════════════════════════════════════════════════ */

import { SignJWT, jwtVerify } from 'jose';

const ISSUER = 'ritmopadel.shop';
const AUDIENCES = /** @type {const} */ (['spielstil', 'ticket', 'magic']);
/** @typedef {typeof AUDIENCES[number]} TokenAudience */

const DEFAULT_EXPIRY = {
  spielstil: '15m',
  ticket:    undefined,   // caller passes absolute exp from event date
  magic:     '7d',
};

function getKey(env) {
  const raw = env.EVENT_JWT_SECRET;
  if (!raw || raw.length < 32) {
    throw new Error('EVENT_JWT_SECRET missing or too short (need >=32 bytes)');
  }
  return new TextEncoder().encode(raw);
}

/**
 * Sign a payload for the given audience.
 * @param {object} env
 * @param {TokenAudience} aud
 * @param {object} payload  Merged with iss/aud/iat/exp.
 * @param {{ expiresAt?: number, expiresIn?: string }} [opts]
 * @returns {Promise<string>}
 */
export async function signToken(env, aud, payload, opts = {}) {
  if (!AUDIENCES.includes(aud)) throw new Error(`unknown audience ${aud}`);
  const key = getKey(env);
  const builder = new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer(ISSUER)
    .setAudience(aud)
    .setIssuedAt();

  if (opts.expiresAt)      builder.setExpirationTime(opts.expiresAt);
  else if (opts.expiresIn) builder.setExpirationTime(opts.expiresIn);
  else if (DEFAULT_EXPIRY[aud]) builder.setExpirationTime(DEFAULT_EXPIRY[aud]);

  return builder.sign(key);
}

/**
 * Verify a token. Throws on bad signature, issuer, audience, or expiry.
 * @returns {Promise<{ payload: import('jose').JWTPayload }>}
 */
export async function verifyToken(env, expectedAud, token) {
  if (!AUDIENCES.includes(expectedAud)) {
    throw new Error(`unknown audience ${expectedAud}`);
  }
  const key = getKey(env);
  return jwtVerify(token, key, { issuer: ISSUER, audience: expectedAud });
}

/** Safe verify — returns null on any failure. */
export async function tryVerifyToken(env, expectedAud, token) {
  try {
    const { payload } = await verifyToken(env, expectedAud, token);
    return payload;
  } catch (e) {
    console.warn(`jwt verify failed (${expectedAud}):`, e?.message || e);
    return null;
  }
}

/**
 * Stable, non-reversible identifier for an email. Used as KV-key
 * prefix instead of plaintext — keeps GDPR-clean storage and logs.
 *
 * SHA-256 of `<pepper>:<email lowercased trimmed>`, hex.
 * Pepper from `EMAIL_HASH_PEPPER` (falls back to EVENT_JWT_SECRET).
 * Rotating pepper invalidates email indexes — intentional escape hatch.
 */
export async function hashEmail(env, email) {
  const pepper = env.EMAIL_HASH_PEPPER || env.EVENT_JWT_SECRET;
  if (!pepper) throw new Error('EMAIL_HASH_PEPPER (or EVENT_JWT_SECRET) required');
  const norm = String(email || '').trim().toLowerCase();
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`${pepper}:${norm}`)
  );
  return bufToHex(buf);
}

function bufToHex(buf) {
  const b = new Uint8Array(buf);
  let h = '';
  for (let i = 0; i < b.length; i++) h += b[i].toString(16).padStart(2, '0');
  return h;
}
