// Ballot data access, reads the bundled 50-state candidate snapshot.
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
//   [{ id, title, candidates, meta, coverage: 'full' | 'names', hiddenCount? }]
//
// Two tiers, both real, clearly distinguished:
//   'full' , researched, sourced positions → match percentages, full profiles
//   'names', we know who's on the ballot (FEC roster + verified nominees) but
//             haven't researched positions. No match %, explicit labeling.
// A race with zero showable candidates IS NOT RETURNED, no empty rows, ever.
//
// opts.curatedOnly → only 'full' races (used for matching).
// opts.display     → both tiers (used for Browse, Home).
// opts.ballotView  → BALLOT ONLY (rule change, Aug 13): covered races with
//   EVERY candidate likely to appear on the real paper ballot, researched or
//   not. The ballot is a planning tool and must mirror the ballot the voter
//   will actually face. Researched candidates come first and are flagged
//   `researched: true`; the rest are listed by name/party from official
//   filing data, flagged `researched: false`, never with inferred positions.
//   Candidates who lost or won't advance are still excluded. Browse/Races
//   deliberately do NOT do this; only the ballot mirrors the full field.
const ELIMINATED = new Set(['not-advancing', 'lost', 'withdrawn']);

export function getRaces(code, data, opts = {}) {
  const races = buildRaces(code, data);
  if (!opts.curatedOnly && !opts.display && !opts.ballotView) return races;
  return races
    .map((race) => {
      const curated = race.candidates.filter(
        (c) => c.tier === 'curated' && c.ballotStatus !== 'not-advancing'
      );
      let shown = null;
      if (curated.length) {
        shown = { ...race, coverage: 'full', candidates: curated, hiddenCount: race.candidates.length - curated.length };
      } else if ((opts.display || opts.ballotView) && (race.meta?.namesOnly || race.meta?.status === 'names-only')) {
        // Names-only: show verified general-election candidates by name.
        const adv = race.meta.advancing;
        const names = adv
          ? race.candidates.filter((c) => adv.includes(c.id))
          : [];
        if (names.length) {
          shown = { ...race, coverage: 'names', candidates: names, hiddenCount: race.candidates.length - names.length };
        }
      }
      if (!shown) return null; // zero showable candidates → race does not exist in the UI
      if (!opts.ballotView) return shown;
      // Ballot view: append every remaining non-eliminated filer, unresearched.
      const shownIds = new Set(shown.candidates.map((c) => c.id));
      const extras = race.candidates
        .filter((c) => !shownIds.has(c.id) && !ELIMINATED.has(c.ballotStatus))
        .map((c) => ({ ...c, researched: false }))
        .sort((a, b) => a.name.localeCompare(b.name));
      return {
        ...shown,
        candidates: [
          ...shown.candidates.map((c) => ({ ...c, researched: shown.coverage === 'full' })),
          ...extras,
        ],
        hiddenCount: 0,
      };
    })
    .filter(Boolean);
}

// Coverage summary across both tiers.
export function getCoverage(dataByState) {
  const src = dataByState || candidatesByState;
  const states = [];
  let fullRaces = 0, namesRaces = 0, totalCandidates = 0;
  for (const code of Object.keys(src)) {
    const races = getRaces(code, src[code], { display: true });
    if (races.length) {
      const full = races.filter((r) => r.coverage === 'full');
      const names = races.filter((r) => r.coverage === 'names');
      const n = full.reduce((s, r) => s + r.candidates.length, 0);
      states.push({ code, name: STATE_NAMES[code] || code, races: races.length, full: full.length, names: names.length, candidates: n });
      fullRaces += full.length;
      namesRaces += names.length;
      totalCandidates += n;
    }
  }
  states.sort((a, b) => a.name.localeCompare(b.name));
  return { states, totalRaces: fullRaces + namesRaces, fullRaces, namesRaces, totalCandidates };
}

// Resolve a race by id like "NC-senate", "TX-governor", "CA-house-12"
// (curated view). Returns null if unknown/uncovered.
export function findRaceById(id, data) {
  const state = (id || '').split('-')[0];
  if (!STATE_NAMES[state] && state !== state.toUpperCase()) return null;
  return getRaces(state, data, { display: true }).find((r) => r.id === id) || null;
}

// Resolve a showable candidate by id across all covered states.
// Returns { candidate, race } or null.
export function findCandidateById(id) {
  for (const code of Object.keys(candidatesByState)) {
    for (const race of getRaces(code, candidatesByState[code], { display: true })) {
      const candidate = race.candidates.find((c) => c.id === id);
      if (candidate) return { candidate, race };
    }
  }
  return null;
}

// States using NEW congressional maps for 2026 (verified Aug 13, 2026:
// TX/CA/MO/NC/OH/UT mid-decade wave + FL/LA/TN/AL post-Callais wave).
// House races in these states carry a "district lines changed" notice so a
// voter who knew their 2024 district number doesn't silently study the wrong
// race. The app never guesses districts (state picker only); this is the
// residual-risk mitigation from the item-0 map audit.
export const REDRAWN_2026 = new Set(['TX', 'CA', 'MO', 'NC', 'OH', 'UT', 'FL', 'LA', 'TN', 'AL']);

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
  if (data.mayor?.length) {
    races.push({
      id: `${code}-mayor`,
      title: 'Mayor',
      candidates: data.mayor,
      meta: data.raceMeta?.[`${code}-mayor`] || null,
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
      title: d === 'at-large' ? 'U.S. House. At-Large' : `U.S. House · District ${d}`,
      candidates: data.house[d],
      meta: data.raceMeta?.[`${code}-house-${d}`] || null,
    });
  }
  return races;
}
