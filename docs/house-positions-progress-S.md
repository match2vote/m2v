# House positions progress, chat S

Started Aug 17, 2026. States in order: ND, SD, VT, HI, ID, ME, MT, WV, NE, NM, AR, IA, KS, MS, NV, UT, CT, KY, OR.
Scope confirmed at start: 60 House races, 175 advancing candidates across the 19 state files, counted from the advancing arrays.
Precondition check: data/curated/CA.json has 52 House race entries (CA-house-1 through CA-house-52) plus one governor entry. Passed.

Rule being enforced: a race is either fully curated at equal depth for every advancing candidate, or left names-only. No partial races at any point.

---

## Log

### ND, done Aug 17

1 race (ND-house-at-large), 3 of 3 advancing candidates curated, race flipped to general.
Candidates: Julie Fedorchak (R, incumbent, fec-H4ND00061), Trygve Hammer (Democrat, fec-H6ND01049), Helene Neville (Independent, nd-house-at-large-neville, extended the pass-1 object in place).
Positions: 23 scored, 7 null. Per candidate: Fedorchak 7 scored / 3 null, Hammer 7 / 3, Neville 9 / 1. Widest scored-axis gap in the race is 2, under the audit's 3-axis denominator threshold.
Identity fields copied programmatically out of data/fec/ND.json, not retyped.

Verify gate, source first, all 23 scored positions re-fetched with axis-specific prompts before looking at what was stored. 9 corrections:
1. Fedorchak climate +2: the House energy page is explicitly both/and and does not call for restricting fossil production, so it did not carry +2. Source moved to the Wikipedia record of the bill she introduced Apr 10, 2025 to strip the IRA wind and solar credits ("unprecedented reliability risks"), which does. Score kept.
2. Fedorchak safety +1 to null: her national security page's only public safety content is votes on funding bills (Pay Our Homeland Defenders Act, Secure America Act). Appropriations only, which the calibration anchors say does not score. nullNote written.
3. Fedorchak health +1 to +2: underclaimed. Re-fetch surfaced "Unaffordable Care Act", "Obamacare is anything but affordable", and a vote against the discharge petition to extend the enhanced premium tax credits.
4. Fedorchak cost label: dropped "fighting utility rate increases", which the second fetch did not confirm and which points the wrong way on the axis. Replaced with the verified campaign-site quotes. Score kept at +1.
5. Hammer cost minus 1 to 0: the re-fetch surfaced the opposite-direction quote the first pass missed, farmers "want to be out there and compete in the free market" and "don't want to be propped up by the government", next to raising reference prices and the 85 percent meat-processing concentration. Documented mixed.
6. Hammer taxes minus 2: the priorities page is a fair-share slogan with no rate or mechanism, so it could not carry minus 2. Source moved to the interview documenting removal of the Social Security taxable income cap. Score kept.
7. Hammer climate label: dropped "developing renewable energy leadership", unconfirmed on re-fetch. Label rebuilt from the twice-confirmed pro-American oil plus next-generation nuclear content. Score kept at 0.
8. Fedorchak repro, taxes, democracy and Hammer repro, education, democracy, immigration labels: replaced with the exact quotes the re-fetch returned, including bill number H.R. 1 and the July 3, 2025 date.
9. Neville cost, repro, democracy, safety, education, immigration, climate labels tightened to verbatim platform wording.

Mechanical checks pass: ids match FEC, name/party/district identical to the FEC record, no partial race, every scored axis has an http source, every null has a note naming where the hunt went, no em-dash in the file.
Note on the bundler: pipeline/bundle-data.mjs writes into apps/mobile/src/data, which chat S is told never to touch, so it was not executed. Its guards (controversy label plus url, id merge, duplicate ids) were replicated read-only instead and pass.

Flag for other chats and the audit, no action taken by me: Helene Neville is on the ND ballot as an independent per her own site and Politics1, but the Wikipedia race article lists only Fedorchak and Hammer. Worth a second look by chat A. Her Meet Helene page is an unfilled template ("Add your page content here"), so bio detail is thin. Ages for Hammer and Neville are not documented anywhere I could fetch and are null rather than inferred.

### Run book revision Aug 16 picked up mid-run: section 4a, the overlap floor

Read the revised run book after ND was already written and flipped. Section 4a replaces the scored-axis-count balance test I had been using with an overlap test: the count of axes where every advancing candidate in the race has a non-null value. 7 or more flips, 5 or 6 gets one targeted round on the one-sided axes hunted on the candidate who lacks them, 4 or less stays names-only.

Also picked up from the tightened source rules: Wikipedia is not a position source, an incumbent must not be scored from Wikipedia or an aggregator on an axis where a roll call exists, one URL should not carry six axes, and one sentence scores one axis only.

