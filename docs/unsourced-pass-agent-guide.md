# Unsourced positions pass: agent guide (Aug 29, 2026)

You are one of several parallel research agents filling unsourced issue positions for the Match2Vote app. The repo is at /home/claude/m2v. You write ONLY `data/curated/<STATE>.json` for the states assigned to you, plus your own ledger file `docs/ledgers/<YOUR-STATES>.md`. Never touch another state's file, data/fec/, apps/, pipeline/, or packages/.

## Your worklist
Read `docs/worklists/<STATE>.md` for each of your states. It lists every candidate needing work, with EXACTLY which axes to hunt. Lines marked "documented dead ends (SKIP)" were already exhausted; do not re-search those axes. Candidates marked ZERO-AXIS need the full 10-axis hunt plus a complete curated-style entry. This is a gap-filling pass: never re-research an axis that already has a source, and never rewrite existing sourced positions or citations except to fix an obvious factual error (log it in your ledger if you do).

## The 10 axes, sign convention, calibration
Score -2..+2 where negative = stance A, positive = stance B, 0 = documented mixed or conflicting (label must quote both sides), null = not documented.

| key | A (negative) | B (positive) |
|---|---|---|
| cost | Intervene directly: cap prices, subsidies, min-wage raises | Step back: cut regs/taxes so markets lower prices |
| health | Bigger public role: expand Medicare/Medicaid toward universal | Bigger private role: competition, less government |
| housing | Public action: build public/affordable housing, protect renters | Unleash building: cut zoning/permits, market builds |
| immigration | Pathways/protections, higher legal immigration | Enforcement first: border security, deportations |
| taxes | Raise taxes on corporations/high earners to fund programs | Cut taxes across the board, reduce spending |
| climate | Act aggressively: rapid clean-energy transition, strict rules | Energy independence/cost: expand all sources incl. oil and gas |
| education | Into public schools: teacher pay, universal pre-K | Into choice: vouchers, charters, parental control |
| safety | Prevention: mental health, reentry, root causes | Enforcement: more police funding, tougher sentencing |
| repro | Protect access: guarantee the right to abortion | Restrict: limit or prohibit abortion |
| democracy | Easier voting: automatic registration, expanded mail/early | Stricter safeguards: voter ID, tighter rules |

Calibration anchors: Medicare for All = health -2; opposing M4A while backing market competition = +1; leading defeat of Medicaid expansion = +2. Voted to make the 2025 tax law / TCJA permanent = taxes +2; targeted household tax credits with no broader agenda = null (does not fit the axis). Voter ID advocacy = democracy +1..+2; John Lewis VRA support = -2; 2020 certification objections = +2; SAVE Act proof-of-citizenship: voted/argued yes = +1..+2, voted/argued no = -1. Mixed zoning-dereg plus Housing-First = housing 0. Routine appropriations alone (police funding votes, housing earmarks with no advocacy language) = null. Magnitude rule of thumb: plus-or-minus 2 for emphatic, flagship, or vote-backed positions; plus-or-minus 1 for a clear but single-mention stance.

