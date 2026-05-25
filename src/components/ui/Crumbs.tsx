import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

/** Breadcrumb strip used at the top of PDPs and cart-adjacent pages. */
export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="pdp-crumbs" aria-label="Breadcrumb">
      <div className="wrap">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={i}>
              {c.to && !last ? <Link to={c.to}>{c.label}</Link> : <span className="here">{c.label}</span>}
              {!last && <span className="sep">/</span>}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}
