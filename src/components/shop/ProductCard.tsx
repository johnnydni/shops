import { Link } from 'react-router-dom';
import type { Product } from '../../lib/types';
import { CATEGORY_LABEL } from '../../lib/types';
import { ProductImage } from './ProductImage';
import { eurParts } from '../../lib/format';

interface Props {
  product: Product;
  animationDelay?: number; // 1..8 for the stagger classes
}

/** A single card in the home/related grid. Whole image is a router Link. */
export function ProductCard({ product, animationDelay }: Props) {
  const href = `/produkt/${product.slug}`;
  const { cur, value } = eurParts(product.price);
  return (
    <article
      className={`card-prod fi${animationDelay ? ` d${animationDelay}` : ''}`}
      data-cat={product.category}
    >
      <Link to={href} className="prod-img" aria-label={`${product.name} ansehen`}>
        <ProductImage illustration={product.illustration} src={product.imageSrc} alt="" />
        {product.flag && (
          <span className={`prod-flag${product.flag.tone ? ` ${product.flag.tone}` : ''}`}>
            {product.flag.label}
          </span>
        )}
      </Link>
      <div className="prod-body">
        <div className="prod-cat">{CATEGORY_LABEL[product.category]}</div>
        <Link to={href} className="prod-name">{product.name}</Link>
        <p className="prod-desc">{product.shortDesc}</p>
        <div className="prod-row">
          <div className="prod-price"><span className="cur">{cur}</span>{value}</div>
          <Link to={href} className="prod-btn">Ansehen</Link>
        </div>
      </div>
    </article>
  );
}
