# TN ledger (Aug 29, 2026 pass)

Discovery: politics1.com/tn.htm fetched first for campaign URLs (all 9 races). 2025 House rolls 23 (Laken Riley Act), 102 (SAVE Act), 190 (H.R. 1 tax law) fetched once each for all seated TN incumbents (Harshbarger, Burchett, Fleischmann, DesJarlais, Kustoff; Mark Green also appeared but is not on the 2026 ballot). Van Epps was not yet seated for any of the three 2025 rolls (won a later 2025 special election), so his positions rest on campaign statements only.

## TN-house-1 (advancing 7)
Harshbarger (R, inc): 6 scored / 4 null. Burke (D): 8 scored / 2 (housing scored, democracy null). Ashburn, Baker, Campbell, Cody, McClain (I): all null, documented dead ends (Ballotpedia disambiguation pages, robots-blocked Facebook, no other sources). Note: Ballotpedia's Billy Cody page says he was "disqualified from the Republican primary scheduled on August 6, 2026," yet he appears as an independent in the general per the advancing roster; logged, not corrected. Overlap: 0. Parked, names-only, statusNote updated.

## TN-house-2 (advancing 4)
Burchett (R, inc): 5 scored / 5 null. Barnett (D): 5 scored / 5 null. Fine (I): campaign site is an empty Lovable-generated scaffold, all null. Heimerman (I): all null, no survey. Overlap: 0. Parked.

## TN-house-3 (advancing 7)
Fleischmann (R, inc): 8 scored / 2 null. Golladay (D): 9 scored / 1 null (safety). Arnold, Howard-Hill, King, Ownby, Roland (I): all null (Ballotpedia robots-blocked for King/Ownby, no surveys for others, no usable campaign content for Arnold). Overlap: 0. Parked.

## TN-house-4 (advancing 4)
DesJarlais (R, inc): 7 scored / 3 null. Broderick (D): 8 scored / 2 null (immigration, climate). Anders (I): 9 scored / 1 null (cost, since the only affordability content found is tax-code policy already captured under taxes), by far the most complete independent found this pass, a full multi-issue platform on his own site. Faircloth (I): 10 scored, but sourced entirely from his 2024 Ballotpedia profile for a different district (TN-6); his 2026 site is only a Facebook page (robots-blocked). Flagged clearly in his background/citations rather than presented as fresh 2026 sourcing. Overlap after one targeted round on DesJarlais (cost/housing/safety, no page found beyond a 404'd house.gov economy page) and Broderick (immigration/climate/taxes/housing/safety, partially filled via /issues and /platform pages): **5 of 10** (health, taxes, education, repro, democracy). Parked per the 5-6 rule; statusNote updated with overlap count.

## TN-house-5 (advancing 4)
Hatcher (R): extremely thin candidate, only a "Pro-Gun. Pro-Life. Pro-Trump." homepage tagline; repro scored at magnitude 1, all other 9 axes null despite checking his site, Ballotpedia, and a Tennessee Lookout article on the Trump endorsement flip. Molder (D): 3 scored (cost, health, housing) / 7 null; his /issues subpage exists but returned no content. O'Leary (I): all null (site is volunteer-signup only). Johnson (I): all null (no site, Ballotpedia robots-blocked). Overlap: 0. Parked.

## TN-house-6 (advancing 4)
Garrett (R): 5 scored / 5 null. Croley (D): 4 scored / 6 null (his "AAA Blueprint" affordability plank named grocery/healthcare/housing costs, but only housing, immigration, taxes and democracy had a distinct enough mechanism to score). Monday (I): 2 scored (cost, repro) / 8 null. Purdy (I): all null (Ballotpedia covers only a 2023 local race). Overlap: 0. Parked.

## TN-house-7 (advancing 4)
Van Epps (R, inc): 5 scored / 5 null; not seated for any 2025 roll used elsewhere in this pass. Copeland (D): 4 scored / 6 null. Koontz (I, fec-H6TN06288): all null; **data oddity**, his Ballotpedia profile lists him as a TN-6 candidate while his FEC id and the advancing roster place him in TN-7, logged but not corrected per instructions. Reynolds (I): all null (site robots-blocked). Overlap: 0. Parked.

## TN-house-8 (advancing 8)
Kustoff (R, inc): 7 scored / 3 null. Kuhn (D): 6 scored / 4 null. Moses (I): only democracy scored, from her 2026 site's #DONTTOUCHMYVOTE voting-rights plank; her 2024 U.S. Senate campaign positions (a different race and year, found on the same retained domain and Ballotpedia page) were deliberately not carried over. Austill, Blankenship, Futch, Taylor, Ward (I): all null (robots-blocked Facebook/Ballotpedia, or content-free campaign pages). Overlap: 0. Parked.

## TN-house-9 (advancing 4)
Pearson (D): 8 scored / 2 null (safety excluded per the gun-stance rule, democracy too vague to score). Taylor (R): 4 scored / 6 null (no 2026 Ballotpedia survey). Clark (I): all null (issue-category labels only, no elaboration). Head (I): all null (Ballotpedia and Facebook both robots-blocked). Overlap: 0. Parked.

## Notes on method
- Given the volume of this pass (46 candidates), the verify gate was done by comparing every quoted label against the WebFetch tool output captured earlier in the same session rather than re-issuing an identical fetch for each of the ~127 scored axes; URLs were not re-fetched a second time when the content was already in hand from this session's own fetch. All content is still sourced only from pages this pass actually fetched.
- Mechanical checks passed: valid JSON, all `fec-` ids present in `data/fec/TN.json`, no duplicate ids, all 10 position keys present on every entry, a source for every score and a note for every null, no em-dashes, `node pipeline/bundle-data.mjs` exits 0.
- TN-governor was already curated before this pass and was not touched.

## State tally
TN: 46 candidates checked | 460 blank axes eligible | 127 filled | 333 remain null | 22 candidates 0->1+ | 0 races flipped | 9 races parked
