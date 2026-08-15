# House names-only sweep, chat 2 progress

States, in order: TX, PA, NC, VA, IN, MD, WI, KY, AR, MS, NE, ID, WV, VT. 127 districts.
Progress file for chat 2 only. Chat 1 and chat 3 own everything else.

## Method note, written before Texas, applies to every state below

The run book says source A is the Wikipedia page
`2026_United_States_House_of_Representatives_elections_in_<State>` and source B is the
state's Ballotpedia 2026 U.S. House page. Both assumptions broke on Texas and the
substitutions below are used for the rest of the run. Every substitution is recorded
per state.

1. **Wikipedia state pages truncate.** The fetch tool returns only the first part of a
   long page. On Texas the content stopped after district 16 or 17, and every request
   for districts 17 to 38 returned "not in content" no matter how the question was
   phrased. Mobile domain, the API endpoints and `Special:Export` are all blocked as
   cache only. So Wikipedia is a usable source A only for the districts it actually
   returns, and that limit has to be probed per state.
2. **Wikipedia state pages are not uniformly current.** Texas has March 3 primary
   result tables for the districts it returns. Pennsylvania has none: its district
   sections list declared primary candidates with campaign finance as of Dec 31 2025,
   so it cannot establish a May 19 2026 nominee.
3. **The Ballotpedia statewide U.S. House page renders no candidate names** through the
   fetch tool. Only the per district pages carry names, so source B has to be fetched
   one district at a time.
4. **Ballotpedia per district pages are stale for Texas.** 20 of the 22 Texas district
   pages fetched still say "general election candidates will be added here following the
   primary" five months after the March 3 primary. They do carry convention nominated
   minor party candidates and some independents, which turned out to matter.
5. **Substitution.** Source B is Ballotpedia per district where that state's pages are
   populated, tested on one district before committing the state. Where they are not,
   source B is `election2026.net/<state>-2026/`, an independent per district list of
   November nominees, and Ballotpedia per district becomes the third source used to
   settle mismatches. On Texas that aggregator agreed with Wikipedia on 13 of the 16
   districts where both had data, and independently matched Ballotpedia on TX-1
   Canchola, TX-25, TX-30 Nordberg, TX-34 Royal and Espinoza, and matched Texas Tribune
   runoff reporting on TX-9 Mealer and TX-18 Menefee. That cross agreement is why it is
   trusted as a second source and never as a lone one.
6. **Single sourced districts are quarantined.** Where only one of the two sources has
   the field, or the two disagree and the third cannot settle it, the district gets no
   race entry.

Also worth knowing: the fetch tool's summarizer is not reliable for structured
extraction. Two calls against the same cached Texas page gave contradicting answers,
one of them inventing a "general election winner" for an election that has not
happened. Narrow single district questions are stable, broad ones are not. Every name
written below survived two independent sources.

---

## TX, done 2026-08-14

Districts written: 15. Districts quarantined: 23. Seats: 38. 15 + 23 = 38.

Source A: Wikipedia, districts 1 to 16 only, page truncates past that.
Source B: election2026.net Texas 2026, all 38 districts.
Third source used: Ballotpedia per district, 22 pages fetched.
Texas SoS publishes no November 2026 certified list yet, checked and confirmed.

Written: 1, 2, 3, 4, 6, 7, 8, 10, 11, 13, 14, 15, 16, 25, 34.

What the verify gate caught:

* **TX-34 was already in the repo and was wrong by omission.** Its `advancing` had only
  Gonzalez and Eric Flores. Ballotpedia and election2026.net both show Libertarian Chris
  Royal, nominated by convention April 12 2026, and Green Eddie Espinoza, nominated
  April 11 2026, on the November ballot. Fixed: both added as curated entries, statusNote
  extended, and a `sources` array added, which the entry had been missing entirely.
  This is the equal treatment rule from the Montana Senate race, and it was being broken.
* **TX-16 nominee has no FEC record.** Wikipedia and election2026.net both name Adam
  Bauman as the Republican. He appears nowhere in `data/fec/TX.json`, whose only TX-16
  Republicans are Berrios, Cabildo and Barraza. Two sources, so a curated entry, not a
  quarantine.
