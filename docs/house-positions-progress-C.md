# House positions pass, chat C, California

Started Aug 17, 2026. Owner: chat C. State: CA only, all 52 districts, 104 candidates.

Precondition checked at start: `data/curated/CA.json` has 52 House race entries (plus CA-governor). Confirmed.

Rule in force: a race is either fully done, both candidates researched to the same depth, or it is not touched. No half-done race is left behind, not between districts and not at a stop.

Method per race: research both candidates, write both, then the verify gate (re-fetch every scored position's source and write what the page says before looking at the stored score), then fix, then log here, then next district.

Thirteen candidates have no FEC record and carry a first-pass curated object (ids like `ca-house-2-littau`). Those are extended in place, never duplicated.


## Operational threshold for the quarantine rule

The run book quarantines a race when a candidate "cannot be found at all" and names 2 scored axes against an opponent's 10 as the denominator problem. California produces a lot of this: many districts pair a well documented incumbent with a challenger who filed no survey, has a three line campaign site and no issue coverage.

The threshold applied in this state, stated so the audit chat can second guess it: **a race is written only if the weaker documented candidate reaches at least 4 scored axes after all three rounds, and the gap between the two candidates is at most 4.** Otherwise the race stays names-only and the reason is logged. Rounds are run in full on the weaker candidate first, so an incumbent is never researched into a race that then has to be thrown away.

---

## Log

| District | Candidates | Scored | Null | Verify gate caught | Status |
|---|---|---|---|---|---|
| CA-1 | Gallagher (R), McGuire (D) | 7 / 9 | 3 / 1 | 7 fixes: 4 Gallagher labels cited facts not on the cited page (Prop 13 and AB 109 attributed to campaign site, Glenn Medical Center attributed to NSPR, energy line attributed to CN&R); McGuire cost label claimed a minimum wage stance not on the issues page; McGuire housing rescored 0 to -1 after a full-page read showed the housing plank is investment plus renter protections and the cut-red-tape phrase is a state record recital; McGuire repro, immigration, democracy and safety labels rebuilt on verified quotes | done |
| CA-2 | Huffman (D), Littau (R) | 0 / 0 | n/a | Quarantined before writing, so nothing to verify. Three rounds run on Littau: campaign site littauforcongress.com is unfetchable (robots.txt), iVoterGuide records 'Did not answer' on roughly 40 policy questions across every issue area, Ballotpedia records no 2026 Candidate Connection survey, and she filed no candidate statement in the Trinity County voter guide. Only one axis was scorable from local coverage (voter ID and proof of citizenship, democracy). One scored axis against Huffman's eight or nine is the denominator problem, so the race was left untouched rather than half researched. Huffman was not written. | names-only, quarantined |
| CA-3 | Bera (D), Tucker (R) | 0 / 0 | n/a | Quarantined before writing. Three rounds on Tucker: campaign site states only 'public safety, support small businesses and create jobs, and protect our quality of life' with a 404 on the priorities page, Ballotpedia records no 2026 Candidate Connection survey, and launch coverage in The Union and YubaNet yields one quotable line, 'support the second amendment, oppose illegal immigration, fight for fiscal sanity'. Second Amendment is excluded by the gun rule, leaving 2 scorable axes (immigration, taxes) against Bera's six or more. Below threshold, so Bera was not written. | names-only, quarantined |
| CA-4 | Thompson (D), Jones (D), same party top-two | 8 / 6 | 2 / 4 | 4 fixes: Thompson housing was null on the claim his House issues page has no housing section, the verify fetch showed a housing nav item and the subpage documents Low-Income Housing Tax Credit work, so housing became -1; Jones housing raised -1 to -2 after the verify fetch returned a named 'Investing in Affordable Housing' theme and 'major federal investments to build housing that workers, families, and seniors can afford'; Jones immigration cut -2 to -1 because the verified theme text is 'humane, orderly, and fair... and restores accountability', not the 'earned path to citizenship' wording the first pass recorded; Thompson safety nullNote reworded to match what the page actually shows | done |
| CA-5 | McClintock (R), Masuda (D) | 10 / 9 | 0 / 1 | 5 fixes: McClintock home was written as Elk Grove, which no fetched source supports, so it is now null; McClintock repro was null until the Ballotpedia key votes section showed a vote for H.R. 36, the twenty week abortion ban, now +2; his energy label misquoted the page, corrected to 'the very things that make us prosperous and comfortable'; the same label claimed the REFINER Act expands petroleum refining, a gloss the page does not support, cut back to what the page says; background claim that he chairs lands and water work replaced with his actual committees | done |
| CA-6 | Kiley (I, FEC party OTHER), Pan (D) | 7 / 7 | 3 / 3 | 4 fixes: Kiley education claimed charter and school choice support citing his House site, which only describes a scholarship tax credit, so the citation moved to Wikipedia where that support is documented; Kiley housing label did not say the quote is from his 2021 recall campaign, now dated; Pan democracy label quoted phrases not on the release, replaced with the verified wording about challenging a free and fair election; Pan safety label shortened the quote, restored in full. Also checked and cleared a suspected FEC error: Kiley's party reads OTHER because he left the Republican Party in March 2026 and is running as an independent, so the FEC record is right and was copied verbatim | done |
| CA-7 | Matsui (D), Vang (D), same party top-two | 8 / 10 | 2 / 0 | 3 fixes, all on Vang: taxes label quoted 'ultra-wealthy' where the platform says 'billionaires'; education label paraphrased where the platform says 'resist efforts to divert public dollars to charter schools or private voucher programs', now verbatim; democracy label claimed she would expand voting access through language services, but the verified sentence is about language access to city services, so the label was rebuilt on 'Vote 16' and protecting voting rights, which is what the page actually supports. All eight Matsui citations re-fetched and confirmed verbatim, including both roll calls | done |
| CA-8 | Garamendi (D), Recile (R) | 10 / 6 | 0 / 4 | 6 fixes: Garamendi cost label quoted an Inflation Reduction Act phrase the re-fetch did not return, trimmed to the confirmed sentence; his repro label said he called abortion access a fundamental human right when the page says he said it of Roe v. Wade; his climate label said cosponsored the Green New Deal where the page documents a statement of support, now quoted; Recile taxes and education labels were missing the strongest verified clauses ('reduce taxes across the board', 'parents should have a choice where their children are taught'), added; Recile cost label was rewritten to say plainly that he names inflation as a priority without a price or wage mechanism, which is a borderline +1 the audit should re-read; FEC id for Recile was wrong on first draft and caught by the id check before writing | done, cost axis for Recile flagged for audit |
| CA-9 | Harder (D), McBride (R) | 7 / 6 | 3 / 4 | Verify confirmed every quote verbatim and produced 2 changes plus 2 flags: McBride cost set to null rather than scored, because his economy list is entirely tax, spending and energy items and names no price, wage or inflation problem, so scoring it would have double counted his tax position; McBride climate label extended with the verified clause 'and it is not being used'. Flagged for audit: Harder repro sits at -2 on the single Wikipedia sentence 'He supports legal abortion rights', which is direction-clear but thinner than the -2 sources used elsewhere in this state; and Harder safety at +1 rests on a page the re-fetch confirmed contains no mental health, reentry, poverty or root cause language at all | done, 2 magnitude calls flagged |
| CA-10 | DeSaulnier (D), Frese (R), no FEC record | 9 / 7 | 1 / 3 | 2 fixes: Frese cost label carried a second quote, 'fight inflation and reckless spending that keep mortgage rates high', sourced to his campaign site when it is actually BallotReady wording, so the label was trimmed to the campaign site sentence; his housing label was extended with the verified clause 'communities decide how they grow, not Washington', which strengthens the mixed reading behind the 0. Note on method: Frese screened at only 3 or 4 scorable axes from BallotReady and local coverage and was close to quarantine, but his own campaign site at freseforcongress.com was found on a third round and carries a full platform, taking him to 7. The stub object ca-house-10-frese was extended in place, not duplicated | done |

---

## Session summary, Aug 17, 2026

**Stopped at a clean boundary.** Districts 1 through 10 are fully resolved: 8 races written and verified, 2 quarantined. No race is half done. Districts 11 through 52 were not touched and remain names-only exactly as the first pass left them.

| | |
|---|---|
| Races flipped to general | 8 (CA-1, 4, 5, 6, 7, 8, 9, 10) |
| Candidates researched | 16, all to equal depth within their race |
| Positions scored | 126 |
| Positions null with a note | 34 |
| Races quarantined | 2 (CA-2, CA-3) |
| Races left untouched | 42 (CA-11 through CA-52) |
| Largest scored-axis gap in a finished race | 4 (CA-8) |

Mechanical gate at stop: no duplicate ids, every curated id present in `data/fec/CA.json` or already curated, name and party and district equal to the FEC record on every object, every non-null position carries an http source, every null carries a note naming where the hunt went, no em-dash in either file, and `node pipeline/bundle-data.mjs` exits 0 with all 16 candidates bundled two per finished district. `apps/` was restored to its pre-run state after the bundler check, so nothing outside `data/curated/CA.json` and this file was changed.

### Things the next session or the audit chat should look at

1. **CA-8 Recile, cost +1.** He names "Reducing Inflation" as a priority but offers no price or wage mechanism, only tax and spending reduction. Scored +1 rather than null so the axis is not silently dropped, but it is the weakest score in the state and it sets the CA-8 gap at 4, the threshold limit.
2. **CA-9 Harder, repro -2.** Rests on a single Wikipedia sentence, "He supports legal abortion rights." Direction is unambiguous, magnitude is thinner than the other -2 repro scores here.
3. **CA-9 Harder, safety +1.** His public safety page was re-fetched and confirmed to contain no mental health, reentry, poverty or root cause language at all, which is why a Democrat scores positive here. Worth a second read because it is counterintuitive.
4. **Kiley's FEC party reads OTHER and that is correct.** He left the Republican Party on March 9, 2026 and is running as an independent. Copied verbatim per the run book. Flagging it so nobody "fixes" it later.
5. **Same-party races.** CA-4, CA-7 and CA-11 through CA-14 include top-two races between two Democrats. CA-4 and CA-7 were researched on the same ten axes as any other race, and both produced real separation, so the format works.

### Method notes worth carrying forward

* `https://clerk.house.gov/evs/2025/rollNNN.xml` is fetchable and returns a named per-member vote reliably. `congress.gov` and `govtrack` are both blocked by robots. The three reusable roll calls are **roll 6** (Laken Riley Act, Jan 7 2025, immigration), **roll 102** (SAVE Act, Apr 10 2025, democracy) and **roll 190** (H.R. 1, Jul 3 2025, health and taxes). Together they give four axes of hard official record for any incumbent.
* Screen the less documented candidate first, all three rounds, before researching the incumbent. Two races here were quarantined before any incumbent work was done, which cost nothing.
* Do not score the cost axis off a tax or spending position alone. A cost score needs a statement about prices, wages or the cost of living. Otherwise one sentence gets counted twice and inflates a candidate's denominator.
* Pull the exact FEC id from `data/fec/CA.json` before writing. One id was guessed wrong on a first draft and the id check caught it before anything was written.
* The verify gate produced at least 2 corrections in every single race, 33 in total. Reading the source first and writing down what it says before looking at the stored label is what caught them; several were labels that quoted a real fact against a page that did not contain it.
