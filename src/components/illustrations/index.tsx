/**
 * Bauhaus-style SVG fallbacks — one component per product.
 * Used as `<illustration />` on cards, PDP hero, cross-sells.
 *
 * All use preserveAspectRatio="xMidYMid slice" so they fill any
 * container regardless of aspect. The HTML/CSS layer above gives
 * each consumer its aspect-ratio (5/4 on cards, 1/1 on PDP stage).
 *
 * To upgrade a placeholder to a real photo, drop the file under
 * /public/assets/products/<id>.jpg and reference it in
 * `data/products.ts` via `imageSrc` / `heroImageSrc`. The wrapper
 * components (ProductImage / PdpStage) handle the fallback when
 * the file 404s.
 */
import type { SVGProps } from 'react';

const SVG = (
  props: SVGProps<SVGSVGElement>,
  viewBox: string,
  children: React.ReactNode
) => (
  <svg
    viewBox={viewBox}
    preserveAspectRatio="xMidYMid slice"
    {...props}
  >
    {children}
  </svg>
);

/* ───────── Schläger ───────── */
export const PadelRacketPro = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#FF7A1A" />
      <ellipse cx="200" cy="135" rx="80" ry="85" fill="none" stroke="#000" strokeWidth="6" />
      <g stroke="#000" strokeWidth="2.2">
        <line x1="160" y1="60"  x2="160" y2="210" />
        <line x1="200" y1="55"  x2="200" y2="215" />
        <line x1="240" y1="60"  x2="240" y2="210" />
        <line x1="130" y1="105" x2="270" y2="105" />
        <line x1="120" y1="135" x2="280" y2="135" />
        <line x1="130" y1="165" x2="270" y2="165" />
      </g>
      <rect x="190" y="220" width="20" height="65" fill="#000" />
      <rect x="186" y="276" width="28" height="10" fill="#000" />
      <text x="20" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="14" fontStyle="italic" fill="#000">PRO</text>
    </>
  ));

export const PadelRacketEdge = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#0A84FF" />
      <path d="M 130 50 L 270 50 L 280 220 L 120 220 Z" fill="none" stroke="#000" strokeWidth="6" />
      <g stroke="#000" strokeWidth="2.2">
        <line x1="160" y1="55"  x2="160" y2="220" />
        <line x1="200" y1="50"  x2="200" y2="220" />
        <line x1="240" y1="55"  x2="240" y2="220" />
        <line x1="128" y1="100" x2="275" y2="100" />
        <line x1="125" y1="140" x2="278" y2="140" />
        <line x1="122" y1="180" x2="282" y2="180" />
      </g>
      <rect x="190" y="220" width="20" height="65" fill="#000" />
      <rect x="186" y="276" width="28" height="10" fill="#000" />
      <text x="20" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="14" fontStyle="italic" fill="#000">EDGE</text>
    </>
  ));

/* ───────── Bälle ───────── */
export const BallsTournament = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#E84545" />
      <circle cx="130" cy="120" r="62" fill="#FFD60A" stroke="#000" strokeWidth="3" />
      <path d="M 75 120 Q 105 95 130 105 Q 155 95 185 120" stroke="#000" strokeWidth="3" fill="none" />
      <path d="M 75 120 Q 105 145 130 135 Q 155 145 185 120" stroke="#000" strokeWidth="3" fill="none" />
      <circle cx="220" cy="200" r="46" fill="#FFD60A" stroke="#000" strokeWidth="3" />
      <path d="M 180 200 Q 200 184 220 191 Q 240 184 260 200" stroke="#000" strokeWidth="2.5" fill="none" />
      <path d="M 180 200 Q 200 216 220 209 Q 240 216 260 200" stroke="#000" strokeWidth="2.5" fill="none" />
      <circle cx="305" cy="140" r="38" fill="#FFD60A" stroke="#000" strokeWidth="3" />
      <path d="M 273 140 Q 290 127 305 132 Q 320 127 337 140" stroke="#000" strokeWidth="2.2" fill="none" />
      <path d="M 273 140 Q 290 153 305 148 Q 320 153 337 140" stroke="#000" strokeWidth="2.2" fill="none" />
      <text x="20" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="14" fontStyle="italic" fill="#000">TOURNAMENT · 12er</text>
    </>
  ));

export const BallsThreePack = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#E84545" />
      <rect x="150" y="60" width="100" height="220" fill="#FFD60A" stroke="#000" strokeWidth="3" />
      <line x1="150" y1="130" x2="250" y2="130" stroke="#000" strokeWidth="2" />
      <line x1="150" y1="200" x2="250" y2="200" stroke="#000" strokeWidth="2" />
      <circle cx="200" cy="95"  r="22" fill="#FFD60A" stroke="#000" strokeWidth="2" />
      <circle cx="200" cy="165" r="22" fill="#FFD60A" stroke="#000" strokeWidth="2" />
      <circle cx="200" cy="235" r="22" fill="#FFD60A" stroke="#000" strokeWidth="2" />
      <path d="M 178 95  Q 200 80  222 95  M 178 95  Q 200 110 222 95"  stroke="#000" strokeWidth="1.5" fill="none" />
      <path d="M 178 165 Q 200 150 222 165 M 178 165 Q 200 180 222 165" stroke="#000" strokeWidth="1.5" fill="none" />
      <path d="M 178 235 Q 200 220 222 235 M 178 235 Q 200 250 222 235" stroke="#000" strokeWidth="1.5" fill="none" />
      <text x="20" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="14" fontStyle="italic" fill="#000">3er DOSE</text>
    </>
  ));

