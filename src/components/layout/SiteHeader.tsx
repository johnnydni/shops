import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useScrolledPast } from '../../hooks/useScrollState';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * Sticky top bar — blurs on scroll, cart badge animates on count change.
 * Includes a burger menu (3 horizontal lines) that opens a dropdown
 * panel with every route. Burger sits next to the cart link and is
 * always reachable (on desktop it complements the horizontal nav; on
 * mobile, where the horizontal nav collapses, the burger IS the nav).
 *
 * Mounted once at app root (see App.tsx).
 */
export function SiteHeader() {
  const scrolled = useScrolledPast(24);
  const { count } = useCart();
  const linkRef = useRef<HTMLAnchorElement | null>(null);
  const prev = useRef(count);

  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

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
              <path d="M9 3H3v10h10V7" />
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

          {/* Burger always visible — primary nav on mobile, alt nav on desktop */}
          <button
            type="button"
            className={`nav-burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
            aria-expanded={menuOpen}
            aria-controls="nav-menu"
          >
            <span className="burger-bar" />
            <span className="burger-bar" />
            <span className="burger-bar" />
          </button>
        </nav>
      </div>

      {/* ─── Dropdown panel ─────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="nav-menu"
            className="nav-menu"
            initial={{ opacity: 0, y: reduce ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -12 }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            role="menu"
          >
            <div className="wrap">
              <ul className="nav-menu-list">
                <NavItem to="/sortiment" label="Sortiment" hint="Alle Schläger, Bälle, Apparel und Prints" />
                <NavItem to="/events"    label="Events"    hint="Turniere, Demo Days, Pop-ups" />
                <NavItem to="/news"      label="News"      hint="Founders Letter & Drops" />
                <NavItem to="/warenkorb" label="Warenkorb" hint={`${count} Artikel`} />
                <li className="nav-menu-sep" aria-hidden />
                <li>
                  <a
                    href="https://ritmopadel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-menu-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="nav-menu-label">RITMO App</span>
                    <span className="nav-menu-hint">öffnet in neuem Tab ↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Single nav row inside the dropdown — label + small hint underneath. */
function NavItem({ to, label, hint }: { to: string; label: string; hint?: string }) {
  return (
    <li>
      <Link to={to} className="nav-menu-link">
        <span className="nav-menu-label">{label}</span>
        {hint && <span className="nav-menu-hint">{hint}</span>}
      </Link>
    </li>
  );
}
