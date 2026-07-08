// Clearly-labeled SAMPLE candidates so the quiz→results flow works before
// the real database is wired up. These are NOT real people (tier: 'sample'),
// exactly like the prototype's generated tier. Real data arrives from:
//   1. curated DB (migrated from prototype policy-db.jsx)  → tier 'curated'
//   2. FEC sync (pipeline/fec-sync.mjs)                    → tier 'fec'
export const SAMPLE_RACE = {
  office: 'U.S. Senate',
  state: 'Sample State',
  candidates: [
    {
      id: 'sample-1',
      name: 'Avery Whitfield',
      party: 'Sample Party A',
      tier: 'sample',
      positions: {
        cost: -2, health: -2, housing: -1, immigration: -1, taxes: -2,
        climate: -2, education: -1, safety: -1, repro: -2, democracy: -2,
      },
    },
    {
      id: 'sample-2',
      name: 'Jordan Calloway',
      party: 'Sample Party B',
      tier: 'sample',
      positions: {
        cost: 2, health: 2, housing: 1, immigration: 2, taxes: 2,
        climate: 1, education: 2, safety: 2, repro: 2, democracy: 1,
      },
    },
    {
      id: 'sample-3',
      name: 'Riley Nakamura',
      party: 'Independent (Sample)',
      tier: 'sample',
      positions: {
        cost: 0, health: -1, housing: 1, immigration: 0, taxes: 1,
        climate: -1, education: 0, safety: 1, repro: null, democracy: 0,
      },
    },
    {
      id: 'sample-4',
      name: 'Morgan Ellis',
      party: 'Sample Party B',
      tier: 'fec', // demonstrates the "Not stated" tier in results
      positions: {
        cost: null, health: null, housing: null, immigration: null, taxes: null,
        climate: null, education: null, safety: null, repro: null, democracy: null,
      },
    },
  ],
};
