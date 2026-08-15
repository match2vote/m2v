# House sweep progress, chat 3

Chat 3 states, in order: NY, IL, OH, MI, WA, TN, MN, AL, OR, KS, UT, HI, ME, ND. 124 districts.
Run book: project doc "House Sweep Run Book". Section 6 skipped by instruction. Browse.js not touched.
Started 2026-08-14.

## METHOD DEVIATION, forced, applies to the whole run

The run book names Ballotpedia as source B. **Ballotpedia's 2026 pages are not usable in this
environment.** Its state pages for both NY and OH still say "The list of general election
candidates is incomplete pending results from the primary" months after those primaries ran, and
its per-district pages still show pre-primary declared-candidate lists with primary dates
"Pending". Verifying against it would confirm nothing.

Substitute source B, in this order of preference:
1. The state election authority (Secretary of State / Board of Elections) certified list or
   official results. This is the run book's own escalation source in section 4 and its designated
   source B for Alabama in section 7.
2. Where the state authority has not published a post-primary or general-election certification,
   an independent set of at least two non-Wikipedia sources: state and local news reporting of
   primary results, Politics1, iVoterGuide, and post-primary results recaps.

Second forced deviation: **WebFetch truncates long Wikipedia pages.** The New York article cut off
at district 10. For the districts past the cut I gathered source A from non-Wikipedia reporting
instead and said so per state below.

Inclusion rule applied uniformly, so coverage is not faked: a candidate goes in `advancing` only
if at least two independently fetched sources put them on the November ballot. Names appearing in
one source only are listed under UNRESOLVED MINOR LINES below and left out of the file.

---

## Completed states

### NY, done 2026-08-14. 26 written, 0 quarantined.

Source A: Wikipedia 2026 U.S. House elections in New York (districts 1 to 10 only, page truncated
past that) plus non-Wikipedia reporting for 11 to 26.
Source B: NYS BOE June 23, 2026 primary certification (covers CDs 2, 3 and 16 to 26 with full
legal names and every party line), Nassau County BOE 2026 general candidate list (CDs 2 to 4),
Politics1, iVoterGuide, Cozen O'Connor primary results recap, and district-level local news.

**What the verify gate caught (4 real findings, plus 1 near miss):**

1. **NY-7, source A was wrong.** Wikipedia names Priscilla Ghaznavi as the Republican nominee.
   Four independent sources, including the Central Queens Republican Club calling him "Republican
   and Conservative candidate for Congress, 7th District", name **Melvin Rivera** as the
   Republican, unopposed, with Ghaznavi on the ballot as an **independent**. Wikipedia is the lone
   outlier. Written as Rivera R / Ghaznavi I.
2. **NY-7, missing candidate.** Antonio Reynoso lost the Democratic primary but stays on the
   November ballot on the Working Families line (Politics1, iVoterGuide, Working Families Party
   candidate page). He would have been dropped as a losing primary candidate.
3. **NY-10, source A incomplete.** Wikipedia gives no Republican. **Jennifer E. Moore**, unopposed,
   confirmed by three sources.
4. **NY-21, Conservative line.** Robert Smullen lost the GOP primary but held the Conservative
   designation and could have appeared as a third name. He declined it after meeting Trump, so the
   line is vacant. Written as a two way race; recorded here because the opposite call was live.
5. Near miss: NY-9's FEC file contains a Republican filer, Jean Fritzner Depalis, who is not the
   nominee. The nominee is Joel Anabilah-Azumah, who has no FEC record. Matching on the FEC file
   alone would have put the wrong man on the ballot.

**District by district comparison, source B read first, then compared to what was written. All 26.**

D1  B: LaLota (R inc), Gallant (D), Maggio (I), Sorensen (I). Written: same 4. MATCH.
D2  B: Garbarino (R inc), Halpin (D), per Nassau BOE general list. Written: same. MATCH.
D3  B: Suozzi (D inc), LiPetri (R), per Nassau BOE. Written: same. MATCH.
D4  B: Gillen (D inc), Driscoll (R), Tarnoff (Libertarian), per Nassau BOE. Written: same 3. MATCH.
D5  B: Meeks (D inc), Marsh (R), both uncontested. Written: same. MATCH.
D6  B: Meng (D inc, 55.7%), Chou (R). Written: same. MATCH.
D7  B: Valdez (D), Rivera (R), Reynoso (WF), Ghaznavi (I). Source A said Ghaznavi was the R and
    omitted Rivera and Reynoso. MISMATCH, resolved against source A, see finding 1 and 2.
D8  B: Jeffries (D inc), Mizrahi (R). Written: same. Sahir Ahsan is a declared write-in only,
    excluded. MATCH.
D9  B: Clarke (D inc, 66.4%), Anabilah-Azumah (R). Written: same. MATCH.
D10 B: Lander (D, beat incumbent Goldman 65.3-34.7), Moore (R). Source A had no R. MISMATCH,
    resolved, see finding 3.
D11 B: Malliotakis (R inc), DeCillis (D, 57.8%). Written: same. MATCH.
D12 B: Lasher (D, 39.0%), Shinkle (R), independents Negron, Ortiz, Wintrich. Written: same 5.
    MATCH. Two further independent names excluded, see UNRESOLVED MINOR LINES.
D13 B: Avila Chevalier (D, beat incumbent Espaillat), Williams (R). Written: same. MATCH.
D14 B: Ocasio-Cortez (D inc, ~85%), Hysenaj (R, uncontested). Written: same. MATCH after a second
    check; one verification pass could not find the GOP primary result and returned unverified,
    so it was re-checked against three further sources before acceptance.
D15 B: Torres (D inc, ~71%), Sapaskis (R), Duran (Conservative), Easton (I, PSL). Written: same 4.
    MATCH. Three further minor names excluded, see UNRESOLVED MINOR LINES.
D16 B: Latimer (D inc), Cinquemani (R), per BOE certification, neither faced a primary.
    Written: same. MATCH.
D17 B: Lawler (R inc, holds R/C/WF lines), Conley (D, ~49% of a five way primary). Written: same
    two people. MATCH.
D18 B: Ryan (D inc), Auringer (R), per BOE certification. Written: same. MATCH.
D19 B: Riley (D inc), Oberacker (R, beat Portelli). Written: same. MATCH.
D20 B: Tonko (D inc), Ambrosio (R), per BOE certification. Written: same. MATCH.
D21 B: Gendebien (D), Constantino (R), open seat, Conservative line vacant. Written: same two.
    MATCH, see finding 4.
D22 B: Mannion (D inc), Buller (R), per BOE certification. Written: same. MATCH.
D23 B: Langworthy (R inc), Gies (D, beat Stocker). Written: same. MATCH.
D24 B: Tenney (R inc), Ellman (D, beat Kastenbaum). Written: same. MATCH.
D25 B: Morelle (D inc, ~63%), McIntyre (R). Written: same. MATCH.
D26 B: Kennedy (D inc), Hannon (R), per BOE certification. Written: same. MATCH.

Mechanical: json.tool clean, all 30 advancing ids resolve, 26 + 0 = 26 seats, no empty advancing
array, no em-dash in any statusNote.

15 curated candidate entries added for real general election candidates with no FEC record:
NY-1 Maggio and Sorensen, NY-5 Marsh, NY-6 Chou, NY-7 Rivera and Ghaznavi, NY-8 Mizrahi,
NY-9 Anabilah-Azumah, NY-10 Moore, NY-12 Wintrich, NY-13 Williams, NY-15 Sapaskis and Duran,
NY-16 Cinquemani, NY-26 Hannon.

### IL, done 2026-08-14. 17 written, 0 quarantined.