Revert list: **no race reverted.** ND was the only race flipped before the revision. Its overlap was 6 when re-measured, inside the targeted-round band rather than below the floor, and the targeted round lifted it to 8, so it stays general. Details below.

### ND, revisited under 4a

Overlap at first pass: 6. One-sided axes were health (Hammer missing), education (Fedorchak missing), safety (Fedorchak and Hammer missing) and housing (all three missing). Hunted each on the candidate who lacked it, never on the candidate who already had more.

What the targeted round found:
- Hammer has a policies page, https://www.hammerfornd.com/policies, that my first pass never fetched because I only pulled /priorities. It carries a mechanism-level health commitment, mandatory rather than discretionary appropriations for the Indian Health Service. Scored health minus 1 with the label stating the Indian Country scope explicitly, rather than dressing it up as a general coverage position.
- Fedorchak's education and safety came from roll calls, which also satisfies the new rule that a roll call beats everything for an incumbent. Education: Aye on H.R. 2616, the PROTECT Kids Act, roll 184 of 2026, 217 to 198, scored +1 as parental control. Safety: Aye on H.R. 6260, the Keeping Violent Offenders Off Our Streets Act, roll 169 of 2026, 243 to 179, scored +1. Her four-vote enforcement pattern would support +2 but one cited page can only carry the one vote, so +1 is what the source bears.
- Housing stayed null for all three, so it never entered the overlap.

Overlap after the targeted round: **8**. Counts 9, 8, 10. Race stays general.

Source-rule corrections forced by the revision:
- Fedorchak climate was cited to Wikipedia, which is now disallowed as a position source. Replaced with the roll call it pointed to: Yea on H.J.Res.88, roll 114 of 2025, disapproving the EPA rule granting California's Advanced Clean Cars II waiver, 246 to 164. Score stayed +2 and is now on a primary record.
- Hammer's 2024 North Dakota Monitor interview was carrying four axes. Moved repro onto his own current priorities page, which has a plank titled "Protect women's freedom to make their own healthcare decisions". That URL now carries three.
- Neville had nine axes on a single URL. Her site turned out to have per-topic issue pages listed in its sitemap, so every axis except cost, taxes and democracy now cites the specific page for that issue. Re-reading those pages source first changed two scores: immigration went from 0 to minus 2, because the dedicated immigration page commits to "Expanding lawful immigration pathways for workers and families", DACA stability and a humane asylum system with no enforcement-first content, and the 0 had been read off a single framing sentence on the index page; safety went from minus 1 to minus 2 on "Addiction is not a moral failure, it is a medical condition" plus named treatment and prevention programs. Her dedicated health page is genuinely middle-ground, so health stayed minus 1, sourced to her Medicare and Medicaid page. Housing moved from null to 0, because her housing page does argue supply over assistance alone, which is a documented mixed position rather than an absence.
- Fedorchak's House education issue page exists and is linked in her own site navigation but returns a persistent 403 to every fetch variant tried, while a deliberately bogus slug returns 404, so the block is real rather than a missing page. Logged because it is the one page most likely to hold her formal education statement.

ND final: 27 scored, 3 null across 3 candidates. Fedorchak 9 scored, Hammer 8, Neville 10. No URL carries four or more axes for any candidate.

### SD, done Aug 17, held at names-only

1 race (SD-house-at-large), 2 of 2 advancing candidates fully researched to equal depth: Marty Jackley (Republican, fec-H6SD01109), Nicole Gronli (Democrat, fec-H6SD01141). Open seat, Dusty Johnson left it to run for governor. Identity fields copied programmatically from data/fec/SD.json. FEC spells her Nicole, all news coverage says Nikki; copied the FEC spelling verbatim and noted the difference in her background rather than correcting the field.

Positions: 14 scored, 6 null. Jackley 6 scored, Gronli 8.
**Overlap: 6. Race left at names-only.** Curated objects kept so the research is not lost, status not flipped, so no match percentage is shown.

The four one-sided axes are all Jackley's: health, housing, climate, education. A full targeted round was run on exactly those four and it did not lift the overlap to 7. What it found and why each stayed null:
- Health: he asked Congress to bar pharmacy benefit managers from owning pharmacies and defended South Dakota's 340B discount law. Real health policy, but it is drug supply chain market structure, and the AG coalition's own rationale was that it "would foster competition", so it points at neither pole of a public-versus-private coverage axis. This is the single call that keeps the race under the floor. If the audit reads a mixed 0 here instead, the overlap becomes 7 and the race flips. I left it null rather than manufacture the score that clears the gate.
- Climate: only energy record is enforcing the Renewable Fuel Standard against refinery hardship exemptions, plus a bipartisan letter for year-round E15. Enforcing a biofuel mandate does not document a view on the pace of transition or on expanding oil and gas, and his campaign issues page has no energy heading at all.
- Housing: only adjacent material is private property rights in the carbon pipeline eminent domain fight, which is farmland taken for a private pipeline, not housing.
- Education: genuinely empty. Campaign issues page has five headings and none is education, he completed no Ballotpedia survey, and South Dakota News Watch's voter guide carries no questionnaire answers from him. The only school items are an AG opinion on competitive bidding and unquoted paraphrase on Title IX.

