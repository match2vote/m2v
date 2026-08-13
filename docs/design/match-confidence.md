# Match confidence: how M2V handles unequal denominators

**Problem (kiki, Aug 13, CT Governor example):** Fazio showed 71% across 9 shared issues while Lamont showed 58% across 10. Because the percentage is computed only over issues where BOTH the user and the candidate have a value, a candidate with fewer documented positions competes on a smaller, potentially friendlier denominator. Thin data can inflate a score, which systematically penalizes the candidates we researched best.

## What we shipped

Three layers, all display/ranking logic; the underlying math and data are untouched.

1. **The denominator is always shown, prominently and identically for everyone.** Results rows read "71% across 9 of your 10 issues" in bold; ballot rows read "71% match on 9 of your 10 issues." No bare percentages anywhere.
2. **Unequal denominators are flagged at the race level.** When candidates in a race were scored on different numbers of issues, the race card carries an explicit italic caveat: these percentages cover different numbers of issues and are not directly comparable.
3. **The star has a denominator guard.** "★ Your top match" is only awarded when the top-ranked candidate was scored on **at least as many issues as every other scored candidate in the race**. In the CT example, Fazio (9 issues) can top the ranked list but cannot take the star over Lamont (10 issues); the list order still shows raw percentages with their denominators and the caveat explains why no star appears. Existing star rules still apply on top (quiz completed with 3+ real answers; 2+ researched candidates in the race).

Also tightened alongside (same root concern, thin evidence pretending to be a result): no percentages, rankings, or stars exist AT ALL until the quiz is completed with at least three real answers; skipping nine questions and answering one no longer produces a "best match."

## What we considered and rejected

- **Impute missing positions** (treat null as the party-typical answer, or as disagreement). Rejected outright: violates the founding rule that nulls stay null. Both variants inject invented data into the number users trust most.
- **Fixed denominator** (score everyone out of the user's 10 answers; missing issues score zero agreement). Superficially fair, but "zero agreement" IS an imputation, it just hides the disagreement assumption inside the math. It would punish thin-data candidates as hard as the current system rewards them, with the bias reversed and invisible.
- **Statistical shrinkage** (Bayesian/Wilson-style: pull low-coverage percentages toward the neutral midpoint in proportion to coverage). The most principled option and the least explainable. Our methodology page promises a calculation an 18-year-old can verify by hand; "we shrank his 71% to 61% using a prior" breaks that promise. Kept in the back pocket for a future cycle if display-level guards prove insufficient.
- **Suppressing thin candidates from results entirely.** Hides real, sourced information and recreates the placeholder-candidate sin in reverse.

## Why this trade

Show everything, weight nothing invisibly. The number stays a plain, verifiable ratio; the CONFIDENCE of the number is communicated where the user makes comparisons (denominator text, race caveat), and the single most consequential UI signal (the star) is gated so it can never be won on a smaller denominator. Honest data presented with honest framing beats corrected data nobody can audit.