Source A: Wikipedia 2026 U.S. House elections in Illinois. **Truncated again, this time at
district 7.** Districts 8 to 17 came from non-Wikipedia reporting.
Source B: Illinois State Board of Elections was not reachable, every dynamic elections.il.gov page
returned 403 and its results portal has nothing past the 2025 consolidated election. Fell back to
the independent set: The Center Square Illinois primary results, NBC Chicago, CBS Chicago,
Chicago Sun-Times, WTTW voters guide, Riverside Brookfield Landmark, Politics1.

**What the verify gate caught (2 real findings):**

1. **IL-4, source A is stale and would have put two people on the ballot who are not on it.**
   Wikipedia lists six candidates including independents Mayra Macias and Byron Sigcho-Lopez. The
   Illinois State Board of Elections struck both on an 8-0 vote on July 21, 2026 for insufficient
   valid signatures (Macias 486 short, Sigcho-Lopez 1,222 short of 10,816). Both now appear as
   declared write-ins only. Written as a four way race: Patty Garcia (D), Lupe Castillo (R),
   Ed Hershey (Working Class Party), Chris Getty (I). Confirmed by Sun-Times, ABC7 Chicago and
   Riverside Brookfield Landmark.
2. **IL-2, Ashley Banks.** Wikipedia lists an independent, Ashley Banks. Four independent sources,
   including Politics1's full IL-2 line, list only Miller (D) and Noack (R), and one states
   explicitly that IL-4 is the only Illinois district with a non-major-party candidate on the
   ballot. ISBE could not be reached to settle it. Excluded under the two-source rule and logged
   under UNRESOLVED MINOR LINES rather than quarantining the district, since both major-party
   nominees are firmly sourced and a quarantine would have thrown away a correct two way race.

**District by district comparison, source B read first, then compared. All 17.**

D1  B: Jackson (D inc, unopposed), Maxwell (R). Written: same. MATCH.
D2  B: Miller (D, beat Jesse Jackson Jr.), Noack (R). Open seat, Kelly running for Senate.
    Written: same 2. Source A also had Banks (I). MISMATCH, see finding 2.
D3  B: Ramirez (D inc), Oakley (R), both unopposed. Written: same. MATCH.
D4  B: Patty Garcia (D), Castillo (R), Hershey (WCP), Getty (I). Source A had 6. MISMATCH,
    see finding 1.
D5  B: Quigley (D inc), Hanson (R). Written: same. MATCH.
D6  B: Casten (D inc, 73.4%), Conforti (R). Written: same. MATCH.
D7  B: Ford (D, 13 way primary), Koppie (R, 66.1%). Open seat, Davis retiring. Source A stopped
    before this district. Written from source B plus corroboration. NO SOURCE A.
D8  B: Bean (D, 31.8%), Davis (R, 51.5%). Open seat, Krishnamoorthi running for Senate.
    Written: same. NO SOURCE A.
D9  B: Biss (D, beat Abughazaleh), Elleson (R). Open seat, Schakowsky retiring. Written: same.
    NO SOURCE A.
D10 B: Schneider (D inc), Lambrecht (R, unopposed). Written: same. NO SOURCE A.
D11 B: Foster (D inc, unopposed), Walter (R, four way primary). Written: same. NO SOURCE A.
D12 B: Bost (R inc), Fortier (D), both unopposed. Written: same. NO SOURCE A.
D13 B: Budzinski (D inc), Wilson (R). Written: same. NO SOURCE A.
D14 B: Underwood (D inc, unopposed), Marter (R). Written: same. NO SOURCE A.
D15 B: Mary Miller (R inc, 73.6%), Todd (D, 45.5%). Written: same. NO SOURCE A.
D16 B: LaHood (R inc), Nolley (D). Written: same. NO SOURCE A.
D17 B: Sorensen (D inc), Vancil (R). Written: same. NO SOURCE A.

For the ten districts marked NO SOURCE A the two-source bar was still met, just from two
independent non-Wikipedia sources rather than Wikipedia plus one.

Mechanical: json.tool clean, all 34 advancing ids resolve, 17 + 0 = 17 seats, no empty advancing
array, no em-dash in any statusNote.

Second-way re-check on five districts, as section 4 requires when a state passes too quietly:
IL-4 checked against Sun-Times and ABC7 separately from the Landmark; IL-8 against Patch and WTTW;
IL-15 against Riverbender and an ISBE-derived filed-candidates PDF; IL-11 and IL-17 against
Politics1 and WTTW. No further changes.

6 curated candidate entries added for candidates with no FEC record: IL-2 Noack, IL-4 Castillo,
IL-4 Hershey, IL-5 Hanson, IL-9 Elleson, IL-10 Lambrecht.

ADDITIONS TO UNRESOLVED MINOR LINES (IL):
* IL-2, Ashley Banks, independent. Named by Wikipedia only among fetched sources. Excluded.
* IL-1 Je'Rico Brown, IL-4 Mayra Macias and Byron Sigcho-Lopez, IL-16 John Kitover: declared
  write-ins, not printed on the ballot. Excluded.

### OH, done 2026-08-14. 15 written, 0 quarantined.

Source A: Wikipedia 2026 U.S. House elections in Ohio, all 15 districts, page did not truncate.
Source B: county boards of elections publishing November 3, 2026 general filings (Hamilton,
Butler, Erie, Summit) and the Trumbull County official May 5, 2026 primary canvass, plus
iVoterGuide's complete Ohio November guide, the Columbus Chamber general election list, WOSU,
Ideastream, WVXU, WNIR, Dayton Daily News, 10TV, Richland Source. The Ohio Secretary of State's
own site returned 403 on every page tried.

**This is the state where the verify gate earned its keep. Six real findings, four of them wrong
names that would have gone in the file.**

1. **OH-14, source A named the wrong person and the wrong party.** Wikipedia gives the Democratic
   nominee as "Nicole Frenchko". Michele Nicole "Niki" Frenchko is a **Republican**, a former
   Trumbull County commissioner, who ran in the **Republican** primary against Rep. Dave Joyce and
   lost 30.0% to 70.0%. The Democratic nominee is **Maria Jukic**, who won with 50.9% over Bill
   O'Neill and Carl Setzer. Sourced to the Trumbull County BOE official results PDF and Ideastream.
   Writing source A here would have put a losing Republican on the ballot as the Democrat.
2. **OH-3, source A named the wrong Republican.** Wikipedia gives "Joe Gerard". The Republican
   nominee is **Cleophus Dulaney**, per 10TV's race call, iVoterGuide and the Columbus Chamber
   list. Gerard appears nowhere in any source B document.
3. **OH-15, source A listed both Democrats as if both were on the ballot.** Adam Miller and Don
   Leonard were rivals in the primary. **Don Leonard won with about 52.8%.** Also adds Libertarian
   Brennan Barrington, whom source A omitted.
4. **OH-4, source A named the wrong independent.** Wikipedia gives "Tamie Wilson (I)". The
   independent on the November ballot is **Tracey Tackett**. Three concurring general election
   lists show the field as Jordan (R), Kolasinski (D), Tackett (I) with no Wilson on either line.
   This also disposes of a would-be quarantine: `data/fec/OH.json` carries **two** filers named
   Tamara Wilson in district 4, one Independent and one Democrat, which under section 8 would be
   the "two FEC filers could be the same person" trigger. Neither is on the ballot, so neither is
   in an advancing array and the question does not arise.
5. **OH-13, source A had the Republican right but omitted the independent.** Carey Coleman beat
   four Republicans including Kevin Coughlin with over 47%. Independent **Sandeep Dixit** is
   confirmed on the Summit County BOE's own November 3, 2026 filing document.
