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
 * Collect every distinct image a product can show — the main hero plus
 * one per variant option that carries an `image` (typically colour
 * swatches). Used to feed the journey-card auto-crossfade slideshow so
 * products with multiple colourways visually announce themselves.
 *
 * If the product carries an explicit `cardImages` array, it wins
 * outright — that's the escape hatch for multi-variant products like
 * the DNA-Tee whose images are composed from a pattern.
 */
function collectProductImages(p: Product): string[] {
  if (p.cardImages && p.cardImages.length) return p.cardImages;
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (src?: string) => {
    if (src && !seen.has(src)) { seen.add(src); out.push(src); }
  };
  push(p.imageSrc);
  for (const group of p.variants ?? []) {
    for (const opt of group.options) push(opt.image);
  }
  return out;
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
          const images = collectProductImages(p);
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
                {images.length > 1 ? (
                  <JourneySlideshow images={images} alt={p.name} delay={i * 600} />
                ) : (
                  <ProductImage illustration={p.illustration} src={p.imageSrc} alt="" />
                )}
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

/**
 * Auto-crossfade slideshow for journey cards.
 *
 * Stacks every image as an absolutely-positioned <img> in the same slot
 * (the gradient `.fallback` underneath stays as the safety net). Only
 * the currently-active image has `opacity: 1`; CSS handles the .6s
 * fade. Images that fail to load drop out and are skipped on the next
 * cycle — so a missing photo never freezes the loop on a blank tile.
 *
 * `delay` staggers the autoplay start across cards so the whole row
 * doesn't pulse in unison; it just makes the journey feel alive.
 */
function JourneySlideshow({
  images,
  alt,
  delay = 0,
}: {
  images: string[];
  alt: string;
  delay?: number;
}) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const live = images.map((_, i) => i).filter((i) => !failed[i]);
    if (live.length <= 1) return;
    let timer: number | undefined;
    const start = window.setTimeout(() => {
      const tick = () => {
        setIndex((cur) => {
          const liveNow = images.map((_, i) => i).filter((i) => !failed[i]);
          if (liveNow.length <= 1) return cur;
          const pos = liveNow.indexOf(cur);
          return liveNow[(pos + 1) % liveNow.length];
        });
      };
      timer = window.setInterval(tick, 2800);
    }, delay);
    return () => {
      window.clearTimeout(start);
      if (timer) window.clearInterval(timer);
    };
  }, [images, delay, failed]);

  return (
    <>
      <div className="fallback" aria-hidden="true" />
      {images.map((src, i) =>
        failed[i] ? null : (
          <img
            key={src}
            src={src}
            alt={i === 0 ? alt : ''}
            loading="lazy"
            className="hjourney-slide"
            style={{ opacity: i === index ? 1 : 0 }}
            onError={() => setFailed((f) => ({ ...f, [i]: true }))}
          />
        )
      )}
    </>
  );
}
