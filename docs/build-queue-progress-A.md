# Build queue progress, Chat A (data)

Started Aug 15, 2026, about 14:35 UTC. Spec: project doc "Build Queue Aug 15", CHAT A section.

## Startup findings

* Cloned https://github.com/match2vote/m2v.git at 66eaabe (data: nightly FEC sync 2026-08-15). main has 9 House races in data/curated.
* The attached zip m2v-house-complete.zip did not arrive in this session. Uploads directory is empty, no zip anywhere on disk. No folder on kiki's Mac is connected; a request for Downloads and Desktop access timed out with nobody there to approve.
* Push credentials: the git proxy refuses match2vote/m2v ("not in this session's authorized repository set"). Push will fail. Per the rules I keep working, commit locally, and zip the whole repo at the end.
* Because A0 depends entirely on the zip, and A1 and A2 depend on A0, I am doing A3 and A4 (which need no zip) while polling for the zip to arrive, then coming back to A0, A1, A2 if it lands.

## A3 done (voting rules), out of order because A0 is blocked

* `data/voting-rules.json`: 51 entries, exact 15-key schema, official state sites only, dates as spoken, verifiedAt 2026-08-15. Research split across seven agents, merged and validated by script (key set, date format, no dashes, no aggregator URLs in sourceUrl).
* Fully null (only officialSite fields filled): IL, NV, OH. elections.il.gov, nvsos.gov (Incapsula wall) and ohiosos.gov (403 on every page and PDF) could not be fetched from this environment after two rounds of attempts on many URLs each. Retry from another network.
* Partial: NH (registration deadline varies by town per the official page, early voting, request deadline and ID pages 403), ND (no voter registration by law, early voting county-set), MO (mail return deadline not on fetched pages), KS (early voting end and mail request deadline not printed), MN (only a recommended request date is official), UT (early voting window is county-set), VT (no registration deadline by law), AL, OR, PA (no early in-person voting, noted), WA/CO/HI/CA (all-mail, request deadline null where no request is needed), NJ/NY ID filled on second pass, WI early start computed from the stated 14-day rule.
* Spot checks: five states source-first (TX, GA, PA, MI, AZ): no discrepancies. Because a clean pass is suspicious, a second adversarial pass on five different states (CA, FL, NC, WA, CO) found: CO drop-box date was October 14 (a 2024 artifact; official 2026 calendar says 22 days before, October 12), fixed; CA mail request deadline existed on the official calendar (October 27, for replacement ballots), filled; WA cited a Feb 2026 special-election article as a source, removed. AZ registration note claimed a postmark rule not on the fetched page, softened.
* Pulled main before bundling: Chat B's pipeline change has not landed, so no generated `apps/mobile/src/data/voting-rules.json` yet. Bundler still exits 0 (2,595 candidates on current main without the zip).
* Committed 012b666. Push refused by the git proxy (repo not in this session's authorized set).

## A4 done (batch 7 plan)

* `docs/batch7-plan.md` written: table plus one section per state, ordered by date. Every URL was fetched Aug 15 and its fetch outcome is stated. Notable: Louisiana House runs as a Nov 3 open primary with a Dec 12 runoff (closed party primaries cancelled after Callais, HB 842; corroborated by the LA SOS document "05.14.26 Fall House Races" and the Governor's Apr 30 release), so LA needs no flip before November; Oklahoma's primary already happened June 16 and only OK-1 GOP goes to the Aug 25 runoff; Rhode Island's primary is Wednesday Sept 9; Massachusetts has no election-night results page.
* Committed cf95aa8. Push refused, same reason.

## A2 done as far as it can be without the zip

* `AZ-house-4` written into `data/curated/AZ.json` in the run book shape (status names-only, advancing, statusNote, sources). Two independent sources agree: the Maricopa County Final Official Results canvass hosted by the Arizona Secretary of State (apps.azsos.gov/election/2026/canvass/2026_Primary_Canvass_Maricopa.pdf) and Maricopa County Elections' own summary report, with Roll Call as a third. Finding: the Republican primary was not a five-way race on the ballot; Zuhdi Jasser was the only Republican listed (96.66%, plus write-ins). Advancing: fec-H8AZ09040 Greg Stanton (D, incumbent), fec-H4AZ04115 M. Zuhdi Jasser (R). A No Labels nominee (Tisha Benoit) is reported by KTAR only; the SOS general candidate list (apps.arizona.vote) returns 403 and the statewide canvass PDF is image-only, so she is not listed. Logged in the statusNote.
* `DC-house-at-large` sources backfilled with the DC Board of Elections November 3, 2026 general election candidate list PDF (July 15, 2026; four Delegate candidates: White D, Rosado R, Freeman Statehood Green, Solana Independent, matching the existing advancing array). The BOE list is not labeled "certified"; noted.
* Both edits are in `tmp/apply-a2.mjs` (excluded from git) so they can be re-applied in one command after the zip is unzipped over the clone, since the zip's AZ.json and DC.json will overwrite these files.
* Committed 60fcede. Push refused.

## A1 not started: needs the zip

The 242 hand-written House candidates exist only in the zip. As preparation, `docs/official-candidate-list-index.md` (committed) lists every state's official primary results and general candidate list URL with fetch status, so the audit can go straight to sources when the zip lands. Michigan and Tennessee note: Michigan's results app and Tennessee's apps block fetch tools; plan for a browser.

## A0 status at the end

Not landed. The zip never arrived in this session (uploads directory empty throughout, one-hour file watch, two folder-access requests to the Mac: the first timed out unanswered, the second found the device disconnected). Chat B is therefore still waiting on the landing commit. Nothing under apps/ or pipeline/ was touched.

## A5 final report (Chat A)

1. Landed in this repo (local commits, none pushed): voting rules for 51 jurisdictions, batch 7 plan, AZ-house-4, DC-house-at-large sources, official candidate list index, this progress file.
2. A0 did not happen: m2v-house-complete.zip never reached this session and kiki's Mac was unreachable, so the 380-race sweep is not landed and Chat B is still blocked on it.
3. A1 party audit not done for the same reason; prep index committed at docs/official-candidate-list-index.md. Party corrections: none made (no candidates to audit).
4. AZ-4 written: yes, Stanton (D) vs Jasser (R), from the SOS-hosted Maricopa official canvass plus the county summary report. No Labels nominee Benoit not confirmed officially, left out and logged.
5. DC-house-at-large sources backfilled from the DC Board of Elections general candidate list.
6. Voting rules: 66 null fields across 51 entries. Entirely null (site unreachable from here): IL, NV, OH. Partial nulls: NH, ND, MO, KS, MN, UT, MS, AL, OR, PA, VT, WA, CO, HI, CA, WI. Fixes from the adversarial spot check: CO drop-box date, CA request deadline, WA stale source, AZ note.
7. Batch 7 plan: Louisiana House is a Nov 3 open primary with a Dec 12 runoff (no September flip); Oklahoma is done except the OK-1 GOP runoff Aug 25; RI primary is Wednesday Sept 9.
8. Pushes: every push failed (git proxy: repo not authorized for this session). All work is committed locally on main; the whole repo is zipped and sent with this report.
