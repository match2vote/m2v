# NY Ledger (Aug 29, 2026)

All 49 worklist items were ZERO-AXIS names-only candidates (no hunt-ONLY partial gaps were on this worklist). politics1.com/ny.htm fetched first and supplied campaign URLs for nearly every candidate. House incumbents scored via clerk.house.gov roll023 (Laken Riley Act, immigration), roll102 (SAVE Act, democracy), roll190 (H.R. 1, taxes) fetched once each covering all 17 NY incumbents in the worklist.

- NY-house-1: LaLota (R, inc), Gallant (D), Maggio (I), Sorensen (I). Overlap 0/10. Parked, all researched. Maggio/Sorensen: no site found, Ballotpedia robots-blocked/no survey.
- NY-house-3: Suozzi (D, inc), LiPetri (R). Overlap 2/10 (health, immigration). Parked.
- NY-house-4: Gillen (D, inc), Driscoll (R). Overlap 0/10. Parked. Driscoll: Facebook-only presence, no site, Ballotpedia robots-blocked.
- NY-house-5: Meeks (D, inc), Marsh (R). Overlap 0/10. Parked. Marsh: Facebook-only, no site.
- NY-house-6: Meng (D, inc), Chou (R). Overlap 2/10 (immigration, education). Parked.
- NY-house-7: Valdez (D), Rivera (R), Ghaznavi (I). Overlap 1/10 (housing, common to all 3). Parked.
- NY-house-8: Jeffries (D, inc), Mizrahi (R). Overlap 0/10. Parked. Mizrahi: LinkedIn-only presence.
- NY-house-9: Clarke (D, inc), Azumah (R). Overlap 0/10. Parked.
- NY-house-10: Lander (D), Moore (R). Overlap 0/10. Parked. Moore: Instagram-only presence.
- NY-house-12: Lasher (D), Shinkle (R), Ortiz (I), Wintrich (I). Overlap 0/10 (4-way race, no axis common to all). Parked.
- NY-house-13: Chevalier (D), Williams (R). Overlap 2/10 (health, immigration). Parked.
- NY-house-14: AOC (D, inc, 9/10 axes filled from a rich issues page), Hysenaj (R, thin site). Overlap 3/10 (housing, immigration, safety). Parked.
- NY-house-15: Torres (D, inc), Sapaskis (R), Duran (C), Easton (I). Overlap 0/10 (4-way). Parked. Sapaskis: no site, Ballotpedia confirms no survey any cycle.
- NY-house-16: Latimer (D, inc), Cinquemani (R). Overlap 0/10. Parked. Cinquemani's only listed URL is a law-firm bio page with no campaign content.
- NY-house-18: Ryan (D, inc), Auringer (R). Overlap 1/10 (cost). Parked.
- NY-house-20: Tonko (D, inc), Ambrosio (R). Overlap 3/10 (climate, immigration, democracy). Parked.
- NY-house-21: Constantino (R), Gendebien (D). Overlap 2/10 (cost, immigration). Parked. Open seat (Stefanik retiring).
- NY-house-22: Mannion (D, inc), Buller (R). Overlap 1/10 (health). Parked.
- NY-house-24: Tenney (R, inc), Ellman (D). Overlap 2/10 (cost, immigration). Parked.
- NY-house-25: Morelle (D, inc), McIntyre (R). Overlap 0/10. Parked. McIntyre's site is JS-rendered with no reachable text; Ballotpedia confirms no survey.
- NY-house-26: Kennedy (D, inc), Hannon (R). Overlap 0/10. Parked. Hannon's site returned a robots.txt fetch error on two attempts.

No race reached the overlap>=7 flip threshold; all 21 races remain `names-only` with updated statusNote text documenting the overlap and researched-but-unscored state.

## Data oddities noticed, not corrected (per guide rule: never correct FEC-sourced fields)
- fec-H2NY01190 (LaLota): data/fec/NY.json stores name as "Lalota Nick"; the pre-existing curated skeleton entry (predates this pass) already used "Nick LaLota". Left as-is.
- fec-H0NY02267 (LiPetri): FEC file stores "Mike Lipetri" (lowercase p); pre-existing curated entry already used "Mike LiPetri". Left as-is.
- fec-H2NY04244 (Gillen): data/fec/NY.json has `incumbent: false`, but Gillen won her seat in 2024 and is the sitting Rep; the pre-existing curated skeleton and worklist both already had `incumbent: true`. Likely a stale FEC sync flag. Left as-is per the copy-verbatim rule; flagging for a maintainer to check the FEC sync.

## Verify gate
- `python3 -m json.tool data/curated/NY.json`: valid.
- All 49 worklist ids present, no duplicates, all 10 position keys present on each, one positionSource per non-null score, one nullNote per null score.
- No em-dashes.
- `node pipeline/bundle-data.mjs` exits 0 (2964 candidates, 937 curated bundled).

## State tally
NY: 49 candidates checked | 490 blank axes researched | 180 filled | 310 remain null | 39 candidates 0->1+ | 0 races flipped | 21 parked