/* ───────── Apparel ───────── */
export const TeeBlack = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#0A84FF" />
      <path
        d="M 130 70 L 100 100 L 130 130 L 145 110 L 145 280 L 255 280 L 255 110 L 270 130 L 300 100 L 270 70 L 235 70 Q 235 95 200 95 Q 165 95 165 70 Z"
        fill="#FFFFFF" stroke="#000" strokeWidth="3"
      />
      <text x="200" y="200" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="36" fill="#000" letterSpacing="2">RITMO</text>
      <circle cx="200" cy="220" r="4" fill="#FF7A1A" />
      <text x="20" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="14" fontStyle="italic" fill="#000">TEE · BLACK PRINT</text>
    </>
  ));

export const HoodieCrew = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#FFD60A" />
      <path
        d="M 120 110 L 90 145 L 125 175 L 145 145 L 145 285 L 255 285 L 255 145 L 275 175 L 310 145 L 280 110 Q 240 130 200 130 Q 160 130 120 110 Z"
        fill="#0A0A0A" stroke="#000" strokeWidth="2.5"
      />
      <path
        d="M 165 60 Q 200 50 235 60 Q 235 100 200 110 Q 165 100 165 60 Z"
        fill="#0A0A0A" stroke="#000" strokeWidth="2.5"
      />
      <rect x="170" y="195" width="60" height="44" fill="none" stroke="#FF7A1A" strokeWidth="2" />
      <text x="200" y="225" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="20" fill="#FF7A1A" letterSpacing="2">RITMO</text>
      <text x="20" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="14" fontStyle="italic" fill="#000">HOODIE · CREW</text>
    </>
  ));

/* ───────── Prints ───────── */
export const PosterAppLive = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#FFFFFF" />
      <rect x="60" y="40" width="280" height="220" fill="#0A0A0A" stroke="#000" strokeWidth="2" />
      <text x="80" y="120" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="48" fill="#FFFFFF" letterSpacing="-1">DIE&nbsp;APP</text>
      <text x="80" y="180" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="48" fill="#FFFFFF" letterSpacing="-1">
        IST&nbsp;<tspan fill="#FF7A1A">LIVE</tspan>.
      </text>
      <rect x="80" y="225" width="240" height="6" fill="#FF7A1A" />
      <text x="80" y="252" fontFamily="sans-serif" fontWeight="700" fontSize="11" fill="rgba(255,255,255,0.6)" letterSpacing="3">RITMOPADEL.APP</text>
      <text x="20" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="14" fontStyle="italic" fill="#000">POSTER · A2</text>
    </>
  ));

export const PrintDna = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#FFFFFF" />
      <rect x="60" y="40" width="280" height="220" fill="#0A0A0A" />
      <circle cx="130" cy="125" r="50" fill="#FFD60A" />
      <rect x="180" y="80" width="90" height="90" fill="#E84545" />
      <polygon points="80,240 280,240 180,170" fill="#0A84FF" />
      <rect x="78" y="252" width="220" height="4" fill="#FF7A1A" />
      <text x="80" y="218" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="14" fill="#FFFFFF" letterSpacing="3">RITMO DNA</text>
      <text x="20" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="14" fontStyle="italic" fill="#000">PRINT · A3</text>
    </>
  ));

/* ───────── Generic feature visuals (used in PDP story sections) ───────── */
export const CarbonWeave = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#0A0A0A" />
      <g stroke="#FF7A1A" strokeWidth="1" opacity=".85">
        <path d="M0 60 L400 60 M0 90 L400 90 M0 120 L400 120 M0 150 L400 150 M0 180 L400 180 M0 210 L400 210 M0 240 L400 240" />
        <path d="M60 0 L60 320 M120 0 L120 320 M180 0 L180 320 M240 0 L240 320 M300 0 L300 320 M340 0 L340 320" />
      </g>
      <rect x="60" y="60" width="280" height="180" fill="none" stroke="#fff" strokeWidth="2" />
      <text x="80" y="280" fontFamily="sans-serif" fontWeight="900" fontSize="13" fontStyle="italic" fill="#fff" letterSpacing="3">3K · CARBON · WEAVE</text>
    </>
  ));

export const SoftCore = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#FFD60A" />
      <circle cx="200" cy="160" r="120" fill="none" stroke="#000" strokeWidth="3" />
      <circle cx="200" cy="160" r="80" fill="none" stroke="#000" strokeWidth="2" />
      <circle cx="200" cy="160" r="40" fill="#FF7A1A" />
      <text x="200" y="166" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="20" fill="#000">SOFT</text>
      <text x="22" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="13" fontStyle="italic" fill="#000" letterSpacing="3">EVA · SWEET-SPOT</text>
    </>
  ));

