import { useSyncExternalStore } from 'react';
import { CartStore } from '../lib/cart';
import type { CartLine } from '../lib/types';

/**
 * Reactive cart hook. Re-renders any subscriber when the cart changes
 * (this tab OR a sibling tab via `storage` event).
 */
export function useCart(): {
  items: CartLine[];
  count: number;
  subtotal: number;
  add: typeof CartStore.add;
  setQty: typeof CartStore.setQty;
  remove: typeof CartStore.remove;
  clear: typeof CartStore.clear;
} {
  const items = useSyncExternalStore(
    CartStore.subscribe,
    CartStore.getSnapshot,
    CartStore.getServerSnapshot
  );

  const count = items.reduce((n, i) => n + (i.qty || 0), 0);
  const subtotal = items.reduce((s, i) => s + i.price * (i.qty || 0), 0);

  return {
    items,
    count,
    subtotal,
    add: CartStore.add,
    setQty: CartStore.setQty,
    remove: CartStore.remove,
    clear: CartStore.clear,
  };
}
