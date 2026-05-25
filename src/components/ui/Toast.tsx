import { useEffect, useState } from 'react';

/**
 * Tiny global toast bus. Call `toast("<b>...</b>")` from anywhere
 * (post-add-to-cart, errors, etc). Renders via <ToastHost /> which
 * lives in App.tsx so any page can fire toasts without prop drilling.
 */
type Toast = { id: number; html: string };
type Listener = (t: Toast[]) => void;

let next = 1;
let live: Toast[] = [];
const subs = new Set<Listener>();

function publish() {
  subs.forEach((l) => l(live));
}

export function toast(html: string, ttl = 2600) {
  const t: Toast = { id: next++, html };
  live = [...live, t];
  publish();
  setTimeout(() => {
    live = live.filter((x) => x.id !== t.id);
    publish();
  }, ttl);
}

export function ToastHost() {
  const [items, setItems] = useState<Toast[]>(live);
  useEffect(() => {
    subs.add(setItems);
    return () => {
      subs.delete(setItems);
    };
  }, []);

  return (
    <div aria-live="polite" aria-atomic="true">
      {items.map((t, i) => (
        <ToastItem key={t.id} html={t.html} offset={i} />
      ))}
    </div>
  );
}

function ToastItem({ html, offset }: { html: string; offset: number }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setShown(true));
  }, []);
  return (
    <div
      className={`toast${shown ? ' show' : ''}`}
      style={{ top: 90 + offset * 70 }}
    >
      <span className="dot" />
      <span className="msg" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
