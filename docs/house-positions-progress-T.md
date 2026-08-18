# House positions pass, chat T (TX then NY)

Started Aug 17, 2026. States: TX (38 districts, 85 candidates), then NY (26 districts, 62 candidates).

Preconditions checked at start: data/curated/TX.json has 38 House race entries (40 races
minus TX-senate and TX-governor), data/curated/NY.json has 26 (27 minus NY-governor). Both match.

Method: House Positions Run Book, plus docs/curation-agent-guide.md. Identity fields
(name, party, district, state, office, incumbent) are copied from data/fec/<STATE>.json by the
merge script and never from a web page, because at least one aggregator swaps party labels on
Texas races. A race is written only when every advancing candidate is researched to equal depth.

## Log

### TX

- **TX-01** NOT WRITTEN, quarantined. Sonia Canchola (Independent, no FEC record) has no campaign
  site, no survey, no coverage, and does not appear in the Texas SOS 2026 independent declaration
  tracking file. Moran and Prince were researched and would have scored 9 and 8, but writing two of
  three candidates would have hidden Canchola from Browse and Races, so the race stays names-only.
- **TX-02** done. Toth 8 scored 2 null, Finnie 6 scored 4 null. Finnie's own issues page is video
  only with no transcript, so his scores lean on his home page and named interviews. capitol.texas.gov
  is robots-blocked, so no Texas roll calls could be cited for Toth.
- **TX-03** done. Self 9 scored 1 null, Hunt 9 scored 1 null. Four Self axes rest on clerk.house.gov
  roll calls. DISCREPANCY LOGGED, NOT FIXED: the FEC record has Keith Self incumbent false, but he is
  the sitting TX-03 member. Identity copied from FEC as required.
- **TX-04** done. Fallon 9 scored 1 null, Pearce 6 scored 4 null. fallon.house.gov issue pages are
  unpopulated placeholders and his campaign issue pages are video only, so two Fallon axes rest on
  Ballotpedia campaign themes. battlegroundvote.com asserts a Pearce immigration stance with no
  citation, so immigration stayed null rather than being scored off an uncited aggregator.
- **TX-05** done. Gooden 9 scored 1 null, Hockett 10 scored 0 null. Three Gooden axes rest on fetched
  roll calls. Could not verify the May 26, 2026 runoff on an official results page. Ballotpedia's
  TX-05 general page also lists Dea Foy (Independent), who is not in the race advancing array; flagged
  for the audit chat, not acted on.
- **TX-06** done. Ellzey 9 scored 1 null, Minton 8 scored 2 null. Minton's campaign domain does not
  resolve and both Fort Worth Report and his Ballotpedia survey are robots-blocked. Name note: the FEC
  record reads John Kevin Sr. Ellzey while every source says Jake Ellzey. FEC value kept.

- **TX-07** done. Fletcher 10/0, Hale 9/1, Ngabo (Green) 8/2. Three-candidate race, minor party given
  the same ten-axis hunt. Fletcher has three documented 0 scores, both sides quoted in each label.
- **TX-08** done. Steinmann 8/2, Jones 6/4. Steinmann's campaign site blocks automated retrieval in
  robots.txt, so her scores come from Ballotpedia, BallotReady, a Community Impact Q and A and an
  endorsement page. Her repro score rests on a group endorsement rather than her own words; flagged.
- **TX-09** done, after a second research round. First pass came back Mealer 6 scored, Gutierrez 3,
  a gap of 3, which is exactly the denominator risk the audit chat screens for, so I sent it back for
  a focused second hunt on Gutierrez alone. Health moved to -1 on a League of Women Voters Houston
  questionnaire answer and the climate citation was upgraded to a Houston Defender interview quote.
  Final 6 versus 4. Her Ballotpedia page returns robots-disallowed on every attempt while her
  opponent's loads, her campaign issues page body is unpublished placeholder text, and archive.org
  is refused by the egress proxy, so six axes stay null with notes naming both rounds.
- **TX-10** done. Gober 6/4, Rourk 6/4. Rourk's issues page is a JavaScript app that never renders to
  a fetch, so two of her scores are cited to BallotReady's verbatim quotes of it.
- **TX-11** done. Pfluger 10/0, Reynolds 7/3. Nine Pfluger axes rest on fetched roll calls and a
  hearing transcript. His housing score rests on a Republican Study Committee framework page he issued
  as chairman rather than a personal statement; weakest of the ten, flagged.
