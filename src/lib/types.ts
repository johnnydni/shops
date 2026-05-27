/**
 * Shared types across the SPA.
 * Wherever it makes sense, the types here mirror the server-side
 * shape used by `worker/src/catalog.js` (single source of truth for
 * price). Keep them in sync when adding products or variants.
 */
import type { ComponentType, SVGProps } from 'react';

/** Top-level category — must match `data-cat` filter chip ids. */
export type Category = 'schlaeger' | 'baelle' | 'apparel' | 'prints' | 'tech';

/** Display label per category (German). */
export const CATEGORY_LABEL: Record<Category, string> = {
  schlaeger: 'Schläger',
  baelle: 'Bälle',
  apparel: 'Apparel',
  prints: 'Print-Editionen',
  tech: 'Smart Gear',
};

/* ───────── Variants ───────── */
/**
 * A pickable option group on a PDP, e.g. "Größe" with [S, M, L, XL].
 * `priceDelta` is in EUR (not cents) — added to base price. The server
 * has the same map in cents; both must agree. UI-only labels can vary
 * (e.g. "M" vs "M (out of stock)") but the `value` must be stable.
 */
export interface VariantOption {
  value: string;          // canonical key (matches worker variantPriceMap)
  label?: string;         // optional display override
  priceDelta?: number;    // EUR, default 0
  swatch?: 'black' | 'white' | 'orange' | 'yellow' | 'blue' | 'pink';
  /**
   * Optional product image for this specific option. When set, picking
   * this variant swaps the PDP hero image. Typically attached to colour
   * variants — size/format options usually leave this empty.
   * Path relative to public/, e.g. `/assets/products/<slug>/<slug>-<farbe>.jpg`.
   */
  image?: string;
}

export interface VariantGroup {
  label: string;          // "Größe", "Farbe", "Format", …
  options: VariantOption[];
  defaultValue?: string;  // defaults to options[0].value
}

/* ───────── Story / spec / video building blocks ───────── */
export interface FeatureSection {
  eyebrow: string;        // "01 · Material"
  title: string;          // headline; supports "<span class='accent'>…</span>" via dangerouslySetInnerHTML in component
  titleAccent?: string;   // accent half of the title, if you want it composed safely
  body: string[];         // paragraphs
  reverse?: boolean;      // image on right vs left
  alt?: boolean;          // alt background section
  visual: ComponentType<SVGProps<SVGSVGElement>>;
  imageSrc?: string;      // optional real photo path; failing image falls back to <visual>
}

export interface EditorialBleed {
  title: string;
  titleAccent?: string;
  body: string;
}

export interface SpecRow { label: string; value: string }

/**
 * A single video slot. Kind decides the renderer:
 *  - 'placeholder'  → animated Bauhaus tile, no real source yet
 *  - 'mp4'          → <video poster src> self-hosted
 *  - 'youtube'      → click-to-load lite embed
 *  - 'vimeo'        → click-to-load lite embed
 *
 * Add as many as you like under product.videos — they render in
 * the "Vorschau" gallery section above specs.
 */
export type VideoKind = 'placeholder' | 'mp4' | 'youtube' | 'vimeo';

export interface VideoItem {
  kind: VideoKind;
  title: string;
  subtitle?: string;
  duration?: string;      // "2:14"
  tag?: string;           // "Test", "Erklärung", "Unboxing"
  src?: string;           // mp4 url, or 'youtube'/'vimeo' video id
  posterSrc?: string;     // optional preview image
}

/* ───────── Product ───────── */
export interface Product {
  /** URL slug AND server catalog id — keep identical to worker key. */
  id: string;
  slug: string;
  category: Category;
  name: string;
  /** Optional accent in the name, e.g. "RITMO <Pro>". */
  nameAccent?: string;
  eyebrow: string;        // small uppercase tag above the name
  tagline: string;        // short paragraph below the name
  shortDesc: string;      // single line for the home card

  /** Base price in EUR. Server has the same in cents. */
  price: number;

  variants?: VariantGroup[];

  flag?: { label: string; tone?: 'soon' | 'new' };

  /** Shared illustration component — used on card, PDP hero, crosssell. */
  illustration: ComponentType<SVGProps<SVGSVGElement>>;
  /** Optional real photo paths; missing → fallback to illustration. */
  imageSrc?: string;
  heroImageSrc?: string;

  story: FeatureSection[];
  bleed?: EditorialBleed;
  videos?: VideoItem[];
  specs: SpecRow[];

  /** Slugs of related products to show in the cross-sell row. */
  related?: string[];

  /** Trust badges in the PDP hero info panel (3 cells). */
  trust?: Array<{ label: string; value: string }>;
}

/* ───────── Cart ───────── */
export interface CartLine {
  id: string;
  name: string;
  cat: string;
  price: number;          // EUR, includes variant delta — DISPLAY only
  qty: number;
  variant?: string;       // "A / B / C"
  img?: string;
}
