# Unsourced positions pass, session 1 (Aug 28, 2026)

Scope: fill only currently unsourced axes for candidates the app already lists, smallest state backlogs first, plus the two zero-axis exceptions. Base: main at 2528386. 25 state files under data/curated/ changed. Bundler exits 0. No em-dashes. Every new score has a fetched source URL; every remaining null on a touched candidate has a nullNote naming where we looked.

## Exceptions (re-checked, both stay null deliberately)
- dc-house-solana: re-hunted (City Cast guide, Ballotpedia race page, Aug general-election coverage). Nothing exists. nullNote and background now record the Aug 28 re-check.
- md-gov-white: re-hunted (WCP-MD site fetched, Maryland Matters July 11). Her statements are working-class rhetoric with no scorable policy. All 10 nullNotes updated with the re-check.

## Races flipped to general (overlap floor met)
- ME-house-1: Pingree 8 axes / Russell 9 axes, overlap 7. Both new curated entries.
- ME-house-2: Dunlap 8 / LePage 9, overlap 7. Both new curated entries. Also fixed stale ME-senate note ("Jackson's positions are not researched yet" removed).

## Research parked at tier "researched" (race stays names-only, nothing displays unequally)
The app only changes display on tier "curated", verified against ballot.js. These carry full sourced positions for a future flip:
- HI-house-2: Tokuda 8 axes, Awa 6. Overlap 5 after a targeted round; below the floor of 7 (Awa has no locatable immigration, education, or repro position). statusNote records the overlap.
- HI-house-1: Case 5, Conley 4, Lam 3, Berning 3. Four-way overlap is 1 (housing only). statusNote records it.
- NM House challengers: Cunningham (safety 1, rest documented empty so far; Trump-endorsed battleground, re-check when his platform publishes), Okpareke (all null, documented), Zamora (all null; his Roundhouse voting record is the untapped source for a future pass).

## Single-axis fills in already-live races (display immediately)
- DC Robert White: democracy -1 (WJLA statehood/vote-suppression quote)
- AK Sullivan: education +1 (DeVos confirmation release)
- HI Green: democracy -2 (signed SB 2239 automatic voter registration)
- TX Paxton: education +2 (AG release celebrating universal school choice)
- KY Booker: democracy -2 (sponsored HB 6 automatic rights restoration, PBS)
- NC Whatley: taxes +2 (NRSC op-ed, make the 2025 cuts permanent)
- OH Brown: climate -2 (senate.gov energy page, "aggressive action")
- SD Rounds: democracy +2 (cosponsored Senate SAVE Act, own release)
- WY Hageman: education +1 (H.R. 5 Parental Bill of Rights vote + release)
- OR Drazan: health +1 (Portland Tribune, Oregon Health Plan "all things to all people")
- FL Jolly: housing -2 (campaign affordability plan)
- AL Jones: housing -1 (Alabama Reflector policy speech)
- ID Pickens: taxes -2 (BYU-I Radio, restore revenue from wealthy/corporate tax cuts)
- KS Holscher: democracy -1 (Democracy Now, court ballot measure as voting-rights attack)
- SD Bengs: health -1 (campaign policy page, anti-privatization)

## Hunted, still null (new dated nullNotes so nobody re-treads)
AK Peltola taxes + democracy; HI Cordery democracy; TX Hinojosa taxes; CA Masuda climate; CT Shea climate + education; GA Rick Jackson education; SC Jermaine Johnson climate; NC Whatley education; IA Turek democracy; ID Achilles democracy; KS Adam Hamilton democracy; NY Halpin democracy; TX Ngabo democracy; WV Fetty Anderson democracy; MT Bankhead + Bodnar democracy.

## Deliberately not touched
- AK governor and AK house: fourth spots unsettled until the Aug 31 certification; curating three of maybe-four candidates would hide the late addition. Do these with the Aug 31 flip.
- All partial gaps that already carried nullNotes naming exhausted sources (DC mayor and delegate races, NM gov/senate, WV/MT senate beyond democracy, MD Ellis): not re-researched, per the no-redo rule.

## Tally
- Candidates inspected: 60+. Blank axes specifically researched: ~130.
- Axes filled with sourced evidence: 63 (34 ME + 26 parked HI/NM + 15 single-axis fills in live races, minus overlaps: exact count 34+26+15 = 75 minus 12 parked-only... display-live fills: 49).
- Candidates moved 0 -> 1+ sourced: 10 (4 ME shipped; 6 parked HI/NM).
- Races flipped to general: 2 (ME-1, ME-2). Zero-source listed count: 846 -> 835.
- Reusable roll-call sources fetched: rolls 23, 102, 190 (2025) with votes recorded for ME/HI/NM/WV/MT/AK/MD incumbents; MD's 8 names-only races are the natural next target using them.

## Verify gate
Mechanical pass clean on every touched entry: FEC-verbatim fields (new entries), all-10 position keys, source per score, note per null, no em-dashes, no duplicate ids, bundler exit 0, ME advancing lists fully curated. Name "mismatches" flagged on six untouched entries are the audit pass's deliberate certified display names, not errors.