* **TX-25 FEC Democrat does not match either source.** `data/fec/TX.json` has William
  James Marks as the only TX-25 Democrat. Ballotpedia and election2026.net both give
  Dione Sims. Curated entry for Sims; Marks will fall to not-advancing, which is the
  correct outcome if Sims won the primary.
* **TX-5 has the same person filed twice.** Chelsey Alexandra Hockett is both
  `fec-H6TX05197` and `fec-H6TX05189`. She is the Democratic nominee, so the ambiguity
  lands directly in `advancing` and there is no way to pick. Quarantined.
* **TX-1 was under-read from Wikipedia.** The Wikipedia fetch returned only Moran.
  Ballotpedia and election2026.net both add Yolanda Prince (D), who is in FEC, and
  independent Sonia Canchola, who is not. Written with all three.
* **Duplicate FEC filers that did not matter:** TX-10 Sarah Eckhardt and Robert Brown,
  TX-14 Konstantinos Vogiatzis. None of them is a nominee, so `advancing` is unaffected.
  Logged, not fixed, per section 9's spirit.
* **Ballotpedia lists Dan McQueen as an independent general election candidate in both
  TX-21 and TX-27.** He cannot be on both ballots. This is why TX-21 was quarantined
  despite its page being the one Texas page marked finalized.

### QUARANTINED

* TX-5, two FEC filers for the Democratic nominee Chelsey Hockett and no way to choose
  between `fec-H6TX05197` and `fec-H6TX05189`.
* TX-9, sources disagree on the field. election2026.net gives Mealer (R) and Gutierrez
  (D). Ballotpedia additionally lists independent Roy Morales, who is in FEC as an
  independent in district 9. Wikipedia is truncated here and cannot settle it.
* TX-12, the Democratic nominee's name does not resolve. Wikipedia says Angela Rodriguez
  Prilliman, election2026.net says Heli Rodriguez Prilliman, and the only TX-12 Democrat
  in FEC is Kenneth Morgan-Aguilera. Three sources, three answers.
* TX-17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37, 38.
  All the same reason: Wikipedia truncates past 16, so there is only one source with a
  full field. Ballotpedia per district was fetched for 17 to 24 and 26 to 34 and is not
  finalized on any of them except 21, which contradicts itself as noted above. TX-19 is
  worse than merely single sourced: election2026.net gives Tom Sell as the Republican
  while Ballotpedia still shows incumbent Jodey Arrington in the primary.

Nothing seen in another chat's states.

---

## PA, done 2026-08-14

Districts written: 14. Districts quarantined: 3. Seats: 17. 14 + 3 = 17.

Source A: election2026.net Pennsylvania 2026, all 17 districts.
Source B: Wikipedia PA page, plus Ballotpedia per district on 9 districts.
Wikipedia PA has no May 19 primary results at all, only declared candidate lists with
campaign finance as of Dec 31 2025. Ballotpedia PA pages are pre primary too: they say
outright that they are "combining all declared candidates for this election into one
list under a general election heading". So for PA neither B source can confirm who won
a primary. What they can and did confirm is identity, party, district and, importantly,
the independents and minor party candidates who are on the November ballot. Every name
written for PA is corroborated as a candidate of that party in that district by at least
one source other than the one it was written from, usually two. **What is single sourced
for PA is the claim that a given person won their primary.** That is the thing for a
second person to re-check.

Written: 2, 3, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17.

What the verify gate caught:

* **The Wikipedia summarizer put three people in the wrong party.** It reported Salem
  Snow as the PA-2 Republican; Ballotpedia has Snow in the Democratic primary against
  Boyle, and the actual Republican is Jessica Arriaga. It reported Melvin Lee Campbell Jr.
  as the PA-5 Republican; Ballotpedia has Campbell as a Democrat and the Republican is
  Nicholas Manganaro, who is in FEC. It reported Nicholas Singelis as a PA-16 Republican;
  Ballotpedia has him as an independent general election candidate. All three were caught
  only because source B was read district by district.
* **Wikipedia named two PA-3 "general election candidates", Alex Schnell and Sheila E.
  Armstrong, who exist in no other source.** Not in FEC, not on Ballotpedia's PA-3 page,
  not on election2026.net. PA-3 has no Republican at all in FEC or on Ballotpedia. Written
  without them and flagged here.
