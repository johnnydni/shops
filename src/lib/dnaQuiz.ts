/**
 * RITMO DNA Quiz — standalone, community-facing version.
 *
 * Different from `src/lib/quiz.ts` (which gates the Spieler-Ticket
 * purchase):
 *   - **Multi-select** per question — pick all that resonate
 *   - More playful tone, designed to be shared
 *   - No timing gate / Turnstile / server-side rescoring
 *   - 7 questions, 4-6 answers each
 *
 * Scoring: sum the vectors of ALL selected answers across the entire
 * quiz. No normalization per-question — picking more answers contributes
 * more, which is fine for an honest signal of "what feels like me".
 *
 * Tie-breaker: use the latest answered question, then SPIELSTIL_ORDER
 * seniority — same approach as the gated quiz.
 */

import type { SpielstilId } from './spielstile';
import { SPIELSTIL_ORDER } from './spielstile';

export type AnswerVector = Partial<Record<SpielstilId, number>>;

export interface DnaQuizAnswer {
  label: string;
  vector: AnswerVector;
}

export interface DnaQuizQuestion {
  id: string;
  q: string;
  hint?: string;
  answers: DnaQuizAnswer[];
}

export const DNA_QUIZ: DnaQuizQuestion[] = [
  /* ── 1 — Packing ── */
  {
    id: 'pack',
    q: 'Was kommt als Erstes in deine Padel-Tasche?',
    hint: 'Mehrfachauswahl. Pick alle, die passen.',
    answers: [
      { label: 'Drei frische Bälle — gleich raus auf den Court.',          vector: { motor: 2, toro: 1 } },
      { label: 'Mein RITMO-Tee in der Lieblings-Farbe.',                    vector: { individuoso: 2, hysterica: 1 } },
      { label: 'Headphones — mein Vorbereitungs-Soundtrack muss laufen.',   vector: { chico: 2, muro: 1 } },
      { label: 'Aperol Spritz für nach dem Match.',                         vector: { hysterica: 2, motor: 1 } },
      { label: 'Ein kleines Notizbuch — kurze Match-Analysen nach dem Spiel.', vector: { chico: 3 } },
    ],
  },

  /* ── 2 — Match-Start ── */
  {
    id: 'opening',
    q: 'Beim ersten Aufschlag denkst du:',
    answers: [
      { label: '„Bleib ruhig, lies das Spiel."',                         vector: { chico: 3, muro: 1 } },
      { label: '„Erster Ball, voller Saft — drauf."',                  vector: { toro: 3, hysterica: 1 } },
      { label: '„Heute mach ich was Verrücktes."',                       vector: { individuoso: 3, hysterica: 2 } },
      { label: '„Hauptsache laufen. Alle Bälle holen."',                vector: { motor: 3 } },
      { label: '„Egal wie er beginnt — der letzte Punkt entscheidet."', vector: { fantasma: 3, chico: 1 } },
    ],
  },

  /* ── 3 — Wie du Punkte machst ── */
  {
    id: 'scoring',
    q: 'Womit machst du am liebsten den Punkt?',
    hint: 'Mehrfachauswahl ausdrücklich erwünscht.',
    answers: [
      { label: 'Volley am Netz, harter Schlag in den Block.',              vector: { toro: 3 } },
      { label: 'Gegnerische Lücke gezielt anspielen.',                     vector: { chico: 3, muro: 1 } },
      { label: 'Bandeja, die nie mehr zurückkommt.',                       vector: { muro: 2, chico: 1 } },
      { label: 'Backhand-Cross aus der Hüfte — Stil über Tempo.',         vector: { individuoso: 3 } },
      { label: 'Globo, der die Gegner zermürbt.',                          vector: { muro: 2, fantasma: 1 } },
      { label: '„Ich weiß auch nicht, lief halt rein."',                  vector: { hysterica: 3, individuoso: 1 } },
    ],
  },

  /* ── 4 — Was zieht dich auf den Court ── */
  {
    id: 'why',
    q: 'Was zieht dich überhaupt auf den Court?',
    answers: [
      { label: 'Adrenalin. Der Punch im Schlag.',                          vector: { toro: 3 } },
      { label: 'Das Lesen des Gegners. Schach mit Bällen.',                vector: { chico: 3, fantasma: 1 } },
      { label: 'Bewegung. Einfach durchpowern.',                            vector: { motor: 3 } },
      { label: 'Spaß mit den Freunden. Energie ins Team.',                  vector: { hysterica: 2, individuoso: 1 } },
      { label: 'Endlose Rallies, bis der Gegner umkippt.',                  vector: { muro: 2, motor: 2 } },
      { label: 'Der eine Shot, an den sich alle erinnern.',                 vector: { individuoso: 3, hysterica: 1 } },
    ],
  },

  /* ── 5 — Druck-Moment ── */
  {
    id: 'pressure',
    q: 'Es steht 5:5 im Tiebreak. Du …',
    answers: [
      { label: '… verlangsamst, atmest tief, alles wieder ruhig.',         vector: { chico: 3, muro: 1 } },
      { label: '… nimmst extra Risiko — alles oder nichts.',               vector: { toro: 2, individuoso: 2 } },
      { label: '… wirst lauter, holst Energie ins Team.',                  vector: { hysterica: 3 } },
      { label: '… spielst exakt gleich weiter wie immer.',                  vector: { muro: 3, motor: 1 } },
      { label: '… wartest auf den entscheidenden Moment, den der Gegner verschläft.', vector: { fantasma: 3 } },
    ],
  },

  /* ── 6 — Was Mitspieler sagen ── */
  {
    id: 'partner-says',
    q: 'Nach dem Match sagt dein Partner über dich:',
    answers: [
      { label: '„Du hast uns gerettet. Was für eine Defense."',           vector: { muro: 3 } },
      { label: '„Wie kommst du nur auf solche Schläge?!"',                vector: { individuoso: 2, hysterica: 2 } },
      { label: '„Du hast nicht eine Sekunde aufgehört zu laufen."',       vector: { motor: 3 } },
      { label: '„Du wusstest exakt, was wir tun müssen."',                vector: { chico: 3 } },
      { label: '„Du hast die ganze Stimmung gemacht."',                    vector: { hysterica: 3 } },
      { label: '„Dieser eine Smash im 3. Satz — Wahnsinn."',              vector: { toro: 3 } },
    ],
  },

  /* ── 7 — Was du an dir selbst nervt ── */
  {
    id: 'honest',
    q: 'Was nervt dich am eigenen Spiel — ehrlich?',
    hint: 'Selbstkenntnis bringt Tier-Punkte.',
    answers: [
      { label: 'Manchmal zu vorsichtig. Zu wenig Risiko.',                  vector: { chico: 2, muro: 2 } },
      { label: 'Ich brauche viel Anlauf, brauche Energie um mich.',         vector: { hysterica: 2, toro: 1 } },
      { label: 'Spiel oft zu kreativ — mehr Statement als Punkt.',          vector: { individuoso: 3 } },
      { label: 'Werde gegen Ende der Sätze müde.',                          vector: { motor: 2 } },
      { label: 'Verliere mich manchmal in Standardschlägen.',                vector: { fantasma: 2, individuoso: 1 } },
      { label: 'Lass mich emotional zu schnell aus der Bahn werfen.',        vector: { hysterica: 3, toro: 1 } },
    ],
  },
];

