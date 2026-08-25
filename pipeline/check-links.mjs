#!/usr/bin/env node
// M2V pipeline: dead-link check for every source URL the app can open.
//
// Reads apps/mobile/src/data/candidates.json (shown curated candidates only)
// and apps/mobile/src/data/voting-rules.json, requests every URL once, and
// prints the ones that do not come back 2xx/3xx. Run from the repo root:
//
//   node pipeline/check-links.mjs            # all URLs
//   node pipeline/check-links.mjs --bad-only # print only failures (default)
//   node pipeline/check-links.mjs --all      # print every result
//
// Needs plain internet access; it is meant to be run on a laptop, not in a
// sandbox. Output is also written to pipeline/link-report.json.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ALL = process.argv.includes('--all');
const CONCURRENCY = 8;
const UA = 'Mozilla/5.0 (compatible; M2V link check; +https://match2vote.org)';
const ELIMINATED = new Set(['not-advancing', 'lost', 'withdrawn']);

const urls = new Map(); // url -> where it is used

function add(url, where) {
  if (typeof url !== 'string' || !/^https?:\/\//.test(url)) return;
  const clean = url.trim();
  if (!urls.has(clean)) urls.set(clean, new Set());
  urls.get(clean).add(where);
}
function walk(o, where) {
  if (Array.isArray(o)) o.forEach((x) => walk(x, where));
  else if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) {
      if (k === 'url' || k === 'sourceUrl' || k === 'officialSiteUrl') {
        if (typeof v === 'string') v.split(';').forEach((u) => add(u, where));
      } else walk(v, where);
    }
  }
}

const cands = JSON.parse(await readFile(path.join(ROOT, 'apps/mobile/src/data/candidates.json'), 'utf8'));
for (const [st, data] of Object.entries(cands)) {
  const lists = [...(data.senate || []), ...(data.governor || []), ...Object.values(data.house || {}).flat()];
  for (const c of lists) {
    if (c.tier !== 'curated' || ELIMINATED.has(c.ballotStatus)) continue;
    walk(c.positionSources, `${st} ${c.name}`);
    walk(c.sources, `${st} ${c.name}`);
  }
}
const rules = JSON.parse(await readFile(path.join(ROOT, 'apps/mobile/src/data/voting-rules.json'), 'utf8'));
for (const [st, r] of Object.entries(rules)) walk(r, `${st} voting rules`);

console.log(`Checking ${urls.size} URLs with concurrency ${CONCURRENCY}...`);

async function probe(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': UA } });
    if (res.status === 405 || res.status === 403 || res.status === 404 || res.status >= 500) {
      // Some hosts refuse HEAD; confirm with GET before calling it dead.
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': UA } });
    }
    return { url, status: res.status, final: res.url !== url ? res.url : undefined };
  } catch (e) {
    return { url, status: 0, error: String(e.cause?.code || e.message) };
  } finally { clearTimeout(t); }
}

const list = [...urls.keys()];
const results = [];
let i = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (i < list.length) {
    const url = list[i++];
    const r = await probe(url);
    r.usedBy = [...urls.get(url)].slice(0, 5);
    results.push(r);
    const ok = r.status >= 200 && r.status < 400;
    if (ALL || !ok) console.log(`${String(r.status).padStart(3)}  ${url}  (${r.usedBy.join('; ')})${r.error ? '  ' + r.error : ''}`);
  }
}));

const bad = results.filter((r) => !(r.status >= 200 && r.status < 400));
await writeFile(path.join(__dirname, 'link-report.json'), JSON.stringify({ checkedAt: new Date().toISOString(), total: results.length, bad: bad.length, results }, null, 2));
console.log(`\n${results.length} checked, ${bad.length} not OK. Full report: pipeline/link-report.json`);
console.log('Note: 403 from Ballotpedia, Wikipedia or newspapers often means bot blocking, not a dead page. Open those in a browser before replacing them.');
