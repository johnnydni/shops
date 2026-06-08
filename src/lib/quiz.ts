/**
 * RITMO Spielstil-Quiz — 7 Fragen, 4 Antworten je Frage.
 *
 * Jede Antwort trägt ein **Vektor-Mapping** auf die 7 Archetypes:
 * Werte zwischen 0 und 3, mehrere Archetypes pro Antwort erlaubt.
 *
 * Scoring summiert alle Vektoren der ausgewählten Antworten, ermittelt
 * den höchsten Eintrag und nutzt — bei Gleichstand — die zuletzt
 * abgegebene Antwort als Tie-Breaker. Wenn die letzte Antwort den Tie
 * nicht löst, gewinnt der nach `SPIELSTIL_ORDER` frühere Archetype.
 *
 * Anti-Bot:
 *  - `MIN_QUIZ_DURATION_MS`: schneller = verdächtig (Worker rechnet das in
 *    einen Risk-Score ein, Frontend warnt)
 *  - `MAX_QUIZ_DURATION_MS`: ein Quiz, das 30+ Min offen ist, ist meist
 *    automatisiertes Scraping (Frontend zwingt zum Neustart)
 */

import type { SpielstilId } from './spielstile';
import { SPIELSTIL_ORDER } from './spielstile';

export type AnswerVector = Partial<Record<SpielstilId, number>>;

export interface QuizAnswer {
  label: string;
  vector: AnswerVector;
}

export interface QuizQuestion {
  id: string;
  q: string;
  hint?: string;
  answers: [QuizAnswer, QuizAnswer, QuizAnswer, QuizAnswer];
}

export const QUIZ: QuizQuestion[] = [
  {
    id: 'opening',
    q: 'Der erste Punkt des Matches. Was machst du?',
    hint: 'Es geht um deinen ersten Impuls — nicht um den klügsten Schlag.',
    answers: [
      { label: 'Sicher rein, lange Bahn, mal schauen wie der Gegner steht.', vector: { chico: 3, muro: 2, motor: 1 } },
      { label: 'Direkt drauf. Vibora, Aufschlag rein, fertig.',              vector: { toro: 3, hysterica: 1 } },
      { label: 'Was Unerwartetes — Lob mit Slice oder Backhand-Cross.',      vector: { individuoso: 3, fantasma: 2 } },
      { label: 'Erst mal Energie laden — kurz brüllen, dann ballern.',       vector: { hysterica: 3, toro: 1 } },
    ],
  },
  {
    id: 'position',
    q: 'Wo stehst du am liebsten?',
    answers: [
      { label: 'Hinten links, das ganze Bild im Blick.',  vector: { chico: 2, muro: 3 } },
      { label: 'Vorne am Netz, Volleys bis es weh tut.',  vector: { toro: 3, motor: 1 } },
      { label: 'Egal — ich bin sowieso überall.',         vector: { motor: 3, individuoso: 1 } },
      { label: 'Da, wo der Gegner nicht hinschaut.',      vector: { fantasma: 3, individuoso: 2 } },
    ],
  },
  {
    id: 'pressure',
    q: 'Es steht 4:5 im Tiebreak. Wie spielst du den nächsten Ball?',
    answers: [
      { label: 'Hoher Globo, lange Bahn, ich gewinne durch Konstanz.',   vector: { muro: 3, motor: 2, chico: 1 } },
      { label: 'Volle Vibora, alles oder nichts.',                       vector: { toro: 3, hysterica: 2 } },
      { label: 'Trickshot — wenn’s reingeht, ist es ein Moment.',   vector: { individuoso: 3, fantasma: 1 } },
      { label: 'Eine kurze Pause, ich brauche jetzt das Momentum.',      vector: { hysterica: 3, chico: 1 } },
    ],
  },
  {
    id: 'partner-fail',
    q: 'Dein Partner verschießt drei Punkte in Folge. Du …',
    answers: [
      { label: '… bleibst ruhig, gibst Anweisung, übernimmst Verantwortung.', vector: { chico: 3, motor: 1, muro: 1 } },
      { label: '… holst die Bälle alleine, deckst dessen Seite mit.',         vector: { motor: 3, muro: 2 } },
      { label: '… spielst einen kreativen Punkt, der ihn wieder ins Match holt.', vector: { individuoso: 3, fantasma: 1 } },
      { label: '… machst ein großes Ding daraus — Energie hoch, Stimmung dreht.', vector: { hysterica: 3, toro: 1 } },
    ],
  },
  {
    id: 'signature',
    q: 'Welcher Schlag ist *dein* Schlag?',
    answers: [
      { label: 'Bandeja gezielt in die Ecke. Geduld, Präzision.',          vector: { chico: 3, muro: 1 } },
      { label: 'Smash por 3 oder por 4. Krach, fertig.',                   vector: { toro: 3 } },
      { label: 'Bajada oder Backhand-Vibora aus dem Lauf.',                vector: { individuoso: 3, fantasma: 1 } },
      { label: 'Defensive Globo, die nie mehr runterkommt.',               vector: { muro: 3, motor: 2 } },
    ],
  },
  {
    id: 'motivation',
    q: 'Was zieht dich auf den Court — ehrlich?',
    answers: [
      { label: 'Das Lösen eines Puzzles. Jeder Gegner hat ein Muster.',     vector: { chico: 3, fantasma: 1 } },
      { label: 'Die körperliche Intensität, der direkte Push.',              vector: { toro: 2, motor: 3 } },
      { label: 'Der eine Schlag, den niemand erwartet hat.',                vector: { individuoso: 3, fantasma: 2 } },
      { label: 'Die Stimmung, die Energie, das Publikum.',                  vector: { hysterica: 3, toro: 1 } },
    ],
  },
  {
    id: 'frustration',
    q: 'Was bringt dich am meisten aus der Fassung?',
    hint: 'Selbstkenntnis — auch eine Stärke.',
    answers: [
      { label: 'Wenn ich einen klar besseren Plan hatte und ihn nicht durchziehe.', vector: { chico: 3 } },
      { label: 'Wenn nichts mehr richtig durchrauscht.',                            vector: { toro: 3, hysterica: 1 } },
      { label: 'Wenn ich nur „normale“ Schläge spielen darf.',            vector: { individuoso: 3 } },
      { label: 'Wenn der Lauf der Energie nicht stimmt — alles fühlt sich tot an.', vector: { hysterica: 3, fantasma: 1, motor: 1 } },
    ],
  },
];