* **Wikipedia listed a PA-10 independent, Steven Long, who is a 2022 write in.**
  Ballotpedia's PA-10 page confirms Long is not a 2026 candidate. The real independent is
  Isabelle Harman, who is in FEC.
* Four November candidates have no FEC record and are written as curated entries:
  Jessica Arriaga (PA-2, R), Jeffrey Wilder (PA-11, I), Adam Halfhill (PA-14, American
  Independent) and Nick Singelis (PA-16, I). All four are on Ballotpedia's general
  election list for their district.

### QUARANTINED

* PA-1, field does not agree. election2026.net has Libertarian Jamie Frost Remmey on the
  ballot; she appears in no other source, and Ballotpedia's PA-1 general list has only
  independent John Hoban alongside Fitzpatrick and Harvie.
* PA-4, the Republican does not resolve. election2026.net says Aurora Stuski, who appears
  nowhere else. Ballotpedia says Ismaine Ayouaz, Wikipedia says Michael Anthony Murphy and
  Ayouaz, and neither Ayouaz nor Murphy nor Stuski is in FEC.
* PA-7, two of the three minor candidates are single sourced. election2026.net has
  independents Frank Golden and Ramon Granados plus Green Andrew Tupone; Ballotpedia's
  PA-7 general list has only Granados, and neither Golden nor Tupone is in FEC.

---

## NC, done 2026-08-14

Districts written: 11. Districts quarantined: 3. Seats: 14. 11 + 3 = 14.

Source A: election2026.net North Carolina 2026, all 14 districts.
Source B: Wikipedia NC page, which unlike PA does carry a usable per district November
field, plus Ballotpedia per district on the six districts where A and B disagreed.
North Carolina was the best behaved state so far: A and B agreed outright on 7 of 14.

Written: 1, 2, 3, 4, 5, 6, 9, 10, 12, 13, 14.

What the verify gate caught:

* **Two minor party candidates were in the wrong party in Wikipedia.** It has Josh Hager
  as a Republican in NC-6; Ballotpedia and election2026.net both have Joshua Hager as an
  independent. It has Bo Whitehead as a Republican in NC-8; election2026.net has him as
  a Green. Party is exactly what this app matches on, so these are not cosmetic.
* **Wikipedia has a write-in candidate in NC-2, Brian McGinnis, who is not on the
  ballot.** Ballotpedia's NC-2 page names the general election field explicitly as Ross,
  Douglass and Laszacs, and does not mention him at all. He is in `data/fec/NC.json` as
  an independent, so the FEC record alone would have been misleading. Written without him.
* **Ballotpedia's NC-13 page names Frank Pierce as the Democrat.** Wikipedia and
  election2026.net both say Paul Barringer, who is the only NC-13 Democrat in FEC besides
  Alexander Nicholi. Two against one, written as Barringer, but this is a real
  disagreement and belongs on the re-check list.
* **NC-12 has an independent in FEC, Ryan Rabah, who no source has on the November
  ballot.** Not written. Logged.
* Nine November candidates have no FEC record and are written as curated entries, all
  Libertarians and independents. Minor party candidates are systematically missing from
  the FEC data, which means a party-blind app that trusted FEC alone would silently drop
  every one of them.

### QUARANTINED

* NC-7, field does not agree. election2026.net has independent Michael Henry on the
  ballot; he is in no other source, and Ballotpedia's NC-7 general list is only Hardy and
  Abu-Ghazalah, omitting even incumbent David Rouzer.
* NC-8, the same person is filed twice in FEC. Mark E Harris is both `fec-H4NC08066`,
  marked incumbent, and `fec-H6NC09200`. He is the Republican nominee, so the ambiguity
  lands in `advancing`.
* NC-11, sources disagree on whether the Republican incumbent is on the ballot.
  election2026.net omits Chuck Edwards entirely and gives Ager, Rogers and Groo.
  Ballotpedia confirms only independent John Rogers for the general and still shows
  Edwards in the March 3 Republican primary. Wikipedia has Edwards, Ager and Groo.

---

## VA, done 2026-08-14

Districts written: 3. Districts quarantined: 8. Seats: 11. 3 + 8 = 11.

