import { useParams, Navigate } from 'react-router-dom';
import { getProductBySlug, getRelated } from '../data/products';
import { CATEGORY_LABEL } from '../lib/types';
import { Crumbs } from '../components/ui/Crumbs';
import { PdpHero } from '../components/pdp/PdpHero';
import { FeatureBlock } from '../components/pdp/FeatureBlock';
import { EditorialBleed } from '../components/pdp/EditorialBleed';
import { VideoGallery } from '../components/pdp/VideoGallery';
import { SpecsTable } from '../components/pdp/SpecsTable';
import { CrossSell } from '../components/pdp/CrossSell';
import { StickyBuyBar } from '../components/pdp/StickyBuyBar';
import { useStickyBuyBar } from '../hooks/useStickyBuyBar';

/**
 * Single PDP component, parameterised by `:slug`. Replaces the 8
 * hand-written HTML files from the previous static version.
 */
export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;
  const { anchorRef, visible } = useStickyBuyBar<HTMLDivElement>();

  if (!product) return <Navigate to="/" replace />;

  const related = getRelated(product);
  const categoryLabel = CATEGORY_LABEL[product.category];

  return (
    <>
      <Crumbs
        items={[
          { label: 'Shop', to: '/' },
          { label: categoryLabel, to: '/sortiment' },
          { label: product.name },
        ]}
      />

      <PdpHero product={product} ctaRef={anchorRef} />

      {product.story[0] && <FeatureBlock feature={product.story[0]} id="story" />}
      {product.story.slice(1).map((s, i) => (
        <FeatureBlock key={i} feature={s} />
      ))}

      {product.bleed && <EditorialBleed data={product.bleed} />}

      {product.videos && product.videos.length > 0 && (
        <VideoGallery videos={product.videos} />
      )}

      <SpecsTable rows={product.specs} />

      <CrossSell products={related} />

      <StickyBuyBar product={product} visible={visible} />
    </>
  );
}
