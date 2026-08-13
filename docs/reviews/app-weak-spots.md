# M2V weak-spots review — first-time-user pass, Aug 13, 2026

Blunt, as requested. Clicked through the current build with fresh eyes (and fresh data: 46 races / 100 candidates / 32 states). Nothing here is fixed; these are findings for kiki to triage. Ordered by how much each one hurts.

## 1. Match percentages built on 4 issues sit next to ones built on 10, and nothing warns you

Virginia, after an all-"Strongly A" quiz: Warner **83% (10 shared issues)** directly above Mizusawa **19% (4 shared issues)**. Both render with the same confident gold ring. A 4-issue percentage is a different, much noisier animal than a 10-issue one, and the tiny "4 shared issues" caption doesn't carry that weight. A skeptical reviewer (or a Mizusawa supporter) will read this as the app shafting sparse candidates. We already show a dash below some overlap threshold; either the threshold is too low or thin-overlap candidates need visibly different treatment ("Limited data: matches on only 4 of your 10 issues" instead of a ring). This is the single most attackable thing in the app.

## 2. Primary-pending races look like five-way generals

Rhode Island's Browse card reads "Dan McKee vs Aaron Guckian vs Elaine Pelino vs Helena Foulkes vs Ken Block" — five names chained with "vs," under a page header saying "2 fully researched." Nothing at this level says *the primary is Sept 8 and these are contenders, not a ballot*. Same pattern for MA, SC Senate, AK, FL. The statusNote exists inside the race page, but the list view is where the wrong impression forms, and on the sample ballot a user can happily mark a candidate who may not survive their primary. Suggested shape: a "PRIMARY SEP 8" pill on the card and a ballot-side note.

## 3. "Fully researched" over-promises when a candidate has near-zero data

Maryland shows "1 fully researched" and then Cathy White with all 10 axes "Not stated" (her nullNotes prove the hunt happened, but users don't see hunts). Darline Graham (SC), Ken Block (RI), and Mizusawa (VA) are similar. "Fully researched" is true of the *race* by our definition (every candidate attempted), but a user who taps White's profile sees a wall of "Not stated" under a banner that promised full research. Either the tier language needs a third state ("researched, thin public record") or profiles this sparse need a plain sentence up top: "We looked hard; this candidate has published almost nothing."

## 4. Uncovered states are an honest dead end, but still a dead end

Wyoming: "No researched races here yet, we're adding races weekly." True and properly humble, but it's a terminal screen: no link to the How-to-vote guide (which is fully state-agnostic and useful to a Wyoming voter today), no list of what states ARE covered, no "tell us you want Wyoming" mailto. Three one-line additions turn a bounce into something useful.

## 5. The quiz doesn't tell you the payoff depends on your state

You can take all 10 questions from an uncovered state and only THEN learn there's nothing to match against. The quiz start screen should say what you'll get: "We've researched N races in [your state]" or, for uncovered states, set expectations before the 3 minutes, not after.

## 6. "vs" chains get long and unreadable

Even in covered generals: "Wes Moore vs Andy Ellis vs Cathy White vs Dan Cox" wraps awkwardly and treats a Working Class Party candidate with zero published positions as equal billing with the incumbent governor. Fine for two-candidate races, clumsy at 4-5. Count-based copy ("4 candidates · incumbent Wes Moore") would read better.

## 7. Sources are the product's soul but are invisible until deep in a profile

The app's whole differentiator ("every position sourced") isn't demonstrable until three taps deep. The results screen says "sourced ✓" but doesn't show a single source. One representative source link surfaced on the match card ("Why this score? Ballotpedia →") would prove the claim where users actually decide whether to trust the number.

## 8. Smaller items

- The nightly FEC sync can silently add filed-but-hopeless candidates to names-only rosters; there's no UI concept of "filed but not viable," so NC-01 stays clean only because it's hand-curated. Watch this as more names-only House races ship.
- "Races we're covering here: 2 fully researched" uses our internal tier vocabulary; users don't know what "fully researched" means. A tap-target explaining the two tiers exists on About but not where the words appear.
- The About coverage counter, share cards, and store-listing draft each state coverage numbers; they now update from data, but the store listing text in docs/launch is a snapshot that will drift — regenerate before submission.
- Dark mode: the gold-on-espresso match rings pass contrast, but "Not stated" gray text on dark cards is borderline; worth one accessibility pass before store screenshots.
- After the quiz, "Retake the quiz" is more prominent than "mark your ballot," which buries the actual conversion step.

## What's genuinely strong (for balance)

The honesty machinery holds up everywhere I poked: no empty race rows anywhere, uncovered states never fake it, the sample-ballot banner survives every path including exports, deep links work, and the no-quiz path is real. The data now visibly crosses party lines (Blakeman pro-choice, Collins mixed on democracy, Osborn all over the map), which is exactly the product's thesis showing through.
