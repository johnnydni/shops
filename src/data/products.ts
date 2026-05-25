/**
 * ═══════════════════════════════════════════════════════════════════
 * RITMO Shop — Frontend product catalog
 * ───────────────────────────────────────────────────────────────────
 * Every detail rendered by the SPA lives here. The PDP component
 * reads one of these entries by URL slug; the home grid maps over
 * all of them; the cart looks up illustrations and category labels
 * by id.
 *
 * SYNC INVARIANT: `id`, `price`, and `variants[].options[].priceDelta`
 * must mirror worker/src/catalog.js. The worker re-prices at checkout
 * — if these two drift, the customer sees one total and gets charged
 * another. When you change a price in one file, change the other.
 *
 * Adding a product:
 *   1. Add an SVG illustration in components/illustrations/index.tsx
 *   2. Add an entry here
 *   3. Add the matching entry to worker/src/catalog.js
 *   4. (optional) Drop a real photo at /public/assets/products/<id>.jpg
 * ═══════════════════════════════════════════════════════════════════
 */
import type { Product } from '../lib/types';
import {
  PadelRacketPro, PadelRacketEdge,
  BallsTournament, BallsThreePack,
  TeeBlack, HoodieCrew,
  PosterAppLive, PrintDna,
  CarbonWeave, SoftCore, DiamondGeo, HardCore,
  PressurelessSpec, FeltDetail, PopCan,
  BoxyCut, FabricWeight, HoodieWeight, HoodiePrint,
  PosterPaper, DnaDetail,
} from '../components/illustrations';