6. **OH-10, wrong party on a minor candidate.** Thomas McMasters is a **Libertarian**, not an
   independent as source A has it. Butler County BOE codes him (L).

Also caught: Politics1, which I use as a corroborating source, has a confirmed error in OH-1,
naming the Libertarian as "Nathan Weise" against three sources saying John Hancock Jr. Its
unique-to-it minor candidates elsewhere (OH-3 Jason Fistick, OH-11 Cortney Peterson) are therefore
treated as unverified and excluded. Logged so a later pass does not trust it alone.

**District by district comparison, source B read first, then compared. All 15.**

D1  B: Landsman (D inc, 73%), Conroy (R), Hancock Jr. (L). Written: same 3. MATCH.
D2  B: Taylor (R inc), Mazzuckelli (D). Source A also had Kenneth Jacob Dietz (I), unconfirmed by
    any source B document. MISMATCH, Dietz excluded.
D3  B: Beatty (D inc), Dulaney (R). Source A said Gerard (R) and Michelle Bird (I). MISMATCH,
    see finding 2. Bird excluded, her own site claims she cleared the signature threshold but no
    election authority lists her.
D4  B: Jordan (R inc), Kolasinski (D), Tackett (I). Source A said Tamie Wilson (I). MISMATCH,
    see finding 4.
D5  B: Latta (R inc), Shaver (D, 28.7%), Franklin (I). Written: same 3. MATCH. Libertarian
    Michael Veloff excluded, see UNRESOLVED MINOR LINES.
D6  B: Rulli (R inc, 76.7%), Kirtley (D, beat five). Written: same. MATCH.
D7  B: Max Miller (R inc), Poindexter (D). Written: same. MATCH.
D8  B: Davidson (R inc), Enoch (D), per Butler County BOE. Written: same. MATCH.
D9  B: Kaptur (D inc), Merrin (R), Althaus (L) per Erie County BOE. Source A omitted Althaus.
    MISMATCH, Althaus added to the pre-existing OH-house-9 entry.
D10 B: Turner (R inc), Knickerbocker (D), McMasters (L). Source A had McMasters as (I).
    MISMATCH, see finding 6.
D11 B: Brown (D inc), Kirchner (R). Written: same. MATCH.
D12 B: Balderson (R inc), Christian (D). Written: same. MATCH.
D13 B: Sykes (D inc, unopposed), Coleman (R, 47%+), Dixit (I) per Summit County BOE. Source A
    omitted Dixit. MISMATCH, see finding 5.
D14 B: Joyce (R inc, 70%), Jukic (D, 50.9%). Source A said Nicole Frenchko (D). MISMATCH,
    see finding 1.
D15 B: Carey (R inc), Leonard (D, 52.8%), Barrington (L). Source A listed two Democrats and no
    Libertarian. MISMATCH, see finding 3.

Mechanical: json.tool clean, all 37 advancing ids resolve, 15 + 0 = 15 seats, no empty advancing
array, no em-dash in any statusNote.

11 curated candidate entries added for candidates with no FEC record: OH-1 Hancock,
OH-2 Mazzuckelli, OH-3 Dulaney, OH-4 Tackett, OH-5 Franklin, OH-6 Kirtley, OH-8 Enoch,
OH-9 Althaus, OH-10 McMasters, OH-11 Kirchner, OH-15 Barrington.

The pre-existing OH-house-9 entry, which I did not write, was correct on both major-party
nominees. I extended it with the Libertarian and left its wording otherwise intact.

ADDITIONS TO UNRESOLVED MINOR LINES (OH):
* OH-2, Kenneth Jacob Dietz (I). Wikipedia only. Excluded.
* OH-3, Michelle Bird (I), self-reported signatures only, and Jason Fistick (I), Politics1 only.
  Both excluded.
* OH-5, Michael J. Veloff (L). iVoterGuide shows him as a printed Libertarian, Politics1 marks him
  L/WI, that is a disagreement about ballot status rather than about the person. Excluded pending
  a board of elections list for Wood or Lucas county.
* OH-7, Brian DuVall-Gambino (L) and Andrey Martinichin: declared write-ins. Excluded.
* OH-11, Cortney Peterson (I), Politics1 only. Excluded.

### MI, done 2026-08-15. 13 written, 0 quarantined.

Source A: Wikipedia 2026 U.S. House elections in Michigan, all 13 districts present.
Source B: **Michigan Bureau of Elections official candidate reports** at mi-boe.entellitrak.com,
both the Aug 4 primary listing and the November 2026 general listing. The general listing is the
best single artifact found anywhere in this run: it carries every minor-party and no-party
nominee with filing dates and status flags including DISQ. Corroborated per district with
ClickOnDetroit, Michigan Advance, Bridge Michigan, Michigan Public, WCMU, 9&10 News, Fox 2
Detroit, CBS Detroit, Detroit News, Politics1.

**Method finding, and it is the biggest of the run so far: for Michigan, source A is not a general
election field at all.** The Wikipedia article lists *primary* candidates by party, all of them,
with no marking of who won. Written straight it would have produced multi-Democrat, multi-Republican
advancing arrays in nine of thirteen districts. It also carries no minor-party candidates, and
Michigan's Libertarian, Green, U.S. Taxpayers and Working Class parties nominate by convention, so
25 ballot-qualified candidates are simply absent from it. Every Michigan district was written from
source B with source A used only as a cross-check on names.

**What the verify gate caught (5 wrong names plus 25 missing candidates):**

1. **MI-3, wrong Republican.** Source A shows Michael Markey Jr. **Terri DeBoer** won the Aug 4
   primary with 79%. Markey is not the nominee.
2. **MI-9, wrong Democrat.** Source A shows Jasen Cartwright. The Democratic nominee is
   **Ray Pooley**, unopposed. Cartwright is a declared write-in and is absent from the official
   state general election listing.
3. **MI-12, wrong Republican, and a party error.** Source A shows Allen Downer and Byron Nolen as
   the Republicans. The Republican nominee is **James D. Hooper**, unopposed, and **Nolen ran as a
   Democrat**, losing to Tlaib.
4. **MI-13, incumbent lost.** Source A lists Rep. Shri Thanedar among the Democrats without noting
   he **lost** the primary to state Rep. Donavan McKinney, 51.9% to 48.1%. The Republican is
   **T.P. Nykoriak**, who appears nowhere in source A.
5. **MI-6 and MI-11, missing Republicans.** Source A lists no Republican at all in MI-6; the
   nominee is **Heather Smiley**. In MI-11 it lists five Republicans; the nominee is **Ethan Baker**.
6. **25 minor-party and independent candidates added** that source A omits entirely, all confirmed
   on the official state general election listing.
7. **One disqualification caught.** D. Etta Wilcoxon's Green filing in MI-13 is flagged **DISQ** in
   the official listing. She is not on the ballot and is not in the file.

**Flagged as unstable, written but marked in the statusNote:**

* **MI-8.** The Republican nominee Thomas J. Smith **suspended his campaign on July 16** and still
  won the primary with 50.4% over Trump-endorsed Amir Hassan, because ballots were already printed
  and he had missed the withdrawal deadline. Michigan Advance's November general election voter
  guide still lists him as the Republican candidate, so he is the nominee of record and is written
  as such with the situation spelled out in the statusNote. If the Michigan GOP substitutes a
  replacement this entry must change. This is the single most likely thing in my states to go stale.
* **MI-2.** Ambrose beat Jamie Hill 44.3% to 42.3%, about 1,500 votes, the closest primary in the
  state. AP called it Aug 5 and no recount petition was found, but it is within candidate-requested
  recount range.