- **TX-12** done. Goldman 9/1, Prilliman 6/4. An aggregator asserts a Prilliman repro position with no
  quote or source, so repro stayed null.
- **TX-13** done. Jackson 7/3, Nair 5/5. Nair's platform has twelve sections and none of them touch
  taxes, climate, safety, repro or democracy. His climate line names global heating with no policy
  attached, so it was left null rather than inferred.
- **TX-14** done. Weber 9/1, Bartie 6/4. Six Weber axes rest on fetched roll calls including the
  January 2021 Pennsylvania elector objection.

### METHOD CHANGE mid-run: the overlap floor (run book section 4a, added Aug 16)

The run book was revised while this session was running. Section 4a replaces the balance rule
I had been working under. Comparing how many axes each candidate has is the wrong instrument,
because computeMatch gives every candidate their own denominator. What matters is the OVERLAP:
the count of axes where EVERY advancing candidate in the race has a non-null value. Two
candidates can each be scored 7 of 10 and overlap on only 4, and then their two percentages
are built from partly different questions.

Applied from here on, and applied retroactively to every race already written:
overlap 7 or more flips to general, 5 or 6 gets one targeted round aimed only at the
one-sided axes on the candidate missing them, 4 or less stays names-only.

The merge script now computes the overlap itself and refuses to flip a race below 7, so this
cannot be forgotten on a later race. Research prompts were updated with the overlap floor and
with the three tightened source rules: one URL must not carry four or more of a candidate's
axes, an incumbent is never scored from Wikipedia or an aggregator on an axis where a roll call
exists (clerk.house.gov/evs/YYYY/rollNNN.xml is fetchable, congress.gov and govtrack are not),
and one sentence scores one axis, never two.

**REVERTED from general back to names-only** (research kept in place, only the race status
changed, so the app stops showing match percentages until the overlap is there):

| race | overlap | why |
|---|---|---|
| TX-02 | 4 | Toth missing cost and housing, Finnie missing taxes, climate, safety, democracy |
| TX-04 | 6 after a targeted round | Fallon housing closed via roll call, Pearce still missing immigration, climate, safety, repro |
| TX-08 | 4 | Steinmann missing health and housing, Jones missing immigration, climate, safety, democracy |
| TX-09 | 2 | worst in the state, only immigration and climate are two-sided |
| TX-10 | 3 | six of ten axes one-sided, split evenly in both directions |
| TX-12 | 6 after a targeted round | Prilliman still missing climate, safety, repro |
| TX-13 | 3 | Jackson missing cost, housing, safety, Nair missing taxes, climate, repro, democracy |

**Held at names-only on first write** (never flipped): TX-15 overlap 3, TX-16 overlap 5 after a
targeted round, TX-17 overlap 4, TX-22 overlap 3, TX-23 overlap 0, TX-24 overlap 5 after a
targeted round, TX-25 overlap 5 after a targeted round.

**Targeted rounds that worked**: TX-14 went 5 to 7 (Weber housing from roll call 57 of 2026 on
H.R. 6644, Bartie climate from his Port Arthur LNG record as mayor) and flipped. TX-20 went 5 to
7 (Castro cost from his Nay on S.J.Res. 18 on the CFPB overdraft rule, roll 96 of 2025, and
housing from roll 224 of 2026) and flipped. TX-04 went 5 to 6 and did not clear.

**Flipped to general and still standing**: TX-03 overlap 8, TX-05 overlap 9, TX-06 overlap 8,
TX-07 overlap 7, TX-11 overlap 7, TX-14 overlap 7, TX-20 overlap 7, TX-21 overlap 7.

### Section 9 flags raised at write time, for the audit chat

One URL carrying four or more axes, which rule 3b now forbids:
Hockett TX-05 all ten axes on chelseyhockettforcongress.com/issues; Ngabo TX-07 eight on
espoirfortexas.com/platform; Bartie TX-14 six on votebartie.org/where, confirmed unfixable, the
page is genuinely flat with no anchors or subpages; Toth TX-02 five, Hale TX-07 five on a bare
homepage, Gober TX-10 five on a bare homepage, Nair TX-13 five; Finnie, Hunt, Minton, Steinmann,
Jones, Rourk four each. The bare-homepage ones are the real defects; a genuine multi-section
issues page is a weaker version of the same flag.

