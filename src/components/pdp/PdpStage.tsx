import type { ComponentType, SVGProps } from 'react';
import { ProductImage } from '../shop/ProductImage';

interface Props {
  illustration: ComponentType<SVGProps<SVGSVGElement>>;
  imageSrc?: string;
  alt: string;
}

/**
 * The square 1:1 hero stage on a PDP. Holds the product image plus
 * the animated blur-blob background behind it (the orange/blue
 * glow that gives the luxury feel).
 */
export function PdpStage({ illustration, imageSrc, alt }: Props) {
  return (
    <div className="pdp-stage si">
      <div className="pdp-bg" aria-hidden="true" />
      <ProductImage illustration={illustration} src={imageSrc} alt={alt} />
    </div>
  );
}