**District by district comparison, source B read first, then compared. All 13.**

D1  B: Bergman (R inc, 74%), Barr (D, 58%), Satterla (L), Kovaly (USTP), Davenport (G),
    Hakola (WC), Featherly (I). Written: same 7. Source A had 6 primary candidates and no minor
    parties. MISMATCH against A, matches B.
D2  B: Moolenaar (R inc, unopposed), Ambrose (D, 44.3%), Magoon (G). Written: same 3. Source A
    listed four Democrats. MISMATCH against A.
D3  B: Scholten (D inc, unopposed), DeBoer (R, 79%), Jock (G). Written: same 3. MISMATCH, finding 1.
D4  B: Huizenga (R inc, 85%), McCann (D, 66%), Barnett (G). Written: same 3. Source A listed four
    Democrats. MISMATCH against A.
D5  B: Walberg (R inc), Vukasovich (D), both unopposed, plus Muszynski (L), Renier (USTP),
    Bronke (G). Written: same 5. MATCH on majors, three added.
D6  B: Dingell (D inc), Smiley (R), plus Teagan (L), Mickevicius (USTP), Shabazz (G),
    Rayburn (WC). Written: same 6. MISMATCH, finding 5.
D7  B: Barrett (R inc), Lawrence (D, 43%), Dedrick (G), Thibodeau (WC). Written: same 4. The
    pre-existing MI-house-7 entry had the two majors right; I extended it with the two minor
    parties and corrected the description of Lawrence, who is a Sunrise Movement co-founder.
D8  B: McDonald Rivet (D inc), Smith (R, 50.4%, campaign suspended), Pettus (L), Casha (G),
    Goodwin (WC). Written: same 5, with the Smith situation in the note. See flag above.
D9  B: McClain (R inc), Pooley (D), plus Vayko (L), Vlahos (USTP), Clayton (G), Walkowicz (WC).
    Written: same 6. MISMATCH, finding 2.
D10 B: Bouchard Jr. (R, 72%), Hines (D, 47%), Saliba (L), Nkromo (G), Kirby (WC). Open seat,
    James running for governor. Written: same 5. Source A listed 14 primary candidates.
    MISMATCH against A.
D11 B: Moss (D, 49%), Baker (R), Ishac (L), Teasdale (G), Kumar (I). Open seat, Stevens ran for
    Senate. Written: same 5. MISMATCH, finding 5.
D12 B: Tlaib (D inc, 74%), Hooper (R), Sosnowski (USTP), Sanders (G), Walkowicz (WC).
    Written: same 5. MISMATCH, finding 3.
D13 B: McKinney (D, beat incumbent Thanedar), Nykoriak (R), Dardzinski (USTP), Coleman (WC),
    Campbell (I), Morton (I). Written: same 6. MISMATCH, finding 4 and 7.

Mechanical: json.tool clean, all 63 advancing ids resolve, 13 + 0 = 13 seats, no empty advancing
array, no em-dash in any statusNote.

37 curated candidate entries added, almost all minor-party nominees chosen at party conventions
who therefore have no FEC filing. This is expected in Michigan and is not a data problem.

ADDITIONS TO UNRESOLVED MINOR LINES (MI):
* MI-9, Jasen Cartwright, declared write-in, absent from the official state listing. Excluded.
* MI-13, D. Etta Wilcoxon (Green), marked DISQ on the official state listing. Excluded.
* MI-3, Joe Jock (Green), appears only on the official state listing and has not propagated to
  Politics1. Included anyway because the state listing is the election authority, but noted.

### WA, done 2026-08-15. 10 written, 0 quarantined.

Source A: Wikipedia 2026 U.S. House elections in Washington. **Unusable for this state.** Its
content is a pre-primary snapshot, candidate announcements and finance data as of March 31, 2026,
and it contains no Aug 4 primary result at all. It could not tell me which two candidates advanced
in a single district.
Source B: Washington SOS candidate filing list (voter.votewa.gov, ballot party preferences for all
10 districts), the King County and Pierce County official result PDFs dated Aug 13, and per-district
reporting from Everett Herald, Everett Post, Yakima Herald, Spokesman-Review, Cheney Free Press,
Peninsula Daily News, West Seattle Blog, KOMO, KUOW, Inside Elections, and two Associated Press
race calls. The SOS results portal itself is a JavaScript app that returns nothing to a fetcher.

**Washington results are NOT yet certified.** County canvassing boards certify Aug 18, 2026 and the
Secretary of State certifies Aug 21, 2026. Everything written for this state is from unofficial
counts and should be re-checked after Aug 21.

**What the verify gate caught:**

1. **Source A gave no advancing pairs for any of the 10 districts.** The whole state was written
   from source B. Recorded here because it means Washington has effectively been single-sourced at
   the *type* level, even though every district clears the two-fetched-sources bar within source B.
2. **WA-4 is the surprise of the state and would have been easy to get wrong.** This is a deep red
   open seat, Rep. Dan Newhouse retiring, and six Republicans split the vote, so a **Democrat,
   John Duresky, took the second slot** with 30.8% behind Trump-endorsed Amanda McKinney at 34.9%.
   A reasonable guess would have put two Republicans on the November ballot.
3. **WA-8 second place was decided by seven votes on election night.** Spencer Meline (R) led
   fellow Republican Trinh Ha (R) by 7 votes on Aug 4. Meline led in King County by about 2,600
   while Ha led in Pierce by about 2,700, and Meline's Chelan and Douglas county base supplied the
   margin. AP called it for Meline on Aug 13 at about a one point district-wide gap. Written as
   Meline with the situation stated in the statusNote. **This is the entry most likely to change on
   certification** and it is the one I would have a second person re-check by hand after Aug 18.
4. **The pre-existing WA-house-3 entry, which I did not write, had no `sources` array**, which the
   run book's section 5 shape requires and which the section 6 UI change depends on. Its two
   advancing ids are correct per source B. I added sources and left its wording alone.

**District by district comparison, source B read first. All 10. No same-party pair advanced in any
district, and no incumbent failed to advance.**

D1  B: DelBene (D inc, 53.1%), Silva (R, 26.2%). Third 20 pts back. Written: same. NO SOURCE A.
D2  B: Larsen (D inc, 42.4%), Feller (R, 32.8%, only Republican filed). Third at 13.9%.
    Written: same. NO SOURCE A.
D3  B: Gluesenkamp Perez (D inc, 39%), Braun (R, 39%), Hennrich (D) third at 15%. Pre-existing
    entry already correct. First and second near tied but both advance, so the tightness does not
    affect the field. MATCH.
D4  B: McKinney (R, 34.9%), Duresky (D, 30.8%). Open seat. Written: same. See finding 2.
D5  B: Baumgartner (R inc, 48.0%), Conroy (D, 20.8%), independent Nate Powell third at 14.4%,
    6.5 pts back. Written: same. NO SOURCE A.
D6  B: Randall (D inc, 60.4%), Fox (R, 25.1%). Third 16 pts back. Written: same. NO SOURCE A.
D7  B: Jayapal (D inc, 83.4%), Sheth (R, 10.6%). District lies wholly in King County so the county
    PDF is the full count. Written: same. NO SOURCE A.
D8  B: Schrier (D inc, ~54%), Meline (R, ~15.8%) over Ha (R, ~14.8%). Written: same. See finding 3.
D9  B: Smith (D inc, ~50%), Basler (R, ~24%) over Sawant (I) by about 4.6 pts. District lies wholly
    in King County. Written: same. NO SOURCE A.