Incumbent scored from an aggregator on an axis where a roll call may exist: Fallon TX-04 on
education and repro. Fixed on housing this session by going to the roll call; education and
repro not yet re-sourced.

### TX races 15 to 25

- **TX-15** written, held names-only, overlap 3. De La Cruz 8 scored, Pulido 3. Pulido's site is
  JavaScript only with one lander page, his Ballotpedia page is empty and his survey is not
  completed, so only the race page's key messages exist for him.
- **TX-16** written, held names-only, overlap 5 after a targeted round. Escobar 10, Bauman 5. His
  site is a Wix build whose sitemap exposes only donate, booking, blog and two unedited template
  drafts. Two flags: elpasogop.org now redirects to an unrelated parked domain, and Ballotpedia's
  TX-16 race page names the Republican as Deliris Montanez, contradicting the roster. FEC identity
  kept, contradiction logged not fixed.
- **TX-17** written, held names-only, overlap 4. Sessions 9, Shepard 5.
- **TX-18** NOT WRITTEN, quarantined. Menefee 10 scored, Whitfield 0. Whitfield has no reachable
  site, a blank Ballotpedia page, no survey, no office held and no coverage stating a position.
  Discrepancy logged not fixed: the FEC record has Menefee incumbent false, but he was sworn in
  for TX-18 in February 2026.
- **TX-19** NOT WRITTEN, quarantined. Sell 0 scored, Rable 4. Three candidate domains for Sell are
  unregistered or parked, his Ballotpedia themes are empty, his survey is unanswered and he has
  never held office.
- **TX-20** done, flipped, overlap 7 after a targeted round. Castro 10, Baez 7.
- **TX-21** done, flipped, overlap 7. Teixeira 9, Hook 7. Ballotpedia lists a third general
  candidate, Dan McQueen (Independent), who is not in the advancing array; flagged for the audit.
- **TX-22** written, held names-only, overlap 3. Nehls 6, Greene-Scott 7, but they are missing
  different axes in both directions. Nehls has no locatable 2026 congressional site; his taxes
  score comes from his older Fort Bend County Judge platform.
- **TX-23** written, held names-only, overlap 0. Herrera 6, Padilla Stout 8, Mendoza 0. Mendoza is
  documented as a candidate by a single San Antonio Report line and has no positions anywhere.
  Ballotpedia's TX-23 page names two different independents and does not mention him; logged.
- **TX-24** written, held names-only, overlap 5 after a targeted round. Van Duyne 10, Burge 5.
  Five of Van Duyne's ten are roll calls. Burge's issues page is unedited template filler.
- **TX-25** written, held names-only, overlap 5 after a targeted round. Williams 8, Sims 6.
  Sims's campaign site is a client-rendered shell that returns only meta tags on every route.

### Standing constraint, hit at TX-15 and every race after

The session's WebSearch budget hit its 200 call cap partway through TX-09 and TX-10 and has been
exhausted for every race since. Research from TX-15 onward ran on direct fetches, sitemaps and
outlet index pages only, with no search discovery. Most search front ends, web.archive.org,
congress.gov, govtrack and Vote Smart are robots-blocked or refused by the egress proxy. This
depresses the hit rate on thinly covered challengers specifically, which is exactly the
population that drives the overlap down. A later session with search budget should re-run the
one-sided axes on every race held at names-only before the audit treats those nulls as settled.

### TX races 26 to 38

- **TX-26** written, names-only, overlap 3. Gill 7 (every score a named roll call, one axis per
  roll call), Shook 7, Gray (Libertarian) 3. Gray has no campaign website at all, confirmed on the
  Libertarian Party of Texas candidate list, so his only source is his Ballotpedia page, and rule
  3b capped him at three axes off that one URL.
- **TX-27** written, names-only, overlap 3. Cloud 8, Lloyd 3. Note for the audit:
  ballotpedia.org/Michael_Cloud is a different person, a Massachusetts Libertarian, and was not
  cited. Ballotpedia's TX-27 page lists an independent, Dan McQueen, absent from the roster.
- **TX-28** NOT WRITTEN, quarantined. Cuellar 8, Tijerina 2, Duran (Green) 0. Duran has no site,
  an empty Ballotpedia profile, and is not on the Green Party of Texas candidate list.
  Contradiction logged not fixed: Ballotpedia's Tijerina profile labels him a Democrat, from his
  county judge office; the FEC record says Republican and the FEC value was kept.
