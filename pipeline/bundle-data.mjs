#!/usr/bin/env node
// M2V pipeline — bundle synced candidate data into the mobile app.
//
// Reads data/fec/*.json (written by fec-sync.mjs) and produces one compact
// JSON the app imports at build time. This is the stopgap until the backend
// serves data over the network; the file doubles as the offline cache seed.
//
// Usage: node pipeline/bundle-data.mjs

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IN_DIR = path.join(__dirname, '..', 'data', 'fec');
const OUT_DIR = path.join(__dirname, '..', 'apps', 'mobile', 'src', 'data');

const CURATED_DIR = path.join(__dirname, '..', 'data', 'curated');

// Load curated overlays: candidates by id + race metadata by race id.
const curatedById = {};
const raceMetaByState = {};
let curatedCount = 0;
try {
  for (const f of (await readdir(CURATED_DIR)).filter((f) => f.endsWith('.json'))) {
    const cur = JSON.parse(await readFile(path.join(CURATED_DIR, f), 'utf8'));
    for (const c of cur.candidates || []) { curatedById[c.id] = c; curatedCount++; }
    if (cur.races) raceMetaByState[cur.state] = cur.races;
  }
} catch {}

const files = (await readdir(IN_DIR)).filter((f) => f.endsWith('.json'));
const states = {};
let total = 0;

for (const f of files.sort()) {
  const { state, candidates: rawCandidates, syncedAt } = JSON.parse(await readFile(path.join(IN_DIR, f), 'utf8'));
  const meta = raceMetaByState[state] || {};
  // Merge curated data over FEC records; apply race status to the rest.
  const candidates = rawCandidates.map((c) => {
    if (curatedById[c.id]) return { ...c, ...curatedById[c.id] };
    const raceId = c.office === 'us-senate' ? `${state}-senate` : `${state}-house-${c.district}`;
    const m = meta[raceId];
    if (m?.advancing && !m.advancing.includes(c.id)) {
      return { ...c, ballotStatus: 'not-advancing' };
    }
    return c;
  });
  const senate = [];
  const house = {};
  const governor = [];
  const mayor = [];
  for (const c of candidates) {
    total++;
    if (c.office === 'us-senate') senate.push(c);
    else (house[c.district || 'at-large'] ||= []).push(c);
  }
  // Curated-only candidates (e.g. governor races — FEC is federal-only).
  const fecIds = new Set(candidates.map((c) => c.id));
  for (const c of Object.values(curatedById)) {
    if (c.state !== state || fecIds.has(c.id)) continue;
    total++;
    if (c.office === 'governor') governor.push(c);
    else if (c.office === 'mayor') mayor.push(c);
    else if (c.office === 'us-senate') senate.push(c);
    else (house[c.district || 'at-large'] ||= []).push(c);
  }
  // Nominees first, then incumbents, then alphabetical; not-advancing last.
  const rank = (c) =>
    (c.ballotStatus === 'nominee' ? 0 : c.ballotStatus === 'not-advancing' ? 2 : 1);
  const order = (a, b) =>
    rank(a) - rank(b) || (b.incumbent - a.incumbent) || a.name.localeCompare(b.name);
  senate.sort(order);
  governor.sort(order);
  mayor.sort(order);
  for (const d of Object.keys(house)) house[d].sort(order);
  states[state] = { senate, house, governor, mayor, syncedAt, raceMeta: raceMetaByState[state] || null };
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(path.join(OUT_DIR, 'candidates.json'), JSON.stringify(states));
console.log(`Bundled ${total} candidates for ${Object.keys(states).length} states/territories (${curatedCount} curated) → apps/mobile/src/data/candidates.json`);