export const PRODUCTS: Product[] = [
  /* ─────────────────────────────────────────────────────────────── */
  {
    id: 'schlaeger-pro',
    slug: 'schlaeger-pro',
    category: 'schlaeger',
    name: 'RITMO Pro',
    nameAccent: 'Pro',
    eyebrow: 'Schläger · Flagship',
    tagline: 'Carbon-3K Rahmen, EVA-Soft-Kern, runde Form. Gebaut für Spieler:innen, die Kontrolle nicht gegen Punch tauschen wollen — sondern beides wollen. Limited Drop, nummeriert.',
    shortDesc: 'Carbon-3K Rahmen, EVA-Soft-Kern, runde Form. Für Spieler:innen mit Kontrolle & Punch.',
    price: 189,
    illustration: PadelRacketPro,
    imageSrc: '/assets/products/schlaeger-pro.jpg',
    heroImageSrc: '/assets/products/schlaeger-pro.jpg',
    flag: { label: 'Flagship', tone: 'soon' },
    variants: [
      {
        label: 'Griff-Größe',
        defaultValue: 'M',
        options: [
          { value: 'S' }, { value: 'M' }, { value: 'L' },
        ],
      },
      {
        label: 'Farbe',
        defaultValue: 'Orange',
        options: [
          { value: 'Orange',  swatch: 'orange' },
          { value: 'Schwarz', swatch: 'black'  },
          { value: 'Gelb',    swatch: 'yellow' },
        ],
      },
    ],
    trust: [
      { label: 'Versand',   value: '2–4 Werktage · DACH frei' },
      { label: 'Garantie',  value: '12 Monate Rahmen' },
      { label: 'Rückgabe',  value: '30 Tage, ohne Wenn' },
    ],
    story: [
      {
        eyebrow: '01 · Material',
        title: 'Carbon-3K.',
        titleAccent: 'Steif. Leicht. Ehrlich.',
        body: [
          'Dreilagiges 3K-Carbongewebe im Rahmen. Hohe Torsionssteifigkeit für saubere Energieübertragung — und ein Gefühl, das nach jedem Treffer sofort sagt, wo der Ball war.',
          'Kein Marketing-Composite. Kein Glasfaser-Anteil. Reines 3K, handgelegt.',
        ],
        visual: CarbonWeave,
      },
      {
        eyebrow: '02 · Kern',
        title: 'EVA-Soft-Kern.',
        titleAccent: 'Spürbar weicher.',
        body: [
          'Eine weichere EVA-Mischung gibt dem Ball mehr Kontaktzeit auf der Schlagfläche. Resultat: lange, kontrollierte Bandeja — und ein satter Sound, wenn du draufdrückst.',
          'Plus: Vibration im Unterarm geht runter. Spürbar.',
        ],
        reverse: true,
        alt: true,
        visual: SoftCore,
      },
    ],
    bleed: {
      title: 'Für die,',
      titleAccent: 'die Padel ernst meinen.',
      body: 'Nicht für jede:n. Aber wenn du den Pro einmal gespielt hast, verstehst du, warum die ersten 200 Stück bereits weg sind.',
    },
    videos: [
      { kind: 'placeholder', title: 'Erste Eindrücke', subtitle: 'Auspacken, Hand-Feel, erste Schläge.', tag: 'Unboxing', duration: '2:14' },
      { kind: 'placeholder', title: 'Pro vs. Edge',    subtitle: 'Direkter Vergleich der beiden Modelle.', tag: 'Test',     duration: '4:38' },
      { kind: 'placeholder', title: 'Bandeja-Drill',   subtitle: 'Wie sich der Soft-Core auf der Bandeja spielt.', tag: 'Erklärung', duration: '3:02' },
    ],
    specs: [
      { label: 'Form',          value: 'Rund · symmetrisch' },
      { label: 'Rahmen',        value: 'Carbon 3K, dreilagig' },
      { label: 'Schlagfläche',  value: 'Carbon 3K, gerauht' },
      { label: 'Kern',          value: 'Soft EVA · 40 shore' },
      { label: 'Gewicht',       value: '365 – 385 g' },
      { label: 'Balance',       value: 'Neutral' },
      { label: 'Sweet-Spot',    value: 'Mittig, großflächig' },
      { label: 'Spiel-Profil',  value: 'Kontrolle + Punch' },
      { label: 'Level',         value: 'Fortgeschritten – Profi' },
      { label: 'Lieferumfang',  value: 'Schläger · Schutzhülle · Kettenband' },
      { label: 'Garantie',      value: '12 Monate auf den Rahmen' },
    ],
    related: ['balls-tournament', 'tee-schwarz', 'schlaeger-edge'],
  },

  /* ─────────────────────────────────────────────────────────────── */
  {
    id: 'schlaeger-edge',
    slug: 'schlaeger-edge',
    category: 'schlaeger',
    name: 'RITMO Edge',
    nameAccent: 'Edge',
    eyebrow: 'Schläger · Power',
    tagline: 'Diamantform, harte EVA, kompromisslose Smash-Power. Für die, die am Netz wohnen — und jeden Ball aufmachen wollen.',
    shortDesc: 'Diamantform, harte EVA, maximale Power. Für aggressive Netz-Spieler.',
    price: 159,
    illustration: PadelRacketEdge,
    imageSrc: '/assets/products/schlaeger-edge.jpg',
    heroImageSrc: '/assets/products/schlaeger-edge.jpg',
    variants: [
      { label: 'Griff-Größe', defaultValue: 'M', options: [{ value: 'S' }, { value: 'M' }, { value: 'L' }] },
      { label: 'Farbe', defaultValue: 'Blau', options: [
        { value: 'Blau', swatch: 'blue' },
        { value: 'Schwarz', swatch: 'black' },
      ]},
    ],
    trust: [
      { label: 'Versand',   value: '2–4 Werktage' },
      { label: 'Garantie',  value: '12 Monate' },
      { label: 'Rückgabe',  value: '30 Tage' },
    ],
    story: [
      {
        eyebrow: '01 · Geometrie',
        title: 'Diamant.',
        titleAccent: 'Power über Kontrolle.',
        body: [
          'Die Diamantform verschiebt den Sweet-Spot Richtung Schlägerkopf — mehr Hebel, mehr Beschleunigung, mehr Knall. Wer mit dem Edge smashed, merkt\'s beim ersten Ball.',
          'Nicht der einfachste Schläger. Aber wenn dein Spiel sitzt: der härteste.',
        ],
        visual: DiamondGeo,
      },
      {
        eyebrow: '02 · Härte',
        title: 'Harte EVA.',
        titleAccent: 'Direkter Punch.',
        body: [
          '55-shore EVA-Kern. Kürzere Kontaktzeit, härteres Feedback — der Ball fliegt ab, nicht hinaus.',
          'Carbon-Schlagflächen vorne und hinten, gerauht für maximalen Topspin auf dem Smash.',
        ],
        reverse: true,
        alt: true,
        visual: HardCore,
      },
    ],
    bleed: {
      title: 'Du wohnst',
      titleAccent: 'am Netz?',
      body: 'Dann ist der Edge der Schläger, der dir gehört.',
    },
    videos: [
      { kind: 'placeholder', title: 'Smash-Drill',      subtitle: 'Wie die Diamantform Smashes beschleunigt.',           tag: 'Test',       duration: '3:21' },
      { kind: 'placeholder', title: 'Edge vs. Konkurrenz', subtitle: 'Direkter Vergleich mit klassischen Power-Schlägern.', tag: 'Erklärung', duration: '5:12' },
    ],
    specs: [
      { label: 'Form',         value: 'Diamant' },
      { label: 'Rahmen',       value: 'Carbon 3K' },
      { label: 'Schlagfläche', value: 'Carbon 3K · gerauht' },
      { label: 'Kern',         value: 'Hard EVA · 55 shore' },
      { label: 'Gewicht',      value: '360 – 380 g' },
      { label: 'Balance',      value: 'Kopflastig' },
      { label: 'Sweet-Spot',   value: 'Oberer Schlägerkopf' },
      { label: 'Spiel-Profil', value: 'Power / Smash' },
      { label: 'Level',        value: 'Fortgeschritten – Profi' },
      { label: 'Lieferumfang', value: 'Schläger · Schutzhülle · Kettenband' },
      { label: 'Garantie',     value: '12 Monate' },
    ],
    related: ['schlaeger-pro', 'balls-tournament', 'hoodie-crew'],
  },

  /* ─────────────────────────────────────────────────────────────── */
  {
    id: 'balls-tournament',
    slug: 'balls-tournament',
    category: 'baelle',
    name: 'Tournament 12er',
    nameAccent: '12er',
    eyebrow: 'Bälle · Turnier',
    tagline: 'Drucklose Wettkampf-Bälle nach FIP-Spezifikation. 4 Drei-Pack-Dosen. Genau das, was du fürs nächste Turnier brauchst — oder fürs nächste Heim-Training.',
    shortDesc: 'Drucklose Padel-Bälle in Turnier-Qualität. 4 Drei-Pack-Dosen.',
    price: 34,
    illustration: BallsTournament,
    imageSrc: '/assets/products/balls-tournament.jpg',
    heroImageSrc: '/assets/products/balls-tournament.jpg',
    variants: [
      { label: 'Stückzahl', defaultValue: '12er', options: [
        { value: '12er', label: '12er' },
        { value: '24er', label: '24er · €64', priceDelta: 30 },
        { value: '36er', label: '36er · €89', priceDelta: 55 },
      ]},
    ],
    trust: [
      { label: 'Versand',     value: '1–3 Werktage' },
      { label: 'FIP-Standard',value: 'Tournament-spec' },
      { label: 'Rückgabe',    value: '30 Tage' },
    ],
    story: [
      {
        eyebrow: '01 · Druck',
        title: 'Drucklos.',
        titleAccent: 'Konstant.',
        body: [
          'Drucklose Bauweise heißt: die Sprunghöhe bleibt vom ersten bis zum letzten Schlag identisch. Keine Dose öffnen, keine Frische riechen — einfach spielen.',
        ],
        visual: PressurelessSpec,
      },
      {
        eyebrow: '02 · Filz',
        title: 'Hochfilziger Spielball.',
        titleAccent: 'Mehr Spin, mehr Kontrolle.',
        body: [
          'Dichter Wollfilz, hoher Naturkautschuk-Anteil. Spin lädt schneller auf, Topspin-Bandejas bleiben länger im Feld.',
        ],
        reverse: true,
        alt: true,
        visual: FeltDetail,
      },
    ],
    videos: [
      { kind: 'placeholder', title: 'Spielverhalten',  subtitle: 'Wie sich die Tournament-Bälle nach 2 Stunden anfühlen.', tag: 'Test',      duration: '2:48' },
      { kind: 'placeholder', title: 'Drucklos erklärt', subtitle: 'Was "drucklos" technisch bedeutet — und warum es zählt.', tag: 'Erklärung', duration: '3:55' },
    ],
    specs: [
      { label: 'Inhalt',     value: '12 Bälle · 4 Drei-Pack-Dosen' },
      { label: 'Bauart',     value: 'Drucklos' },
      { label: 'Durchmesser',value: '6.35 – 6.77 cm' },
      { label: 'Gewicht',    value: '56.0 – 59.4 g' },
      { label: 'Sprunghöhe', value: '135 – 145 cm (von 2.54 m)' },
      { label: 'Filz',       value: 'Hochdichter Wollfilz' },
      { label: 'Kern',       value: 'Naturkautschuk-Mischung' },
      { label: 'Standard',   value: 'FIP Tournament-spec' },
      { label: 'Verpackung', value: '4 wiederverschließbare Dosen' },
    ],
    related: ['schlaeger-pro', 'balls-3pack'],
  },

  /* ─────────────────────────────────────────────────────────────── */
  {
    id: 'balls-3pack',
    slug: 'balls-3pack',
    category: 'baelle',
    name: 'RITMO Ball Set',
    nameAccent: 'Ball Set',
    eyebrow: 'Bälle · Standard',
    tagline: 'Die klassische 3er-Dose. Druckkonserviert, frisch geöffnet, sofort spielbereit. Für Training, Match oder spontane Padel-Sessions.',
    shortDesc: 'Klassische Drei-Pack-Dose, perfekt fürs nächste Match.',
    price: 9,
    illustration: BallsThreePack,
    imageSrc: '/assets/products/balls-3pack.jpg',
    heroImageSrc: '/assets/products/balls-3pack.jpg',
    variants: [
      { label: 'Menge', defaultValue: '1 Dose', options: [
        { value: '1 Dose',  label: '1 Dose · €9' },
        { value: '3 Dosen', label: '3 Dosen · €25', priceDelta: 16 },
        { value: '6 Dosen', label: '6 Dosen · €49', priceDelta: 40 },
      ]},
    ],
    trust: [
      { label: 'Versand',    value: '1–3 Werktage' },
      { label: 'Verpackung', value: 'Wiederverschließbar' },
      { label: 'Rückgabe',   value: '30 Tage' },
    ],
    story: [
      {
        eyebrow: '01 · Frische',
        title: 'Druck-Dose.',
        titleAccent: 'Auf Pop.',
        body: [
          'Bei jeder neuen Dose hörst du das vertraute „Pssss" — und weißt: jetzt geht\'s los. Der Druck hält die Sprunghöhe knackig.',
        ],
        visual: PopCan,
      },
    ],
    videos: [
      { kind: 'placeholder', title: '3er vs. 12er', subtitle: 'Wann lohnt sich welche Dose?', tag: 'Erklärung', duration: '2:12' },
    ],
    specs: [
      { label: 'Inhalt',     value: '3 Bälle · 1 Druck-Dose' },
      { label: 'Bauart',     value: 'Druck-konserviert' },
      { label: 'Durchmesser',value: '6.35 – 6.77 cm' },
      { label: 'Gewicht',    value: '56.0 – 59.4 g' },
      { label: 'Filz',       value: 'Wollfilz · matchtauglich' },
      { label: 'Standard',   value: 'Spiel-Niveau Amateur – Vereins-Match' },
      { label: 'Verpackung', value: 'Wiederverschließbar' },
    ],
    related: ['balls-tournament', 'schlaeger-pro'],
  },

  /* ─────────────────────────────────────────────────────────────── */
  {
    id: 'tee-schwarz',
    slug: 'tee-schwarz',
    category: 'apparel',
    name: 'RITMO Tee',
    nameAccent: 'Tee',
    eyebrow: 'Apparel · Oversized',
    tagline: 'Heavy 240 g/m² Cotton, oversized geschnitten, italic Brust-Print. Trägt sich nach dem ersten Match wie ein Lieblings-Shirt — ohne die nervigen Falten am Saum.',
    shortDesc: 'Weiches Heavy-Cotton, oversized Cut, italic Brust-Logo. S–XXL.',
    price: 39,
    illustration: TeeBlack,
    imageSrc: '/assets/products/tee-schwarz.jpg',
    heroImageSrc: '/assets/products/tee-schwarz.jpg',
    variants: [
      { label: 'Größe', defaultValue: 'M', options: [
        { value: 'S' }, { value: 'M' }, { value: 'L' }, { value: 'XL' }, { value: 'XXL' },
      ]},
      { label: 'Farbe', defaultValue: 'Schwarz', options: [
        { value: 'Schwarz', swatch: 'black' },
        { value: 'Weiß',    swatch: 'white' },
        { value: 'Orange',  swatch: 'orange' },
      ]},
    ],
    trust: [
      { label: 'Versand',  value: '2–4 Werktage' },
      { label: 'Material', value: '100% Bio-Baumwolle' },
      { label: 'Rückgabe', value: '30 Tage' },
    ],
    story: [
      {
        eyebrow: '01 · Cut',
        title: 'Oversized.',
        titleAccent: 'Aber kein Sack.',
        body: [
          'Boxy Schnitt mit fallenden Schultern. Etwas länger als Standard. Lässig genug für After-Match, sauber genug für die Couch davor.',
        ],
        visual: BoxyCut,
      },
      {
        eyebrow: '02 · Stoff',
        title: '240 g/m².',
        titleAccent: 'Substanz, kein Papier.',
        body: [
          'Schwerer Single-Jersey aus 100% Bio-Baumwolle. Garngefärbt, weich gewaschen — Farbe bleibt, Schnitt bleibt, Print bleibt.',
          'Fair produziert in Portugal.',
        ],
        reverse: true,
        alt: true,
        visual: FabricWeight,
      },
    ],
    videos: [
      { kind: 'placeholder', title: 'Fit & Cut',     subtitle: 'Wie der Boxy-Cut auf S, M und L sitzt.',           tag: 'Test', duration: '2:05' },
      { kind: 'placeholder', title: 'Stoff-Detail',  subtitle: 'Close-up auf den 240 g Single-Jersey.',           tag: 'Erklärung', duration: '1:42' },
    ],
    specs: [
      { label: 'Material', value: '100% Bio-Baumwolle (GOTS)' },
      { label: 'Gewicht',  value: '240 g/m² · Single-Jersey' },
      { label: 'Cut',      value: 'Oversized · Boxy' },
      { label: 'Größen',   value: 'S · M · L · XL · XXL' },
      { label: 'Farben',   value: 'Schwarz · Weiß · Orange' },
      { label: 'Druck',    value: 'Wasserbasierter Siebdruck' },
      { label: 'Herkunft', value: 'Made in Portugal' },
      { label: 'Pflege',   value: '30°C · auf links · nicht bleichen' },
    ],
    related: ['hoodie-crew', 'print-dna'],
  },

  /* ─────────────────────────────────────────────────────────────── */
  {
    id: 'hoodie-crew',
    slug: 'hoodie-crew',
    category: 'apparel',
    name: 'RITMO Hoodie',
    nameAccent: 'Hoodie',
    eyebrow: 'Apparel · Heavy',
    tagline: '400 g/m² Brushed-Cotton, gefütterte Kapuze, Kängurutasche. Trägt dich von der After-Match-Pause durch den ganzen Winter.',
    shortDesc: 'Schwerer Baumwoll-Crew-Hoodie, gefütterte Kapuze, orangenes Bauhaus-Print.',
    price: 79,
    illustration: HoodieCrew,
    imageSrc: '/assets/products/hoodie-crew.jpg',
    heroImageSrc: '/assets/products/hoodie-crew.jpg',
    variants: [
      { label: 'Größe', defaultValue: 'M', options: [
        { value: 'S' }, { value: 'M' }, { value: 'L' }, { value: 'XL' }, { value: 'XXL' },
      ]},
      { label: 'Farbe', defaultValue: 'Schwarz', options: [
        { value: 'Schwarz', swatch: 'black' },
        { value: 'Orange',  swatch: 'orange' },
      ]},
    ],
    trust: [
      { label: 'Versand',  value: '2–4 Werktage' },
      { label: 'Material', value: '85% Bio-Baumwolle' },
      { label: 'Rückgabe', value: '30 Tage' },
    ],
    story: [
      {
        eyebrow: '01 · Gewicht',
        title: '400 g/m².',
        titleAccent: 'Echt warm.',
        body: [
          'Schwerer als die meisten Hoodies da draußen. Innenseite gebürstet, Außenseite glatt — der Stoff, den du nach dem Match nicht mehr ausziehst.',
        ],
        visual: HoodieWeight,
      },
      {
        eyebrow: '02 · Detail',
        title: 'Bauhaus-Print.',
        titleAccent: 'Front-Pocket-Frame.',
        body: [
          'Der RITMO-Schriftzug sitzt in einem orangenen Geometrie-Rahmen über der Kängurutasche. Drei Punkte Bauhaus — präzise, ruhig, ehrlich.',
        ],
        reverse: true,
        alt: true,
        visual: HoodiePrint,
      },
    ],
    videos: [
      { kind: 'placeholder', title: 'Material-Check', subtitle: '400 g Brushed-Cotton im Close-Up.', tag: 'Test', duration: '2:18' },
    ],
    specs: [
      { label: 'Material', value: '85% Bio-Baumwolle · 15% Recycled Polyester' },
      { label: 'Gewicht',  value: '400 g/m² · brushed' },
      { label: 'Cut',      value: 'Regular · etwas länger' },
      { label: 'Größen',   value: 'S · M · L · XL · XXL' },
      { label: 'Farben',   value: 'Schwarz · Orange' },
      { label: 'Details',  value: 'Doppelt vernähte Kapuze · Kängurutasche · Strick-Bündchen' },
      { label: 'Herkunft', value: 'Made in Portugal' },
      { label: 'Pflege',   value: '30°C · auf links · nicht trocknen' },
    ],
    related: ['tee-schwarz', 'schlaeger-pro'],
  },

  /* ─────────────────────────────────────────────────────────────── */
  {
    id: 'poster-app-live',
    slug: 'poster-app-live',
    category: 'prints',
    name: '"App ist Live"',
    nameAccent: 'Live',
    eyebrow: 'Print · Limited',
    tagline: 'A2-Format (50 × 70 cm), nummeriert auf 200 Stück, gedruckt auf 250 g/m² Mattpapier. Gerollt geliefert in einer Kraftpapier-Hülse.',
    shortDesc: 'Limited Print, 50×70 cm, gerollt geliefert. Premium-Mattpapier 250 g/m².',
    price: 24,
    illustration: PosterAppLive,
    imageSrc: '/assets/products/poster-app-live.jpg',
    heroImageSrc: '/assets/products/poster-app-live.jpg',
    variants: [
      { label: 'Format', defaultValue: 'A2', options: [
        { value: 'A3' },
        { value: 'A2' },
        { value: 'A1', label: 'A1 (+€16)', priceDelta: 16 },
      ]},
      { label: 'Rahmen', defaultValue: 'Ohne Rahmen', options: [
        { value: 'Ohne Rahmen',          label: 'Ohne' },
        { value: 'Schwarzer Holzrahmen', label: 'Schwarz (+€39)', priceDelta: 39 },
      ]},
    ],
    trust: [
      { label: 'Versand',  value: '3–5 Werktage · Rolle' },
      { label: 'Auflage',  value: '200 nummeriert' },
      { label: 'Rückgabe', value: '30 Tage' },
    ],
    story: [
      {
        eyebrow: '01 · Papier',
        title: '250 g/m².',
        titleAccent: 'Premium Matt.',
        body: [
          'FSC-zertifiziertes Mattpapier, säurefrei, archivtauglich. Kein Glanz, kein Spiegel — nur tiefes Schwarz und sattes Orange.',
        ],
        visual: PosterPaper,
      },
    ],
    videos: [
      { kind: 'placeholder', title: 'Unboxing & Hängen', subtitle: 'Vom Rohr zur Wand in 90 Sekunden.', tag: 'Unboxing', duration: '1:32' },
    ],
    specs: [
      { label: 'Format',   value: 'A2 · 50 × 70 cm' },
      { label: 'Papier',   value: '250 g/m² · Mattpapier · FSC' },
      { label: 'Druck',    value: 'Giclée-Druck, 5-Farben-Pigment' },
      { label: 'Auflage',  value: '200 Stück · handnummeriert' },
      { label: 'Versand',  value: 'Gerollt in Kraftpapier-Hülse' },
      { label: 'Herkunft', value: 'Gedruckt in Berlin' },
    ],
    related: ['print-dna', 'tee-schwarz'],
  },

  /* ─────────────────────────────────────────────────────────────── */
  {
    id: 'print-dna',
    slug: 'print-dna',
    category: 'prints',
    name: 'RITMO DNA',
    nameAccent: 'DNA',
    eyebrow: 'Print · Bauhaus',
    tagline: 'Kreis. Quadrat. Dreieck. Die drei Bauhaus-Grundformen, übersetzt in die drei Padel-Spielstile: Kontrolle, Power, Volley. A3, mattes Premium-Papier.',
    shortDesc: 'Bauhaus-Komposition aus den drei Padel-Spielstil-Grundformen. A3.',
    price: 18,
    illustration: PrintDna,
    imageSrc: '/assets/products/print-dna.jpg',
    heroImageSrc: '/assets/products/print-dna.jpg',
    variants: [
      { label: 'Format', defaultValue: 'A3', options: [
        { value: 'A3' },
        { value: 'A2', label: 'A2 (+€8)', priceDelta: 8 },
      ]},
      { label: 'Rahmen', defaultValue: 'Ohne Rahmen', options: [
        { value: 'Ohne Rahmen',          label: 'Ohne' },
        { value: 'Schwarzer Holzrahmen', label: 'Schwarz (+€29)', priceDelta: 29 },
      ]},
    ],
    trust: [
      { label: 'Versand',  value: '3–5 Werktage' },
      { label: 'Papier',   value: '250 g/m² matt' },
      { label: 'Rückgabe', value: '30 Tage' },
    ],
    story: [
      {
        eyebrow: '01 · Idee',
        title: 'Drei Formen.',
        titleAccent: 'Drei Spielstile.',
        body: [
          'Der Kreis steht für Kontrolle. Das Quadrat für Stabilität. Das Dreieck für Power. Drei Formen, ein Spiel — und ein Stück Wand-Geometrie für deine Padel-Crew.',
        ],
        visual: DnaDetail,
      },
    ],
    videos: [
      { kind: 'placeholder', title: 'Designprozess', subtitle: 'Wie aus drei Spielstilen drei Formen wurden.', tag: 'Erklärung', duration: '3:08' },
    ],
    specs: [
      { label: 'Format',   value: 'A3 · 29.7 × 42 cm (auch A2)' },
      { label: 'Papier',   value: '250 g/m² · Mattpapier · FSC' },
      { label: 'Druck',    value: 'Giclée-Druck, 5-Farben-Pigment' },
      { label: 'Auflage',  value: 'Open Edition' },
      { label: 'Versand',  value: 'Flach im Stabilkarton' },
      { label: 'Herkunft', value: 'Gedruckt in Berlin' },
    ],
    related: ['poster-app-live', 'tee-schwarz'],
  },
];

/* ───────── Lookup helpers ─────────────────────────────────────── */

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelated(product: Product): Product[] {
  if (!product.related?.length) return [];
  return product.related
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}
