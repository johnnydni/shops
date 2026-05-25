/* ═══════════════════════════════════════════════════════════════════
   RITMO Shop — Server-side product catalog
   ───────────────────────────────────────────────────────────────────
   THIS is the source of truth for prices. The client cart is NEVER
   trusted — the worker re-resolves every line item against this
   catalog before creating a Stripe Checkout Session.

   Prices are in CENTS (smallest currency unit), VAT-inclusive (German
   convention — 19% MwSt baked in). Currency: EUR.

   Each entry:
     name             Public product name (shown on Stripe Checkout)
     price            Base price in cents (VAT incl.)
     category         Free-text category, used in product description
     variantPriceMap  Optional. Keys are EXACT variant strings as
                      they appear in the PDP's `data-variant` attr
                      (e.g. "24er (+€30)"). Values are price deltas
                      in cents — added to the base price. Variants
                      not listed here have NO price effect.

   The client cart variant is "A / B / C" (joined by " / "). We split
   and try each segment against variantPriceMap; first match wins.
   ═══════════════════════════════════════════════════════════════════ */
export const CATALOG = {
  'schlaeger-pro': {
    name: 'RITMO Pro',
    price: 18900,
    category: 'Schläger',
  },
  'schlaeger-edge': {
    name: 'RITMO Edge',
    price: 15900,
    category: 'Schläger',
  },
  'balls-tournament': {
    name: 'Tournament 12er',
    price: 3400,
    category: 'Bälle',
    variantPriceMap: {
      '12er': 0,
      '24er': 3000,   // €34 + €30 = €64
      '36er': 5500,   // €34 + €55 = €89
    },
  },
  'balls-3pack': {
    name: 'RITMO Ball Set',
    price: 900,
    category: 'Bälle',
    // "3 Dosen" / "6 Dosen" are bundle SKUs — one cart entry = whole bundle
    variantPriceMap: {
      '1 Dose':  0,
      '3 Dosen': 1600,  // €9 + €16 = €25 (3 cans, €2 off vs buying separately)
      '6 Dosen': 4000,  // €9 + €40 = €49 (6 cans, €5 off vs buying separately)
    },
  },
  'tee-schwarz': {
    name: 'RITMO Tee',
    price: 3900,
    category: 'Apparel',
  },
  'hoodie-crew': {
    name: 'RITMO Hoodie',
    price: 7900,
    category: 'Apparel',
  },
  'poster-app-live': {
    name: '"App ist Live" Print',
    price: 2400,
    category: 'Print',
    variantPriceMap: {
      'A3': 0,
      'A2': 0,
      'A1': 1600,                  // +€16
      'Ohne Rahmen': 0,
      'Schwarzer Holzrahmen': 3900, // +€39
    },
  },
  'print-dna': {
    name: 'RITMO DNA Print',
    price: 1800,
    category: 'Print',
    variantPriceMap: {
      'A3': 0,
      'A2': 800,                   // +€8
      'Ohne Rahmen': 0,
      'Schwarzer Holzrahmen': 2900, // +€29
    },
  },
};

/**
 * Resolve a single client cart line to a server-priced line item.
 * Returns { ok: true, line } or { ok: false, error }.
 *
 * The returned `line` is shape-ready for Stripe Checkout:
 *   { price_data: { currency, unit_amount, product_data:{name,description} }, quantity }
 */
export function resolveLine(clientLine) {
  if (!clientLine || typeof clientLine !== 'object') {
    return { ok: false, error: 'invalid line' };
  }
  const product = CATALOG[clientLine.id];
  if (!product) {
    return { ok: false, error: `unknown product ${clientLine.id}` };
  }
  const qty = Math.max(1, Math.min(99, parseInt(clientLine.qty, 10) || 1));

  // Resolve variant delta — try each segment of "A / B / C"
  let delta = 0;
  const variantStr = String(clientLine.variant || '');
  if (variantStr && product.variantPriceMap) {
    const segments = variantStr.split(' / ').map(s => s.trim()).filter(Boolean);
    for (const seg of segments) {
      if (Object.prototype.hasOwnProperty.call(product.variantPriceMap, seg)) {
        delta += product.variantPriceMap[seg];
      }
    }
  }

  const unitAmount = product.price + delta;
  if (unitAmount < 50) {
    // Stripe minimum charge is €0.50 — refuse anything below.
    return { ok: false, error: `price too low for ${clientLine.id}` };
  }

  const description = [product.category, variantStr].filter(Boolean).join(' · ');

  return {
    ok: true,
    line: {
      quantity: qty,
      price_data: {
        currency: 'eur',
        unit_amount: unitAmount,
        product_data: {
          name: product.name,
          description: description || undefined,
          metadata: { product_id: clientLine.id, variant: variantStr || '' },
        },
      },
    },
  };
}
