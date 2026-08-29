# Ledger: CO, PA (unsourced positions pass, Aug 29, 2026)

Discovery method: politics1.com/co.htm and /pa.htm fetched first for campaign URLs; clerk.house.gov 2025 rolls 23 (Laken Riley Act), 102 (SAVE Act), 190 (H.R. 1) fetched once each covering all CO/PA incumbents. Ballotpedia was robots-blocked on most attempts after the first few CO fetches (worked for Kiros, Milton; blocked thereafter for Peterson, Humphrey, Blau, Dennison, Manganaro, Dennis Mahoney, McMahon, Cory Robertson), retried once each per the addendum, then moved on. Several campaign sites were JavaScript-rendered SPAs that returned only metadata (Susan Hall, Dennis Mahoney, Kelley Dennison's issue subpages, Patty McMahon's issues page). One WebFetch proxy rate-limit (429) hit mid-PA-7 research; resolved after a ~90s wait.

Data-quality note: one WebFetch response mislabeled John Joyce's (R-PA13) party as "D" on roll 023/190 despite the vote value being correct; re-fetched roll 190 with a narrow, XML-quoting prompt and confirmed `party="R"` and `vote="Aye"` from the raw legislator element. Also caught that `lee.house.gov` and `joyce.house.gov` resolve to different members of Congress (Barbara Lee D-CA and Dave Joyce R-OH); discarded that content and found the correct URLs (`summerlee.house.gov`, `johnjoyce.house.gov`).

## CO races (all parked, overlap 0 on every race)

- CO-house-1: overlap=0 | Melat Kiros 4/10, Christy Peterson 5/10, Chad Humphrey 1/10, Critter Milton 2/10, Shimon Blau 0/10. Blau: no fetchable source at all (Facebook only). Milton's Unity Party page served stale 2022 CD-7 content; used his 2020 Ballotpedia Candidate Connection survey instead, flagged as dated.
- CO-house-2: overlap=0 | Joseph Neguse 3/10, Gaylon Kent 3/10, Kelley Dennison 0/10. Dennison's site (kelleyforco.com) is JS-rendered; only nav structure retrievable.
- CO-house-3: overlap=0 | Jeffrey Hurd 4/10, Dwayne Romero 6/10, Clifton Brown 0/10, Cory Robertson 0/10. Brown's ruhero.com blocked by robots.txt twice; Robertson has no listed campaign site.
- CO-house-4: overlap=0 | Lauren Boebert 9/10, Eileen Laubacher 6/10, Douglas Mangeris 0/10. Mangeris's site unreachable over both https and http (connection errors).
- CO-house-5: overlap=0 | Jeff Crank 4/10, Jessica Willow Killin 4/10, Christopher Mitchell 0/10, Mark "Marky Jr" Elworth 1/10. Mitchell's site is a bare template with no policy text.
- CO-house-6: overlap=0 | Jason Crow 3/10, Jason Clark 2/10, Meredith Ryan 5/10, Patty McMahon 0/10, Samir Ezzeldin Witta 2/10. Ryan's data drawn from a 2024 state-senate Candidate Connection survey (her most recent), flagged as dated. McMahon's issues page 404'd and Ballotpedia was blocked.
- CO-house-7: overlap=0 | Brittany Louise Pettersen 2/10, Timothy Bennett 2/10, Joe Krzeczkowski 4/10, Lawrence Kyle Clark 0/10, Susan Hall 0/10, Dan "Kilo" Sallis 0/10. Hall's site is JS-rendered (empty on two fetches); Clark has no listed site; Sallis's only link is an unfetchable X/Twitter account.
- CO-house-8: overlap=0 | Timothy Gabriel Joseph Evans (campaigns as "Gabe Evans") 6/10, Manny Rutinel 1/10, Dave Wood 0/10. Wood has no listed campaign site.

Data oddity: FEC roster lists Rep. Timothy Gabriel Joseph Evans (CO-8); he campaigns publicly as "Gabe Evans." Not corrected per guide instruction, noted here.

## PA races (16 parked, 1 flipped)