export const DiamondGeo = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#0A0A0A" />
      <polygon points="200,40 360,280 40,280" fill="none" stroke="#0A84FF" strokeWidth="3" />
      <polygon points="200,90 320,260 80,260" fill="none" stroke="#FF7A1A" strokeWidth="2" />
      <circle cx="200" cy="220" r="34" fill="#0A84FF" />
      <text x="22" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="13" fontStyle="italic" fill="#fff" letterSpacing="3">SWEET-SPOT · OBEN</text>
    </>
  ));

export const HardCore = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#E84545" />
      <rect x="100" y="80" width="200" height="160" fill="#0A0A0A" />
      <rect x="110" y="90" width="180" height="140" fill="none" stroke="#FFD60A" strokeWidth="2" />
      <text x="200" y="170" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="36" fill="#FFD60A">55°</text>
      <text x="22" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="13" fontStyle="italic" fill="#000" letterSpacing="3">SHORE · HART</text>
    </>
  ));

export const PressurelessSpec = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#0A0A0A" />
      <circle cx="100" cy="160" r="20" fill="#FFD60A" />
      <circle cx="170" cy="160" r="20" fill="#FFD60A" />
      <circle cx="240" cy="160" r="20" fill="#FFD60A" />
      <circle cx="310" cy="160" r="20" fill="#FFD60A" />
      <line x1="80" y1="220" x2="330" y2="220" stroke="#FF7A1A" strokeWidth="2" />
      <text x="22" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="13" fontStyle="italic" fill="#fff" letterSpacing="3">SPRUNG · KONSTANT</text>
    </>
  ));

export const FeltDetail = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#FFD60A" />
      <circle cx="200" cy="160" r="100" fill="#FFD60A" stroke="#000" strokeWidth="3" />
      <path d="M 100 160 Q 150 110 200 130 Q 250 110 300 160" stroke="#000" strokeWidth="3" fill="none" />
      <path d="M 100 160 Q 150 210 200 190 Q 250 210 300 160" stroke="#000" strokeWidth="3" fill="none" />
      <text x="22" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="13" fontStyle="italic" fill="#000" letterSpacing="3">FILZ · HOCH</text>
    </>
  ));

export const PopCan = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#0A0A0A" />
      <rect x="160" y="60" width="80" height="200" fill="#FFD60A" stroke="#FF7A1A" strokeWidth="3" />
      <circle cx="200" cy="160" r="22" fill="#FF7A1A" />
      <text x="200" y="166" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="14" fill="#000">POP</text>
    </>
  ));

export const BoxyCut = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#0A0A0A" />
      <path d="M 120 60 L 280 60 L 280 280 L 120 280 Z" fill="none" stroke="#FF7A1A" strokeWidth="3" />
      <line x1="160" y1="60" x2="160" y2="280" stroke="#FFD60A" strokeWidth="2" strokeDasharray="4 4" />
      <line x1="240" y1="60" x2="240" y2="280" stroke="#FFD60A" strokeWidth="2" strokeDasharray="4 4" />
      <text x="22" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="13" fontStyle="italic" fill="#fff" letterSpacing="3">BOXY · CUT</text>
    </>
  ));

export const FabricWeight = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#FFD60A" />
      <text x="200" y="170" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="68" fill="#000">240</text>
      <text x="200" y="210" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="16" fill="#000" letterSpacing="3">G / M²</text>
    </>
  ));

export const HoodieWeight = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#0A0A0A" />
      <text x="200" y="180" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="84" fill="#FF7A1A">400</text>
      <text x="200" y="220" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="16" fill="#fff" letterSpacing="3">G / M²</text>
    </>
  ));

export const HoodiePrint = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#FF7A1A" />
      <rect x="100" y="80" width="200" height="160" fill="none" stroke="#000" strokeWidth="3" />
      <text x="200" y="180" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontStyle="italic" fontSize="38" fill="#000" letterSpacing="2">RITMO</text>
      <circle cx="200" cy="210" r="6" fill="#000" />
    </>
  ));

export const PosterPaper = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#0A0A0A" />
      <rect x="50" y="40" width="300" height="240" fill="#FFFFFF" />
      <rect x="70" y="60" width="260" height="200" fill="#0A0A0A" />
      <rect x="80" y="240" width="240" height="4" fill="#FF7A1A" />
      <text x="22" y="304" fontFamily="sans-serif" fontWeight="900" fontSize="13" fontStyle="italic" fill="#fff" letterSpacing="3">250 G/M² · MATT</text>
    </>
  ));

export const DnaDetail = (p: SVGProps<SVGSVGElement>) =>
  SVG(p, '0 0 400 320', (
    <>
      <rect width="400" height="320" fill="#0A0A0A" />
      <circle cx="100" cy="160" r="50" fill="#FFD60A" />
      <rect x="170" y="110" width="100" height="100" fill="#E84545" />
      <polygon points="290,210 380,210 335,130" fill="#0A84FF" />
      <rect x="40" y="270" width="320" height="4" fill="#FF7A1A" />
    </>
  ));
