import { useState, type ComponentType, type SVGProps } from 'react';

/**
 * The image-with-Bauhaus-fallback pattern, ported to React.
 *
 * Renders the SVG illustration unconditionally; layers a real photo
 * on top with z-index 1. If the photo fails to load (file missing,
 * 404, etc.), we unmount the <img> and the SVG underneath stays visible.
 * Identical effect to the old `onerror="this.remove()"` trick.
 */
interface Props {
  illustration: ComponentType<SVGProps<SVGSVGElement>>;
  src?: string;
  alt?: string;
  className?: string;
}

export function ProductImage({ illustration: Illustration, src, alt = '', className }: Props) {
  const [imgOk, setImgOk] = useState(Boolean(src));
  return (
    <>
      <Illustration className={`fallback ${className ?? ''}`} />
      {src && imgOk && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setImgOk(false)}
        />
      )}
    </>
  );
}