D10 B: Strickland (D inc, ~46%), Chung (R, ~35%, only Republican filed). Third 25 pts back.
    Written: same. NO SOURCE A.

Second-way re-check on five districts, since source A contributed nothing and a state passing on
one source's word is exactly what section 4 warns about: WA-1, WA-7, WA-8 and WA-9 were each
re-checked against the King County official PDF independently of the news reporting; WA-6 and WA-10
against the Pierce County official PDF. WA-8 was additionally checked against the AP race call.
No changes resulted.

Mechanical: json.tool clean, all 20 advancing ids resolve, 10 + 0 = 10 seats, no empty advancing
array, no em-dash in any statusNote.

3 curated candidate entries added for candidates with no FEC record: WA-1 Silva, WA-2 Feller,
WA-10 Chung.

### TN, done 2026-08-15. 9 written, 0 quarantined.

Source A: Wikipedia 2026 U.S. House elections in Tennessee. All 9 districts present but the content
is a **pre-primary candidate list with no Aug 6 results**, so in every contested district it names
losers alongside winners with nothing to distinguish them.
Source B: The Green Papers Tennessee 2026 general election page, which carries full legal names and
party-switch notes compiled from official filings, plus Politics1, TN Firefly primary results, WPLN
election live blog, and Tennessee Lookout. sos.tn.gov, tnsos.org and the Clarity results portal all
returned 403 or robots blocks, so the certified state list could not be reached directly.

**What the verify gate caught. Tennessee had the single largest error in the run.**

1. **TN-5, the incumbent lost and source A does not know it.** Wikipedia lists Rep. Andy Ogles (R)
   as the incumbent running, with four Democrats. **Ogles lost the Aug 6 Republican primary to
   Charlie Hatcher, 53.2% to 46.8%**, and Trump moved his endorsement to Hatcher afterward. The
   November race is Hatcher (R) vs Columbia Mayor Chaz Molder (D). Writing source A would have put
   a defeated incumbent on the ballot as the Republican nominee.
2. **TN-9, source A had three names and two of them are wrong for the field.** Wikipedia lists
   London Lamar (D), Justin Pearson (D) and Brent Taylor (R). Rep. Steve Cohen is retiring rather
   than run in any of the three districts Memphis was carved into, **Pearson** won the Democratic
   primary with 65.7%, and Lamar is not on the November ballot.
3. **TN-3, wrong Democrat.** Source A gives Derek Hawn. The Democratic nominee is **Anna Golladay**,
   79.6%. Golladay is also the only Democrat with an FEC record in the district, so the FEC file
   quietly agreed with source B against source A.
4. **TN-7, wrong Democrat.** Source A gives Vincent Dixie and Aftyn Behn. The nominee is
   **Darden Copeland**, 39.9%.
5. **TN-6, three Republicans and two Democrats listed with no winner marked.** The nominees are
   **Johnny Garrett (R)**, who beat former Rep. Van Hilleary, and **Mike Croley (D)**. Open seat,
   Rep. John Rose ran for governor. The Democratic primary at +4.9 with the winner on 28.9% is the
   narrowest congressional margin in the state.
6. **TN-8, source A lists no Democrat at all.** The nominee is **Heidi Kuhn**, 52.0%, and there are
   six independents on the ballot that source A omits.
7. **26 independent candidates added across all nine districts.** Tennessee independents qualify by
   petition and source A carries only two of them. Every one included here appears on both The
   Green Papers and Politics1.
8. **Redistricting note, relevant beyond this file.** Tennessee redrew its congressional map in a
   second extraordinary session before 2026 and split Memphis across three districts. Any
   district-lookup layer in the app built on 2024 geometry is wrong for Tennessee.

**District by district comparison, source B read first. All 9.**

D1  B: Harshbarger (R inc, unopposed), Burke (D, 76.6%), plus independents Ashburn, Baker,
    Campbell, Cody, McClain. Written: same 7. Source A had 2. MISMATCH on independents.
D2  B: Burchett (R inc), Barnett (D), both unopposed, plus independents Fine and Heimerman.
    Written: same 4. MISMATCH on independents.
D3  B: Fleischmann (R inc), Golladay (D, 79.6%), plus five independents. Written: same 7.
    MISMATCH, finding 3.
D4  B: DesJarlais (R inc, 65.9%), Broderick (D, 37.9%), Anders (I), Faircloth (I). Written: same 4.
    Source A missed Faircloth. MISMATCH.
D5  B: Hatcher (R, 53.2%), Molder (D), Johnson (I), O'Leary (I). Written: same 4. MISMATCH,
    finding 1.
D6  B: Garrett (R, 43.6%), Croley (D, 28.9%), Monday (I), Purdy (I). Written: same 4. MISMATCH,
    finding 5.
D7  B: Van Epps (R inc), Copeland (D, 39.9%), Koontz (I), Reynolds (I). Written: same 4. MISMATCH,
    finding 4.
D8  B: Kustoff (R inc), Kuhn (D, 52.0%), plus six independents. Written: same 8. MISMATCH,
    finding 6.
D9  B: Pearson (D, 65.7%), Taylor (R, 46.0%), Clark (I), Head (I). Written: same 4. MISMATCH,
    finding 2.

Every one of the nine districts mismatched source A. That is the expected result when source A is
a pre-primary snapshot, and it is why the gate is worth its cost.

Mechanical: json.tool clean, all 46 advancing ids resolve, 9 + 0 = 9 seats, no empty advancing
array, no em-dash in any statusNote.

26 curated candidate entries added, all of them petition-qualified independents with no FEC record.

ADDITIONS TO UNRESOLVED MINOR LINES (TN):
* TN-7, Jon Thorp (I) and TN-8, George Herold (I). Both appear on Politics1 and on Wikipedia's
  pre-primary list but are absent from The Green Papers' filing-derived roster. Sources disagree
  and the Tennessee SOS certified list could not be reached to settle it. Excluded. These two are
  the specific names to re-check by hand against the SOS list.

### MN, done 2026-08-15. 8 written, 0 quarantined.

Source A: Wikipedia 2026 U.S. House elections in Minnesota. All 8 districts present but again a
**pre-primary snapshot dated March 31, 2026**, with no Aug 11 results.
Source B: **Minnesota Secretary of State official primary results** at electionresults.sos.mn.gov,
the strongest source B in the run so far, plus The Green Papers, Politics1 and Minnesota Reformer.
Minnesota's primary was four days ago and the results are unofficial until the State Canvassing
Board certifies on **Aug 18, 2026**. Every margin is lopsided enough that no nominee is in doubt.

**What the verify gate caught:**

1. **MN-3, wrong Republican.** Source A gives Quentin Wittrock. **Tyler Bass** beat Wittrock
   55.4% to 44.6%. Bass has no FEC record, Wittrock does, so matching on the FEC file alone would
   have reinforced the error.
2. **MN-4, wrong Republican.** Source A gives Paul Xiong. **Paul Wikstrom** won a three way primary
   with 72.6%. Both men are in the FEC file, which is exactly the situation where guessing from
   FEC data goes wrong.
3. **MN-2, MN-5, MN-7, MN-8: source A lists whole primary fields with no winner marked.** The
   nominees are Little (DFL) and Pratt (R) in the open MN-2, Nagel (R) in MN-5, Osberg (DFL) in
   MN-7, Swanson (DFL) in MN-8.
4. **MN-6, a minor-party candidate in source A that does not exist in source B.** Wikipedia lists
   "Kelly Doss (Forward-Independence Party)". Neither The Green Papers nor Politics1 carries any
   MN-6 minor-party candidate. Excluded.
