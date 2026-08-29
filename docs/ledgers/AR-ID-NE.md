# Ledger: AR, ID, NE unsourced pass (Aug 29, 2026)

Worked smallest race counts first, state by state (AR then ID then NE), all 9 assigned races were ZERO-AXIS (no candidate had any prior score). House incumbents sourced primarily via 2025 House roll calls (roll 23 Laken Riley Act, roll 102 SAVE Act, roll 190 H.R. 1 tax law), all fetched once per state batch; every AR/ID/NE Republican incumbent in scope voted yes on all three, giving immigration +2, democracy +2, taxes +2 from vote-backed evidence. Remaining axes hunted via campaign sites, Ballotpedia, Wikipedia, state-outlet coverage (Arkansas Advocate, Idaho Capital Sun, Nebraska Examiner) and local candidate surveys (KIVI/Idaho News ID-2 survey, Nebraska Voter Guide).

## Arkansas

- **AR-house-2** (Hill vs Jones, advancing=2): Hill 6/10 scored (health, immigration, taxes, climate, repro, democracy), Jones 5/10 (health, housing, climate, education, democracy). Overlap = 3 (health, climate, democracy). Parked at tier researched.
- **AR-house-4** (Westerman vs Russell, advancing=2): Westerman 4/10 (immigration, taxes, repro, democracy), Russell 6/10 (cost, health, housing, taxes, climate, education). Overlap = 1 (taxes only). Parked.
- **AR-house-1** (Crawford, Green, Parsons, advancing=3): Crawford 5/10, Green 0/10 (no documented positions found beyond vague affordability/accountability rhetoric that doesn't fit any axis mechanism), Parsons 1/10 (cost). Overlap = 0. Parked.
- **AR-house-3** (Womack, Ryerse, Wilson, advancing=3): Womack 5/10, Ryerse 0/10 (campaign site has no detailed platform, Ballotpedia survey incomplete, iVoterGuide questionnaire unanswered), Wilson 2/10 (taxes, climate). Overlap = 0. Parked.

Oddities logged, not corrected: FEC roster lists Crawford as "Eric Alan Rick Crawford" and Womack as "Stephen A The Womack"; kept existing shorter display names already in the curated file.

AR: 10 candidates checked | 100 blank axes researched | 34 filled | 66 remain null | 8 candidates 0->1+ | 0 races flipped | 4 parked

## Idaho

- **ID-house-1** (Fulcher, Peterson, Zabel, Gomez, advancing=4): Fulcher 7/10, Peterson 8/10, Zabel 4/10 (health, housing, immigration mixed=0, taxes mixed=0), Gomez 0/10 (never completed a Candidate Connection survey across 3 cycles, did not respond to an Idaho Capital Sun interview request). Overlap = 0 (Gomez has nothing). Parked despite strong Fulcher/Peterson coverage.
- **ID-house-2** (Simpson, Gilbreath, Johanson, Sierra, Houser, Hutchinson, advancing=6): Simpson 6/10, Gilbreath 5/10, Johanson 2/10 (taxes, climate, from a local candidate survey), Sierra 0/10, Houser 0/10, Hutchinson 3/10 (cost, housing, climate, same survey). Overlap = 0 (Sierra and Houser have nothing). Parked.

Oddity logged and corrected: worklist name "C. Sierra" is registered with the Idaho Secretary of State as "Sierra 'Idaho Lorax' Carta"; updated the display name to match the official record.

ID: 10 candidates checked | 100 blank axes researched | 35 filled | 65 remain null | 7 candidates 0->1+ | 0 races flipped | 2 parked

## Nebraska

- **NE-house-1** (Flood, Backemeyer, Sandman, advancing=3): Flood 5/10 (immigration, taxes, education, repro, democracy), Backemeyer 0/10 (campaign site priority headings name topics like "Making Healthcare Affordable" with no stated mechanism; priorities page 404s), Sandman 3/10 (cost, health, taxes). Overlap = 0. Parked.
- **NE-house-2** (Harding, Powell, Foreman, advancing=3, open seat, Bacon retiring): Harding 4/10 (cost, immigration, climate, democracy, from his campaign "vision" page), Powell 4/10 (health, taxes, education, repro), Foreman 0/10 (general libertarian philosophy only, no mechanism on any axis). Overlap = 0. Parked.
- **NE-house-3** (Smith, Stille, Cohen, Else, advancing=4): Smith 4/10 (health, immigration, taxes, democracy), Stille 2/10 (immigration, repro), Cohen 0/10 (rejects two-party framing, no policy mechanism found), Else 2/10 (cost, health, from an archived 2022 campaign site since he has never completed a Candidate Connection survey). Overlap = 0. Parked.

NE: 10 candidates checked | 100 blank axes researched | 24 filled | 76 remain null | 7 candidates 0->1+ | 0 races flipped | 3 parked

## Verify gate

All 30 candidate entries: valid JSON (`python3 -m json.tool`), all ids exist in `data/fec/<STATE>.json` where FEC-rostered, all 10 position keys present on every entry, one positionSource per non-null score, one nullNote per null (dated "checked Aug 29, 2026"), zero em-dashes, zero duplicate ids across all three files, `node pipeline/bundle-data.mjs` exits 0 (2964 candidates, 741 curated, unchanged tier count for this batch since nothing flipped). Every scored position traces to a URL actually fetched with WebFetch; three-round hunts (campaign site, Ballotpedia/survey, news coverage) were exhausted before any axis was left null.

## Overall tally

**AR/ID/NE: 30 candidates checked | 300 blank axes researched | 93 filled | 207 remain null | 22 candidates 0->1+ | 0 races flipped | 9 parked**
