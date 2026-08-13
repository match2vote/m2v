# Design note: expanding the quiz from 10 to 20 questions

**Status: DESIGN ONLY. Not built, not scheduled. Written Aug 13, 2026 at kiki's request.**

## The 20 axes

Each current axis splits into two sharper ones (current key in parentheses; new keys suggested):

| # | New axis | Splits from | A side | B side |
|---|---|---|---|---|
| 1 | Everyday prices (cost1) | cost | Price caps, anti-gouging rules | Deregulate, let markets lower prices |
| 2 | Wages & work (cost2) | cost | Raise minimum wage, paid leave mandates | Let employers and markets set pay |
| 3 | Coverage (health1) | health | Universal public coverage | Private competition |
| 4 | Drug & care costs (health2) | health | Government negotiates/caps prices | Transparency and market pressure |
| 5 | Building housing (housing1) | housing | Public/affordable construction | Cut zoning and permits |
| 6 | Renters & ownership (housing2) | housing | Renter protections, corporate-buyer limits | No new landlord rules |
| 7 | Border & enforcement (imm1) | immigration | Humane limits on enforcement | Enforcement first, deportations |
| 8 | Legal immigration & status (imm2) | immigration | Citizenship pathways, more legal entry | No amnesty, reduce levels |
| 9 | Who pays taxes (taxes1) | taxes | Raise on corporations/wealthy | Cut across the board |
| 10 | Spending & debt (taxes2) | taxes | Invest even if deficits rise | Cut spending, balance budgets |
| 11 | Climate urgency (climate1) | climate | Rapid transition, strict rules | Energy independence, all sources |
| 12 | Energy mix (climate2) | climate | Wind/solar first | Oil, gas, and nuclear expansion |
| 13 | College cost & student debt (edu1) | education | Free/cheap public college, debt relief | Personal responsibility, trade paths |
| 14 | Curriculum & book bans (edu2) | education | Teachers/librarians decide | Parents veto content, remove books |
| 15 | Policing (safety1) | safety | Prevention, root causes | More police, tougher sentencing |
| 16 | Drugs & sentencing (safety2) | safety | Treatment over incarceration | Strict enforcement, mandatory minimums |
| 17 | Abortion access (repro1) | repro | Guarantee the right | Limit or prohibit |
| 18 | IVF & contraception (repro2) | repro | Guarantee access | Open to restrictions / conscience carve-outs |
| 19 | Voting access (dem1) | democracy | Automatic registration, mail voting | Voter ID, tighter rules |
| 20 | Money & power (dem2) | democracy | Limit money in politics, independent maps | Fewer restrictions on spending/speech |

The education split kiki asked about is #13/#14 and it is the single most valuable split: "college cost" and "book bans" genuinely divide differently (plenty of candidates are B on 14 but quiet on 13, and the current single axis smears them together).

## Re-curation cost (the honest number)

100 curated candidates today, 10 axes each = 1,000 cells, ~837 scored or explicitly nulled. Splitting to 20 axes doubles the cells to 2,000 and **every existing score has to be re-derived, not copied**, because a −2 on "education" doesn't tell you the candidate's position on book bans specifically. Realistic effort, based on what today's sessions actually took: a focused session curates or re-verifies roughly 60-80 cells with real source fetching. That's **~15-20 full sessions of pure re-curation**, before any new state. Every new candidate also costs double forever after. The database, curation tool, DB trigger, quiz UI, and share cards all need schema updates too (a day of engineering, trivial next to the curation).

## Matching-math impact

The engine itself barely changes: same −2..+2 per axis, same shared-issues rule, same matters-doubling. Effects that do matter:

- **More nulls, worse match quality.** Sparse candidates get sparser: someone scored on 4 of 10 axes today would realistically hit 5-6 of 20. The shared-issue floor (we already show a dash below enough overlap) triggers more often, so MORE candidates show "—" instead of a percentage. That's honest but reads as thinner coverage.
- **Quiz length doubles: ~90 seconds to ~3-4 minutes.** For an 18-29 first-time-voter audience, completion drops meaningfully with every added screen. Mitigation if ever built: a 10-question core with an optional "go deeper" second round, matching on whatever the user answered.
- **Better differentiation where it exists.** Where both candidates are well-documented (competitive statewide races, which is our whole catalog), 20 axes genuinely separates candidates the current 10 blur together.

## Recommendation: after November, if at all

Before November this is the wrong trade. The ~15-20 re-curation sessions would come directly out of the same budget that maintains accuracy through the Aug 18/Sep 8 primaries, the House toss-ups, and launch QA — and it would make the app's most visible number (match %) rarer and its "Not stated" rows twice as common during the exact weeks we're being judged by store reviewers and first users. The 10-axis model is also a promise we've already made in the store listing, the methodology page, and 100 curated profiles.

If the app earns an audience, do it **after November 3** as the 2028-cycle data model, built from day one with 20 axes and the two-round quiz. The one piece worth doing sooner and cheaply: adding the two *questions* kiki cares about (college cost, book bans) to the curation TOOL as optional note fields now, so evidence gets captured in passing and the 2028 re-curation starts half-done.