- **TX-29** written, overlap 7 after a targeted round, flipped, then REVERTED by the verify gate to
  overlap 6. Garcia 10 then 9, Fierro 7.
- **TX-30** NOT WRITTEN, quarantined. Haynes 6, Jackson 0. jacksonfortexas.com is a client-rendered
  single page app whose bundle is served as unreadable binary, Ballotpedia has created no profile,
  and with search unavailable there was no route to him.
- **TX-31** written, names-only, overlap 2. Carter 8, Early 7, Stoker (Green) 2. Stoker's real site
  is stokerfortexas.com, not either domain Ballotpedia lists, and it has three sections.
- **TX-32** written, overlap 7, flipped, then REVERTED by the verify gate to overlap 6.
- **TX-33** done, flipped, overlap 8 and still 8 after the gate. Allred 10 then 9, Gillespie 8.
- **TX-34** written, names-only, overlap 1. Four candidates. Gonzalez 9 (nine separate roll calls),
  Flores 4, Royal (Libertarian) 3, Espinoza (Green) 4. Flores's campaign site is priority headings
  with no body text.
- **TX-35** written, names-only, overlap 2. Garcia 3, De La Cruz 4. Both first-time candidates with
  thin sites. "End the Trump tariffs" was left off the cost axis because it maps to neither pole.
- **TX-36** written, names-only, overlap 1. Babin 9, Hart 1. Hart's entire documented platform is
  three items and one of them is guns, which rule 4 excludes from the safety axis.
- **TX-37** written, names-only, overlap 0. Casar 10 from ten separate official issue subpages,
  Pena 0. Her site's sitemap lists nine issue pages and every route returns prerendered metadata
  with no body text.
- **TX-38** written, names-only, overlap 2. Bonck 4, McDonough 8, McMenemy (Green) 7. Contradiction
  logged not fixed: ballotpedia.org/Jon_Bonck places him in Texas's 2nd District, the FEC record
  says 38.

## TX VERIFY GATE

Every scored position in all eleven races that had been flipped to general was re-checked, 190
positions in total. Method: an independent agent per race was given only the candidate name, the
axis and the URL, never the stored score or label, fetched each page, and wrote what the page
documents before any comparison was possible. I then compared and applied the fixes.

**20 corrections applied. Twelve axes nulled, seven rescored, one URL repointed.**

Nulled because the cited page does not document the axis:
Gooden safety (HALT Fentanyl is drug scheduling, passed 312 to 108, no policing or sentencing
content); Pfluger housing (a Republican Study Committee framework page with no statement by him,
and its planks are federal lending, not zoning); Weber housing (H.R. 6644 passed 390 to 9, a
near-unanimous vote documents no direction) and Weber education (the page argues federal versus
local control, no voucher, charter, teacher pay or pre-K content); Castro housing (same bill,
358 to 32); Baez cost and taxes (homepage and Ballotpedia carry no position on either);
Hook cost (the sentence cited is about health care access and was already scored on health,
which rule 3c forbids) and Hook climate (the section is conservation, not climate or energy);
Garcia safety (the cited bill is immigration federalism, nothing on policing or prevention);
Yarbrough safety (the only enforcement sentence was the ICE line already scored on immigration);
Allred education (the affordability plan is community college and Pell, no K-12 content).

Rescored because the page supports something weaker: Gooden cost 2 to 1 and education 2 to 1
(no voucher or charter language anywhere); Minton climate -2 to -1 (his Green New Deal answer is
hedged, incentives only); Hale climate 2 to 1 with the label rewritten, because the stored label
quoted a sentence the page does not contain; Pfluger repro 2 to 1 (Born-Alive imposes infant care
duties rather than restricting access); Teixeira education 2 to 1; Yarbrough democracy 2 to 1
(the page has a biographical line about volunteering against voter fraud, not a voting-rules
position). Hook education repointed from /issues, which renders only headings, to /blank, where
the actual paragraph lives.

**Two verifier findings overturned after I re-fetched the page myself.** Both were decisive, so
neither was taken on trust. The verifier reported Fierro's repro source as containing no abortion
content; the page does contain "helped activate worship leaders and families across Texas to
advocate in support of the Texas Heartbeat legislation", so the score stands. The verifier
reported Baez's safety source as documenting no safety position; the page does contain "we
fiercely support law enforcement and advocate for safer streets". The verifier's raw-HTML grep
missed JavaScript-rendered content in both cases. A gate that is never itself checked is just
another single source.