Source A: election2026.net Virginia 2026. Source B: Wikipedia VA page, which is entirely
pre primary, plus Ballotpedia per district on VA-10 and VA-11.

Written: 1, 6, 8.

Virginia is the worst state in this run and the reason is not subtle: nothing accessible
has June 16, 2026 primary results, and election2026.net lists petition independents in
eight of eleven districts that no other source has heard of.

What the verify gate caught:

* **Three sources give three different VA-11 Republicans.** election2026.net says Arthur
  Purves, who is in FEC. Ballotpedia says Nathan Headrick and Michael Van Meter, neither
  of whom is in FEC. Wikipedia says Gavin Solomon, who is in no Virginia source at all.
* **"Gavin Solomon" also turns up as a WI-3 independent in the Wikipedia fetch for
  Wisconsin.** The same invented name appearing in two unrelated states is the clearest
  evidence in this run that the fetch tool's summarizer fabricates names under load.
  Anything sourced only to a broad Wikipedia fetch should be treated as unverified.
* **VA-10 has four Republicans in FEC and no agreement on which is the nominee.**
  election2026.net says David Beckwith, Wikipedia says Sam Wong, both are in FEC, and
  Ballotpedia lists no Republican at all.
* VA-8 has an independent in FEC, Tim Sharman, who no narrative source has on the ballot.
  Same treatment as NC-12 Rabah: not written, logged.

### QUARANTINED

* VA-2, three independents (DeVinche Albritton, Makiba Gaines, Bishop Staten) single sourced.
* VA-3, Republican does not resolve, election2026.net says Edwin Rivera and Wikipedia says
  Justin Maffett; independent James Taylor single sourced; FEC has a second independent,
  Stephen Woll, that no source has on the ballot.
* VA-4, independent Jason Brown single sourced.
* VA-5, independents Cooke Harvey and Chris Register single sourced.
* VA-7, independent Alaha Ahrar single sourced.
* VA-9, independent Michael Jackson single sourced.
* VA-10, Republican does not resolve, see above.
* VA-11, Republican does not resolve, see above.

---

## IN, done 2026-08-14

Districts written: 5. Districts quarantined: 4. Seats: 9. 5 + 4 = 9.
`data/curated/IN.json` did not exist and was created by this run.

Source A: election2026.net Indiana 2026. Source B: Wikipedia IN page, which carries a
clean November field including Libertarians and independents. A and B agreed outright on
5 of 9.

Written: 3, 5, 6, 7, 9. Four curated entries for candidates with no FEC record:
Phillip Beachy (IN-3, I), Patrick McAuley (IN-7, R), James Sceniak (IN-7, L),
Tonya Hudson (IN-9, L).

### QUARANTINED

* IN-1, independents Alexander Degman and James Johnson single sourced.
* IN-2, independent Eric Beebe single sourced.
* IN-4, independent David Bokash single sourced.
* IN-8, independent James Burke single sourced.

---

## MD, done 2026-08-14

Districts written: 5. Districts quarantined: 3. Seats: 8. 5 + 3 = 8.

Source A: election2026.net Maryland 2026. Source B: Wikipedia MD page, pre primary, which
reports the Democratic nominee as TBD in five of eight districts but does carry the Green
and independent candidates. Written where every named candidate is corroborated by FEC or
Wikipedia and no source names a competing nominee.

Written: 2, 3, 6, 7, 8. Three curated entries: Moshe Landman (MD-6, Green),
Scott Collier (MD-7, R), Nancy Wallace (MD-8, Green).

* **Section 9's Maryland glitch confirmed and not fixed.** `data/fec/MD.json` has nine
  district keys for eight seats: 1 through 8 plus a district literally keyed `at-large`
  holding one filer. Logged only.

### QUARANTINED

* MD-1, independent Edward Shlikas single sourced.
* MD-4, Green Sam Husseini single sourced.
* MD-5, Republican Chris Chaffee appears in no other source and is not in FEC, whose only
  MD-5 Republican is Michelle Talkington; independent Mildred Hall single sourced; and the
  Democratic nominee is one of nineteen filers with no source naming a winner.

---

## WI, done 2026-08-14

Districts written: 3. Districts quarantined: 5. Seats: 8. 3 + 5 = 8.

Wisconsin's primary was August 11, 2026, three days before this run. Neither source has
results: both still list every declared candidate per party. Only the districts where each
party had exactly one candidate could be written.

