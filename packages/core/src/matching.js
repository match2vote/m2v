// M2V core — matching math.
// Ported from the prototype's model:
//   * Every position is -2..+2 or null ("Not stated").
//   * Match % uses ONLY issues where BOTH the user and the candidate
//     have a stated value. Nothing is ever inferred.
//   * Issues the user flagged "this matters to me" count double.
//
// agreement(u, c) = 1 - |u - c| / 4        (4 = max distance on the scale)
// match% = round( 100 * Σ(weight·agreement) / Σ(weight) )   over shared issues

import { ISSUE_KEYS } from './issues.js';

const SCALE_MAX_DIFF = 4; // distance between -2 and +2
const MATTERS_WEIGHT = 2;
const DEFAULT_WEIGHT = 1;
// Research floor (kiki, Sep 11 2026): a candidate is scored only when at least
// this many of the ten issues carry a sourced position. Below the floor the
// profile still shows whatever is documented, but no percentage is computed,
// because a match built on one or two positions is noise dressed as a number.
export const MIN_STATED_POSITIONS = 7;

/** Number of the ten issues on which a candidate has a stated (-2..2) position. */
export function statedCount(candidatePositions) {
  return ISSUE_KEYS.filter((k) => isStated(candidatePositions?.[k])).length;
}

export function isStated(v) {
  return v === -2 || v === -1 || v === 0 || v === 1 || v === 2;
}

/**
 * @param {Object} userAnswers   {issueKey: -2..2|null}
 * @param {Object} userMatters   {issueKey: boolean} — "this matters to me"
 * @param {Object} candidatePositions {issueKey: -2..2|null}
 * @returns {{ pct: number|null, sharedIssues: number, statedIssues: number, underResearched: boolean, perIssue: Array }}
 *   pct is null when there are no shared issues (rendered as "Not enough info")
 *   or when the candidate has fewer than MIN_STATED_POSITIONS sourced positions
 *   (underResearched: true; rendered as "still being researched").
 */
export function computeMatch(userAnswers, userMatters, candidatePositions) {
  let weightSum = 0;
  let scoreSum = 0;
  const perIssue = [];

  for (const key of ISSUE_KEYS) {
    const u = userAnswers?.[key];
    const c = candidatePositions?.[key];
    const shared = isStated(u) && isStated(c);
    const weight = userMatters?.[key] ? MATTERS_WEIGHT : DEFAULT_WEIGHT;
    let agreement = null;

    if (shared) {
      agreement = 1 - Math.abs(u - c) / SCALE_MAX_DIFF;
      weightSum += weight;
      scoreSum += weight * agreement;
    }

    perIssue.push({
      issue: key,
      user: isStated(u) ? u : null,
      candidate: isStated(c) ? c : null,
      shared,
      matters: !!userMatters?.[key],
      agreement, // 0..1 or null
    });
  }

  const sharedIssues = perIssue.filter((p) => p.shared).length;
  const statedIssues = perIssue.filter((p) => p.candidate !== null).length;
  const underResearched = statedIssues < MIN_STATED_POSITIONS;
  const pct = !underResearched && weightSum > 0 ? Math.round((100 * scoreSum) / weightSum) : null;
  return { pct, sharedIssues, statedIssues, underResearched, perIssue };
}

/**
 * Rank candidates for display. Candidates with a computable match sort by
 * pct desc; candidates with no shared issues (pct null) sort after them,
 * keeping their original order. Ties broken by more shared issues (a 90%
 * over 8 issues beats a 90% over 2).
 */
export function rankCandidates(userAnswers, userMatters, candidates) {
  const scored = candidates.map((cand, idx) => ({
    candidate: cand,
    idx,
    ...computeMatch(userAnswers, userMatters, cand.positions || {}),
  }));
  return scored.sort((a, b) => {
    if (a.pct === null && b.pct === null) return a.idx - b.idx;
    if (a.pct === null) return 1;
    if (b.pct === null) return -1;
    if (b.pct !== a.pct) return b.pct - a.pct;
    if (b.sharedIssues !== a.sharedIssues) return b.sharedIssues - a.sharedIssues;
    return a.idx - b.idx;
  });
}