5. **Minnesota's minor parties are gone this cycle.** Legal Marijuana Now and Grassroots Legalize
   Cannabis, which have had ballot lines in recent Minnesota congressional elections, have no 2026
   congressional candidates in either source B roster, consistent with their loss of major-party
   status. Only one non-major-party candidate exists statewide: DeVelle Jackson (I) in MN-5.

**District by district comparison, source B read first. All 8.**

D1 B: Finstad (R inc, 90.1%), Johnson (DFL, 81.7%). Written: same. MATCH on names.
D2 B: Little (DFL, 47.2% of six), Pratt (R, unopposed). Open seat, Craig ran for Senate.
   Written: same. MISMATCH against A, which listed ten names.
D3 B: Morrison (DFL inc, unopposed), Bass (R, 55.4%). Written: same. MISMATCH, finding 1.
D4 B: McCollum (DFL inc, 85.8%), Wikstrom (R, 72.6%). Written: same. MISMATCH, finding 2.
D5 B: Omar (DFL inc, 80.7%), Nagel (R, 52.2%), Jackson (I). Written: same 3. MISMATCH against A.
D6 B: Emmer (R inc, 80.9%), Chapin (DFL, unopposed). Written: same 2. MISMATCH, finding 4.
D7 B: Fischbach (R inc, unopposed), Osberg (DFL, 65.7%). Written: same. MISMATCH against A.
D8 B: Stauber (R inc, 86.4%), Swanson (DFL, 77.2%). Written: same. MISMATCH against A.

Mechanical: json.tool clean, all 17 advancing ids resolve, 8 + 0 = 8 seats, no empty advancing
array, no em-dash in any statusNote.

2 curated candidate entries added: MN-3 Bass, MN-5 Jackson.

Caveat carried forward: the SOS candidate filing list itself could not be retrieved, so the
absence of minor-party candidates in seven of eight districts rests on two compiled rosters rather
than on state filing data. Re-check after the Aug 18 canvass.

ADDITIONS TO UNRESOLVED MINOR LINES (MN):
* MN-6, Kelly Doss (Forward-Independence Party). Wikipedia only, absent from both source B
  rosters. Excluded.

### AL, done 2026-08-15. 7 written, 0 quarantined. Run book section 7 state.

Source A: Wikipedia 2026 U.S. House elections in Alabama.
Source B: per section 7, the Secretary of State rather than Ballotpedia. The Alabama SoS
upcoming-elections page confirmed the election calendar verbatim, all four rounds: May 19 primary,
June 16 runoff, **August 11 special primary for Congressional Districts 1, 2, 6 and 7**, November 3
general. The SoS did NOT publish fetchable certified *results* for 2026 (its election-data page
lists only voter registration statistics for the cycle and its candidate lists are robots-blocked),
so the calendar is SoS-sourced and the names rest on Alabama Political Reporter, Alabama Reflector,
WBRC, WSFA, The Green Papers and Politics1.

**The section 7 trap fired, but not in the direction I was warned about.**

I was told a nominee sourced to May 19 in districts 1, 2, 6 or 7 is wrong. No source I fetched
made that mistake. What source A did instead was subtler and would have been just as wrong:

**AL-2. Wikipedia names Hampton Harris as the Republican nominee and correctly attributes him to
the August 11 special primary.** Harris is not the nominee. **State Rep. Rhett Marques won the
Aug 11 Republican special primary with 16,411 votes, 50.03%. Harris finished second with 7,100
votes, 21.65%.** Confirmed by an Alabama Political Reporter results story with the vote totals, an
Alabama Reflector piece on the general election matchup, WSFA, and Politics1. So the right primary
date with the wrong winner. The date check alone would not have caught this; only reading the
result did.

Other findings:

2. **AL-3, wrong party on the Democrat, and the FEC file says so too.** Wikipedia gives
   "Terri LaPoint (D)". `data/fec/AL.json` lists Terri Lapoint as a **Republican** and Victor Lee
   McInnis as the Democrat. Source B confirms **Lee McInnis** is the Democratic nominee.
3. **AL-6 and AL-7, source A gives only the incumbent.** The full fields are Palmer (R),
   Maurice Mercer (D, 64.2% of the Aug 11 special primary) and independent William Puetz in AL-6;
   Sewell (D) and Ammie Akin (R, over 70% of the Aug 11 special primary) in AL-7.
4. **AL-1 is an open seat and source A mislabels the incumbent.** Wikipedia marks Jerry Carl as the
   incumbent. Carl is a **former** member, 2021 to 2025, who lost the 2024 primary. The sitting
   member is **Barry Moore (R), who is the Republican Senate nominee and is vacating the seat**.
   The advancing array is unaffected but the description would have been wrong.
5. **A source B data error caught and not adopted.** The Green Papers labels Jerry Carl
   "incumbent 2000-present", wrong on both the incumbency and the dates. Logged so a later pass
   does not pick it up.

**District by district comparison, source B read first, then compared. All 7. Election of record
stated for each, per section 7.**

D1 B: Carl (R, **Aug 11 special primary**, 74.7%), Jones (D, Aug 11). Written: same. Open seat.
   MISMATCH against A on incumbency label only, see finding 4.
D2 B: Figures (D inc, Aug 11, unopposed), **Marques (R, Aug 11, 50.03%)**. Source A said Harris.
   MISMATCH, the section 7 trap, see above.
D3 B: Rogers (R inc, May 19), McInnis (D, May 19). Source A said LaPoint (D). MISMATCH, finding 2.
D4 B: Aderholt (R inc, May 19), Pusczek (D, May 19). Written: same. MATCH.
D5 B: Strong (R inc, May 19), Sneed (D, **June 16 runoff**). Written: same. MATCH. Note the two
   nominees come from different rounds.
D6 B: Palmer (R inc, Aug 11, ~87%), Mercer (D, Aug 11, 64.2%), Puetz (I, by petition).
   Source A had only Palmer. MISMATCH, finding 3.
D7 B: Sewell (D inc, Aug 11, unopposed), Akin (R, Aug 11, over 70%). Source A had only Sewell.
   MISMATCH, finding 3.

**No district in 1, 2, 6 or 7 is sourced to May 19.** Districts 3 and 4 are correctly sourced to
May 19 and district 5's Democrat to the June 16 runoff, which is right because those districts were
not part of the special primary.

Mechanical: json.tool clean, all 15 advancing ids resolve, 7 + 0 = 7 seats, no empty advancing
array, no em-dash in any statusNote.

1 curated candidate entry added: AL-6 Puetz. All other Alabama nominees matched an FEC filer.

Weakest links in this state, for the hand re-check: AL-3, AL-4 and AL-5 rest on two compiled
rosters with no news corroboration and no SoS certified result, and AL-5's attribution of Sneed to
the June 16 runoff is single-sourced.

ADDITIONS TO UNRESOLVED MINOR LINES (AL):
* AL-6, William Puetz. Included, but the two sources disagree on his line: Politics1 says
  independent, The Green Papers lists him under the district tagged Democratic while separately
  showing Mercer as the Democratic nominee. Written as independent per Politics1, which is
  explicit. Both sources agree he is on the November ballot. Party label worth a hand check.

### OR, done 2026-08-15. 5 written, 1 quarantined (OR-5). 5 + 1 = 6 seats.

Source A: Wikipedia 2026 U.S. House elections in Oregon, pre-primary candidate lists, May 19, 2026
primary.
Source B: The Green Papers Oregon 2026 general election page and Politics1. The Oregon Secretary of
State could not be used: results.oregonvotes.gov redirects to a historical-data page that carries
only voter registration documents for 2026 and links to no 2026 primary abstract, and the direct
abstract URL 404s.

