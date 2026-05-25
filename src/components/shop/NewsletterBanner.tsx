import { useState, type FormEvent } from 'react';
import { useReveal } from '../../hooks/useReveal';

/**
 * Newsletter capture stub — currently no-op submit. Replace `onSubmit`
 * body with a real fetch (Resend, Mailchimp, Brevo, etc) when ready.
 */
export function NewsletterBanner() {
  const ref = useReveal<HTMLDivElement>();
  const [done, setDone] = useState(false);

  function handle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: POST email to newsletter endpoint
    setDone(true);
  }

  return (
    <section className="banner" id="newsletter">
      <div className="wrap">
        <p className="rule">Newsletter</p>
        <div className="banner-card reveal" ref={ref}>
          <div>
            <h2>
              Bleib&nbsp;im&nbsp;<span className="accent">Loop</span>.
            </h2>
            <p>
              Trag dich ein und erfahre als Erste:r, wenn neue RITMO-Drops
              verfügbar sind. Kein Spam, jederzeit abbestellbar.
            </p>
          </div>
          <form className="banner-form" onSubmit={handle}>
            <input
              type="email"
              required
              placeholder="deine@email.de"
              aria-label="E-Mail Adresse"
              disabled={done}
            />
            <button type="submit" disabled={done}>
              {done ? 'Danke ✓' : 'Vormerken lassen'}
            </button>
            <span className="hint">
              Wir nutzen deine E-Mail nur, um dich über RITMO-Releases zu informieren.
            </span>
          </form>
        </div>
      </div>
    </section>
  );
}