Self-reported audit flag: Gronli has 6 axes on one URL, her campaign priorities page. Her site has no per-issue subpages, and that page is a long seven-section platform where each score quotes its own distinct section, so this is not positions read off a general impression, but it crosses the threshold section 9 check 5 looks for and the audit should see it named rather than discover it.

Blocked pages worth a second route: KELOLAND returned 403 on two Jackley pieces while serving others on the same domain, and the Rapid City Journal Q&A on abortion and prisons sits behind a TollBit gateway.

### VT, done Aug 17, flipped to general

1 race (VT-house-at-large), 2 of 2 advancing candidates: Rebecca 'Becca' Balint (Democrat, incumbent, fec-H2VT01076), Gerald Malloy (Republican, fec-H6VT01085). Identity fields copied programmatically from data/fec/VT.json.

Positions: 17 scored, 3 null. Balint 9 scored, Malloy 8. **Overlap: 7. Flipped.**
One-sided and therefore outside the overlap: cost of living (Balint has no cost, prices or wages page anywhere on either site, and the House issues index has only 14 topics, none of them cost or taxes), housing (Malloy null after the verify gate, see below), voting rules (Malloy has nothing on the axis, only term limits and campaign finance, which the anchors treat as incidental).

Sourcing shape worth noting: Balint is an incumbent, so taxes and safety are scored from named roll calls, and every other axis cites its own separate House office issue page. No URL carries more than one axis for her. Malloy's heaviest URL carries three.

Verify gate run blind this time. Instead of re-reading pages I had already scored, I gave a checker the URL and the axis question only, with no access to the stored score or label, and asked what the page documents. That removes the confirmation bias the method warns about, since the checker cannot see what it is supposed to confirm. It found six problems:

1. **Malloy housing +1 to null.** The worst one. I had scored housing off VTDigger and quoted 'reducing regulatory barriers to new development' as his position. It is the reporter's paraphrase of past remarks, not his words, and the words housing, zoning, renter and permitting do not appear in the article at all. I had also attached a quote he gave Vermont Public to the VTDigger URL. Both are the Chat C defect, a label stating something the cited page does not carry. Axis set to null with a note that names the paraphrase problem.
2. **Balint housing minus 2 to minus 1.** The page's one concrete figure, $250 million, is a past Vermont state accomplishment, not a federal commitment, and the federal ask is aspiration with no bill named.
3. **Balint immigration minus 2 to minus 1.** 'Comprehensive immigration reform' is unnamed and the page cites no bill. Her Nay on the Laken Riley Act would support the direction but a single vote does not carry minus 2 either.
4. **Balint education minus 2 to minus 1.** Aspiration only, no bill or figure, and the page never mentions teacher pay, which my first label had not claimed but which I had been counting toward the magnitude.
5. **Malloy cost +2 to +1.** Deregulation direction is clear but the page has no bill or figure, and the words minimum wage, price cap and subsidy appear nowhere, so there is no documented intervention side to weigh against.
6. **Roll-call labels rewritten, in VT and back-ported to ND.** My labels had been adding what a bill did, for example calling H.R. 1 'the law that made the 2017 tax cuts permanent'. The clerk XML gives only the short title, so that was a true fact the cited page does not contain. Labels now name the bill number and quote the roll call's own title, marked as such, and give the date and tally. Same trim applied to Fedorchak's taxes, education and climate labels in ND.

Balint's Nay on a bill titled the Affordable HOMES Act, 2026 roll 12, is logged here as unresolved rather than used. The title alone does not tell me what the bill did and I could not read its content from a fetchable page, so scoring housing off it either way would have been guessing. Chat A may want to look.

### HI, both races left names-only, files untouched

HI-house-1 (4 advancing: Case D, Lam R, Conley Green, Berning nonpartisan) and HI-house-2 (3 advancing: Tokuda D, Awa R, Codelia nonpartisan).

Changed method here. Because overlap requires every advancing candidate to have a value on an axis, the weakest candidate caps the whole race. So I triaged the minor and nonpartisan candidates before doing any work on the incumbents, which is cheaper and decides the race outright.

