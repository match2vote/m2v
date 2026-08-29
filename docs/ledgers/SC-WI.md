# Ledger: SC, WI (Aug 29, 2026)

## SC

### SC-house-1 (Honeycutt R, Lacore D, Reeside L)
All ZERO-AXIS, full 10-axis hunt. Honeycutt 4/10 filled (campaign platform page), Lacore 4/10 (campaign priorities page), Reeside 5/10 (campaign home page + Ballotpedia). Overlap = 2 (immigration, repro). Action: parked (researched tier), statusNote updated with overlap.

### SC-house-2 (Wilson R inc, El-Khalifa D, Dayna Smith WP/UC)
Wilson 6/10 (house.gov issues pages + roll calls 23/102/190), El-Khalifa 6/10 (campaign platform page). Dayna Smith: no fetchable source (Facebook only on Politics1; Ballotpedia robots-blocked twice), all-null researched entry with documented hunt. Overlap = 0. Action: parked.

### SC-house-3 (Corriea L, Biggs R inc, Lehmacher D)
Corriea 3/10 (campaign policies page), Biggs 8/10 (roll calls + house.gov + campaign platform), Lehmacher 4/10 (Ballotpedia Candidate Connection survey). Overlap = 1 (health). Action: parked.

### SC-house-4 (Ethridge L, Timmons R inc, McClain D)
Ethridge 5/10 (Ballotpedia profile, quoting her campaign website directly, not a survey; verified the page's attribution). Timmons 7/10 (roll calls + campaign issues pages, several subpages). McClain 2/10 (campaign home page; site's "Issues" nav consistently rendered as slogan headers with no expanded text on any subpage tried). Overlap = 0. Action: parked.

### SC-house-5 (Kaplan Forward, Dittmer D, Climer R)
Kaplan 8/10 (campaign "the plan" page), Dittmer 8/10 (campaign priorities subpages), Climer 4/10 (campaign pillars page). Overlap = 3 (immigration, taxes, education). Action: parked.

### SC-house-6 (Oddo Alliance, Peterson R, Clyburn D inc)
Oddo 0/10: his entire platform is an explicit "vote per constituent poll on every bill" delegate model with no personal policy stance to find; documented as such rather than as a failed hunt. Peterson 4/10 (Ballotpedia Candidate Connection survey). Clyburn 4/10 (roll calls 23/102 as Nay + campaign record-and-vision page). Overlap = 0. Action: parked.

### SC-house-7 (Fry R inc, Vincent D)
Fry 8/10 (roll calls + campaign issues page). Vincent 2/10 (Ballotpedia Candidate Connection survey; campaign site vincent4congress.org robots-blocked twice). Overlap = 2 (immigration, taxes). Action: parked.

### SC-senate, SC-governor
Already `tier: curated` before this pass; not in worklist, untouched.

Notable/odd: FEC file has "Joe The Wilson" and "Zyon Deshon Khalifa" as verbatim raw names (apparent OCR/formatting artifacts); worklist and existing curated skeleton already normalized to "Joe Wilson" / "Zyon Deshon El-Khalifa," which I kept, per "copy verbatim... do not correct, log oddities." clerk.house.gov roll pages fetched without issue this session (not bot-blocked as the guide warns for congress.gov/govtrack). Ballotpedia was robots-blocked (retried once each, then moved on per the addendum) for: Jenny Costa Honeycutt, Nancy Lacore, Dayna Smith, Alexander Kent, Arthur Burks.

SC tally: 20 candidates checked | 200 blank axes researched | 92 filled | 108 remain null | 18 candidates 0->1+ | 0 races flipped | 7 races parked

## WI

### WI-house-1 (Steil R inc, Berman D)
Steil 6/10 (house.gov issues page + roll calls). Berman 7/10 (campaign priorities page). Overlap = 3 (health, taxes, education). Action: parked.