**What the verify gate caught:**

1. **OR-5 is quarantined. Sources disagree on the Republican nominee and no third source can
   settle it.** Wikipedia and The Green Papers both name **Patti J. Adair**, a Deschutes County
   Commissioner. Politics1 names **Jonathan Lockwood** and does not list Adair at all. Ballotpedia,
   which I do not otherwise use, names Lockwood and additionally calls Joseph Lehman a Republican
   where the other rosters call him a Libertarian. Both Adair and Lockwood are Republican filers in
   `data/fec/OR.json`, so the FEC file cannot break the tie either. The Oregon SoS publishes no
   reachable 2026 primary result. This is a genuine two against two with a defensible quality
   argument on each side, so under section 8 it gets no race entry.
2. **OR-5's minor-party candidates are also unsettled**, which is part of why the whole district
   is quarantined rather than written with a partial field: Joseph Lehman is Libertarian per
   Politics1 and The Green Papers but Republican per Ballotpedia, and Andrea Thorn Townsend
   (Pacific Green) appears in two rosters and not in source A.
3. **OR-2 and OR-6 fusion lines.** Chris Beck (D) in OR-2 and Andrea Salinas (D) in OR-6 also carry
   the Independent Party of Oregon line. Recorded in the statusNotes so the fusion line is not
   later mistaken for a separate candidate.
4. **OR-6, a name in one source that is not a candidate.** The Green Papers lists Jason J. Faler as
   non-affiliated and annotates him "apparently not an active candidate". He is an FEC filer in the
   district. Excluded.

**District by district comparison, source B read first. All 6, including the quarantined one.**

D1 B: Bonamici (D inc, renominated), Kahl (R). Written: same. MATCH.
D2 B: Bentz (R inc, renominated), Beck (D, also IPO line). Written: same. MATCH.
D3 B: Dexter (D inc, renominated), Ayles (R). Written: same. MATCH.
D4 B: Hoyle (D inc), DeSpain (R), Filip (Pacific Green). Written: same 3. MATCH, and source A
   carried Filip too.
D5 B: **conflict**, Adair (R) per two sources vs Lockwood (R) per two others, minor lines also in
   dispute. QUARANTINED.
D6 B: Salinas (D inc, also IPO line), Russ (R). Written: same 2, Faler excluded. MATCH.

Mechanical: json.tool clean, all 11 advancing ids resolve, 5 written + 1 quarantined = 6 seats,
no empty advancing array, no em-dash in any statusNote.

2 curated candidate entries added: OR-3 Ayles, OR-4 Filip.

### KS, done 2026-08-15. 4 written, 0 quarantined.

Source A: Wikipedia 2026 U.S. House elections in Kansas, pre-primary lists, Aug 4, 2026 primary.
Source B: The Green Papers Kansas 2026 general election page and Politics1, which agree exactly,
candidate for candidate and party for party, in all four districts. The Kansas Secretary of State
was not reachable and this session's web search budget was exhausted before Kansas, so source B is
two compiled rosters rather than a state authority.

**What the verify gate caught:**

1. **KS-3, source A does not contain the Republican nominee at all.** Wikipedia lists Sarah Preu,
   Chase LaPorte, Gavin Solomon and Blake Stanley as the Republicans. The nominee per both source B
   rosters is **Eric Jenkins**, who is an FEC-filed Republican in the district and appears nowhere
   in source A. Compounding it, `data/fec/KS.json` lists Sarah Preu as a **Democrat**, so source A
   has her party wrong as well.
2. **KS-4, source A lists seven Democrats with no winner marked.** The nominee is **Katy Tyndell**.
3. **Four Libertarian nominees added** that source A does not carry as such: Steve Jacob (KS-1),
   John Hauer (KS-2), Steve Hohe (KS-3), Drew Cranmer (KS-4). Source A lists Jacob and Cranmer with
   no party given.

**District by district comparison, source B read first. All 4.**

D1 B: Mann (R inc, renominated), Reinhold (D), Jacob (L). Written: same 3. Source A also had
   Colin McRoberts (D) as a rival and Craig Musser (United Kansas). MISMATCH on both.
D2 B: Schmidt (R inc, renominated), Coover (D), Hauer (L). Written: same 3. Source A also had
   Braeden Curwick (D). MISMATCH.
D3 B: Davids (D inc, renominated), Jenkins (R), Hohe (L). Written: same 3. MISMATCH, finding 1.
D4 B: Estes (R inc, renominated), Tyndell (D), Cranmer (L). Written: same 3. MISMATCH, finding 2,
   and Paul Catanese (I) excluded, see below.

Mechanical: json.tool clean, all 12 advancing ids resolve, 4 + 0 = 4 seats, no empty advancing
array, no em-dash in any statusNote.

4 curated candidate entries added, all Libertarian nominees with no FEC record.

Soft spot, stated plainly: neither source B roster gives Aug 4 primary vote totals, only the word
"renominated". The general election fields agree perfectly between two independent compilers, which
is the bar, but no Kansas result was read directly and no state authority was reached. Kansas is
the state in my set with the thinnest evidence behind it.

ADDITIONS TO UNRESOLVED MINOR LINES (KS):
* KS-1, Craig Musser (United Kansas party). Named by Wikipedia and present as an FEC filer coded
  OTHER, but absent from both source B rosters. Excluded, FEC filing alone is not evidence of
  nomination.
* KS-4, Paul Catanese (I). Same situation, named by Wikipedia and an FEC filer, absent from both
  source B rosters. Excluded.

### UT, done 2026-08-15. 4 written, 0 quarantined. New file created.

`data/curated/UT.json` did not exist. Created with state, note, races and candidates, matching the
shape of the other curated files.

Source A: Wikipedia 2026 U.S. House elections in Utah, June 23, 2026 primary, includes results.
Source B: The Green Papers Utah 2026 general election page and Politics1, which agree on every
major-party and minor-party name except one.

**What the verify gate caught:**

1. **Utah redistricted before 2026 and source A does not flag it.** Every sitting member is running
   in a renumbered district: Blake Moore moved from the old 1st to the 2nd, Celeste Maloy from the
   old 2nd to the 3rd, Mike Kennedy from the old 3rd to the 4th. Districts 1 and 4 are open seats.
   `data/fec/UT.json` still carries Burgess Owens as an incumbent in district 4; he is not on the
   ballot in any source and is not in any advancing array.
2. **UT-1, source A calls Ben McAdams the incumbent. He is not.** McAdams is a former member,
   2019 to 2021. The district is open. The advancing array is unaffected but the description would
   have been wrong.
3. **Nine minor-party and unaffiliated candidates added that source A almost entirely omits.**
   Source A carries only Steven Burt (UT-4). Both source B rosters carry Libertarians in all four
   districts, an Independent American in UT-2, a Constitution Party candidate in UT-3, and
   unaffiliated candidates in UT-1, UT-2 and UT-3.

**District by district comparison, source B read first. All 4.**

D1 B: McAdams (D), Owen (R), West (L), Montgomery (Unaffiliated). Open seat. Written: same 4.
   Source A had 2 and mislabelled the incumbent. MISMATCH.
D2 B: Moore (R inc), Crosby (D), Bowen (Independent American), Cottam (L), Moesinger
   (Unaffiliated). Written: same 5. Source A had 2. MISMATCH.
D3 B: Maloy (R inc), Udell (D), Easley (Constitution), Stoddard (L), Hooslyn (Unaffiliated).
   Written: same 5. Source A had 2. MISMATCH. One further name excluded, see below.
D4 B: Kennedy (R inc), Larsen (D), Wright (L), Burt (I). Open seat. Written: same 4. Source A had
   3, missing the Libertarian. MISMATCH.

