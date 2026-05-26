import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../lib/types';
import { CATEGORY_LABEL } from '../../lib/types';
import { ProductImage } from './ProductImage';
import { eurParts } from '../../lib/format';

interface Props {
  products: Product[];
  title?: string;
  titleAccent?: string;
}

/**
 * Horizontal Scroll Journey — implements the pattern recommended by the
 * ui-ux-pro-max skill for immersive product discovery. Each product is a
 * scroll-snap panel; users swipe / arrow-key / drag through the lineup.
 * A live "01 / 08" progress indicator updates as you scroll.
 */
export function HorizontalScrollJourney({
  products,
  title = 'Die Journey',
  titleAccent = '.',
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(1);

  // Track which panel is closest to the left edge → that's the "current" one
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const panels = track.querySelectorAll<HTMLElement>('.hjourney-panel');
        const trackLeft = track.getBoundingClientRect().left;
        let bestIdx = 0;
        let bestDist = Infinity;
        panels.forEach((p, i) => {
          const dist = Math.abs(p.getBoundingClientRect().left - trackLeft);
          if (dist < bestDist) { bestDist = dist; bestIdx = i; }
        });
        setActive(bestIdx + 1);
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [products.length]);

  return (
    <section className="hjourney" aria-label="Produkt-Journey">
      <div className="hjourney-header">
        <h2>
          {title}
          <span className="accent">{titleAccent}</span>
        </h2>
        <div className="progress" aria-live="polite">
          {String(active).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
        </div>
      </div>

      <div className="hjourney-track" ref={trackRef} tabIndex={0}>
        {products.map((p, i) => {
          const { cur, value } = eurParts(p.price);
          const href = `/produkt/${p.slug}`;
          return (
            <Link
              key={p.id}
              to={href}
              className={`hjourney-panel cat-${p.category}`}
            >
              <span className="hjourney-cat-stripe" aria-hidden />
              <div className="hjourney-visual">
                <span className="hjourney-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <ProductImage illustration={p.illustration} src={p.imageSrc} alt="" />
              </div>
              <div className="hjourney-body">
                <span className="hjourney-eyebrow">
                  {CATEGORY_LABEL[p.category]}
                </span>
                <span className="hjourney-name">{p.name}</span>
                <p className="hjourney-desc">{p.shortDesc}</p>
                <div className="hjourney-foot">
                  <span className="price">
                    <span className="cur">{cur}</span>{value}
                  </span>
                  <span className="prod-btn">Ansehen →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