Result: **HI-1 cannot exceed overlap 0.** Nathan Berning has zero first-person policy content on any fetchable page. His Good Party profile is unclaimed, his BallotReady page is an empty template, his Instagram and Facebook are robots-blocked, he submitted no Civil Beat Q and A, he has no Ballotpedia page, and the site Politics1 lists for him is a content-advisory gate with nothing reachable behind it. The only coverage of him is Hawaii Public Radio on an ad controversy, which also reports the Office of Elections has him listing a Florida address. Nothing was written for HI-1.

**HI-2 caps at about 3 to 5.** Codelia has cost of living, housing and climate solidly from a Civil Beat Q and A and a Kauai Chamber survey, health and education only as part of one line about Native Hawaiian programs, and nothing at all on immigration, taxes, crime, abortion or voting. Ceiling is below 7, so nothing was written for HI-2 either.

Finding that affects other chats and the audit, not just me: **Civil Beat's 2026 congressional questionnaire did not ask about abortion, voting and elections, taxes, or crime.** Those four gaps will show up for Ed Case, Jill Tokuda and Brenton Awa too, not only for the minor candidates. The source that would fill them is the Star-Advertiser candidate questionnaire, and staradvertiser.com fails every fetch with a redirect loop. The hawaiinewsnetwork.com mirror carries the bio header then truncates mid-questionnaire. Any future Hawaii work needs a different route to that questionnaire.

### ID, both races left names-only, files untouched

Same triage-first method. Both races fail, each on a single candidate.

**ID-1 dies on Brendan Gomez (Constitution).** He answered Vote411 but stated no policy at all; his topical content is one grievance sentence naming economic collapse, the war on renters, unaffordable healthcare and inadequate education as problems, with no position on any of them. No campaign website exists, the Constitution Party of Idaho has no 2026 candidate page, no Candidate Connection survey, $0 raised across 2022 and 2024, and no Idaho news coverage beyond name-in-a-list. Sarah Zabel by contrast has at least 5 axes and probably more.

**ID-2 dies on C. Sierra (Constitution), and this one needs escalating: he is dead.** C. Sierra is Carta Reale Sierra, the Pocatello activist known as the Idaho Lorax, who died June 9, 2026 at 74, per https://localnews8.com/news/2026/06/10/longtime-idaho-environmental-activist-john-carta-dies-at-74/ . He still appears as a live advancing candidate in data/curated/ID.json, on Wikipedia's 2026 Idaho House page, and on Vote411's ID-2 ballot. I did not change the advancing array, because the run book says to keep it as it is and because whether Idaho keeps his name printed or allows a substitution is a Secretary of State question I could not resolve from a fetchable page. **This is a ballot-data correction someone with authority over the advancing arrays needs to make, and it is the highest priority item in this file.** A deceased person currently reads as a November nominee in the app.

Also logged from ID-2, not used: Tripp Hutchinson was sentenced March 31, 2026 for misdemeanor petit theft and called it "moral civil disobedience". That is a documented controversy with a URL if ID-2 is ever curated.

Two campaign sites were unfetchable and would raise counts if they open up: zabelforcongress.com/what-i-stand-for, persistent 429 on Squarespace, and houserforidaho.com, robots-blocked plus 429. Neither changes the outcome, because Gomez and Sierra are what kill these races.

### What the overlap floor does to multi-candidate races, and the queue for the next session

The most important structural thing I learned. Overlap counts axes where **every** advancing candidate has a value, so one thin minor candidate caps the race no matter how well the incumbent is documented. That is the correct behavior for the product, but it changes which races are worth the effort.

Of the 53 races I have not yet decided:

* **24 are two-candidate, major party only.** These are the ones that can realistically clear overlap 7. In order of the run book's state sequence: ME-1, ME-2, NM-1, NM-2, NM-3, AR-2, AR-4, IA-1, IA-2, IA-3, IA-4, MS-1, NV-3, CT-1, CT-2, CT-3, CT-4, CT-5, KY-1, KY-3, OR-1, OR-2, OR-3, OR-6.
* **19 have exactly one minor or independent candidate.** Triage that candidate first. If they clear 7 scorable axes the race is workable, otherwise stop immediately.
* **10 have two or more minor or independent candidates**, including NV-1 with four and three races with three. Expect these to be unflippable and triage cheaply: NE-3, NV-1, NV-4, UT-2, UT-3, KY-5, KY-6, OR-5, UT-1, UT-4.

Recommended order for whoever picks this up: the 24 two-candidate races first, in state order, because they convert effort into matchable races at the highest rate. Then triage the 19 single-minor-candidate races. Treat the 10 crowded races as probable quarantines and spend accordingly.

Method note for the next session, which saved real time here: triage the weakest candidate in a race before researching anyone else, and run the verify gate blind by handing a checker only the URL and the axis question, never the stored score. The blind gate caught a reporter's paraphrase being cited as a candidate quote, which a re-read by the person who wrote the label would very likely have confirmed instead.
