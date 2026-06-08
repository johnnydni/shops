/**
 * RITMO Spielstil-Archetypen — Source of Truth.
 *
 * 7 Archetypes used across:
 *   - the Spielstil-Quiz on /event/buy and /spielstil-quiz
 *   - the personalised ticket render (badge + accent colour + symbol)
 *   - the DNA-Tee PDP (matches a Tee print to each Spielstil)
 *   - the RITMO Padel App scoring multiplier
 *
 * The Quiz scores user answers into a vector keyed by `SpielstilId` and
 * picks the highest-scoring entry; ties broken by the order listed here
 * (so `chico` wins over `motor` on a perfect tie — chronological seniority).
 *
 * Filename token (`slug`) MUST match the DNA-Tee image pattern:
 *   /assets/products/ritmo-dna-tee/{slug}-{schnitt}-{farbe}.jpg
 */

export type SpielstilId =
  | 'chico'
  | 'toro'
  | 'individuoso'
  | 'muro'
  | 'fantasma'
  | 'motor'
  | 'hysterica';

export interface Spielstil {
  id: SpielstilId;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  desc: string;
  kernwerte: [string, string, string];
  strengths: string[];
  shots: string[];
  weaknesses: string[];
  partners: SpielstilId[];
  accent: string;
  card: string;
  text: '#000' | '#fff';
  symbol:
    | 'triangle'
    | 'square'
    | 'circle'
    | 'cross'
    | 'diagonal'
    | 'ring'
    | 'splash';
}

