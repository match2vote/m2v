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
  let races = buildRaces(code, data);
  // Optional district filter: keep every statewide race, and only the one
  // House race for the given district. Applied here so no call site filters
  // on its own. Never defaults to any district; no district means all House
  // races in the state, in district order.
  if (opts.district) {
    const houseId = `${code}-house-${opts.district}`;
    races = races.filter((r) => !r.id.includes('-house-') || r.id === houseId);
  }
  if (!opts.curatedOnly && !opts.display && !opts.ballotView) return races;
  return races
    .map((race) => {
      const curated = race.candidates.filter(
        (c) => c.tier === 'curated' && !ELIMINATED.has(c.ballotStatus)
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

// States (and DC) with no showable races. Coverage is feasibility-complete:
// every state with a 2026 statewide race is covered, so an uncovered state is
// a fact about the election calendar, not a gap in research. Callers use this
// to phrase coverage as "everything except..." while the exceptions are few.
export function getUncoveredStates(dataByState) {
  const covered = new Set(getCoverage(dataByState).states.map((s) => s.code));
  return STATE_LIST.filter((s) => !covered.has(s.code));
}

// One sentence describing coverage for uncovered-state screens, generated
// from the data so it stays true as coverage changes. While the exceptions
// are few (<=6) we name the exceptions; if the uncovered list ever grows past
// that, naming what IS covered reads better than a long list of gaps.
export function coverageSentence() {
  const covered = getCoverage().states;
  const uncovered = getUncoveredStates();
  const hasDC = covered.some((s) => s.code === 'DC');
  const stateCount = covered.length - (hasDC ? 1 : 0);
  if (uncovered.length === 0) {
    return `We cover all ${stateCount} states${hasDC ? ' and Washington, D.C' : ''}.`;
  }
  if (uncovered.length > 0 && uncovered.length <= 6) {
    return (
      `We cover ${stateCount} states${hasDC ? ' and Washington, D.C.' : ''} ` +
      `The only ones missing are ${nameList(uncovered.map((s) => s.name))}, ` +
      `none of which has a Senate or governor race in 2026.`
    );
  }
  return `We're adding states weekly. So far we cover ${nameList(covered.map((s) => s.name))}.`;
}

function nameList(names) {
  if (names.length <= 1) return names[0] || '';
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
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

// U.S. House seats per state for the 2022 to 2030 maps (2020 apportionment).
// DC elects one non-voting delegate. Used only to list district numbers in
// the district picker; race data still comes from the bundle.
export const HOUSE_SEATS = {
  AL: 7, AK: 1, AZ: 9, AR: 4, CA: 52, CO: 8, CT: 5, DE: 1, FL: 28, GA: 14,
  HI: 2, ID: 2, IL: 17, IN: 9, IA: 4, KS: 4, KY: 6, LA: 6, ME: 2, MD: 8,
  MA: 9, MI: 13, MN: 8, MS: 4, MO: 8, MT: 2, NE: 3, NV: 4, NH: 2, NJ: 12,
  NM: 3, NY: 26, NC: 14, ND: 1, OH: 15, OK: 5, OR: 6, PA: 17, RI: 2, SC: 7,
  SD: 1, TN: 9, TX: 38, UT: 4, VT: 1, VA: 11, WA: 10, WV: 2, WI: 8, WY: 1,
  DC: 1,
};

// District ids a voter can pick for a state: ['at-large'] for single-seat
// states and DC, otherwise ['1'..'N'].
export function districtOptions(code) {
  const n = HOUSE_SEATS[code] || 0;
  if (n <= 1) return ['at-large'];
  return Array.from({ length: n }, (_, i) => String(i + 1));
}

export function isSingleDistrict(code) {
  return (HOUSE_SEATS[code] || 0) <= 1;
}

export function districtLabel(d) {
  if (!d) return null;
  return d === 'at-large' ? 'At-Large' : `District ${d}`;
}

// Where to send a voter who does not know their district. house.gov's finder
// returns the currently seated member and, by its own note, the 2026 changes
// in the ten redrawn states do not take effect until January 2027, so for
// those ten it points at the state's own page instead. Verified Aug 15, 2026,
// see docs/build-queue-progress-B.md for what each page showed; states whose
// finder could not be verified use their main elections page.
const HOUSE_GOV_FINDER = 'https://www.house.gov/representatives/find-your-representative';
const STATE_DISTRICT_FINDERS = {
  TX: { url: 'https://www.votetexas.gov/', label: 'VoteTexas.gov, Texas Secretary of State' },
  CA: { url: 'https://sdmg.senate.ca.gov/committeehome/2025-congressional-districts', label: 'the California Senate map of the 2025 congressional districts' },
  MO: { url: 'https://www.sos.mo.gov/elections', label: 'the Missouri Secretary of State elections page' },
  NC: { url: 'https://www.ncsbe.gov/results-data/voting-maps-redistricting', label: 'the North Carolina State Board of Elections redistricting page' },
  OH: { url: 'https://findmydistrict.ohiosos.gov/', label: 'the Ohio Secretary of State Find My District tool' },
  UT: { url: 'https://vote.utah.gov/', label: 'vote.utah.gov, Utah Lieutenant Governor' },
  FL: { url: 'https://dos.fl.gov/elections/', label: 'the Florida Division of Elections' },
  LA: { url: 'https://www.sos.la.gov/ElectionsAndVoting/Pages/default.aspx', label: 'the Louisiana Secretary of State elections page' },
  TN: { url: 'https://sos.tn.gov/elections', label: 'the Tennessee Secretary of State elections page' },
  AL: { url: 'https://www.sos.alabama.gov/alabama-votes/state-district-maps', label: 'the Alabama Secretary of State district maps page' },
};
export function districtFinder(code) {
  if (STATE_DISTRICT_FINDERS[code]) return { ...STATE_DISTRICT_FINDERS[code], redrawn: true };
  return { url: HOUSE_GOV_FINDER, label: 'house.gov', redrawn: false };
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