**Verifier finding recorded but not applied:** eight Ngabo positions came back DEAD because
espoirfortexas.com/platform refused that agent every route. I re-fetched it successfully and it
documents all eight, so the citations stand. Worth knowing that the site serves inconsistently.

**Systematic finding for the audit chat.** Roll call pages carry the bill number, short title and
the member's vote, and no bill text. Every roll call citation in this state was therefore reported
as NOT ON PAGE by a strict reading. I did not strip those, because the run book and the shipped
WA-03 precedent both cite the vote itself as the documented fact. But two things follow that I did
apply: a near-unanimous vote documents no direction and was nulled, and an omnibus vote used for
several axes is weak, since H.R. 1 would equally "document" health, taxes, immigration and energy.
If the audit chat disagrees with the roll-call convention, it should say so once, globally, rather
than race by race, because it affects most incumbents in the state.

**Effect of the gate on the overlap floor.** Six of the eleven flipped races fell below 7 once the
corrections were applied and were reverted to names-only: TX-11 to 6, TX-14 to 5, TX-20 to 4,
TX-21 to 5, TX-29 to 6, TX-32 to 6. That is the gate doing its job, and it is a larger effect than
a sampling pass would have found, because the corrections concentrated in exactly the thin axes
the overlap depends on.

## TX FINAL

38 districts attempted. 33 races written, 5 quarantined and left untouched (TX-01, TX-18, TX-19,
TX-28, TX-30). 73 of 85 candidates researched. 5 races clear the overlap floor and are flipped to
general: TX-03 overlap 8, TX-05 overlap 9, TX-06 overlap 8, TX-07 overlap 7, TX-33 overlap 8.
28 races hold at names-only, 23 of them with full research stored and ready for a later session to
close their one-sided axes, 5 with nothing written.

Mechanical checks pass: 0 identity mismatches against the FEC record, every non-null position has
an http source, every null has a note, no race is part curated, no em-dash or en-dash anywhere.
node pipeline/bundle-data.mjs exits 0. Note that running the bundler rewrites
apps/mobile/src/data/candidates.json, which is outside this chat's write scope; it is a generated
artifact, it is not included in the delivery zip, and it can be regenerated or reverted freely.

## NY

Same method. 26 districts attempted, 20 races written, 6 quarantined and left untouched.

