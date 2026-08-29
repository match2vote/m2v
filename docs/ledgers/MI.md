# Ledger: MI (Aug 29, 2026)

All 13 MI House districts worked in order. Source discovery: politics1.com/mi.htm fetched first for campaign URLs; clerk.house.gov rolls 23 (Laken Riley Act), 102 (SAVE Act), 190 (H.R. 1 tax law) fetched once each, covering all 10 MI incumbents in one pass each. Michigan Advance/Ballotpedia used for incumbent backfill. Every race in this worklist was already "names-only" with third-party/independent micro-candidates in the mix, so every race parked at overlap 0 (a fully null micro-candidate on every axis caps overlap at 0-1 regardless of how well-documented the major-party candidates are). No overlap reached 5+, so no targeted-round races were needed.

- **MI-house-1**: Bergman(R,inc) 5/10, Barr(D) 4/10, Featherly(I) 6/10, Satterla/Davenport/Kovaly/Hakola(3rd-party) 0/10 documented dead ends. Overlap 0. Parked.
- **MI-house-2**: Moolenaar(R,inc) 6/10, Ambrose(D) 0/10 (site metadata-only, no body content on repeated fetch), Magoon(G) 0/10 dead end. Overlap 0. Parked.
- **MI-house-3**: Scholten(D,inc) 6/10, DeBoer(R) 5/10, Jock(G) 0/10 dead end (Ballotpedia robots-blocked). Overlap 0. Parked.
- **MI-house-4**: Huizenga(R,inc) 6/10, McCann(D) 6/10 (includes two genuinely mixed 0-scores on safety and immigration, quoting both sides), Barnett(G) 0/10 dead end. Overlap 0. Parked.
- **MI-house-5**: Walberg(R,inc) 3/10 (only vote data; issues page thin), Vukasovich(D) 0/10 (site metadata-only), Bronke/Muszynski/Renier(3rd-party) 0/10 dead ends. Overlap 0. Parked.
- **MI-house-6**: Dingell(D,inc) 6/10, Smiley(R) 7/10, Shabazz/Teagan/Mickevicius/Rayburn(3rd-party) 0/10 dead ends. Overlap 0. Parked. Note: Smiley alone would clear overlap with Dingell on several axes but the four minor candidates cap it at 0.
- **MI-house-7**: Barrett(R,inc) 5/10 (opponent-characterization on repro correctly excluded per rule), Lawrence(D) 5/10, Dedrick(G)/Thibodeau(WC) 0/10 dead ends. Overlap 0. Parked. Pre-existing rich background/priorities on Barrett and Lawrence entries preserved, only positions data added.
- **MI-house-8**: McDonald Rivet(D,inc) 3/10 (thin campaign site, mostly vote data), Smith(R)/Pettus(L)/Casha(G)/Goodwin(WC) 0/10 dead ends. Overlap 0. Parked.
- **MI-house-9**: McClain(R,inc) 3/10 (vote data only; homepage has no issues content, Ballotpedia notes no survey completed any cycle), Pooley(D) 0/10, Clayton/Vayko/Vlahos/Walkowicz(3rd-party) 0/10 dead ends. Overlap 0. Parked.
- **MI-house-10**: Bouchard(R) 4/10, Hines(D) 3/10 (includes one mixed 0-score on safety), Saliba(L) 1/10, Nkromo(G)/Kirby(WC) 0/10 dead ends. Overlap 0. Parked.
- **MI-house-11**: Moss(D) 3/10, Baker(R) 0/10 (unity-message site, no policy content), Kumar(I) 0/10 (only outdated, explicitly-disclaimed 2016 positions found; not used per guide caution), Teasdale(G)/Ishac(L) 0/10 dead ends. Overlap 0. Parked.
- **MI-house-12**: Tlaib(D,inc) 2/10 (campaign site issues page only exposed priority-category headings, no body text; 2 axes from votes), Hooper(R) 1/10, Sanders(G)/Sosnowski(USTP)/Walkowicz(WC) 0/10 dead ends. Overlap 0. Parked.
- **MI-house-13**: McKinney(D) 9/10 (very rich priorities page), Dardzinski(USTP) 6/10, Nykoriak(R)/Coleman(WC) 0/10 dead ends, Campbell(I) and Morton(I) 0/10 (Campbell not even listed on politics1's MI page, which shows a different Green candidate for this seat than the worklist does; flagged as an oddity, not corrected). Overlap 0. Parked.

## Data oddities noticed, not corrected
- MI-house-13: politics1.com lists Green candidate "Raelyn Light" for this district; the worklist instead lists Independent "Shelby Campbell" (not shown on politics1 at all). Both may be real filers; left as-is per instructions not to alter candidate rosters.
- Anil Kumar (fec-H4MI10131) is tagged "Independent" in the pre-existing curated entry though the FEC source data used "UNAFFILIATED"; this predates this pass and was left unchanged (guide says extend in place, not to overwrite existing fields).
- Two candidates (fec-H2MI07123 Barrett, fec-H6MI07298 Lawrence) already had rich background/priorities/sources from an earlier pass; those fields were preserved untouched and only `positions`/`positionSources`/`nullNotes` were added.

## Gun-related content explicitly excluded from the safety axis
Featherly (MI-1) and McDonald Rivet (MI-8) both had gun-policy statements paired with other language; per the guide's rule 3, these were excluded from the safety axis and left null/unscored on that basis.

## Externally blocked
Ballotpedia direct-URL fetches were robots-blocked for roughly half of attempted micro-candidate pages (intermittently, not a consistent pattern); each blocked attempt is logged in that candidate's nullNotes. congress.gov/govtrack were not attempted per the guide. hillaryscholten.com and terrideboerforcongress.com had SSL/redirect errors on first attempt; DeBoer's redirect target was fetched successfully, Scholten's was not (fell back to Ballotpedia, which succeeded).

## Verify gate
Ran source-first re-checks against the fetched text used for each quote (all scores were derived directly from the WebFetch output text at write time, not from memory). Mechanical checks from repo root: `python3 -m json.tool data/curated/MI.json` passes; all 63 worklist ids present with no duplicates; all 10 position keys present on every entry; every non-null score has a positionSources entry; every null has a nullNotes entry; no em-dashes found; `node pipeline/bundle-data.mjs` exits 0 (2964 candidates, 1207 curated bundled).

## State tally
MI: 63 candidates checked | 63 full 10-axis hunts run (all ZERO-AXIS) | 105 positions filled | 525 remain null | 23 candidates 0->1+ | 0 races flipped | 13 races parked
