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
    id: 'chico', slug: 'chico', name: 'CHICO/CHICA',
    subtitle: 'Allrounder',
    tagline: 'Keine halben Sachen.',
    desc:
      'Chicos und Chicas sind vielseitig, anpassungsfähig und konstant — sie passen ' +
      'sich schnell an Gegner, Partner und Match-Dynamik an. Kein extremes Risiko, ' +
      'aber sehr oft die richtige Lösung.\n\n' +
      'Dieser Spielstil liest das Match in Echtzeit und wechselt zwischen Offensive ' +
      'und Defensive je nach Situation.',
    kernwerte: ['Geduld', 'Übersicht', 'Präzision'],
    strengths: [
      'Lange Ballwechsel',
      'Weiß, wann welcher Schlag angebracht ist',
      'Kann alles auf einem ähnlichen Niveau',
    ],
    shots: ['Bandeja zur Schwäche', 'Globo gezielt', 'Win-by-Position-Volley'],
    weaknesses: ['Verliert Geduld unter Druck-Tempo', 'Wenig Risiko-Punch'],
    partners: ['motor', 'muro'],
    accent: '#FFD23F', card: '#1A1500', text: '#000', symbol: 'square',
  },
  toro: {
    id: 'toro', slug: 'toro', name: 'TORO',
    subtitle: 'Der Aggressor',
    tagline: 'Druck ist die beste Defensive.',
    desc:
      'TORO spielt Padel als Statement. Smashes mit Auflage, Vibora, harte Bandejas — ' +
      'wer auf der anderen Seite steht, spürt jeden Schlag. Nicht der eleganteste Stil, ' +
      'aber der kräftigste.',
    kernwerte: ['Power', 'Dominanz', 'Entschlossenheit'],
    strengths: [
      'Smash / Remate',
      'Netzangriff',
      'Bricht Verteidigung mit Vibora auf',
    ],
    shots: ['Smash por 3 / por 4', 'Vibora', 'Hard Volley'],
    weaknesses: ['Lange Ballwechsel kosten Konzentration', 'Globos lesen schwer'],
    partners: ['chico', 'fantasma'],
    accent: '#FF5A1F', card: '#1F0A00', text: '#000', symbol: 'triangle',
  },
  individuoso: {
    id: 'individuoso', slug: 'individuoso', name: 'INDIVIDUOSO',
    subtitle: 'Der Stratege',
    tagline: 'Lücken sind nicht umsonst da.',
    desc:
      'INDIVIDUOSO — jedes Spiel, wo er dabei ist, ist einzigartig. Seine Strategien ' +
      'sind ebenso individuell wie sein Spielstil. Bajadas, riskante Drehungen, Crosse ' +
      'aus dem Lauf — statistisch präzise platziert, somit wird Risiko zur kalkulierten ' +
      'Routine, denn die Lücken sind nicht umsonst da.',
    kernwerte: ['Strategisch', 'Antizipation', 'Präzision'],
    strengths: [
      'Liest Spielmuster im Voraus',
      'Unorthodoxe Winkel in freie Lücken',
      'Spielt mit dem Tempo statt dagegen',
    ],
    shots: ['Bajada', 'Cross-Lob mit Drall', 'Backhand-Vibora aus dem Lauf'],
    weaknesses: ['Inkonstanz', 'Spielt manchmal sich selbst statt den Punkt'],
    partners: ['muro', 'motor'],
    accent: '#E94CFF', card: '#1B0020', text: '#000', symbol: 'splash',
  },
  muro: {
    id: 'muro', slug: 'muro', name: 'MURO',
    subtitle: 'Die Wand',
    tagline: 'Den Fehler machst du, nicht ich.',
    desc:
      'MURO ist die Verteidigung, die nicht bricht. Jeder Smash kommt zurück, jeder ' +
      'Winkel wird gedeckt, jede Volley liest sich, bevor sie fällt. Er sieht an deiner ' +
      'Körperhaltung ganz genau, welchen Schlag du ausführen willst — und ist dann ' +
      'entweder sofort am Netz, an der Rückwand oder bereits außerhalb des Platzes, ' +
      'um deinen Smash zu returnen.',
    kernwerte: ['Defense', 'Geduld', 'Stabilität'],
    strengths: [
      'Smash-Defense mit Globo-Reset',
      'Hohe Return-Quote bei langen Ballwechseln',
      'Liest Schläge sehr früh und genau',
    ],
    shots: ['Defensive Globo', 'Block-Volley', 'Cross-Reset'],
    weaknesses: ['Wenig eigene Punktgenerierung', 'Verliert bei Speed-Eskalation'],
    partners: ['toro', 'individuoso'],
    accent: '#3A86FF', card: '#001028', text: '#fff', symbol: 'square',
  },
  fantasma: {
    id: 'fantasma', slug: 'fantasma', name: 'FANTASMA',
    subtitle: 'Das Phantom',
    tagline: 'Du beachtest mich nicht wirklich — aber ich sehe dein Ego.',
    desc:
      'FANTASMA spielt mit Stille. Plötzlicher Switch hinter dem Gegner, unauffällige ' +
      'Vorbereitung, dann ein einziger entscheidender Schlag. Unvorhersehbar, intuitiv ' +
      'und mit einer unaufhörlichen Liebe für Überraschung. Ungewöhnliche Winkel, Stil- ' +
      'und Rhythmusbrüche.\n\n' +
      'Chaos ist angesagt.',
    kernwerte: ['Kreativität', 'Freiheit', 'Überraschung'],
    strengths: [
      'Erzeugt unkonventionelle Spielzüge',
      'Spielt sehr unauffällig — Gegner verlieren Fokus',
      'Mentaler Game Changer',
    ],
    shots: ['Switch-Lob', 'Quiet Volley', 'Surprise Vibora'],
    weaknesses: ['Braucht passenden Partner', 'Wenig Power bei direkter Konfrontation'],
    partners: ['toro', 'hysterica'],
    accent: '#9D7CFF', card: '#100020', text: '#fff', symbol: 'ring',
  },
  motor: {
    id: 'motor', slug: 'motor', name: 'MOTOR',
    subtitle: 'Die Maschine',
    tagline: 'Den Ball kriege ich noch!',
    desc:
      'MOTOR ist Ausdauer in Reinform. Jeder Ball muss erreicht werden, jede Position ' +
      'gehalten, jedes Set frische Beine.',
    kernwerte: ['Ausdauer', 'Kampfgeist', 'Geschwindigkeit'],
    strengths: [
      'Hohe Lauf-Rate',
      'Erreicht „unmögliche" Bälle',
      'Ist schnell da, wo man ihn nicht erwartet',
    ],
    shots: ['Cross-Volley repetitiv', 'Defensive Lob', 'Lange Bandeja-Kette'],
    weaknesses: ['Wenig Variation', 'Schwierig gegen Trickshot-Spieler'],
    partners: ['chico', 'individuoso'],
    accent: '#00C896', card: '#001A10', text: '#000', symbol: 'circle',
  },
  hysterica: {
    id: 'hysterica', slug: 'hysterica', name: 'HYSTERICO/A',
    subtitle: 'Drama Queen',
    tagline: 'Drama ist Teil meines Spiels.',
    desc:
      'HYSTERICA spielt das Match auf zwei Ebenen — auf dem Court und über dem Court. Jubel ' +
      'nach dem Punkt, ein Blick nach jedem Fehlentscheid, kleine Pause an der richtigen Stelle. ' +
      'Nicht Schauspiel, sondern Strategie: Tempo brechen, Köpfe drehen, Energie ins eigene Team holen.',
    kernwerte: ['Energie', 'Bühnenpräsenz', 'Momentum'],
    strengths: [
      'Stimmung ankurbeln',
      'Stark unter Publikum',
      'Schwer einzuschätzen',
    ],
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
