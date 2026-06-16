import { useEffect, useState, type ComponentType, type SVGProps } from 'react';

/**
 * Image with gradient fallback.
 *
 * Renders an orange→black Bauhaus gradient unconditionally; layers a
 * real photo on top via z-index. If the photo fails to load (file
 * missing, 404, etc.), `<img>` unmounts and the gradient underneath
 * stays visible — same UX pattern as the old SVG illustration trick.
 *
 * The `key={src}` on the <img> plus the effect-reset of `imgOk`
 * makes the component react cleanly when `src` is swapped at runtime
 * (e.g. clicking a different colour swatch on the PDP).
 *
 * The `illustration` prop is kept optional for backward-compatibility
 * with existing call sites (it's quietly ignored — the gradient is now
 * the canonical fallback). Future cleanups can drop the prop entirely.
 */
interface Props {
  /** @deprecated Ignored — gradient is the canonical fallback now. */
  illustration?: ComponentType<SVGProps<SVGSVGElement>>;
  src?: string;
  alt?: string;
  className?: string;
}

export function ProductImage({ src, alt = '', className }: Props) {
  const [imgOk, setImgOk] = useState(Boolean(src));
  useEffect(() => {
    setImgOk(Boolean(src));
  }, [src]);
  return (
    <>
      <div className={`fallback ${className ?? ''}`} aria-hidden="true" />
      {src && imgOk && (
        <img
          key={src}
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setImgOk(false)}
        />
      )}
    </>
  );
}
