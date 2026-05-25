import type { FeatureSection } from '../../lib/types';
import { useReveal } from '../../hooks/useReveal';
import { ProductImage } from '../shop/ProductImage';

/** One alternating story section on a PDP. */
export function FeatureBlock({ feature, id }: { feature: FeatureSection; id?: string }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className={`pdp-section${feature.alt ? ' alt' : ''}`} id={id}>
      <div className="wrap">
        <div className={`feat-grid${feature.reverse ? ' reverse' : ''} reveal`} ref={ref}>
          <div className="feat-copy">
            <span className="eyebrow">{feature.eyebrow}</span>
            <h2>
              {feature.title}
              {feature.titleAccent && (
                <>
                  <br />
                  <span className="accent">{feature.titleAccent}</span>
                </>
              )}
            </h2>
            {feature.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="feat-visual">
            <ProductImage illustration={feature.visual} src={feature.imageSrc} alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
