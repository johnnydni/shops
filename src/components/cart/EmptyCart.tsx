import { Link } from 'react-router-dom';

export function EmptyCart() {
  return (
    <div className="cart-empty">
      <div className="icon">∅</div>
      Dein Warenkorb ist leer.
      <br />
      <Link
        to="/"
        style={{
          color: 'var(--orange)',
          fontWeight: 700,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          fontSize: 12,
          marginTop: 14,
          display: 'inline-block',
          borderBottom: '1px solid var(--orange)',
          paddingBottom: 2,
        }}
      >
        Zum Shop →
      </Link>
    </div>
  );
}