- PA-house-1: overlap=0 | Brian Fitzpatrick 2/10, Robert J Harvie 5/10. Fitzpatrick was one of two Republicans to vote No on H.R. 1 (roll 190); no statement explaining the vote was found, so taxes stayed null rather than guessing a sign.
- PA-house-2: overlap=0 | Brendan F Boyle 3/10, Jessica Arriaga 0/10.
- PA-house-3: overlap=0 | Christopher M. Rabb 4/10, Dennis Joseph Mahoney 0/10. Mahoney's site is JS-rendered (metadata only, two attempts); Ballotpedia blocked.
- PA-house-4: overlap=0 | Madeleine Dean 5/10, Aurora Stuski 0/10. Stuski has no listed campaign site; Ballotpedia confirms she has not completed its Candidate Connection survey.
- PA-house-5: overlap=0 | Mary Gay Scanlon 2/10, Nicholas Waln Morris Manganaro 0/10. Manganaro has no listed site; Ballotpedia blocked under two name variants.
- PA-house-6: overlap=0 | Chrissy Houlahan 6/10, Martin Young 0/10.
- **PA-house-7: overlap=7 → FLIPPED to `tier: "curated"` / race `status: "general"`.** Ryan Edward Mackenzie 8/10, Bob Brooks 9/10. Shared axes: cost, health, housing, immigration, taxes, climate, safety. Every quote re-fetched and verbatim-verified in the verify pass.
- PA-house-8: overlap=0 | Rob Bresnahan 5/10, Paige Cognetti 0/10. Cognetti's site emphasizes anti-corruption messaging with no scorable policy statement on any of the 10 axes.
- PA-house-9: overlap=0 | Daniel Meuser 5/10, Rachel Wallace 0/10. Both sites thin; house.gov issue pages returned only placeholder text.
- PA-house-10: overlap=3 | Scott Perry 7/10, Janelle Stelson 4/10. Stelson's cost-of-living/tariff language was garbled in the fetch; left null rather than guess a sign.
- PA-house-11: overlap=1 | Lloyd K. Smucker 4/10, Nancy Mannion 2/10.
- PA-house-12: overlap=0 | Summer Lee 5/10, James Hayes 3/10. Lee has a rich house.gov issues section (nine issue pages); only four fetched in the time budget, several (climate) left null though a page exists.
- PA-house-13: overlap=1 | John Joyce 5/10, Elizabeth Rhoads Farnham 2/10.
- PA-house-14: overlap=1 | Guy Reschenthaler 4/10, David Alan Bradstock 2/10. Reschenthaler's site (guyforpa.com) content reads as dated (references a 2018 primary win) but is the live URL politics1 lists.
- PA-house-15: overlap=3 | Glenn Thompson 5/10, Raymond Allen Bilger 5/10.
- PA-house-16: overlap=4 | George J Jr Kelly (campaigns as "Mike Kelly") 6/10, Justin Wagner 7/10. Close to the 5-6 targeted-round band but landed at 4; parked without an extra round given time budget.
- PA-house-17: overlap=1 | Christopher Deluzio 2/10, Tony Guy 4/10.

Data oddity: FEC roster lists Rep. George J Jr Kelly (PA-16); he campaigns publicly as "Mike Kelly." Not corrected, noted here.

## Verify gate performed
Mechanical checks (valid JSON, all 10 keys present, source per score, note per null, no em-dash, no duplicate IDs, `node pipeline/bundle-data.mjs` exit 0) passed for all 67 candidates with zero errors. Re-fetch spot-verification covered: all three roll calls (with the Joyce mislabel catch above), plus verbatim re-checks of the highest-magnitude (±2) quotes for the PA-7 flip (Mackenzie ×3, Brooks ×9 planks), Boebert (repro, education), Killin (housing, taxes), Summer Lee (democracy), and Gabe Evans (education): all confirmed present as quoted.

## State tally lines
CO: 33 candidates checked | 330 blank axes researched | 79 filled | 251 remain null | 22 candidates 0->1+ | 0 races flipped | 8 parked
PA: 34 candidates checked | 340 blank axes researched | 121 filled | 219 remain null | 27 candidates 0->1+ | 1 races flipped | 16 parked
