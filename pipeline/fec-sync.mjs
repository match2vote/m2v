#!/usr/bin/env node
// VAPP pipeline — FEC candidate sync (all 50 states).
//
// Pulls every 2026 U.S. House and Senate candidate from the free FEC API
// and writes them into VAPP's candidate format, one JSON file per state.
// This replaces the prototype's hand-built fec-seed.jsx snapshots.
//
// Usage:
//   FEC_API_KEY=yourkey node pipeline/fec-sync.mjs            # full sync
//   node pipeline/fec-sync.mjs --mock                          # offline test
//
// Get a free key at https://api.data.gov/signup/ (arrives by email in
// seconds). Rate limit is 1,000 requests/hour — a full sync uses ~40.
//
// Honesty rules encoded here (same as the prototype):
//   * tier: "fec"  → real candidate, real funding, positions ALL null
//     ("Not stated") until a human curates them with sources.
//   * We never guess a position from party. Ever.

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'data', 'fec');
const API = 'https://api.open.fec.gov/v1';
const ELECTION_YEAR = 2026;
const PER_PAGE = 100;

const ISSUE_KEYS = [
  'cost', 'health', 'housing', 'immigration', 'taxes',
  'climate', 'education', 'safety', 'repro', 'democracy',
];

function emptyPositions() {
  return Object.fromEntries(ISSUE_KEYS.map((k) => [k, null]));
}

// FEC party codes → display label (top few; everything else passes through).
const PARTY = {
  DEM: 'Democrat', REP: 'Republican', LIB: 'Libertarian',
  GRE: 'Green', IND: 'Independent', NNE: 'None', UNK: 'Unknown', W: 'Write-in',
};

function titleCaseName(fecName) {
  // FEC names come as "LAST, FIRST MIDDLE" — flip and title-case.
  const [last, rest] = fecName.split(',').map((s) => s.trim());
  const raw = rest ? `${rest} ${last}` : fecName;
  return raw
    .toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(Ii|Iii|Iv)\b/g, (m) => m.toUpperCase())
    .replace(/\bMc(\w)/g, (_, c) => 'Mc' + c.toUpperCase());
}

export function transformCandidate(fec) {
  const office = fec.office; // 'H' | 'S'
  return {
    id: `fec-${fec.candidate_id}`,
    fecId: fec.candidate_id,
    name: titleCaseName(fec.name),
    party: PARTY[fec.party] || fec.party_full || fec.party || 'Unknown',
    state: fec.state,
    office: office === 'S' ? 'us-senate' : 'us-house',
    district:
      office === 'H' && fec.district && fec.district !== '00'
        ? String(parseInt(fec.district, 10))
        : office === 'H'
          ? 'at-large'
          : null,
    incumbent: fec.incumbent_challenge === 'I',
    tier: 'fec',                 // real candidate, positions not yet curated
    ballotStatus: 'filed',       // refined later by curation (primary results)
    positions: emptyPositions(), // ALL "Not stated" — never inferred
    sources: [
      {
        label: 'FEC filing',
        url: `https://www.fec.gov/data/candidate/${fec.candidate_id}/`,
      },
    ],
    funding: null, // filled by a separate totals pass (candidate totals endpoint)
    syncedFrom: 'fec-api',
  };
}

async function fetchPage(pathname, params, apiKey) {
  const url = new URL(`${API}${pathname}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set('api_key', apiKey);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`FEC API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchAllCandidates(office, apiKey) {
  const out = [];
  let page = 1, pages = 1;
  do {
    const data = await fetchPage('/candidates/', {
      election_year: ELECTION_YEAR,
      office,                       // 'H' or 'S'
      candidate_status: 'C',        // statutory candidates (filed & active)
      per_page: PER_PAGE,
      page,
      sort: 'name',
    }, apiKey);
    out.push(...data.results);
    pages = data.pagination.pages;
    process.stdout.write(`\r  ${office === 'H' ? 'House' : 'Senate'}: page ${page}/${pages} (${out.length} candidates)`);
    page++;
  } while (page <= pages);
  process.stdout.write('\n');
  return out;
}

async function writeStates(candidates) {
  await mkdir(OUT_DIR, { recursive: true });
  const byState = {};
  for (const c of candidates) (byState[c.state] ||= []).push(c);
  for (const [state, list] of Object.entries(byState)) {
    list.sort((a, b) => (a.office + (a.district || '')).localeCompare(b.office + (b.district || '')) || a.name.localeCompare(b.name));
    await writeFile(
      path.join(OUT_DIR, `${state}.json`),
      JSON.stringify({ state, electionYear: ELECTION_YEAR, syncedAt: new Date().toISOString(), candidates: list }, null, 2)
    );
  }
  return byState;
}

async function main() {
  if (process.argv.includes('--mock')) {
    const fixture = JSON.parse(
      await readFile(path.join(__dirname, 'fixtures', 'fec-sample.json'), 'utf8')
    );
    const transformed = fixture.results.map(transformCandidate);
    const byState = await writeStates(transformed);
    console.log(`MOCK OK — transformed ${transformed.length} candidates into ${Object.keys(byState).length} state file(s) in data/fec/`);
    console.log(JSON.stringify(transformed[0], null, 2));
    return;
  }

  const apiKey = process.env.FEC_API_KEY;
  if (!apiKey) {
    console.error('Set FEC_API_KEY (free key: https://api.data.gov/signup/), or run with --mock.');
    process.exit(1);
  }

  console.log(`Syncing ${ELECTION_YEAR} federal candidates from the FEC…`);
  const house = await fetchAllCandidates('H', apiKey);
  const senate = await fetchAllCandidates('S', apiKey);
  const transformed = [...house, ...senate].map(transformCandidate);
  const byState = await writeStates(transformed);

  const states = Object.keys(byState).sort();
  console.log(`Done: ${transformed.length} candidates across ${states.length} states/territories → data/fec/*.json`);
}

main().catch((e) => { console.error(e); process.exit(1); });
