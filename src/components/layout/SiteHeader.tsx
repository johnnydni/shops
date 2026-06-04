import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useScrolledPast } from '../../hooks/useScrollState';
import { useEffect, useRef } from 'react';

/**
 * Sticky top bar — blurs on scroll, cart badge animates on count change.
 * Mounted once at app root (see App.tsx).
 */
export function SiteHeader() {
  const scrolled = useScrolledPast(24);
  const { count } = useCart();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const prev = useRef(count);

  // Bump animation when cart count changes
  useEffect(() => {
    if (count !== prev.current && linkRef.current) {
      const el = linkRef.current;
      el.classList.remove('bump');
      // restart animation
      void el.offsetWidth;
      el.classList.add('bump');
    }
    prev.current = count;
  }, [count]);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="wrap topbar">
        <Link to="/" className="word" aria-label="RITMO Shop">
          <span>RITMO</span>
          <span className="dot" aria-hidden="true" />
          <span className="pipe">·</span>
          <span className="sub">Shop</span>
        </Link>
        <nav className="nav" aria-label="Seitennavigation">
          <Link to="/sortiment">Sortiment</Link>
          <Link to="/events">Events</Link>
          <Link to="/news">News</Link>
          <a
            href="https://ritmopadel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-ext"
            aria-label="RITMO App (öffnet in neuem Tab)"
          >
            App
            <svg
              className="ext-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {/* Box (square minus top-right corner) */}
              <path d="M9 3H3v10h10V7" />
              {/* Arrow */}
              <path d="M9 2h5v5" />
              <path d="M14 2L7.5 8.5" />
            </svg>
          </a>
          <Link
            to="/warenkorb"
            className="cart-link"
            ref={linkRef}
            title={`${count} Artikel`}
          >
            <span className="bag" aria-hidden="true" />
            <span className="count">{count}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
