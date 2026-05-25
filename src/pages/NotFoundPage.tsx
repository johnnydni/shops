import { AnimatedBg } from '../components/layout/AnimatedBg';
import { ButtonLink } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <main className="notfound">
      <AnimatedBg />
      <div className="err">
        <div className="num">404</div>
        <h1>
          Diese Seite gibt es{' '}
          <span style={{ color: 'var(--orange)' }}>nicht</span>.
        </h1>
        <p>
          Vielleicht ist sie umgezogen, vielleicht hat es sie nie gegeben.
          Zurück zum Shop?
        </p>
        <div className="links">
          <ButtonLink to="/">Zum Shop</ButtonLink>
          <ButtonLink variant="out" to="/#sortiment">
            Sortiment ansehen
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