## Hard source rules (violations are worse than gaps)
1. A position is scored ONLY if a specific URL you actually fetched with WebFetch documents it. Never cite a page you did not load. If a fetch fails or 403s, that URL does not exist for you.
2. Never infer from party, endorsements, ideology, or an opponent's characterization. Undocumented stays null.
3. Gun stances do NOT map to the safety axis. Ignore them.
4. Wikipedia and Ballotpedia narrative text can point you to a vote or statement; a Ballotpedia Candidate Connection survey answer IS citable (it is the candidate's own words). congress.gov and govtrack are bot-blocked; do not try them.
5. For House incumbents, roll-call votes beat press releases. Fetch `https://clerk.house.gov/evs/2025/rollNNN.xml` and ask for your members' votes. Known useful 2025 rolls: roll 23 (S.5 Laken Riley Act, Jan 22: yes = immigration +1..+2, no = -1), roll 102 (H.R. 22 SAVE Act passage, Apr 10: yes = democracy +1..+2, no = -1), roll 190 (H.R. 1 tax law, Jul 3: yes = taxes +2; a no vote alone does NOT establish the taxes axis for Democrats, find a statement).
6. One sentence, one axis. A drug-price line is cost OR health, not both.
7. One URL should not carry six positions; link the specific issues page, release, or vote.
8. No em-dashes anywhere in anything you write. Use commas or colons.
9. Honolulu Civil Beat style candidate Q&As, Maine Public style profiles, and local voter guides are excellent; look for the state equivalent (e.g. AZ Mirror, Wisconsin Examiner, Spotlight PA, CalMatters, statehouse-press voter guides).

Search patterns: '"<name>" <issue>', '"<name>" <issue> 2026', site:<campaigndomain> <issue>, '"<name>" questionnaire', '"<name>" interview <issue>'. Three rounds max per axis: campaign pages, then Ballotpedia/surveys/Q&As, then legislative record or named news coverage. Then it is a null with a note.

## Schema for entries you create or extend
An existing FEC-rostered candidate: add an object to the state's curated file `candidates` array with the SAME id (`fec-...`), copying `name`, `party`, `district`, `state`, `office`, `incumbent` VERBATIM from `data/fec/<STATE>.json` (do not correct them; log oddities). If a curated/researched object already exists for the id, extend it in place; never create a duplicate id.
Required fields: `tier` (see below), `ballotStatus` (keep what the race's advancing logic implies; nominees are "nominee"), `age` (null unless a fetched page states it), `home` (same rule), `now`, `background` (2-4 sentences), `priorities` (top 3), `positions` (ALL 10 keys, null allowed), `positionSources` (one entry per non-null score: `label` = compressed evidence sentence with verbatim quote where punchy, ending with the source name in parentheses; `url` = the fetched page), `nullNotes` (one entry per null naming where you looked; "not found" alone is not a note; date new dead ends "(checked Aug 29, 2026)"), `sources` (2-4 incl. the FEC filing URL for federal candidates), `curatedAt`: "2026-08-29".

## Tier and race-flip rules (protects app honesty)
- The app displays a race as fully researched the moment ANY candidate in it has `tier: "curated"`, hiding non-curated candidates in that race. Therefore:
- Compute the OVERLAP for each race: the count of axes where EVERY advancing candidate has a non-null value.
- Overlap >= 7: set every advancing candidate to `tier: "curated"` and set the race's `status` to `"general"` in the `races` map (keep `advancing` and `sources`). Update the statusNote to drop "positions not researched yet" language.
- Overlap 5-6: do ONE targeted round only on the one-sided axes (hunt the axis on the candidate missing it). If still under 7, set all researched entries to `tier: "researched"` (NOT curated), leave race status names-only, and append to the statusNote: positions researched and stored, race not scored, overlap N of 10 as of Aug 29, 2026.
- Overlap <= 4 after reasonable effort: same parking procedure. A race where most issues are one-sided must not show percentages.
- Never leave a race half done: either every advancing candidate gets an entry (even if mostly nulls with notes), or revert the race entirely and log why. A candidate who cannot be found at all gets a minimal `tier: "researched"` entry that is all nulls with a documented hunt, same as the quarantine precedent.
- primary-pending races: skip entirely.

## Verify gate (before you finish a state)
For every position you wrote: re-check that the cited page (as you fetched it) actually contains the claim, source first, then compare sign, magnitude, and label. Fix or null any mismatch. Then mechanically: valid JSON (`python3 -m json.tool`), ids exist in the FEC file, all 10 position keys present, source per score, note per null, no em-dash, no duplicate ids, and `node pipeline/bundle-data.mjs` exits 0 from the repo root.

## Ledger
Append to `docs/ledgers/<YOUR-STATES>.md` as you complete each race: race id, per-candidate scored/null counts, overlap, action taken (flipped / parked / left names-only), and anything odd. End with a state tally line:
`XX: N candidates checked | N blank axes researched | N filled | N remain null | N candidates 0->1+ | N races flipped | N parked`

## Final response
Your final message back must be SHORT (under 25 lines): the tally line per state, races flipped, races parked, anything externally blocked, and any data errors you noticed but did not fix. Do not paste file contents.

## ADDENDUM (Aug 29, later): WebFetch-only discovery
The session's WebSearch budget is exhausted. Do NOT call WebSearch; it will refuse. Discover sources by direct fetching instead:
1. `https://politics1.com/<state>.htm` (lowercase two-letter state, e.g. politics1.com/az.htm): lists every 2026 candidate per race WITH links to their campaign websites. Fetch this FIRST for each state and collect the campaign URLs for your worklist candidates.
2. `https://www.thegreenpapers.com/G26/<ST>` for rosters when needed.
3. Ballotpedia direct URLs: `https://ballotpedia.org/First_Last` (underscores); race pages like `https://ballotpedia.org/<State>'s_2nd_Congressional_District_election,_2026`. If robots-blocked, retry once, then move on and note it.
4. Incumbents: `https://<lastname>.house.gov/` issues pages, plus the guide's clerk.house.gov rolls.
5. Campaign sites: try the URL from politics1; if none, try obvious patterns (`<name>forcongress.com`, `<name>for<state>.com`) at most twice, then treat as unfindable.
6. State-outlet candidate Q&As by URL pattern where known (e.g. civilbeat.org candidate-qa pages); one guess, then move on.
Budget your fetches: aim under 12 fetches per ZERO-AXIS candidate, under 4 per single-axis gap.
