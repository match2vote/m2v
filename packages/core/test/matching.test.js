import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeMatch, rankCandidates, isStated, statedCount, MIN_STATED_POSITIONS } from '../src/matching.js';
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
  // Candidate states 7 issues (the floor) and agrees perfectly there.
  const answers = {}, positions = {};
  for (const k of ISSUE_KEYS) { answers[k] = 1; positions[k] = null; }
  for (const k of ISSUE_KEYS.slice(0, 7)) positions[k] = 1;
  const { pct, sharedIssues, statedIssues, underResearched, perIssue } = computeMatch(answers, {}, positions);
  assert.equal(pct, 100);           // 100% of the SEVEN shared issues
  assert.equal(sharedIssues, 7);    // ...and shown as 7 shared issues
  assert.equal(statedIssues, 7);
  assert.equal(underResearched, false);
  const unstated = perIssue.filter((p) => !p.shared);
  assert.equal(unstated.length, 3);
  for (const p of unstated) assert.equal(p.agreement, null);
});

test(`fewer than ${MIN_STATED_POSITIONS} sourced positions → not scored, even on perfect agreement`, () => {
  const answers = {};
  for (const k of ISSUE_KEYS) answers[k] = 2;
  for (let n = 0; n < MIN_STATED_POSITIONS; n++) {
    const positions = {};
    for (const k of ISSUE_KEYS) positions[k] = null;
    for (const k of ISSUE_KEYS.slice(0, n)) positions[k] = 2;
    const r = computeMatch(answers, {}, positions);
    assert.equal(r.pct, null, `${n} stated positions must not score`);
    assert.equal(r.underResearched, true);
    assert.equal(r.statedIssues, n);
    assert.equal(statedCount(positions), n);
  }
  // Exactly at the floor: scored.
  const positions = {};
  for (const k of ISSUE_KEYS) positions[k] = null;
  for (const k of ISSUE_KEYS.slice(0, MIN_STATED_POSITIONS)) positions[k] = 2;
  assert.equal(computeMatch(answers, {}, positions).pct, 100);
});

test('under-researched candidates rank after scored ones', () => {
  const answers = {};
  for (const k of ISSUE_KEYS) answers[k] = 2;
  const thin = { name: 'thin', positions: Object.fromEntries(ISSUE_KEYS.map((k, i) => [k, i < 3 ? 2 : null])) };
  const full = { name: 'full', positions: Object.fromEntries(ISSUE_KEYS.map((k) => [k, -2])) };
  const ranked = rankCandidates(answers, {}, [thin, full]);
  assert.equal(ranked[0].candidate.name, 'full'); // 0% but scored beats unscored
  assert.equal(ranked[1].pct, null);
  assert.equal(ranked[1].underResearched, true);
});

test('no shared issues → pct is null (Not enough info), never a guess', () => {
  const answers = { health: 2 };
  const positions = { climate: 2 }; // disjoint
  const { pct, sharedIssues } = computeMatch(answers, {}, positions);
  assert.equal(pct, null);
  assert.equal(sharedIssues, 0);
});

// Candidates in the arithmetic tests below carry a stated position on every
// issue so they clear the research floor; the user answers only the issues
// under test, so only those are shared and counted.
const pad = (positions) => Object.fromEntries(ISSUE_KEYS.map((k) => [k, k in positions ? positions[k] : 0]));

test('"matters" flag doubles an issue\'s weight', () => {
  // Two issues: agree fully on health, disagree fully on taxes.
  const answers = { health: 2, taxes: -2 };
  const positions = pad({ health: 2, taxes: 2 });
  const even = computeMatch(answers, {}, positions);
  assert.equal(even.pct, 50); // (1 + 0) / 2
  const mattersHealth = computeMatch(answers, { health: true }, positions);
  assert.equal(mattersHealth.pct, 67); // (2·1 + 1·0) / 3
  const mattersTaxes = computeMatch(answers, { taxes: true }, positions);
  assert.equal(mattersTaxes.pct, 33); // (1·1 + 2·0) / 3
});

test('adjacent positions score 75% agreement', () => {
  const { pct } = computeMatch({ health: 1 }, {}, pad({ health: 2 }));
  assert.equal(pct, 75); // |1-2|/4 = 0.25 → 0.75
});

test('user skipping an issue (null answer) excludes it', () => {
  const answers = { health: 2, taxes: null };
  const positions = pad({ health: 2, taxes: 2 });
  const { pct, sharedIssues } = computeMatch(answers, {}, positions);
  assert.equal(pct, 100);
  assert.equal(sharedIssues, 1);
});

test('ranking: computable matches first, null-match candidates last, ties by coverage', () => {
  const answers = {}, matters = {};
  for (const k of ISSUE_KEYS) answers[k] = 0;
  const full = { id: 'full', positions: Object.fromEntries(ISSUE_KEYS.map((k) => [k, 0])) };
  const seven = { id: 'seven', positions: Object.fromEntries(ISSUE_KEYS.map((k, i) => [k, i < 7 ? 0 : null])) }; // also 100%, 7 issues
  const thin = { id: 'thin', positions: { health: 0 } };            // below the floor: pct null
  const none = { id: 'none', positions: {} };                        // pct null
  const ranked = rankCandidates(answers, matters, [none, thin, seven, full]);
  assert.deepEqual(ranked.map((r) => r.candidate.id), ['full', 'seven', 'none', 'thin']);
  assert.equal(ranked[0].pct, 100);
  assert.equal(ranked[1].pct, 100);
  assert.equal(ranked[2].pct, null);
  assert.equal(ranked[3].pct, null);
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