if (QUIZ.length !== 7) throw new Error(`Quiz must have 7 questions, got ${QUIZ.length}`);
for (const q of QUIZ) {
  if (q.answers.length !== 4) throw new Error(`Question ${q.id} must have 4 answers`);
}

export const MIN_QUIZ_DURATION_MS = 15_000;
export const MAX_QUIZ_DURATION_MS = 30 * 60 * 1000;

export type QuizSubmission = number[];

export interface QuizResult {
  winner: SpielstilId;
  ranking: Array<{ id: SpielstilId; score: number }>;
  tieBreakUsed: boolean;
}

export function scoreQuiz(submission: QuizSubmission): QuizResult {
  if (!Array.isArray(submission) || submission.length !== QUIZ.length) {
    throw new Error(`submission must be ${QUIZ.length} answers`);
  }
  const totals: Record<SpielstilId, number> = {
    chico: 0, toro: 0, individuoso: 0, muro: 0,
    fantasma: 0, motor: 0, hysterica: 0,
  };
  submission.forEach((idx, qi) => {
    if (!Number.isInteger(idx) || idx < 0 || idx > 3) {
      throw new Error(`answer ${qi} out of range`);
    }
    const vec = QUIZ[qi].answers[idx].vector;
    for (const [k, v] of Object.entries(vec)) {
      totals[k as SpielstilId] += v || 0;
    }
  });

  const ranking = (Object.entries(totals) as Array<[SpielstilId, number]>)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);

  const top = ranking[0].score;
  const tiedIds = ranking.filter((r) => r.score === top).map((r) => r.id);
  let winner: SpielstilId = tiedIds[0];
  let tieBreakUsed = false;

  if (tiedIds.length > 1) {
    tieBreakUsed = true;
    const lastVec = QUIZ[QUIZ.length - 1].answers[submission[submission.length - 1]].vector;
    let bestLast = -1;
    let bestLastId: SpielstilId | null = null;
    for (const id of tiedIds) {
      const v = lastVec[id] ?? 0;
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
  return { winner, ranking, tieBreakUsed };
}

export interface QuizPayload {
  v: 1;
  answers: QuizSubmission;
  startedAt: number;
  finishedAt: number;
  turnstileToken: string;
}
