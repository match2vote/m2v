# M2V weak-spots review — v2, Aug 13 2026 (evening)

Fresh first-time-user pass in **Oregon** (a state curated entirely by research passes, not hand-picked for demos), against the current build: 49 races / 107 candidates / 35 states, denominator fix, 5 tabs, ballot v3. The v1 review's top findings are marked resolved or still open. Blunt, nothing fixed, for kiki to triage.

## Resolved since v1 (for the record)

- ~~Match % on 4 issues beside 10 with no warning~~ → every score now shows "across N of your 10 issues," unequal races carry the not-comparable caveat, and the star can't be won on a smaller denominator. Verified live in OR Senate (Brock Smith 63% on 8 issues vs Merkley on 10: caveat shows).
- ~~Best match after one question~~ → mid-quiz shows progress only; skip-through path closed.
- ~~Opens in a random state~~ → covered-states-first picker; stale-state fallback removed.
- ~~Ballot badge reads like a notification~~ → "N marked."
- ~~Browse card mismatch~~ → goes straight to your state's races.

## Still open, in order of hurt

### 1. Primary-pending races still read like settled generals in Browse and on the ballot
Ten races are pending (AK, FL x2, SC special, OK, MA, RI x2, NH), and the Browse card format ("Dan McKee vs Aaron Guckian vs Elaine Pelino vs Helena Foulkes vs Ken Block") plus the markable ballot still present contenders like a finished field. The statusNote inside the race page is honest, but the list view and ballot are where impressions form, and a user can mark a candidate who loses their primary next week. This is now the app's #1 data-presentation risk, especially the week of Aug 18/25 when four of these resolve. Suggested shape: a "PRIMARY AUG 25" pill on race cards and ballot section headers for pending races.

### 2. "Fully researched" still over-promises for zero-record candidates
OR Senate says "2 fully researched," and Brock Smith's profile now has 8 scored axes (better after backfill), but MD's Cathy White (0 scored), SC's Darline Graham (2), and RI's Ken Block (1) sit in "fully researched" races showing walls of "Not stated." The research was real (every null has a documented dead-end note) but users can't see hunts. One plain sentence on sparse profiles would fix it: "We searched this candidate's site, surveys, and records; they have published almost no positions."

### 3. Uncovered states are still dead ends
15 states still get "No researched races here yet" with no How-to-vote link (the guide is state-agnostic and now has its own tab, but the empty state doesn't point there), no covered-states list, no report-interest mailto.

### 4. The results screen buries the profile path
The one-tap Mark button (good) now competes with the candidate name tap (profile) and the race title tap (race page). Nothing says the name is tappable. A first-timer who wants to know WHY Drazan scored 60% has no visible "see her positions" affordance on the row.

### 5. Denominator caveat says "check the count" but sorting is still pure percentage
In OR Senate, 8-issue 63% still sorts above 10-issue candidates with lower percentages. Defensible (we show the caveat, gate the star) but a skeptic will note the ORDER itself is thin-data-friendly. If this ever draws fire, the next step is sorting by (denominator, then pct) in unequal races or graying thin rows.

### 6. Smaller items
- How to Vote now exists twice on Home (card + tab). Fine, slightly redundant.
- The espresso quiz hero + "skip the quiz" link is getting crowded on small screens.
- Race-page "Take the quiz to see your match %" shows even when the quiz is done (should deep-link to results).
- Ballot exports don't yet show the denominator or star context that the screen shows; the shared image just has names and ovals (arguably correct for a sample ballot, worth a deliberate decision).
- Primary-pending flip dates (Aug 18, Aug 25, Sep 1, Sep 9) are operational promises: if data isn't flipped within ~48h of each, the honesty brand takes the hit. The queue is in the Priority Order doc.

## What's strong

The Oregon pass read as trustworthy end-to-end: real candidates, denominators everywhere, the conservative test answers surfaced the Republican in both races with sourced labels (policy-not-party holding under a fresh state), the sample banner survived every path, and no empty rows appeared anywhere. Post-QA, every label I spot-checked traces to a page that literally says it.
