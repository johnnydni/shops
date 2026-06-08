/* ═══════════════════════════════════════════════════════════════════
   Resend — transactional email send.
   ───────────────────────────────────────────────────────────────────
   Plain fetch (no SDK — keeps the bundle tiny).

   Required env:
     RESEND_API_KEY      secret (wrangler secret put)
     RESEND_FROM         "RITMO Padel <hello@ritmopadel.shop>"
   Optional env:
     RESEND_REPLY_TO     defaults to RESEND_FROM address

   Domain must be Resend-verified (SPF + DKIM + DMARC on ritmopadel.shop).
   `sendEmail()` returns { ok, id, error }. Throws on programmer errors
   only (missing env). Network/Resend errors land in {ok:false}.
   ═══════════════════════════════════════════════════════════════════ */

const RESEND_URL = 'https://api.resend.com/emails';

/**
 * @typedef {Object} SendEmailInput
 * @property {string} to
 * @property {string} subject
 * @property {string} html
 * @property {string} [text]
 * @property {string[]} [tags]
 * @property {string} [idempotencyKey]
 */

/**
 * @param {object} env
 * @param {SendEmailInput} input
 * @returns {Promise<{ ok: boolean, id?: string, error?: string }>}
 */
export async function sendEmail(env, input) {
  if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY missing');
  if (!env.RESEND_FROM)    throw new Error('RESEND_FROM missing');
  if (!input?.to || !input?.subject || !input?.html) {
    throw new Error('sendEmail requires to + subject + html');
  }

  const body = {
    from:    env.RESEND_FROM,
    to:      [input.to],
    subject: input.subject,
    html:    input.html,
    text:    input.text,
    tags:    (input.tags || []).map((name) => ({ name, value: name })),
  };
  if (env.RESEND_REPLY_TO) body.reply_to = env.RESEND_REPLY_TO;

  /** @type {Record<string,string>} */
  const headers = {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  };
  if (input.idempotencyKey) headers['Idempotency-Key'] = input.idempotencyKey;

  let resp;
  try {
    resp = await fetch(RESEND_URL, { method: 'POST', headers, body: JSON.stringify(body) });
  } catch (e) {
    console.error('resend fetch failed', e);
    return { ok: false, error: 'network' };
  }

  let data = null;
  try { data = await resp.json(); } catch { /* empty body sometimes */ }

  if (!resp.ok) {
    const msg = data?.message || data?.error || `HTTP ${resp.status}`;
    console.error('resend rejected', msg);
    return { ok: false, error: msg };
  }
  return { ok: true, id: data?.id };
}

/**
 * Wrap an HTML body fragment in the RITMO Bauhaus email shell.
 * Inline styles tested in Apple Mail, Gmail, Outlook web.
 */
export function ritmoShell({ preheader = '', bodyHtml = '' }) {
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>RITMO Padel</title>
  <style>
    body { margin:0; padding:0; background:#0A0A0A; color:#F2F2F2;
           font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
           line-height:1.55; -webkit-text-size-adjust:100%; }
    a { color:#FF7A1A; text-decoration:none; }
    .container { max-width:560px; margin:0 auto; padding:32px 24px; }
    .head { display:flex; align-items:center; gap:12px; margin-bottom:32px;
            border-bottom:2px solid #FF7A1A; padding-bottom:16px; }
    .logo-mark { width:36px; height:36px; background:#FF7A1A; }
    .brand { letter-spacing:.12em; font-size:14px; font-weight:700; text-transform:uppercase; }
    .foot  { margin-top:48px; padding-top:16px; border-top:1px solid #222;
             font-size:12px; color:#777; }
    .preheader { display:none !important; visibility:hidden; opacity:0;
                 color:transparent; height:0; width:0; overflow:hidden; }
    h1, h2, h3 { color:#fff; font-weight:700; letter-spacing:-.01em; }
    .btn { display:inline-block; padding:14px 28px; background:#FF7A1A; color:#000 !important;
           font-weight:800; letter-spacing:.04em; text-transform:uppercase; font-size:13px; }
    .tile { background:#141414; border:1px solid #222; padding:20px; margin:16px 0; }
    .tile h3 { margin:0 0 8px; font-size:15px; }
    .tile small { color:#888; font-size:12px; letter-spacing:.06em; text-transform:uppercase; }
  </style>
</head>
<body>
  <span class="preheader">${escapeHtml(preheader)}</span>
  <div class="container">
    <div class="head">
      <div class="logo-mark" aria-hidden="true"></div>
      <div class="brand">RITMO Padel</div>
    </div>
    ${bodyHtml}
    <div class="foot">
      RITMO Padel · ritmopadel.shop<br>
      Du erhältst diese Email, weil du auf <a href="https://ritmopadel.shop">ritmopadel.shop</a>
      ein Ticket oder eine Bestellung getätigt hast.
    </div>
  </div>
</body>
</html>`;
}

/** Minimal HTML escape for any user string injected into markup. */
export function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