/* ───── Validation ───── */

if (DNA_QUIZ.length !== 7) {
  throw new Error(`DNA quiz must have 7 questions, got ${DNA_QUIZ.length}`);
}
for (const q of DNA_QUIZ) {
  if (q.answers.length < 4 || q.answers.length > 6) {
    throw new Error(`DNA question ${q.id} must have 4-6 answers (got ${q.answers.length})`);
  }
}

/* ───── Scoring ───── */

/**
 * One submission slot per question — array of selected indices (0..N-1)
 * within that question's `answers`. Empty array = no selection (skipped).
 */
export type DnaQuizSubmission = number[][];

export interface DnaQuizResult {
  winner: SpielstilId;
  ranking: Array<{ id: SpielstilId; score: number }>;
  totalSelected: number;
}

/**
 * Score a multi-select submission.
 *
 * The user can pick 0..N answers per question. Each picked answer
 * contributes its full vector — no normalization. We treat a question
 * with zero picks as a no-op (doesn't hurt anyone).
 *
 * @throws on shape mismatch
 */
export function scoreDnaQuiz(submission: DnaQuizSubmission): DnaQuizResult {
  if (!Array.isArray(submission) || submission.length !== DNA_QUIZ.length) {
    throw new Error(`DNA submission must be ${DNA_QUIZ.length} arrays`);
  }
  const totals: Record<SpielstilId, number> = {
    chico: 0, toro: 0, individuoso: 0, muro: 0,
    fantasma: 0, motor: 0, hysterica: 0,
  };

  let totalSelected = 0;
  let lastNonEmptyQ = -1;

  submission.forEach((picks, qi) => {
    if (!Array.isArray(picks)) throw new Error(`question ${qi}: picks must be an array`);
    const q = DNA_QUIZ[qi];
    if (picks.length) lastNonEmptyQ = qi;
    for (const idx of picks) {
      if (!Number.isInteger(idx) || idx < 0 || idx >= q.answers.length) {
        throw new Error(`question ${qi}: answer index ${idx} out of range`);
      }
      const vec = q.answers[idx].vector;
      for (const [k, v] of Object.entries(vec)) {
        totals[k as SpielstilId] += v || 0;
      }
      totalSelected++;
    }
  });

  const ranking = (Object.entries(totals) as Array<[SpielstilId, number]>)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);

  /* Tie-break: lookup the last-answered question's selected answers
     and prefer the ID with the highest summed vector there; if still
     tied, fall back to SPIELSTIL_ORDER. */
  const top = ranking[0].score;
  const tiedIds = ranking.filter((r) => r.score === top).map((r) => r.id);
  let winner: SpielstilId = tiedIds[0];

  if (tiedIds.length > 1 && lastNonEmptyQ >= 0) {
    const lastPicks = submission[lastNonEmptyQ];
    const lastQ = DNA_QUIZ[lastNonEmptyQ];
    const lastTotals: Partial<Record<SpielstilId, number>> = {};
    for (const idx of lastPicks) {
      for (const [k, v] of Object.entries(lastQ.answers[idx].vector)) {
        lastTotals[k as SpielstilId] = (lastTotals[k as SpielstilId] ?? 0) + (v || 0);
      }
    }
    let bestLast = -1;
    let bestLastId: SpielstilId | null = null;
    for (const id of tiedIds) {
      const v = lastTotals[id] ?? 0;
      if (v > bestLast) { bestLast = v; bestLastId = id; }
    }
    if (bestLastId && bestLast > 0) {
      winner = bestLastId;
    } else {
      for (const id of SPIELSTIL_ORDER) {
        if (tiedIds.includes(id)) { winner = id; break; }
      }
    }
  }

  return { winner, ranking, totalSelected };
}

/* ───── Helpers ───── */

/** Initial empty submission — array of 7 empty arrays. */
export function emptyDnaSubmission(): DnaQuizSubmission {
  return DNA_QUIZ.map(() => []);
}

/** Toggle a pick in a submission (immutable, returns new array). */
export function toggleDnaPick(
  submission: DnaQuizSubmission,
  questionIdx: number,
  answerIdx: number
): DnaQuizSubmission {
  const next = submission.map((arr) => [...arr]);
  const set = new Set(next[questionIdx]);
  if (set.has(answerIdx)) set.delete(answerIdx);
  else set.add(answerIdx);
  next[questionIdx] = Array.from(set).sort((a, b) => a - b);
  return next;
}
