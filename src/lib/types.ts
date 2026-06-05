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

  /**
   * When true, the product is unavailable. PDP CTA + cards reflect it
   * (sold-out badge, dim image, disabled add-to-cart). For "everything
   * sold out for now", flip `SOLDOUT_ALL` in `data/products.ts` instead.
   */
  soldOut?: boolean;
}

/* ───────── Events ───────── */
/** Event taxonomy — must match filter-chip ids on /events. */
export type EventType = 'turnier' | 'demo' | 'training' | 'popup';

export const EVENT_TYPE_LABEL: Record<EventType, string> = {
  turnier:  'Turnier',
  demo:     'Demo Day',
  training: 'Training',
  popup:    'Pop-up',
};

/** Optional shorthand for CSS variant class (added to .event-type-badge). */
export const EVENT_TYPE_TONE: Record<EventType, string> = {
  turnier:  'orange',
  demo:     'yellow',
  training: 'blue',
  popup:    'red',
};

/**
 * One ticket tier within an event. Events can have several (e.g. a
 * tournament with player tickets + spectator tickets at different prices).
 * Use `EventItem.tickets` for the multi-tier case; the flat `price` field
 * is kept for single-tier events.
 */
export interface TicketTier {
  name: string;                          // "Spieler", "Zuschauer", …
  price: number;                         // EUR
  capacity?: number;                     // undefined = unlimited
  status?: 'open' | 'soldout' | 'waitlist';
}

export interface EventItem {
  /** URL slug — kept short, lower-kebab. */
  id: string;
  type: EventType;
  title: string;
  /** Optional secondary heading shown below the title (e.g. "Founders Edition"). */
  subtitle?: string;
  /** ISO date string (yyyy-mm-dd) for the start. Sorting key. */
  date: string;
  /** ISO end date for multi-day events. Optional. */
  endDate?: string;
  /** Single line like "RITMO Center · Berlin" or just "Hamburg". */
  location: string;
  /** Optional venue name shown above the city if you want a 2-line venue. */
  venue?: string;
  shortDesc: string;

  /** Multi-tier ticket pricing — preferred over flat `price` when present. */
  tickets?: TicketTier[];
  /** Sale-window dates — surfaces a "Verkauf ab/bis" mini-info on the card. */
  salesStart?: string;
  salesEnd?: string;
  /** Free-form display chips next to the type badge (e.g. "House Music"). */
  tags?: string[];

  /** Single-tier price (EUR). 0 = free. Undefined = "auf Anfrage". */
  price?: number;
  capacity?: number;
  status?: 'open' | 'soldout' | 'waitlist';
  ctaLabel?: string;
  /** External ticketing / signup URL (Eventbrite, Mailchimp form, etc.). */
  ctaUrl?: string;

  /* ─── Detail-page fields (optional) ─────────────────────────── */

  /** Hero image for the detail page (path under public/, optional). */
  heroImageSrc?: string;

  /** Multi-paragraph long description rendered as the detail-page lead. */
  longDesc?: string[];

  /** Schedule rows for the program timeline: time + title + optional note. */
  schedule?: Array<{ time: string; title: string; note?: string }>;

  /** High-level program phases (e.g. group stage / KO / sunset session). */
  program?: Array<{ phase: string; details: string }>;

  /** FAQ entries shown as an accordion-style list. */
  faq?: Array<{ q: string; a: string }>;

  /** Venue information block. Strings here support inline links. */
  venueInfo?: {
    name: string;
    address?: string;
    web?: string;
    blurb?: string;
  };

  /** Partner badge — e.g. "in Kooperation mit Padel Haus". */
  partner?: { name: string; web?: string };

  /**
   * Catering / food + drink stations on site. Each renders as a card
   * with optional image placeholder (Bauhaus SVG fallback if imageSrc
   * fails to load).
   */
  catering?: Array<{
    name: string;          // "RITMO Refresh Bar"
    tagline?: string;      // "Obstbar"
    description: string;
    imageSrc?: string;     // /assets/events/<id>-<station>.jpg
  }>;

  /**
   * Music block — DJ headliner + optional follow-up section.
   * Single object since most events have one main music story.
   */
  music?: {
    djName: string;        // "ANKOE"
    setTitle?: string;     // "Ready Mix für RITMO X Padel Haus"
    description: string;
    followUp?: string;     // "Danach: LNRT House Music bis Mitternacht"
    imageSrc?: string;
  };

  /**
   * RITMO Match Tier bonus system. Group-phase matches get tier-rated
   * by opponent quality; winning a higher-tier match earns more bonus
   * points on top of the regular point race.
   */
  scoring?: {
    title: string;         // "RITMO Match Tiers"
    description: string;
    tiers: Array<{
      tier: string;        // "S", "A", "B", "C", "X"
      bonus: number;       // +4, +3, +2, +1, 0
      label?: string;      // optional descriptor, e.g. "Top-Pairings"
    }>;
  };
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