Mechanical: json.tool clean, all 18 advancing ids resolve, 4 + 0 = 4 seats, no empty advancing
array, no em-dash in any statusNote.

8 curated candidate entries added, all minor-party or unaffiliated candidates with no FEC record.

Soft spot: as with Kansas, neither source B roster supplies June 23 primary vote totals and the
Utah Lieutenant Governor's office was not reached, so the evidence is two agreeing compilers.

ADDITIONS TO UNRESOLVED MINOR LINES (UT):
* UT-3, Ayden Tate Scott (Unaffiliated). Listed by The Green Papers only, absent from Politics1
  and from Wikipedia. Excluded.

### HI, done 2026-08-15. 2 written, 0 quarantined.

Source A: Wikipedia 2026 U.S. House elections in Hawaii, pre-primary lists, no Aug 8 results.
Source B: The Green Papers Hawaii 2026 general election page and Politics1, which agree exactly.

**What the verify gate caught:**

1. **HI-1, source A has the wrong Republicans.** Wikipedia lists Maxwell Frazier and Gavin Solomon
   as the Republican candidates. The Republican nominee per both source B rosters is **Adriel Lam**,
   who appears nowhere in source A and has no FEC record either.
2. **Four minor and nonpartisan candidates added:** Green candidate Jordan Conley and nonpartisan
   Nathan Berning in HI-1, nonpartisan Edward Codelia in HI-2. Source A carries none of them.
3. **Source A marks Rep. Jill Tokuda's candidacy as "not declared".** Both source B rosters have
   her renominated in the Aug 8 primary.
4. **A source A artifact worth flagging to whoever maintains this method.** The name
   "**Gavin Solomon**" appeared as a Republican candidate in the Wikipedia-derived content for
   **four different states in my set**: HI-1, KS-3, IL-11 and MI-11. No source B roster carries him
   in any of them. Whatever its origin, whether a Wikipedia problem or an artifact of summarizing
   long pages, it is a contamination pattern in source A and any name that only source A supplies
   should be treated with suspicion for that reason.

**District by district comparison, source B read first. Both districts.**

D1 B: Case (D inc, renominated), Lam (R), Conley (G), Berning (Nonpartisan). Written: same 4.
   MISMATCH, findings 1 and 2.
D2 B: Tokuda (D inc, renominated), Awa (R), Codelia (Nonpartisan). Written: same 3. MISMATCH,
   findings 2 and 3.

Mechanical: json.tool clean, all 7 advancing ids resolve, 2 + 0 = 2 seats, no empty advancing
array, no em-dash in any statusNote.

4 curated candidate entries added: HI-1 Lam, Conley, Berning and HI-2 Codelia.

### ME, done 2026-08-15. 2 written, 0 quarantined.

Source A: Wikipedia 2026 U.S. House elections in Maine, June 9, 2026 primary, includes results.
Source B: The Green Papers Maine 2026 general election page and Politics1, which agree exactly.

**What the verify gate caught:**

1. **ME-1, source A lists two Republicans as general election candidates.** Wikipedia gives both
   Ronald Russell and Joshua Pietrowicz as general election candidates for a partisan seat, which
   cannot be right. Both source B rosters give **Ron Russell** alone as the Republican nominee.
   `data/fec/ME.json` carries three Republican filers in the district (Russell, Pietrowicz, Small),
   so the FEC file offers no help; source B settles it.
2. ME-2 is an open seat, Rep. Jared Golden announced in November 2025 that he would not seek
   reelection. Both sources agree on Dunlap (D) and LePage (R). Source A adds the detail, which
   source B corroborates as a primary win, that Dunlap won through a **ranked choice runoff**,
   52.5% to 47.5% over Joe Baldacci, because no candidate cleared 50% on first preferences.
3. Maine runs both the primary and the general with ranked choice voting. Noted in both
   statusNotes since it affects how a reader should interpret a two-name field.

**District by district comparison, source B read first. Both districts.**

D1 B: Pingree (D inc, unopposed), Russell (R). Written: same 2. Source A had 3 names.
   MISMATCH, finding 1.
D2 B: Dunlap (D, RCV runoff winner), LePage (R). Open seat. Written: same 2. MATCH.

Mechanical: json.tool clean, all 4 advancing ids resolve, 2 + 0 = 2 seats, no empty advancing
array, no em-dash in any statusNote.

No curated candidate entries needed; every Maine nominee matched an FEC filer.

### ND, done 2026-08-15. 1 written, 0 quarantined. New file created.

`data/curated/ND.json` did not exist. Created. The race key is **`ND-house-at-large`**, per the
section 5 rule for single-district states, not `ND-house-1`, and the curated candidate id uses the
same district string: `nd-house-at-large-neville`.

Source A: Wikipedia. Note the article title for a single-seat state is **"election"** singular,
`2026_United_States_House_of_Representatives_election_in_North_Dakota`. The plural form used for
every other state in my list returns a not-found error.
Source B: The Green Papers North Dakota 2026 general election page and Politics1.

**What the verify gate caught:**

1. **Source A omits the independent.** Wikipedia gives a two way race, Fedorchak (R) vs Hammer
   (D-NPL). Both source B rosters carry a third candidate, **Helene Neville**. Included.
2. Both source B rosters agree Neville is on the ballot but label her differently: Politics1 says
   independent, The Green Papers says "Independence" and adds a confusing note that she has a
   Democratic-Nonpartisan League affiliation. Written as independent per Politics1, which is the
   unambiguous one. Logged below.

**District comparison, source B read first.**

At-large  B: Fedorchak (R inc, renominated over Alex Balazs), Hammer (Democratic-NPL), Neville (I).
   Written: same 3. Source A had 2. MISMATCH, finding 1.

Mechanical: json.tool clean, all 3 advancing ids resolve, 1 + 0 = 1 seat, no empty advancing array,
no em-dash in the statusNote, key is `at-large`.

1 curated candidate entry added: ND at-large Neville.

ADDITIONS TO UNRESOLVED MINOR LINES (ND):
* ND at-large, Helene Neville. Included, but the two rosters disagree on her label, independent
  versus "Independence" with a Democratic-NPL note. Both agree she is on the ballot. Worth a hand
  check against the North Dakota Secretary of State.

## QUARANTINED

* **OR-5.** Sources disagree on the Republican nominee. Wikipedia and The Green Papers say
  Patti J. Adair; Politics1 and Ballotpedia say Jonathan Lockwood. Both are Republican filers in
  the FEC file so it cannot break the tie, and the Oregon Secretary of State publishes no
  reachable 2026 primary result. The minor-party field is also in dispute: Joseph Lehman is
  Libertarian in two rosters and Republican in a third. No race entry written.

## UNRESOLVED MINOR LINES, named by one source only, deliberately left out

* NY-1, Thomas Sorensen: on the ballot per two sources but spelled "Sorenson" by one of them.
  Written with the Politics1 spelling. Worth a hand check.
* NY-8, Sahir Ahsan, listed as a declared write-in, not a ballot line.
* NY-12, Robb Huhn (West Side Rag, pre-primary) and Amy Jordan (Politics1). Excluded.
* NY-13, Bob Cohen (Working Families, Politics1) and Candace Niles (independent, iVoterGuide).
  Excluded.
* NY-15, Star Davis (Politics1), John Maynard Harris (iVoterGuide), Jose Vega (iVoterGuide).
  Excluded.

New York has **not** published a November 3, 2026 general election ballot certification as of
today, so no independent or minor-party line in the state is officially final. The major-party
nominees are not affected.

## Notes on states I do not own

(none yet)
