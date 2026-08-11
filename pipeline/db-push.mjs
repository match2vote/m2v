// Push the canonical dataset (data/fec + data/curated) into Supabase Postgres.
// Runs in GitHub Actions after each FEC sync. Requires SUPABASE_SECRET_KEY.
// The database trigger `positions_require_sources` is the last line of defense
// for the hard rule: no scored position without a source URL.
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tfhszpjhylekdvhrvcjm.supabase.co';
const KEY = process.env.SUPABASE_SECRET_KEY;
if (!KEY) { console.error('SUPABASE_SECRET_KEY not set'); process.exit(1); }

const IN_DIR = path.join(__dirname, '..', 'data', 'fec');
const CURATED_DIR = path.join(__dirname, '..', 'data', 'curated');

// --- load curated overlays (same logic as bundle-data.mjs) ---
const curatedById = {};
const raceMetaRows = [];
try {
  for (const f of (await readdir(CURATED_DIR)).filter((f) => f.endsWith('.json'))) {
    const cur = JSON.parse(await readFile(path.join(CURATED_DIR, f), 'utf8'));
    for (const c of cur.candidates || []) curatedById[c.id] = c;
    for (const [raceId, m] of Object.entries(cur.races || {})) {
      raceMetaRows.push({
        race_id: raceId, state: cur.state, status: m.status || null,
        status_note: m.statusNote || null, advancing: m.advancing || null,
      });
    }
  }
} catch {}

// --- flatten all candidates ---
const rows = [];
const seen = new Set();
const advancingByRace = Object.fromEntries(
  raceMetaRows.filter((r) => r.advancing).map((r) => [r.race_id, new Set(r.advancing)])
);
for (const f of (await readdir(IN_DIR)).filter((f) => f.endsWith('.json')).sort()) {
  const { state, candidates } = JSON.parse(await readFile(path.join(IN_DIR, f), 'utf8'));
  for (const raw of candidates) {
    const c = curatedById[raw.id] ? { ...raw, ...curatedById[raw.id] } : { ...raw };
    if (!curatedById[raw.id]) {
      const raceId = c.office === 'us-senate' ? `${state}-senate` : `${state}-house-${c.district}`;
      const adv = advancingByRace[raceId];
      if (adv && !adv.has(c.id)) c.ballotStatus = 'not-advancing';
    }
    seen.add(c.id);
    rows.push(toRow(c));
  }
}
// curated-only candidates (governors)
for (const c of Object.values(curatedById)) if (!seen.has(c.id)) rows.push(toRow(c));

function toRow(c) {
  return {
    id: c.id, state: c.state, office: c.office, district: c.district || null,
    name: c.name, party: c.party || null, incumbent: !!c.incumbent,
    tier: c.tier || 'fec', ballot_status: c.ballotStatus || null,
    background: c.background || null,
    positions: c.positions || null, position_sources: c.positionSources || null,
    sources: c.sources || null,
    funding: c.funding || (c.receipts != null ? { receipts: c.receipts } : null),
    updated_at: new Date().toISOString(),
  };
}

// --- upsert in batches via PostgREST ---
async function upsert(table, batch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: KEY, Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok) {
    const body = await res.text();
    if (res.status === 404 || /relation .* does not exist|Could not find the table/.test(body)) {
      console.error(`Table ${table} missing — run supabase/schema.sql first. Skipping DB push (not failing the sync).`);
      return false;
    }
    throw new Error(`${table} upsert failed ${res.status}: ${body.slice(0, 400)}`);
  }
  return true;
}

let pushed = 0, ok = true;
for (let i = 0; i < rows.length && ok; i += 500) {
  ok = await upsert('candidates', rows.slice(i, i + 500));
  if (ok) { pushed += Math.min(500, rows.length - i); process.stdout.write(`\rcandidates: ${pushed}/${rows.length}`); }
}
console.log();
if (ok && raceMetaRows.length) ok = await upsert('race_meta', raceMetaRows);
if (ok) {
  await upsert('meta', [{ key: 'dataset', value: {
    candidates: rows.length, curated: Object.keys(curatedById).length,
    updatedAt: new Date().toISOString(), version: 1,
  }, updated_at: new Date().toISOString() }]);
  console.log(`DB push complete: ${rows.length} candidates, ${raceMetaRows.length} race_meta rows.`);
}
