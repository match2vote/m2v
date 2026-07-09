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

const files = (await readdir(IN_DIR)).filter((f) => f.endsWith('.json'));
const states = {};
let total = 0;

for (const f of files.sort()) {
  const { state, candidates, syncedAt } = JSON.parse(await readFile(path.join(IN_DIR, f), 'utf8'));
  const senate = [];
  const house = {};
  for (const c of candidates) {
    total++;
    if (c.office === 'us-senate') senate.push(c);
    else (house[c.district || 'at-large'] ||= []).push(c);
  }
  // Incumbents first, then alphabetical — a neutral, explainable order.
  const order = (a, b) => (b.incumbent - a.incumbent) || a.name.localeCompare(b.name);
  senate.sort(order);
  for (const d of Object.keys(house)) house[d].sort(order);
  states[state] = { senate, house, syncedAt };
}

await mkdir(OUT_DIR, { recursive: true });
await writeFile(path.join(OUT_DIR, 'candidates.json'), JSON.stringify(states));
console.log(`Bundled ${total} candidates for ${Object.keys(states).length} states/territories → apps/mobile/src/data/candidates.json`);
