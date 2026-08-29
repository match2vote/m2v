# Ledger: KY, WA (unsourced pass, Aug 29 2026)

## KY-house-1 (Comer R inc vs Williams D)
Comer: 5 scored (health, immigration, taxes, climate, democracy), 5 null. Williams: 0 scored, 10 null (campaign site issue headings have no elaborated positions; paducahsun article 429-blocked). Overlap 0. Parked, statusNote updated.

## KY-house-2 (Guthrie R inc vs Wingfield D vs Loecken Ind)
Guthrie: 5 scored (health, immigration, taxes, repro, democracy), 5 null. Wingfield: 6 scored (cost, health, housing, taxes, education, repro), 4 null - rich campaign platform page. Loecken: 0 scored, all null (no web presence found). Overlap 0. Parked.

## KY-house-3 (McGarvey D inc vs Rodriguez R)
McGarvey: 8 scored (cost, health, immigration, climate, education, safety, repro, democracy), 2 null (housing, taxes - his tax statements were narrow household/energy credits, don't fit axis; no-vote-alone rule applied per guide). Rodriguez: 4 scored (immigration, taxes, safety, repro), 6 null - thin campaign site. Overlap 3 (immigration, safety, repro). Parked.

## KY-house-4 (Gallrein R vs Todd Libertarian vs Strange D) - open seat, Massie lost primary
Gallrein: 5 scored (cost, immigration, taxes, safety, repro), 5 null. Todd: 0 scored, all null (Ballotpedia robots-blocked repeatedly, no other presence found). Strange: 3 scored (cost, education, repro), 7 null. Overlap 0 (Todd zero). Parked.

## KY-house-5 (Rogers R inc vs Pillersdorf D vs Serrano Ind vs Wein Ind)
Rogers: 4 scored (immigration, taxes, climate, democracy), 6 null - very thin web presence for an 88-year-old dean of the delegation; House office site is mostly generic. Pillersdorf: 2 scored (health, taxes), 8 null. Serrano: 2 scored (taxes, repro) from a dated 2014 statement, noted as stale in the label; 8 null. Wein: 0 scored, all null (Ballotpedia robots-blocked, no other presence found). Overlap 0. Parked.

## KY-house-6 (Alvarado R vs Dembo D vs Lynch Ind/Kentucky Party vs Bowman Ind) - open seat, Barr running for Senate
Alvarado: 3 scored (cost, health, taxes), 7 null. Dembo: 0 scored, all null (cost/taxes statements found don't cleanly fit either axis's definition). Lynch: 0 scored, all null. Bowman: 0 scored, all null (only same-name Ballotpedia hit is an unrelated 2024 presidential candidate). Overlap 0. Parked.
Data oddity: worklist/roster lists Lynch's party as "Kentucky Party" but Ballotpedia lists him as Independent; left the existing party field untouched per guide instructions, logging here only.

**KY tally: 18 candidates checked | 180 blank axes reviewed (18x10) | 47 filled | 133 remain null | 11 candidates 0->1+ | 0 races flipped | 6 races parked**

---

## WA-house-1 (DelBene D inc vs Silva R)
DelBene: 7 scored (health, housing, immigration, climate, education, repro, democracy), 3 null. Silva: 1 scored (health), 9 null. Overlap 1 (health). Parked.

## WA-house-2 (Larsen D inc vs Feller R)
Larsen: 7 scored (health, immigration, climate, education, safety[0 mixed], repro, democracy), 3 null. Feller: 0 scored, all null (campaign site is taglines only). Overlap 0. Parked.

## WA-house-4 (McKinney R vs Duresky D) - open seat, Newhouse retiring
McKinney: 0 scored, all null (Ballotpedia robots-blocked, campaign sites returned no readable content, Wikipedia has finance/endorsements only). Duresky: 4 scored (cost, health, immigration[0 mixed], taxes), 6 null. Overlap 0. Parked.

## WA-house-5 (Baumgartner R inc vs Conroy D) - 2024 rematch
Baumgartner: 4 scored (immigration, taxes, climate, democracy), 6 null. Conroy: 6 scored (health, housing, taxes, climate, education, repro), 4 null. Overlap 2 (taxes, climate). Parked.

## WA-house-6 (Randall D inc vs Fox R)
Randall: 7 scored (health, immigration, taxes, climate, education, repro, democracy), 3 null. Fox: 0 scored, all null (campaign site tagline only, survey not completed). Overlap 0. Parked.

## WA-house-7 (Jayapal D inc vs Sheth R)
Jayapal: 7 scored (cost, health, immigration, climate, education, safety, democracy), 3 null. Sheth: 3 scored (immigration, education, safety), 7 null. Overlap 3 (immigration, education, safety). Parked.
Data oddity: fec-H4WA08147's FEC id embeds district "08" but the FEC record's district field (and worklist assignment) is "7"; copied district verbatim from data/fec/WA.json per guide, logging here only.

## WA-house-8 (Schrier D inc vs Meline R) - closest primary in the state for 2nd slot
Schrier: 7 scored (cost, health, immigration[0 mixed vote-vs-platform], climate, education, repro, democracy), 3 null. Meline: 1 scored (education), 9 null. Overlap 1 (education).
Note: Schrier's immigration is scored 0 despite an explicit yes vote on the Laken Riley Act, because her platform statements (bipartisan pathway, DACA codification, opposing the wall) directly conflict with that vote; labeled and quoted both. Parked.

## WA-house-9 (Smith D inc vs Basler R)
Smith: 9 scored (cost, health, housing, immigration, climate, education, safety[0 mixed], repro, democracy), 1 null (taxes). Basler: 0 scored, all null (no campaign site resolved, Ballotpedia robots-blocked). Overlap 0. Parked.

## WA-house-10 (Strickland D inc vs Chung R)
Strickland: 7 scored (cost, health, housing, immigration, climate, safety, democracy), 3 null. Chung: 0 scored, all null (only material found is generic Insurance-Commissioner-run boilerplate). Overlap 0. Parked.

**WA tally: 18 candidates checked | 180 blank axes reviewed (18x10) | 70 filled | 110 remain null | 13 candidates 0->1+ | 0 races flipped | 9 races parked**

---

## Blocked / unresolved
- Ballotpedia intermittently returned ROBOTS_DISALLOWED across both states (transient, not a hunt gap): Loecken, Todd (KY-04), Wein (KY-05), Mikel Wein retry, Jeremy Ryan Todd retry, McKinney (WA-04), Basler (WA-09), and one early Comer attempt before it started working again mid-session. Where a retry also failed, the candidate is documented null with the block noted.
- WebSearch budget was exhausted early (shared session-wide budget across parallel agents) after KY house races 1-2; all subsequent research (KY house 3-6, all of WA) relied on WebFetch against Ballotpedia, House office sites, campaign sites, and clerk.house.gov roll calls only, with URLs guessed/inferred from prior results rather than searched.
- All 12 races (6 KY, 9 WA... 6+9=15 minus counted once) covered in my worklist stayed at "names-only" status with statusNote updated to note overlap; none reached the 7-axis flip threshold, so no candidate was set to tier "curated".

## Combined final tally
**KY: 18 candidates checked | 180 blank axes researched | 47 filled | 133 remain null | 11 candidates 0->1+ | 0 races flipped | 6 parked**
**WA: 18 candidates checked | 180 blank axes researched | 70 filled | 110 remain null | 13 candidates 0->1+ | 0 races flipped | 9 parked**
