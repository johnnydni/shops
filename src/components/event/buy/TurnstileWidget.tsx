import { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile widget wrapper.
 *
 * Loads `challenges.cloudflare.com/turnstile/v0/api.js` once per session,
 * mounts a widget into our own div, and reports its token via `onToken`.
 *
 * Lifecycle handled:
 *  - onToken('')           when widget expires or errors out, so the
 *                          parent disables the submit button again
 *  - cleanup on unmount    removes the widget instance from CF's registry
 *
 * Env:
 *  - `VITE_TURNSTILE_SITE_KEY` — required. If missing, the widget renders
 *    a yellow dev-banner and immediately reports a fake `dev-bypass-token`
 *    so local development without CF still works. The worker MUST reject
 *    that token in production (it does — the secret is the real check).
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: TurnstileOptions
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
    };
    onloadTurnstileCallback?: () => void;
  }
}

interface TurnstileOptions {
  sitekey: string;
  callback: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  'timeout-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  action?: string;
  cData?: string;
  appearance?: 'always' | 'execute' | 'interaction-only';
  size?: 'normal' | 'compact' | 'flexible';
}

const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('failed to load Turnstile script'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function TurnstileWidget({
  action = 'event-checkout',
  onToken,
}: {
  action?: string;
  onToken: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined) ?? '';

  useEffect(() => {
    let cancelled = false;
    if (!siteKey) {
      // Dev-bypass — only OK because the worker will still reject any
      // request lacking a real CF-verified token. Visible banner makes
      // this obvious so it never leaves dev.
      onToken('dev-bypass-token');
      return;
    }
    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: 'dark',
          size: 'flexible',
          callback: (token: string) => onToken(token),
          'error-callback':   () => onToken(''),
          'expired-callback': () => onToken(''),
          'timeout-callback': () => onToken(''),
        });
      })
      .catch((e) => {
        console.error(e);
        onToken('');
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* widget already gone */
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, siteKey]);

  if (!siteKey) {
    return (
      <div className="ts-dev-banner" role="status">
        <strong>Dev-Bypass:</strong> Turnstile inaktiv (kein
        <code> VITE_TURNSTILE_SITE_KEY</code> gesetzt). Token: <em>fake</em>.
        Production verifiziert serverseitig.
      </div>
    );
  }

  return <div ref={containerRef} className="ts-container" />;
}
