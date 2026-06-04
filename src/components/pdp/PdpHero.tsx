import { useMemo, useState } from 'react';
import type { Product } from '../../lib/types';
import { CATEGORY_LABEL } from '../../lib/types';
import { eurParts } from '../../lib/format';
import { PdpStage } from './PdpStage';
import { VariantPicker } from './VariantPicker';
import { Button } from '../ui/Button';
import { useCart } from '../../hooks/useCart';
import { toast } from '../ui/Toast';
import { isSoldOut } from '../../data/products';

interface Props {
  product: Product;
  /** Ref to attach to the CTA row so the sticky buy bar knows when to show. */
  ctaRef: React.RefObject<HTMLDivElement>;
}

/**
 * Top of the PDP — split layout with image left, info+CTA right.
 * Owns the local variant-selection state for the page.
 */
export function PdpHero({ product, ctaRef }: Props) {
  const { add } = useCart();
  const sold = isSoldOut(product);

  // Initialise selected variant value per group
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    product.variants?.forEach((g) => {
      init[g.label] = g.defaultValue ?? g.options[0]?.value ?? '';
    });
    return init;
  });

  // Compute current unit price (base + sum of selected variant deltas)
  // PLUS resolve the active hero image — first variant group whose
  // selected option has an `image` set wins, falling back to the
  // product's default heroImageSrc/imageSrc.
  const { price, variantLabel, heroImage } = useMemo(() => {
    let p = product.price;
    const parts: string[] = [];
    let img: string | undefined;
    product.variants?.forEach((g) => {
      const v = selected[g.label];
      const opt = g.options.find((o) => o.value === v);
      if (opt) {
        if (opt.priceDelta) p += opt.priceDelta;
        parts.push(opt.value);
        if (opt.image && !img) img = opt.image;
      }
    });
    return {
      price: p,
      variantLabel: parts.join(' / '),
      heroImage: img ?? product.heroImageSrc ?? product.imageSrc,
    };
  }, [product, selected]);

  const { cur, value } = eurParts(price);

  function handleAdd() {
    add({
      id: product.id,
      name: product.name,
      cat: CATEGORY_LABEL[product.category],
      price,
      variant: variantLabel || undefined,
      img: product.imageSrc,
    });
    toast(`<b>${escapeHtml(product.name)}</b> in den Warenkorb gelegt.`);
  }

  return (
    <section className="pdp-hero">
      <div className="wrap pdp-hero-grid">
        <PdpStage
          illustration={product.illustration}
          imageSrc={heroImage}
          alt={product.name}
        />

        <div className="pdp-info fu">
          <span className="pdp-eyebrow">{product.eyebrow}</span>
          <h1 className="pdp-name">
            {product.nameAccent ? (
              <>
                {splitAroundAccent(product.name, product.nameAccent).before}
                <span className="accent">{product.nameAccent}</span>
                {splitAroundAccent(product.name, product.nameAccent).after}
              </>
            ) : (
              product.name
            )}
            <span className="accent">.</span>
          </h1>
          <p className="pdp-tagline">{product.tagline}</p>

          <div className="pdp-price-row">
            <div className="pdp-price"><span className="cur">{cur}</span>{value}</div>
            <div className="pdp-price-note">Inkl. MwSt. · Kostenloser DACH-Versand</div>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="pdp-options">
              {product.variants.map((g) => (
                <VariantPicker
                  key={g.label}
                  group={g}
                  selected={selected[g.label] ?? ''}
                  onSelect={(v) => setSelected((s) => ({ ...s, [g.label]: v }))}
                />
              ))}
            </div>
          )}

          <div className="pdp-cta-row" ref={ctaRef}>
            {sold ? (
              <Button variant="pri" size="lg" disabled>Ausverkauft</Button>
            ) : (
              <Button variant="pri" size="lg" onClick={handleAdd}>
                In den Warenkorb
              </Button>
            )}
            <a className="btn btn-out btn-lg" href="#story">Mehr erfahren</a>
          </div>
          {sold && (
            <p className="pdp-soldout-note">
              Aktuell nicht verfügbar. Für Restock-Benachrichtigung in den{' '}
              <a href="/news" style={{ color: 'var(--orange)', borderBottom: '1px solid var(--orange)' }}>
                Newsletter
              </a>{' '}
              eintragen.
            </p>
          )}

          {product.trust && product.trust.length > 0 && (
            <div className="pdp-trust">
              {product.trust.map((t, i) => (
                <div key={i}>
                  <span className="label">{t.label}</span>
                  <span className="value">{t.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* Tiny helpers ----------------------------------------------------- */
function splitAroundAccent(full: string, accent: string) {
  const idx = full.indexOf(accent);
  if (idx === -1) return { before: full, after: '' };
  return { before: full.slice(0, idx), after: full.slice(idx + accent.length) };
}
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
