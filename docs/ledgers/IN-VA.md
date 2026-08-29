# Ledger: IN, VA (Aug 29, 2026)

Method: fetched politics1.com/in.htm and politics1.com/va.htm first to harvest campaign URLs for every worklist candidate. Fetched House roll calls 23 (Laken Riley Act), 102 (SAVE Act), 190 (H.R. 1 tax law) once each, covering all IN and VA incumbents in the 119th Congress in three total fetches. All 48 worklist candidates were ZERO-AXIS; did full 10-axis hunts (campaign issues pages, then Ballotpedia/Candidate Connection, then roll calls/named news) within the WebFetch-only discovery playbook.

## Data oddities found and logged (not corrected in FEC file, per instructions)
- `fec-H0IN03198` (Marlin Stutzman, IN-03): worklist flagged `inc=true`; `data/fec/IN.json` has `incumbent: false`. Used FEC value. He is a former member (2010-2017) seeking to return; the current IN-03 seat is held by someone else.
- `fec-H0VA07133` (John McGuire, VA-05): `data/fec/VA.json` has `district: "5"` and `incumbent: false`, though the FEC id carries a legacy `VA07` string and McGuire is in fact the sitting VA-05 representative. The pre-existing curated placeholder for this id had `incumbent: true`. Used the FEC file's `incumbent: false` verbatim per the sourcing rule and logged this discrepancy rather than correcting it.
- Ballotpedia intermittently returned `robots.txt fetch failed` / HTTP 202 errors on several fetches (Bobby Scott, Edwin Rivera, Alaha Ahrar) that were not clearly permanent blocks; retried once per the addendum's guidance, then moved on.

## IN races (all names-only -> parked at "researched", none reached overlap >= 7)
- IN-house-1 (Mrvan D vs Regnitz R): Mrvan 3 filled (health, repro, democracy); Regnitz 0 (campaign site unreachable twice, no Ballotpedia survey). Overlap 0. Parked.
- IN-house-2 (Yakym R inc vs Decio D vs Henry L): Yakym 5, Decio 4, Henry 2. Overlap 1 (taxes only, across all three). Parked.
- IN-house-3 (Stutzman R vs Thompson D): Stutzman 6, Thompson 4. Overlap 1 (repro). Parked.
- IN-house-4 (Baird R inc vs Cox D): Baird 3 (roll-call only; campaign site now redirects to an unrelated org), Cox 5. Overlap 1 (taxes). Parked.
- IN-house-5 (Spartz R inc vs Ford D): Spartz 6, Ford 7. Overlap 4 (immigration, taxes, education, repro). Parked (below the 5-6 targeted-round threshold).
- IN-house-6 (Shreve R inc vs Wirth D): Shreve 5, Wirth 4. Overlap 1 (repro). Parked.
- IN-house-7 (Carson D inc vs McAuley R vs Sceniak L): Carson fully researched, 10/10 filled; McAuley 0 (no issues page, no Ballotpedia survey); Sceniak 3 (only 2022/2024 material on Ballotpedia). Overlap 0 because of McAuley. Parked.
- IN-house-8 (Messmer R inc vs Allen D): Messmer 4, Allen 7. Overlap 2 (immigration, taxes). Parked.
- IN-house-9 (Houchin R inc vs Meyer D vs Hudson L vs Taylor I): Houchin 6, Meyer 4, Hudson 5, Taylor 0 (no site found, no Ballotpedia survey). Overlap 0 because of Taylor. Parked.

## VA races (all names-only -> parked at "researched", none reached overlap >= 7)
- VA-house-1 (Wittman R inc vs Taylor D): Wittman 7, Taylor 6. Overlap 4 (health, taxes, climate, safety). Parked.
- VA-house-2 (Kiggans R inc vs Luria D): Kiggans 8, Luria 5. Overlap 4 (cost, health, education, repro). Parked.
- VA-house-3 (Scott D inc vs Rivera R vs Woll I): Scott 5, Woll 5, Rivera 0 (campaign site only generic taglines, Ballotpedia robots-blocked twice). Overlap 0. Parked.
- VA-house-4 (McClellan D inc vs Murray R, no FEC id): McClellan 7, Murray 1 (taxes only: 0% federal income tax pledge). Overlap 0. Parked.
- VA-house-5 (McGuire R inc vs Perriello D): McGuire 3 (roll-call only, no readable campaign or house.gov content), Perriello 4. Overlap 0. Parked.
- VA-house-6 (Cline R inc vs Macy D): Cline 4, Macy 7. Overlap 2 (immigration, taxes). Parked.
- VA-house-7 (Vindman D inc vs Ollivant R vs Ahrar I): Vindman 7, Ollivant 6, Ahrar 0 (site metadata only twice, Ballotpedia robots-blocked twice). Overlap 0. Parked.
- VA-house-8 (Beyer D inc vs Sabio R vs Sharman I vs Arnoldi L): Beyer 3, Sabio 3, Sharman 0, Arnoldi 0 (both no usable issues content on two attempts each). Overlap 0. Parked.
- VA-house-9 (Griffith R inc vs Powers D): Griffith 5, Powers 4. Overlap 0 (no shared filled axis). Parked.
- VA-house-10 (Subramanyam D inc vs Beckwith R): Subramanyam 5, Beckwith 5. Overlap 2 (cost, climate). Parked.
- VA-house-11 (Walkinshaw D inc vs Purves R): Walkinshaw 8, Purves 7. Overlap 5 (immigration, climate, education, repro, democracy) after the one required targeted round (checked Purves for health/housing/safety and Walkinshaw for cost/taxes; no new fills found). Still under 7. Parked.
- VA-senate: not in worklist, untouched.

Note: several close calls (IN-house-5 at 4, VA-house-1/2 at 4, VA-house-11 at 5) were the ones where a further round would matter most if this pass is resumed later.

## State tallies
IN: 22 candidates checked | 220 blank axes researched | 93 filled | 127 remain null | 19 candidates 0->1+ | 0 races flipped | 9 parked
VA: 26 candidates checked | 260 blank axes researched | 115 filled | 145 remain null | 22 candidates 0->1+ | 0 races flipped | 11 parked
