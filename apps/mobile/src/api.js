// M2V data layer: fetch the live dataset from the server, cache it on device,
// fall back to the bundled snapshot so the app always works offline.
//
// Order of truth: live server data > cached server data > bundled snapshot.
// The publishable key below is designed to be public (read-only access,
// enforced by Postgres row-level security). The secret key never ships here.
import bundled from './data/candidates.json';

export const SUPABASE_URL = 'https://tfhszpjhylekdvhrvcjm.supabase.co';
const PUBLISHABLE_KEY = 'sb_publishable_H61HevfahZAjaU6Kd8onzQ_tD9sGz3n';
const HEADERS = { apikey: PUBLISHABLE_KEY, Authorization: `Bearer ${PUBLISHABLE_KEY}` };

// Storage adapter: AsyncStorage on native, localStorage on web when allowed,
// in-memory otherwise. Never throws.
const memory = {};
let store = {
  async get(k) { return memory[k] ?? null; },
  async set(k, v) { memory[k] = v; },
};
try {
  // eslint-disable-next-line global-require
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  store = {
    async get(k) { try { return await AsyncStorage.getItem(k); } catch { return memory[k] ?? null; } },
    async set(k, v) { try { await AsyncStorage.setItem(k, v); } catch { memory[k] = v; } },
  };
} catch {
  if (typeof localStorage !== 'undefined') {
    store = {
      async get(k) { try { return localStorage.getItem(k); } catch { return memory[k] ?? null; } },
      async set(k, v) { try { localStorage.setItem(k, v); } catch { memory[k] = v; } },
    };
  }
}

function groupState(stateCode, candidates, raceMeta) {
  const senate = []; const house = {}; const governor = [];
  for (const c of candidates) {
    if (c.office === 'governor') governor.push(c);
    else if (c.office === 'us-senate') senate.push(c);
    else (house[c.district || 'at-large'] ||= []).push(c);
  }
  const rank = (c) => (c.ballotStatus === 'nominee' ? 0 : c.ballotStatus === 'not-advancing' ? 2 : 1);
  const order = (a, b) => rank(a) - rank(b) || (b.incumbent - a.incumbent) || a.name.localeCompare(b.name);
  senate.sort(order); governor.sort(order);
  for (const d of Object.keys(house)) house[d].sort(order);
  const meta = {};
  for (const r of raceMeta || []) meta[r.race_id] = { status: r.status, statusNote: r.status_note, advancing: r.advancing };
  return { senate, house, governor, raceMeta: Object.keys(meta).length ? meta : null, live: true };
}

function fromRow(r) {
  return {
    id: r.id, state: r.state, office: r.office, district: r.district || undefined,
    name: r.name, party: r.party, incumbent: !!r.incumbent, tier: r.tier,
    ballotStatus: r.ballot_status || undefined, background: r.background || undefined,
    positions: r.positions || null, positionSources: r.position_sources || undefined,
    sources: r.sources || undefined, funding: r.funding || undefined,
  };
}

async function fetchJson(pathAndQuery, timeoutMs = 8000) {
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const t = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${pathAndQuery}`, { headers: HEADERS, signal: ctrl?.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally { if (t) clearTimeout(t); }
}

// Get one state's dataset. Resolves fast from cache/bundle; refreshes from the
// server in the background and calls onUpdate(fresh) if newer data arrived.
export async function getStateData(code, onUpdate) {
  const cacheKey = `m2v:state:${code}:v1`;
  let current = null;
  const cached = await store.get(cacheKey);
  if (cached) { try { current = JSON.parse(cached); } catch {} }
  if (!current) current = bundled[code] ? { ...bundled[code], live: false } : null;

  (async () => {
    try {
      const [rows, meta] = await Promise.all([
        fetchJson(`candidates?state=eq.${code}&select=*&limit=2000`),
        fetchJson(`race_meta?state=eq.${code}&select=*`),
      ]);
      if (Array.isArray(rows) && rows.length) {
        const fresh = groupState(code, rows.map(fromRow), meta);
        await store.set(cacheKey, JSON.stringify(fresh));
        if (onUpdate) onUpdate(fresh);
      }
    } catch { /* offline or server unreachable, cached/bundled data stands */ }
  })();

  return current;
}

// Generic persisted key-value access (theme mode, quiz progress, chosen state).
export const kv = {
  get: (k) => store.get(k),
  set: (k, v) => store.set(k, typeof v === 'string' ? v : JSON.stringify(v)),
};

// --- Quiz progress: answers survive leaving mid-quiz; resume any time ---
const QUIZ_KEY = 'm2v:quiz:v1';
export async function getQuizState() {
  try { return JSON.parse((await store.get(QUIZ_KEY)) || 'null'); } catch { return null; }
}
export async function saveQuizState(state) {
  await store.set(QUIZ_KEY, JSON.stringify(state));
}
export async function clearQuizState() {
  await store.set(QUIZ_KEY, 'null');
}

// --- My Ballot: the user's saved picks, on device only (never uploaded) ---
const PICKS_KEY = 'm2v:picks:v1';
export async function getPicks() {
  try { return JSON.parse((await store.get(PICKS_KEY)) || '[]'); } catch { return []; }
}
export async function savePick(pick) {
  const picks = (await getPicks()).filter((p) => p.raceId !== pick.raceId);
  picks.push(pick);
  await store.set(PICKS_KEY, JSON.stringify(picks));
  return picks;
}
export async function removePick(raceId) {
  const picks = (await getPicks()).filter((p) => p.raceId !== raceId);
  await store.set(PICKS_KEY, JSON.stringify(picks));
  return picks;
}

// Dataset-wide freshness info for the About/Methodology screen.
export async function getDatasetInfo() {
  try {
    const rows = await fetchJson('meta?key=eq.dataset&select=value');
    return rows?.[0]?.value || null;
  } catch { return null; }
}
