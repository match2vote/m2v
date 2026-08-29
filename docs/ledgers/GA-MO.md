# Ledger: GA, MO (Aug 29, 2026)

## Method notes
- Fetched `politics1.com/ga.htm` and `politics1.com/mo.htm` first for campaign URLs (all candidates on both worklists were ZERO-AXIS).
- House incumbents' immigration/taxes/democracy axes checked against House roll calls 23 (S.5 Laken Riley Act, Jan 22 2025), 102 (H.R.22 SAVE Act, Apr 10 2025), and 190 (H.R.1 tax law, Jul 3 2025), fetched once each and asked for all 16 GA/MO incumbents at once. Georgia has two Representatives named Scott (Austin Scott R-GA8, David Scott D-GA13); the first combined fetch mis-attributed a generic "Scott (GA)" row, so each roll was re-fetched with a name-disambiguation prompt before scoring Austin Scott's votes.
- Clay Fuller (GA-14, fec-H0GA14030) does not appear in any of the three 2025 rolls, consistent with taking the seat via a special election after roll 190 (Jul 3, 2025); logged as an oddity, not corrected.
- Bob Onder (fec-H8MO09146) was "Not Voting" on roll 102 (SAVE Act); his democracy score instead cites his campaign site's "Securing Our Election" heading at reduced (+1) magnitude.
- Ballotpedia robots-blocked WebFetch intermittently for both states (Brian Jack's, Matt Day's, Nikema Williams's, and several other pages required workarounds or were left unreachable after one retry per guide). house.gov domain guesses failed for `sanfordbishop.house.gov` and `williams.house.gov` (DNS/wrong-member); corrected to `bishop.house.gov`, `nikemaforcongress.com` (campaign site), etc.
- Several campaign URLs from politics1 were dead or redirected to unrelated content: `daugherty4congress.com` (MO-2 Libertarian) now redirects to an unrelated commercial site; `chrishardenforcongress.com` (GA-11) and `missiheskethforcongress.com` (MO-7) redirect to their current domains, which were then fetched.
- John Kiehne's (MO-2, independent) personal site's only accessible content is explicitly dated to an earlier 2018 campaign for a different office; treated as not current enough to score per the hard source rules, despite being technically fetchable.
- Sample re-fetch verification (per the verify gate) confirmed exact quotes for Ann Wagner (cost), Jason Smith (cost), Kevin Craig (taxes), Jim Kingston (taxes), and Ceretta Smith (repro); no mismatches found.

## GA races (all parked, names-only, all researched-tier)
- GA-house-1 (Kingston R vs Hollowell D): Kingston 8/2, Hollowell 2/8. Overlap 2 of 10 (taxes, democracy). Parked.
- GA-house-2 (Bishop D-inc vs Day R): Bishop 5/5, Day 4/6. Overlap 2 of 10 (immigration, climate). Parked.
- GA-house-3 (Jack R-inc vs Keller D): Jack 4/6, Keller 8/2. Overlap 3 of 10 (climate, democracy, immigration). Parked.
- GA-house-4 (Johnson D-inc vs Duffie R): Johnson 6/4, Duffie 1/9. Overlap 0 of 10. Parked.
- GA-house-5 (Williams D-inc vs Salvesen R): Williams 4/6, Salvesen 1/9 (fringe monetary/food-safety campaign site). Overlap 1 of 10 (democracy). Parked.
- GA-house-6 (McBath D-inc vs Martin R): McBath 2/8 (house.gov issues index has no accessible text, only roll votes usable), Martin 3/7. Overlap 0 of 10. Parked.
- GA-house-7 (McCormick R-inc vs Kozycki D): McCormick 4/6, Kozycki 2/8. Overlap 1 of 10 (immigration). Parked.
- GA-house-8 (Scott R-inc vs Esti D): Scott 3/7 (house.gov issues index has no accessible text, only roll votes usable), Esti 2/8. Overlap 0 of 10. Parked.
- GA-house-9 (Clyde R-inc vs Gegen D): Clyde 4/6, Gegen 0/10 (no locatable campaign content at all). Overlap 0 of 10. Parked.
- GA-house-10 (Gaines R vs DeLancy D): Gaines 4/6, DeLancy 2/8. Overlap 0 of 10. Parked.
- GA-house-11 (Cowan R vs Harden D): Cowan 3/7, Harden 4/6. Overlap 2 of 10 (health, taxes). Parked.
- GA-house-12 (Allen R-inc vs C. Smith D): Allen 3/7 (campaign homepage nearly content-free, only roll votes usable), C. Smith 7/3 (unusually well-documented campaign site). Overlap 1 of 10 (democracy). Parked.
- GA-house-13 (Chavez R vs Clark D): Chavez 7/3, Clark 1/9 (thin campaign homepage, no Ballotpedia survey). Overlap 0 of 10. Parked.
- GA-house-14 (Fuller R-inc vs S. Harris D): Fuller 2/8 (not in any 2025 roll, likely a mid-cycle special-election winner), S. Harris 5/5. Overlap 2 of 10 (immigration, safety). Parked.

## MO races (all parked, names-only, all researched-tier)
- MO-house-1 (Bell D-inc, Berry R, Schmitz L, Phillips I, 4-way): Bell 6/4, Berry 0/10 (Facebook page unreachable, Ballotpedia has only a 2024 Lt. Gov. entry), Schmitz 5/5, Phillips 0/10 (site 404 twice, Ballotpedia unreachable). Overlap 0 of 10. Parked.
- MO-house-2 (Wagner R-inc, Wellman D, Daugherty L, Kiehne I, 4-way): Wagner 7/3 (best-documented candidate in this pass), Wellman 2/8, Daugherty 0/10 (dead campaign URL), Kiehne 0/10 (stale 2018-era page, not scored). Overlap 0 of 10. Parked.
- MO-house-3 (Onder R-inc, Mann D, Higgins L, Brown I, 4-way): Onder 4/6, Mann 4/6, Higgins 0/10 (no campaign URL, Ballotpedia unreachable), Brown 0/10 (perennial candidate, no completed survey across 5 cycles). Overlap 0 of 10. Parked.
- MO-house-4 (Alford R-inc, Herrera D, Holbrook L, Rogers I, 4-way): Alford 6/4, Herrera 1/9, Holbrook 0/10 (issues sub-page not accessible), Rogers 1/9 (write-in independent). Overlap 0 of 10. Parked.
- MO-house-5 (Cleaver D-inc, Brattin R, Langkraehr L, Becker I, 4-way): Cleaver 3/7, Brattin 3/7, Langkraehr 0/10 (Facebook-only presence), Becker 0/10 (no campaign URL). Overlap 0 of 10. Parked.
- MO-house-6 (Stigall R, Smead D, Maidment L, 3-way): Stigall 0/10 (only an X/Twitter profile listed, not fetchable), Smead 5/5, Maidment 1/9. Overlap 0 of 10. Parked.
- MO-house-7 (Burlison R-inc, Hesketh D, Craig L, 3-way): Burlison 4/6, Hesketh 0/10 (homepage lists priority headings only, detail pages inaccessible), Craig 6/4 (extensive libertarian platform, notably left-leaning on immigration/drug policy despite party). Overlap 0 of 10. Parked.
- MO-house-8 (Smith R-inc, Reichard D, Lombard L, 3-way): Smith 6/4, Reichard 0/10 (campaign site unreachable, robots-blocked twice), Lombard 2/8. Overlap 0 of 10. Parked.

## Odd items noticed, not changed
- GA-14's incumbent in the FEC/curated data is Clay Fuller (R), while a withdrawn candidate entry for Marjorie Taylor Greene (fec-H0GA06192, ballotStatus "withdrawn") also exists for the same district, and Fuller does not appear in any 2025 House roll call. This is consistent with Greene resigning/vacating the seat and Fuller winning a special election sometime after July 2025, but was not independently confirmed; left as-is per existing curated data, not altered.
- John Kiehne (MO-2) is listed as "Independent" for 2026 but Ballotpedia shows him running as a Democrat for the same seat in the 2024 primary (withdrew) and for state legislature in several prior cycles; noted, not altered.
- Robert Onder's FEC id (fec-H8MO09146) carries district "3" and matches the worklist's MO-house-3 placement; his ballotStatus in the pre-existing stub was "filed" rather than "nominee" and was left as the pre-existing curated data (not part of this pass's edits) but is worth a maintainer's cross-check against the primary-results sources already cited in the race's statusNote.

## State tally
GA: 28 candidates checked | 280 blank axes researched | 101 filled | 179 remain null | 27 candidates 0->1+ | 0 races flipped | 14 parked
MO: 29 candidates checked | 290 blank axes researched | 66 filled | 224 remain null | 17 candidates 0->1+ | 0 races flipped | 8 parked