Written: 2, 5, and 3, which was already in the repo.

* **WI-3 was already in the repo and asserts an Aug 11 primary result** (Rebecca Cooke
  60.4% over Emily Berge) that neither of this run's sources can confirm, and it has no
  `sources` array. Left exactly as found, not touched, flagged here for re-check.
* **WI-6 has the same person filed twice**, Amanda H Bell as `fec-H6WI06225` and
  `fec-H6WI06217`. WI-6 is quarantined for other reasons anyway.
* Curated entry: Douglas Alexander (WI-2, R), the only Republican filed, no FEC record.

### QUARANTINED

* WI-1, four Democrats filed and no primary result available.
* WI-4, multiple candidates in both parties, plus independents that do not match between
  sources.
* WI-6, two Democrats, two independents, and a Green that only one source has.
* WI-7, six Republicans and three Democrats filed, no result.
* WI-8, three Democrats filed, no result.

---

## KY, done 2026-08-14

Districts written: 1. Districts quarantined: 5. Seats: 6. 1 + 5 = 6.

Source A: election2026.net Kentucky 2026. Source B: Wikipedia KY page, which does report
May 19, 2026 primary results, so the major party nominees in Kentucky are the best
sourced in this run. The problem is entirely independents.

Written: 1.

* **election2026.net lists independents in five of six Kentucky districts and Wikipedia
  lists none anywhere in the state.** A spot check settled it against the aggregator:
  Ballotpedia's KY-6 page names Jay Bowman and Pete Lynch as general election candidates
  and does not have Robert Quigley, whom election2026.net also lists. So that source is
  right about some independents and wrong about others in the same district, which is
  exactly why none of them can be taken on its word alone.
* Notable and now unpublishable: **KY-4, where Ed Gallrein beat incumbent Thomas Massie
  54.9% to 45.1% in the Republican primary.** Both sources agree on Gallrein, Melissa
  Strange (D) and Libertarian Jeremy Todd. It is quarantined only because
  election2026.net adds independent Mohammad Wael Ahmad, who is in no other source and
  whom Ballotpedia's KY-4 page does not mention.

### QUARANTINED

* KY-2, independent Thomas Loecken single sourced.
* KY-3, independent Oumou Diallo single sourced.
* KY-4, independent Mohammad Wael Ahmad single sourced, see above.
* KY-5, independents Gerardo Serrano, Mikel Wein and Billy Ray Wilson single sourced.
* KY-6, independent Robert Quigley single sourced and contradicted by Ballotpedia, which
  confirms only Bowman and Lynch.

---

## AR, done 2026-08-14

Districts written: 3. Districts quarantined: 1. Seats: 4. 3 + 1 = 4.

Source A: election2026.net Arkansas 2026. Source B: Wikipedia AR page. Neither reports
March 3 primary results, but three of four districts have one candidate per party in
both sources.

Written: 1, 2, 4. Curated entry: Steve Parsons (AR-1, Libertarian).

### QUARANTINED

* AR-3, Wikipedia has independent Christopher Hocevar on the November ballot and
  election2026.net does not. This one runs the other way from the usual pattern, the
  extra name is Wikipedia's.

---

## MS, done 2026-08-14

Districts written: 2. Districts quarantined: 2. Seats: 4. 2 + 2 = 4.

Source A: election2026.net Mississippi 2026. Source B: Wikipedia MS page. Primary was
March 10, 2026 with April 7 runoffs; neither source reports tallies.

Written: 3, 4. Curated entry: Erik Kiehle (MS-3, Libertarian).

### QUARANTINED

* MS-1, Libertarian Johnny Baucom single sourced.
* MS-2, independent Bennie Foster single sourced.

---

## NE, done 2026-08-14

Districts written: 1. Districts quarantined: 2. Seats: 3. 1 + 2 = 3.

Source A: election2026.net Nebraska 2026. Source B: Wikipedia NE page, which reports
May 12, 2026 primary results.

Written: 2, the open Bacon seat. Curated entry: Eric Foreman (NE-2, Libertarian).

### QUARANTINED

