/**
 * Cart store — single source of truth for the cart in the browser.
 *
 * Lives in localStorage under one key (`ritmo.cart.v1`) and exposes
 * a subscribe/getSnapshot interface compatible with React's
 * `useSyncExternalStore`. Cross-tab sync via the `storage` event.
 *
 * IMPORTANT: prices stored here are for DISPLAY only. The server
 * (worker/src/catalog.js) re-resolves every line during checkout —
 * never trust this to bill anything.
 */
import type { CartLine } from './types';

const KEY = 'ritmo.cart.v1';

type Listener = () => void;
const listeners = new Set<Listener>();

function read(): CartLine[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}

function write(items: CartLine[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  // Cache the snapshot so useSyncExternalStore returns a stable ref
  // until the next mutation (avoids "getSnapshot should be cached" warnings).
  cachedSnapshot = items;
  listeners.forEach((l) => l());
}

// Cached snapshot for useSyncExternalStore identity stability.
let cachedSnapshot: CartLine[] = read();

// Cross-tab sync — re-read when another tab writes.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      cachedSnapshot = read();
      listeners.forEach((l) => l());
    }
  });
}

function variantKey(id: string, variant?: string) {
  return `${id}::${variant ?? ''}`;
}

export const CartStore = {
  /** Subscribe to changes. Returns unsubscribe. */
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Stable snapshot for useSyncExternalStore. */
  getSnapshot(): CartLine[] {
    return cachedSnapshot;
  },

  /** SSR snapshot (we don't SSR, but React 18 requires it). */
  getServerSnapshot(): CartLine[] {
    return [];
  },

  add(item: Omit<CartLine, 'qty'> & { qty?: number }): void {
    const items = [...read()];
    const k = variantKey(item.id, item.variant);
    const existing = items.find((i) => variantKey(i.id, i.variant) === k);
    if (existing) {
      existing.qty += item.qty ?? 1;
    } else {
      items.push({ ...item, qty: item.qty ?? 1 });
    }
    write(items);
  },

  setQty(id: string, variant: string | undefined, qty: number): void {
    const safe = Math.max(1, Math.min(99, qty | 0));
    write(
      read().map((i) =>
        variantKey(i.id, i.variant) === variantKey(id, variant)
          ? { ...i, qty: safe }
          : i
      )
    );
  },

  remove(id: string, variant: string | undefined): void {
    write(
      read().filter(
        (i) => variantKey(i.id, i.variant) !== variantKey(id, variant)
      )
    );
  },

  clear(): void {
    write([]);
  },

  count(): number {
    return cachedSnapshot.reduce((n, i) => n + (i.qty || 0), 0);
  },

  subtotal(): number {
    return cachedSnapshot.reduce((s, i) => s + i.price * (i.qty || 0), 0);
  },
};