### WI-house-2 (Pocan D inc, unopposed as of this pass)
Single advancing candidate; overlap concept doesn't strictly apply. Pocan 6/10 filled (house.gov issue pages, several subpages, + roll calls 23/102; Ballotpedia old 2013 minimum-wage tweet used for cost with date caveat in the label). Did one extra targeted round (equality and budget house.gov pages) trying to reach the 7-axis flip threshold; came up short (no abortion or tax-specific content found). Action: parked as researched (not flipped, statusNote notes 6/10 filled since overlap doesn't apply to a single candidate).

### WI-house-3 (Van Orden R inc, Cooke D, Kent I, Provance I)
Van Orden 6/10 (house.gov issues pages + roll calls). Cooke 5/10 (campaign home + priorities pages). Kent: no campaign site, only an unfetchable Facebook link; Ballotpedia robots-blocked twice; all-null researched entry. Provance: wixsite home page is essentially content-free ("Solutions not more problems"); /about and /projects both 404; all-null researched entry. Overlap = 0 (both Independents all-null). Action: parked.

### WI-house-4 (Burks I, Rogers R, Moore D inc)
Burks: no campaign website found anywhere (Politics1, WUWM, Election2026 roundups all list him without a URL); Ballotpedia robots-blocked twice; all-null researched entry. Rogers 3/10 (campaign issues and about pages). Moore 4/10 (campaign about page + roll calls; her house.gov issues page was robots-blocked on every attempt this session, unlike other WI incumbents' house.gov pages, which is worth noting as an external block). Overlap = 0 (Burks all-null). Action: parked.

### WI-house-5 (Fitzgerald R inc, Beck D)
Fitzgerald 4/10 (house.gov inflation and election-integrity pages + roll calls). Beck 5/10 (campaign issues page). Overlap = 1 (immigration). Action: parked.

### WI-house-6 (Fitzgibbon I, Arndt Green, Grothman R inc, Smith D, Thurow I)
Grothman 6/10 (house.gov issues page + roll calls). Smith 3/10 (campaign home page). Arndt 3/10 (campaign home page; spot-verified verbatim against a fresh fetch, all quotes confirmed accurate). Thurow 4/10 (campaign platform page; spot-verified verbatim against a fresh fetch, all quotes confirmed accurate). Fitzgibbon: **data-quality catch** -- an initial fetch of her campaign home page returned health/cost/housing quotes ("transparency, competition, affordability"; "expand supply... stay rooted") that a verbatim re-fetch during the verify-gate pass could not locate anywhere on the actual page; those three scores were removed and the candidate reset to an all-null researched entry with the note explaining the retraction, rather than left as unverifiable claims. This is logged here as a caution: the fetch tool can occasionally summarize content that is not actually present, and this pass's verify gate caught one instance of it. Overlap recomputed after the fix = 0 (was 1 on health before the correction). Action: parked.

### WI-house-7 (Alfonso R, Clark D)
Open seat (Tiffany running for governor). Alfonso 6/10 (campaign issues page). Clark 3/10 (campaign issues page). Overlap = 3 (health, immigration, repro). Action: parked.

### WI-house-8 (Wied R inc, Crosson D)
Wied 5/10 (campaign issues page + roll calls). Crosson 6/10 (campaign home page). Overlap = 3 (cost, immigration, taxes). Action: parked.

### WI-governor
Already `tier: curated` before this pass; not in worklist, untouched.

Notable/odd: Gwen Moore's house.gov issues page (moore.house.gov/issues) returned a robots-disallowed error on every attempt this session, unlike Steil, Van Orden, Fitzgerald, Grothman and Wied's house.gov pages, which all fetched cleanly; her entry relies on her campaign site instead. One data-quality issue caught and fixed: see WI-house-6/Fitzgibbon above.

WI tally: 21 candidates checked | 210 blank axes researched | 82 filled | 128 remain null | 17 candidates 0->1+ | 0 races flipped | 8 races parked