* NE-1, Wikipedia has independent Austin Ahlman on the ballot, election2026.net does not.
* NE-3, the two sources give David Else different parties, Legal Marijuana Now on
  Wikipedia versus independent on election2026.net, and Wikipedia adds independent Macey
  Budke.

---

## ID, done 2026-08-14

Districts written: 0. Districts quarantined: 2. Seats: 2. 0 + 2 = 2.

Neither source is usable for Idaho. Wikipedia has no May 19 primary results and lists two
Republicans and two Democrats in ID-2. election2026.net's ID-2 list contains an entry
named "Idaho Law", which is not a person, and that alone disqualifies the field.

### QUARANTINED

* ID-1, Brendan Gomez is Constitution Party on Wikipedia and independent on
  election2026.net, and Wikipedia has a second Democrat with no primary result.
* ID-2, both parties have multiple candidates with no result, the two sources disagree on
  the minor party field, and one source lists a non-person.

---

## WV, done 2026-08-14

Districts written: 2. Districts quarantined: 0. Seats: 2. 2 + 0 = 2.
The only state in this run with full coverage.

Source A: election2026.net West Virginia 2026. Source B: Wikipedia WV page, which reports
May 12, 2026 primary results with percentages. Third source: Ballotpedia per district,
which resolved the independents in both districts.

Written: 1, 2. Curated entries: Isaiah Rucker (WV-1, I), Christopher Whitcomb (WV-2, I).

* **A stale candidate was caught and removed.** election2026.net has Belinda Fox-Spencer
  as a WV-1 independent. Ballotpedia's WV-1 page confirms she was an independent candidate
  in the **2022** general election and is not a 2026 candidate. Written without her.
  Ballotpedia's WV-2 page likewise has no Patrick Carney, whom election2026.net lists.
  Because the Ballotpedia district pages in West Virginia are exactly where independents
  appear before the majors are added, their absence there is meaningful and was treated as
  resolving the mismatch rather than as silence.

---

## VT, done 2026-08-14

Districts written: 0. Districts quarantined: 1. Seats: 1. 0 + 1 = 1.

* **The run book's URL pattern is wrong for single district states.** Vermont's article is
  `2026_United_States_House_of_Representatives_election_in_Vermont`, singular "election".
  The plural form the run book gives returns not found. Worth fixing in the run book for
  ND and SD, which belong to chats 3 and 1.
* The headline race is settled and well sourced: Vermont Public reports Gerald Malloy won
  the August 11, 2026 Republican primary 77% to 22% over Mark Coester and will face
  Rep. Becca Balint (D), who was unopposed. Both are in FEC.

### QUARANTINED

* VT at-large. election2026.net lists four independents, Adam Ortiz, Suzanne Seymour, Ryan
  Walton and Andrew Giusto, that appear in no other source. Ballotpedia's Vermont at-large
  page cannot be fetched at all, it returns a robots.txt failure, and the Vermont Secretary
  of State candidate page carries filing instructions rather than the certified roster. So
  there is no third source able to settle whether those four are on the ballot, and the
  field cannot be closed. The two major party nominees are not in doubt; the field is.

---

## Run totals

| State | Written | Quarantined | Seats |
|---|---|---|---|
| TX | 15 | 23 | 38 |
| PA | 14 | 3 | 17 |
| NC | 11 | 3 | 14 |
| VA | 3 | 8 | 11 |
| IN | 5 | 4 | 9 |
| MD | 5 | 3 | 8 |
| WI | 3 | 5 | 8 |
| KY | 1 | 5 | 6 |
| AR | 3 | 1 | 4 |
| MS | 2 | 2 | 4 |
| NE | 1 | 2 | 3 |
| ID | 0 | 2 | 2 |
| WV | 2 | 0 | 2 |
| VT | 0 | 1 | 1 |
| **Total** | **65** | **62** | **127** |

Two of the 65 written entries, TX-34 and WI-3, were already in the repo before this run.
TX-34 was corrected; WI-3 was left untouched.

Files written: `data/curated/` TX, PA, NC, VA, IN, MD, WI, KY, AR, MS, NE, WV.
ID and VT have no written districts, so those files were not touched.
No file outside this chat's states was opened for writing, `data/fec/*.json` was not
modified, `apps/mobile/src/screens/Browse.js` was not touched, section 6 was skipped,
and no git command was run.
