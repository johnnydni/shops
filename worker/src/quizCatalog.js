/* ═══════════════════════════════════════════════════════════════════
   Server-side Spielstil quiz catalog + scoring.
   ───────────────────────────────────────────────────────────────────
   MUST MATCH `src/lib/quiz.ts` 1:1 (same answer vectors, same order).
   Worker re-scores every quiz submission — the client `winner` field
   is treated as a hint only; the Worker's authoritative result is
   what lands in the signed spielstilToken + Stripe metadata.

   When you edit `src/lib/quiz.ts`, MIRROR the same change here.
   ═══════════════════════════════════════════════════════════════════ */

export const SPIELSTIL_ORDER = [
  'chico', 'toro', 'individuoso', 'muro', 'fantasma', 'motor', 'hysterica',
];

export const QUIZ = [
  {
    id: 'opening',
    answers: [
      { vector: { chico: 3, muro: 2, motor: 1 } },
      { vector: { toro: 3, hysterica: 1 } },
      { vector: { individuoso: 3, fantasma: 2 } },
      { vector: { hysterica: 3, toro: 1 } },
    ],
  },
  {
    id: 'position',
    answers: [
      { vector: { chico: 2, muro: 3 } },
      { vector: { toro: 3, motor: 1 } },
      { vector: { motor: 3, individuoso: 1 } },
      { vector: { fantasma: 3, individuoso: 2 } },
    ],
  },
  {
    id: 'pressure',
    answers: [
      { vector: { muro: 3, motor: 2, chico: 1 } },
      { vector: { toro: 3, hysterica: 2 } },
      { vector: { individuoso: 3, fantasma: 1 } },
      { vector: { hysterica: 3, chico: 1 } },
    ],
  },
  {
    id: 'partner-fail',
    answers: [
      { vector: { chico: 3, motor: 1, muro: 1 } },
      { vector: { motor: 3, muro: 2 } },
      { vector: { individuoso: 3, fantasma: 1 } },
      { vector: { hysterica: 3, toro: 1 } },
    ],
  },
  {
    id: 'signature',
    answers: [
      { vector: { chico: 3, muro: 1 } },
      { vector: { toro: 3 } },
      { vector: { individuoso: 3, fantasma: 1 } },
      { vector: { muro: 3, motor: 2 } },
    ],
  },
  {
    id: 'motivation',
    answers: [
      { vector: { chico: 3, fantasma: 1 } },
      { vector: { toro: 2, motor: 3 } },
      { vector: { individuoso: 3, fantasma: 2 } },
      { vector: { hysterica: 3, toro: 1 } },
    ],
  },
  {
    id: 'frustration',
    answers: [
      { vector: { chico: 3 } },
      { vector: { toro: 3, hysterica: 1 } },
      { vector: { individuoso: 3 } },
      { vector: { hysterica: 3, fantasma: 1, motor: 1 } },
    ],
  },
];

export const MIN_QUIZ_DURATION_MS = 15_000;
export const MAX_QUIZ_DURATION_MS = 30 * 60 * 1000;

/**
 * Re-score a submission (array of 7 indices 0..3).
 * Throws on shape mismatch (defensive against client manipulation).
 *
 * @returns {{ winner: string, ranking: Array<{id: string, score: number}>, tieBreakUsed: boolean }}
 */
export function scoreQuiz(submission) {
  if (!Array.isArray(submission) || submission.length !== QUIZ.length) {
    throw new Error(`submission must be ${QUIZ.length} answers`);
  }
  const totals = { chico: 0, toro: 0, individuoso: 0, muro: 0, fantasma: 0, motor: 0, hysterica: 0 };

  submission.forEach((idx, qi) => {
    if (!Number.isInteger(idx) || idx < 0 || idx > 3) {
      throw new Error(`answer ${qi} out of range`);
    }
    const vec = QUIZ[qi].answers[idx].vector;
    for (const [k, v] of Object.entries(vec)) {
      totals[k] += v || 0;
    }
  });

  const ranking = Object.entries(totals)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score);

  const top = ranking[0].score;
  const tiedIds = ranking.filter((r) => r.score === top).map((r) => r.id);
  let winner = tiedIds[0];
  let tieBreakUsed = false;

  if (tiedIds.length > 1) {
    tieBreakUsed = true;
    const lastVec = QUIZ[QUIZ.length - 1].answers[submission[submission.length - 1]].vector;
    let bestLast = -1, bestLastId = null;
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

/**
 * Validate timing constraints around the quiz.
 * @returns {{ ok: boolean, reason?: string }}
 */
export function checkQuizTiming(startedAt, finishedAt, nowMs = Date.now()) {
  const start  = Number(startedAt);
  const finish = Number(finishedAt);
  if (!Number.isFinite(start) || !Number.isFinite(finish)) {
    return { ok: false, reason: 'quiz_timing_invalid' };
  }
  if (finish < start) return { ok: false, reason: 'quiz_timing_backward' };
  const elapsed = finish - start;
  if (elapsed < MIN_QUIZ_DURATION_MS) return { ok: false, reason: 'quiz_too_fast' };
  if (elapsed > MAX_QUIZ_DURATION_MS) return { ok: false, reason: 'quiz_too_slow' };
  // Quiz mustn't have been finished in the future
  if (finish > nowMs + 10_000) return { ok: false, reason: 'quiz_timing_future' };
  return { ok: true };
}
