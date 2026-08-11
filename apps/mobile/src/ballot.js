// Ballot data access — reads the bundled 50-state candidate snapshot.
// Later this becomes a fetch from the M2V backend with this file as the
// offline fallback; the call sites won't change.
import candidatesByState from './data/candidates.json';

export const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
  MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
  NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
  ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
  RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
  TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', DC: 'Washington, D.C.',
};

// The 50 states (plus DC), in name order, for the picker.
export const STATE_LIST = Object.entries(STATE_NAMES)
  .sort((a, b) => a[1].localeCompare(b[1]))
  .map(([code, name]) => ({ code, name }));

export function getBundledStateData(code) {
  return candidatesByState[code] || null;
}

// Returns the list of races for a state:
//   [{ id, title, candidates, meta, hiddenCount? }]
// `data` (from api.getStateData) takes precedence; bundled snapshot is the fallback.
// opts.curatedOnly: only races with researched candidates, and only those
// candidates — users never see placeholder "Not stated" candidates.
export function getRaces(code, data, opts = {}) {
  const races = buildRaces(code, data);
  if (!opts.curatedOnly) return races;
  return races
    .map((race) => {
      const curated = race.candidates.filter(
        (c) => c.tier === 'curated' && c.ballotStatus !== 'not-advancing'
      );
      if (!curated.length) return null;
      return { ...race, candidates: curated, hiddenCount: race.candidates.length - curated.length };
    })
    .filter(Boolean);
}

// Coverage summary: which states have at least one fully researched race.
export function getCoverage(dataByState) {
  const src = dataByState || candidatesByState;
  const states = [];
  let totalRaces = 0;
  let totalCandidates = 0;
  for (const code of Object.keys(src)) {
    const races = getRaces(code, src[code], { curatedOnly: true });
    if (races.length) {
      const n = races.reduce((s, r) => s + r.candidates.length, 0);
      states.push({ code, name: STATE_NAMES[code] || code, races: races.length, candidates: n });
      totalRaces += races.length;
      totalCandidates += n;
    }
  }
  states.sort((a, b) => a.name.localeCompare(b.name));
  return { states, totalRaces, totalCandidates };
}

// Resolve a race by id like "NC-senate", "TX-governor", "CA-house-12"
// (curated view). Returns null if unknown/uncovered.
export function findRaceById(id, data) {
  const state = (id || '').split('-')[0];
  if (!STATE_NAMES[state] && state !== state.toUpperCase()) return null;
  return getRaces(state, data, { curatedOnly: true }).find((r) => r.id === id) || null;
}

// Resolve a curated candidate by id across all covered states.
// Returns { candidate, race } or null.
export function findCandidateById(id) {
  for (const code of Object.keys(candidatesByState)) {
    for (const race of getRaces(code, candidatesByState[code], { curatedOnly: true })) {
      const candidate = race.candidates.find((c) => c.id === id);
      if (candidate) return { candidate, race };
    }
  }
  return null;
}

function buildRaces(code, data) {
  data = data || getBundledStateData(code);
  if (!data) return [];
  const races = [];
  if (data.governor?.length) {
    races.push({
      id: `${code}-governor`,
      title: 'Governor',
      candidates: data.governor,
      meta: data.raceMeta?.[`${code}-governor`] || null,
    });
  }
  if (data.senate?.length) {
    races.push({
      id: `${code}-senate`,
      title: 'U.S. Senate',
      candidates: data.senate,
      meta: data.raceMeta?.[`${code}-senate`] || null,
    });
  }
  const districts = Object.keys(data.house || {}).sort((a, b) => {
    if (a === 'at-large') return -1;
    if (b === 'at-large') return 1;
    return Number(a) - Number(b);
  });
  for (const d of districts) {
    races.push({
      id: `${code}-house-${d}`,
      title: d === 'at-large' ? 'U.S. House — At-Large' : `U.S. House — District ${d}`,
      candidates: data.house[d],
      meta: data.raceMeta?.[`${code}-house-${d}`] || null,
    });
  }
  return races;
}