export const SPIELSTILE: Record<SpielstilId, Spielstil> = {
  chico: {
    id: 'chico', slug: 'chico', name: 'CHICO',
    subtitle: 'Der Stratege',
    tagline: 'Ich denke zwei Schläge voraus.',
    desc:
      'CHICO liest den Court wie ein Schachbrett. Lange Ballwechsel, gezielte Winkel, ' +
      'geduldige Konstruktion — der Punkt fällt nicht durch Power, sondern weil der ' +
      'Gegner längst falsch steht.',
    kernwerte: ['Geduld', 'Übersicht', 'Präzision'],
    strengths: ['Lange Ballwechsel ohne Konzentrationsverlust', 'Liest Gegnerformation früh', 'Spielt Lücken statt Linien'],
    shots: ['Bandeja zur Schwäche', 'Globo gezielt', 'Win-by-Position-Volley'],
    weaknesses: ['Verliert Geduld unter Druck-Tempo', 'Wenig Risiko-Punch'],
    partners: ['motor', 'muro'],
    accent: '#FFD23F', card: '#1A1500', text: '#000', symbol: 'square',
  },
  toro: {
    id: 'toro', slug: 'toro', name: 'TORO',
    subtitle: 'Die Kraft',
    tagline: 'Wenn ich treffe, ist der Punkt vorbei.',
    desc:
      'TORO spielt Padel als Statement. Smashes mit Auflage, Vibora, harte Bandejas — ' +
      'wer auf der anderen Seite steht, spürt jeden Schlag. Nicht der eleganteste Stil, aber der lauteste.',
    kernwerte: ['Power', 'Präsenz', 'Punch'],
    strengths: ['Beidhändiger Smash mit Auflage', 'Stark im Volley-Nahkampf', 'Bricht Verteidigung mit Vibora auf'],
    shots: ['Smash por 3 / por 4', 'Vibora', 'Hard Volley'],
    weaknesses: ['Lange Ballwechsel kosten Konzentration', 'Globos lesen schwer'],
    partners: ['chico', 'fantasma'],
    accent: '#FF5A1F', card: '#1F0A00', text: '#000', symbol: 'triangle',
  },
  individuoso: {
    id: 'individuoso', slug: 'individuoso', name: 'INDIVIDUOSO',
    subtitle: 'Der Künstler',
    tagline: 'Ich spiele den Schlag, den du nicht kommen siehst.',
    desc:
      'INDIVIDUOSO bricht jede Regel — und macht den Punkt. Bajadas, riskante Drehungen, ' +
      'Crosse aus dem Lauf, Trickshots aus der Defensive. Stil über Statistik, Risiko über Routine.',
    kernwerte: ['Kreativität', 'Risiko', 'Eleganz'],
    strengths: ['Unorthodoxe Winkel', 'Macht aus Verteidigung Angriff', 'Spielt mit dem Tempo statt dagegen'],
    shots: ['Bajada', 'Cross-Lob mit Drall', 'Backhand-Vibora aus dem Lauf'],
    weaknesses: ['Inkonstanz', 'Spielt manchmal sich selbst statt den Punkt'],
    partners: ['muro', 'motor'],
    accent: '#E94CFF', card: '#1B0020', text: '#000', symbol: 'splash',
  },
  muro: {
    id: 'muro', slug: 'muro', name: 'MURO',
    subtitle: 'Die Mauer',
    tagline: 'Du wirst keinen Ball an mir vorbei bekommen.',
    desc:
      'MURO ist die Verteidigung, die nicht bricht. Jeder Smash kommt zurück, jeder Winkel wird ' +
      'gedeckt, jede Volley liest sich, bevor sie fällt.',
    kernwerte: ['Defense', 'Geduld', 'Stabilität'],
    strengths: ['Smash-Defense mit Globo-Reset', 'Hohe Quote bei langen Ballwechseln', 'Liest Gegner-Vibora frühzeitig'],
    shots: ['Defensive Globo', 'Block-Volley', 'Cross-Reset'],
    weaknesses: ['Wenig eigene Punktgenerierung', 'Verliert bei Speed-Eskalation'],
    partners: ['toro', 'individuoso'],
    accent: '#3A86FF', card: '#001028', text: '#fff', symbol: 'square',
  },
  fantasma: {
    id: 'fantasma', slug: 'fantasma', name: 'FANTASMA',
    subtitle: 'Der Phantom-Spieler',
    tagline: 'Du siehst mich nicht — bis es zu spät ist.',
    desc:
      'FANTASMA spielt mit Stille. Plötzlicher Switch hinter dem Gegner, unauffällige ' +
      'Vorbereitung, dann ein einziger entscheidender Schlag.',
    kernwerte: ['Timing', 'Stille', 'Überraschung'],
    strengths: ['Switcht unauffällig die Court-Seite', 'Spielt sehr leise — Gegner verlieren Fokus', 'Vibora aus dem Nichts'],
    shots: ['Switch-Lob', 'Quiet Volley', 'Surprise Vibora'],
    weaknesses: ['Braucht passenden Partner', 'Wenig Power bei direkter Konfrontation'],
    partners: ['toro', 'hysterica'],
    accent: '#9D7CFF', card: '#100020', text: '#fff', symbol: 'ring',
  },
  motor: {
    id: 'motor', slug: 'motor', name: 'MOTOR',
    subtitle: 'Die Maschine',
    tagline: 'Ich werde nicht müde, bevor du es nicht bist.',
    desc:
      'MOTOR ist Ausdauer in Reinform. Jeder Ball erreicht, jede Position gehalten, jedes Set frisch.',
    kernwerte: ['Ausdauer', 'Disziplin', 'Bewegung'],
    strengths: ['Hohe Lauf-Rate über volle Sets', 'Konstante Erste-Stellung', 'Bringt jeden Ball zurück'],
    shots: ['Cross-Volley repetitiv', 'Defensive Lob', 'Lange Bandeja-Kette'],
    weaknesses: ['Wenig Variation', 'Schwierig gegen Trickshot-Spieler'],
    partners: ['chico', 'individuoso'],
    accent: '#00C896', card: '#001A10', text: '#000', symbol: 'circle',
  },
  hysterica: {
    id: 'hysterica', slug: 'hysterica', name: 'HYSTERICA',
    subtitle: 'Die Dramatikerin',
    tagline: 'Drama ist Teil meines Spiels.',
    desc:
      'HYSTERICA spielt das Match auf zwei Ebenen — auf dem Court und über dem Court. Jubel ' +
      'nach dem Punkt, ein Blick nach jedem Fehlentscheid, kleine Pause an der richtigen Stelle. ' +
      'Nicht Schauspiel, sondern Strategie: Tempo brechen, Köpfe drehen, Energie ins eigene Team holen.',
    kernwerte: ['Energie', 'Bühnenpräsenz', 'Momentum'],
    strengths: ['Drift Tempo & Stimmung des Matches', 'Stark unter Publikum', 'Bricht gegnerischen Lauf nach 3 Punkten'],
    shots: ['Loud Smash', 'Pause-und-Vibora', 'Comeback-Cross'],
    weaknesses: ['Verliert Konzentration ohne Energie-Anker', 'Eigenes Drama als Bumerang'],
    partners: ['fantasma', 'motor'],
    accent: '#FF1F6F', card: '#20001A', text: '#000', symbol: 'diagonal',
  },
};

export const SPIELSTIL_ORDER: SpielstilId[] = [
  'chico', 'toro', 'individuoso', 'muro', 'fantasma', 'motor', 'hysterica',
];

export function getSpielstil(id: string | null | undefined): Spielstil | null {
  if (!id) return null;
  return (SPIELSTILE as Record<string, Spielstil>)[id] ?? null;
}

// Runtime sanity-check: id === slug for every archetype (DNA-tee image pattern relies on this).
for (const id of SPIELSTIL_ORDER) {
  if (SPIELSTILE[id].id !== id) {
    throw new Error(`SPIELSTILE['${id}'].id mismatch`);
  }
  if (SPIELSTILE[id].slug !== id) {
    throw new Error(`SPIELSTILE['${id}'].slug mismatch`);
  }
}