Quarantined, because at least one candidate on the November ballot could not be documented at all:
NY-01 (Maggio and Sorensen, both independents, no site with content, no survey, no coverage),
NY-05 (Marsh, site is a construction placeholder and Ballotpedia omits him entirely),
NY-07 (Rivera and Ghaznavi, three dead domains and a Ballotpedia page confirming candidacy and
nothing else), NY-08 (Mizrahi, no site under any of four domains, no Ballotpedia page, no FEC
filing, zero raised), NY-10 (Moore, documented only by a Politics1 line and an Instagram link),
NY-13 (Williams, no reachable presence and Ballotpedia's NY-13 page lists no Republican at all),
NY-15 (Sapaskis, Politics1 lists a site for every other candidate in the race and none for him),
NY-26 (Hannon, his domain serves an all-paths-disallowed robots.txt and no outlet in Buffalo has
covered him). That is a high quarantine rate and it is a finding about these races, not about the
pass: the pattern is safe-seat New York City and upstate districts where the challenger has no
public campaign at all. Threshold applied: a candidate with zero scorable axes after three rounds
takes the whole race out, per the run book's quarantine rule.

Overlap per race, all 20 written races: NY-02 7, NY-03 8 then 6 after the gate, NY-04 0,
NY-06 4, NY-09 4, NY-11 7, NY-12 0 (five candidates), NY-14 6 after a targeted round,
NY-16 6, NY-17 9 then 7 after the gate, NY-18 7 then 4, NY-19 7, NY-20 7 after a targeted
round then 4, NY-21 3, NY-22 7 then 6, NY-23 8 then 7, NY-24 3, NY-25 2.

Targeted rounds: NY-20 moved from 6 to 7 on Ambrosio health, which the gate then removed.
NY-14 and NY-16 moved nothing. The NY-16 round hit a global HTTP 429 from the egress proxy on
every fetch including a control request, so it did no work at all; that race deserves one more
attempt in a session with a live proxy before it is closed out.

## NY VERIFY GATE

All 153 scored positions in the nine races that had been flipped were re-checked blind, same
method as TX: an independent agent per race, given only candidate, axis and URL, fetched each page
and wrote what it documents before any comparison was possible.

**16 corrections applied. Twelve axes nulled, four rescored.**

Nulled: Suozzi health (the release is a long-term-care public education campaign and its one WISH
Act clause is explicitly a federal program coupled with a private market); LiPetri immigration
(the Assembly page for A03675 documents his No vote but describes the bill only as a driver
license and data privacy measure, and the words immigrant and immigration appear nowhere, so the
Green Light framing was imported knowledge); Conley taxes (an attack release with no tax position
of her own); Lawler cost (a bare deregulation title with 59 Democratic yes votes); Ryan education
(a childcare roundtable with no K-12 content); Auringer safety and democracy (both attack releases
that state her opponent's position and not hers); Ambrosio health (cited to a press room index on
which the word health does not appear) and immigration (a news article in which he is paraphrased
and quoted only on field operation tactics); Tonko education (a release about classroom censorship,
not the funding versus choice axis); Buller safety (a release announcing a blog launch, containing
only the phrase back law enforcement); Gies housing (supply and redevelopment only, with zoning,
permitting, renter and public housing all absent, so neither pole is documented).

Rescored: Conley repro -2 to -1 and the label rewritten, because the cited homepage never says
abortion, Roe or reproductive, only "codify in federal law a woman's right to make her own
healthcare decisions"; Conley cost -2 to -1; Ryan housing -1 to 0, because his Ulster County plan
pairs county housing funds with zoning reform and supply-side building, which is the exact shape
of the calibration anchor for a housing 0; Mannion safety 0 to +1, because the page is
enforcement-dominant and its only mental health item is funding for law enforcement professionals,
so the stored 0 claimed a balance the page does not contain.

**Effect on the floor:** four of the nine flipped races fell below 7 and were reverted. NY-03 to 6,
NY-18 to 4, NY-20 to 4, NY-22 to 6.

**Two races where the gate found nothing to change, NY-11 and NY-19.** Per the run book that means
the pass was too gentle, so I looked again at both rather than accept it. NY-11: Malliotakis health
and education both rest on her own release describing a bill, which is her characterization rather
than bill text or a vote, and Decillis immigration rests on a reporter's line that he condemned his
opponent. All three are honest as labelled but thin, and they are flagged here rather than changed,
because the labels do not claim more than the pages contain. NY-19: Oberacker's repro score rests
on a broad state equal protection amendment covering many protected classes, not an abortion-only
vote, and his S2509C citation is an omnibus budget bill in which the tax surcharge is only one
part. Both are weak fits rather than misstatements. The audit chat should look at these five items
first in this state.

**Convention note for the audit.** The blind verifiers were given each axis as a pair of options
and several of them adopted "positive equals the first-named option", which is the opposite of the
app's sign convention. I read their prose findings, not their numbers, for exactly that reason. A
future gate should state the sign convention in the packet.

## FINAL STATE

TX: 38 districts, 33 races written, 5 quarantined, 73 of 85 candidates researched, 488 positions
scored and 242 null, 5 races flipped to general.
NY: 26 districts, 20 races written, 6 quarantined, 40 of 62 candidates researched, 270 positions
scored and 130 null, 5 races flipped to general.

Mechanical checks pass on both files: 0 identity mismatches against the FEC record, every non-null
position carries an http source, every null carries a note naming where the hunt looked, no race
is part curated, no em-dash or en-dash anywhere, node pipeline/bundle-data.mjs exits 0.

No race is left half done. Every quarantined race was never written to, so it is names-only with
no curated candidates. Every written race has all of its advancing candidates at tier curated,
whether or not the race is flipped.

## WHAT THE NEXT SESSION SHOULD DO FIRST

1. Re-run the one-sided axes on the 33 written races held at names-only. Most of them sit at
   overlap 4 to 6 and need one or two axes on one named candidate, which is listed per race above.
   This is cheap work with a large payoff, since each closed axis can flip a whole race.
2. Do it in a session with WebSearch budget. This session's 200 call cap was exhausted partway
   through TX-09, so every race from TX-15 onward and all of NY ran on direct fetches with no
   search discovery. That depresses the hit rate specifically on thinly covered challengers, which
   is exactly the population the overlap depends on.
3. Retry NY-16 first, since its targeted round did no work at all due to a proxy outage.
4. The 11 quarantined races are probably permanent. Each has a candidate with no public campaign.

