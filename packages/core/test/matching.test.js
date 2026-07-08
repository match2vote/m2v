import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeMatch, rankCandidates, isStated } from '../src/matching.js';
import { ISSUES, stanceLabel, ISSUE_KEYS } from '../src/issues.js';

test('there are exactly 10 issues with unique keys', () => {
  assert.equal(ISSUES.length, 10);
  assert.equal(new Set(ISSUE_KEYS).size, 10);
});

test('perfect agreement on all issues = 100%', () => {
  const answers = {}, positions = {};
  for (const k of ISSUE_KEYS) { answers[k] = 2; positions[k] = 2; }
  const { pct, sharedIssues } = computeMatch(answers, {}, positions);
  assert.equal(pct, 100);
  assert.equal(sharedIssues, 10);
});

test('maximum disagreement on all issues = 0%', () => {
  const answers = {}, positions = {};
  for (const k of ISSUE_KEYS) { answers[k] = -2; positions[k] = 2; }
  const { pct } = computeMatch(answers, {}, positions);
  assert.equal(pct, 0);
});

test('null candidate positions are excluded, never inferred', () => {
  // Candidate states only ONE issue and agrees perfectly there.
  const answers = {}, positions = {};
  for (const k of ISSUE_KEYS) { answers[k] = 1; positions[k] = null; }
  positions.health = 1;
  const { pct, sharedIssues, perIssue } = computeMatch(answers, {}, positions);
  assert.equal(pct, 100);           // 100% of the ONE shared issue
  assert.equal(sharedIssues, 1);    // ...and shown as only 1 shared issue
  const unstated = perIssue.filter((p) => !p.shared);
  assert.equal(unstated.length, 9);
  for (const p of unstated) assert.equal(p.agreement, null);
});

test('no shared issues → pct is null (Not enough info), never a guess', () => {
  const answers = { health: 2 };
  const positions = { climate: 2 }; // disjoint
  const { pct, sharedIssues } = computeMatch(answers, {}, positions);
  assert.equal(pct, null);
  assert.equal(sharedIssues, 0);
});

test('"matters" flag doubles an issue\'s weight', () => {
  // Two issues: agree fully on health, disagree fully on taxes.
  const answers = { health: 2, taxes: -2 };
  const positions = { health: 2, taxes: 2 };
  const even = computeMatch(answers, {}, positions);
  assert.equal(even.pct, 50); // (1 + 0) / 2
  const mattersHealth = computeMatch(answers, { health: true }, positions);
  assert.equal(mattersHealth.pct, 67); // (2·1 + 1·0) / 3
  const mattersTaxes = computeMatch(answers, { taxes: true }, positions);
  assert.equal(mattersTaxes.pct, 33); // (1·1 + 2·0) / 3
});

test('adjacent positions score 75% agreement', () => {
  const { pct } = computeMatch({ health: 1 }, {}, { health: 2 });
  assert.equal(pct, 75); // |1-2|/4 = 0.25 → 0.75
});

test('user skipping an issue (null answer) excludes it', () => {
  const answers = { health: 2, taxes: null };
  const positions = { health: 2, taxes: 2 };
  const { pct, sharedIssues } = computeMatch(answers, {}, positions);
  assert.equal(pct, 100);
  assert.equal(sharedIssues, 1);
});

test('ranking: computable matches first, null-match candidates last, ties by coverage', () => {
  const answers = {}, matters = {};
  for (const k of ISSUE_KEYS) answers[k] = 0;
  const full = { id: 'full', positions: Object.fromEntries(ISSUE_KEYS.map((k) => [k, 0])) };
  const thin = { id: 'thin', positions: { health: 0 } };            // also 100%, 1 issue
  const none = { id: 'none', positions: {} };                        // pct null
  const ranked = rankCandidates(answers, matters, [none, thin, full]);
  assert.deepEqual(ranked.map((r) => r.candidate.id), ['full', 'thin', 'none']);
  assert.equal(ranked[0].pct, 100);
  assert.equal(ranked[1].pct, 100);
  assert.equal(ranked[2].pct, null);
});

test('stanceLabel renders null as "Not stated"', () => {
  assert.equal(stanceLabel('health', null), 'Not stated');
  assert.equal(stanceLabel('health', undefined), 'Not stated');
  assert.match(stanceLabel('health', -2), /^Strongly: /);
  assert.equal(stanceLabel('health', 0), 'Mixed / middle-ground position');
});

test('isStated accepts only the five scale values', () => {
  for (const v of [-2, -1, 0, 1, 2]) assert.equal(isStated(v), true);
  for (const v of [null, undefined, 3, -3, 0.5, '1', NaN]) assert.equal(isStated(v), false);
});
