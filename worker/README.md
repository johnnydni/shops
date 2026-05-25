# RITMO Shop — Checkout Worker

Cloudflare Worker that powers the Stripe Checkout flow for
`ritmopadel.shop`. The frontend stays purely static on GitHub Pages;
this Worker is the only piece that talks to Stripe.

## Routes

| Method | Path             | Purpose                                            |
|-------:|------------------|----------------------------------------------------|
|   POST | `/api/checkout`  | Re-prices the cart from `src/catalog.js`, creates a Stripe Checkout Session, returns `{url}` |
|   POST | `/api/webhook`   | Receives Stripe webhooks. Verifies `Stripe-Signature` via Web Crypto. Logs orders. |
|    GET | `/api/health`    | Liveness probe                                     |

The client cart is **never trusted for prices** — every line is
re-resolved against `src/catalog.js` before the session is created.

## One-time setup

```bash
cd worker
npm install
npx wrangler login              # auth with your Cloudflare account
```

Set the two Stripe secrets (test keys first):

```bash
npx wrangler secret put STRIPE_SECRET_KEY        # paste sk_test_...
npx wrangler secret put STRIPE_WEBHOOK_SECRET    # paste whsec_... (see below)
```

Edit `wrangler.toml` if you want a different `name`, `SUCCESS_URL`,
`CANCEL_URL`, or `ALLOWED_ORIGIN`.

## Deploy

```bash
npx wrangler deploy
```

You'll get a URL like `https://ritmo-shop.<your-subdomain>.workers.dev`.
Either:

- **Use it as-is** and set `window.RITMO_CHECKOUT_URL` in
  `warenkorb.html` to that URL, **or**
- **Attach a custom domain** like `api.ritmopadel.shop` — uncomment
  the `[[routes]]` block in `wrangler.toml`, `wrangler deploy` again.

## Configure the webhook in Stripe

1. Stripe Dashboard → Developers → Webhooks → **Add endpoint**
2. URL:  `https://<your-worker-url>/api/webhook`
3. Events: at minimum `checkout.session.completed`
   (optional: `checkout.session.expired`, `payment_intent.payment_failed`)
4. Copy the signing secret (`whsec_...`) → paste into
   `wrangler secret put STRIPE_WEBHOOK_SECRET`
5. Redeploy: `npx wrangler deploy`

## Wire the frontend

In `warenkorb.html`, set the Worker URL:

```html
<script>window.RITMO_CHECKOUT_URL = "https://api.ritmopadel.shop/api/checkout";</script>
```

The button is already wired — clicking "Zur Kasse" POSTs the cart and
redirects to Stripe.

## Local dev

```bash
cp .dev.vars.example .dev.vars   # fill in your test keys
npm run dev                       # http://localhost:8787
npm run tail                      # tail prod logs
```

To test the webhook locally, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:8787/api/webhook
# Stripe CLI prints a temporary whsec_... — put it in .dev.vars
stripe trigger checkout.session.completed
```

## Variant pricing

Some products have variant-specific prices (paper size, ball count,
frame). These are encoded in `src/catalog.js` under `variantPriceMap`.
The keys MUST exactly match the `data-variant` attribute on the PDP
buttons. The client sends the variant string as `"A / B / C"` (split
by `" / "`), and the Worker sums the deltas for each segment.

When adding a new variant, update **both** the PDP markup and the
catalog — the README in the repo root documents which side is the
source of truth (the catalog wins on price).

## Extending

`src/webhook.js` currently just logs orders. Common next steps:

- **Persist orders** → bind a KV namespace in `wrangler.toml`, write
  the session object under `order:<session_id>`.
- **Merchant notification email** → call Resend / Postmark / Mailgun
  from inside the `checkout.session.completed` branch.
- **Inventory** → before resolving each line in `src/catalog.js`,
  check available stock in KV/D1.

None of these are required for v1 — Stripe sends the customer receipt
automatically, and the Stripe Dashboard is the source of truth for
orders.
