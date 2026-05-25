/**
 * Sends the cart to the Cloudflare Worker which re-prices and creates
 * a Stripe Checkout Session. Returns the Stripe URL the browser should
 * redirect to.
 *
 * The endpoint URL comes from VITE_CHECKOUT_URL (set in .env or .env.local
 * for dev), and falls back to the production worker domain. Never send
 * client-side prices — the worker ignores them anyway.
 */
import type { CartLine } from './types';

const DEFAULT_URL = 'https://api.ritmopadel.shop/api/checkout';

function endpoint(): string {
  // Vite exposes import.meta.env at build time.
  const fromEnv = (import.meta.env.VITE_CHECKOUT_URL as string | undefined) ?? '';
  return fromEnv || DEFAULT_URL;
}

export interface CheckoutRequestItem {
  id: string;
  qty: number;
  variant?: string;
}

export interface CheckoutResponse {
  url: string;
  id: string;
}

export async function createCheckoutSession(
  items: CartLine[]
): Promise<CheckoutResponse> {
  if (!items.length) throw new Error('cart is empty');

  const body: { items: CheckoutRequestItem[] } = {
    items: items.map((i) => ({
      id: i.id,
      qty: i.qty,
      variant: i.variant || '',
    })),
  };

  const resp = await fetch(endpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let data: Partial<CheckoutResponse> & { error?: string } = {};
  try {
    data = await resp.json();
  } catch {
    // server didn't return JSON; fall through to error throw
  }

  if (!resp.ok || !data.url) {
    throw new Error(data.error || `HTTP ${resp.status}`);
  }
  return { url: data.url, id: data.id ?? '' };
}
