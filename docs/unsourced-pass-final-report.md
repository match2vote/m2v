# Unsourced positions pass: FINAL REPORT (Aug 29, 2026)

Base: main at 2528386. All 43 state files under data/curated/ changed. All numbers below are computed from git diff against that baseline and from the app's own Browse/display logic (ballot.js getRaces display view) re-run against the finished bundle, not from worker self-reports.

## Headline numbers
- Listed candidates with zero sourced positions: 846 at the Aug 28 baseline -> **226 now**.
- Total blank axes filled with sourced evidence: **2,938**.
- New candidate entries created: 545 (plus ~330 existing entries extended).
- Candidates moved from 0 sourced axes to 1+: **622**.
- Candidates newly at 10/10: 18.
- Races flipped names-only -> curated/general: **12** (AZ-3, CA-4, IA-3, MD-1, MD-3, MD-6, MD-8, ME-1, ME-2, NJ-6, PA-7, WI-2).
- Races with research banked at tier "researched", still names-only: **319** (statusNotes carry each race's overlap count).
- Remaining unsourced axes among listed candidates: 6,306 (was ~9,200+ at baseline), essentially all carrying dated nullNotes.
- Full-coverage (scored) races now: 98. Names-only races shown: 349.

## What voters actually see vs what is banked
- VISIBLE: the 12 flipped races now show match percentages; single-axis fills in ~20 already-live races (Paxton, Booker, Brown, Whatley, Rounds, Hageman, Drazan, Jolly, Jones, Pickens, Holscher, Bengs, Green, Sullivan, Robert White and others) sharpen existing scores.
- BANKED, NOT VISIBLE: 319 races hold sourced research at tier "researched". The app deliberately shows these as names-only because their cross-candidate overlap is below the 7-issue comparability floor, almost always because one minor-party or no-web-presence candidate has nothing findable. The research displays the moment an overlap-closing source appears; nothing needs a rebuild (data ships server-side).
- GENUINE NULLS: every null on a touched candidate has a nullNote naming the sources tried and the date. 226 listed candidates remain at zero sourced axes; they are the documented-unfindable set (mostly Libertarian/Green/independent micro-candidates, worst in MI 40 and TN 24).
- Tier hygiene: 65 pre-existing entries that carried positions at tier "fec" (mostly TX) were normalized to tier "researched"; zero display change.

## Externally deferred (the only unfinished work)
1. **AK-governor and AK-house-at-large** (6 candidates): fourth ballot spots unsettled until the Aug 31 certification. Curating three of a maybe-four field would hide a later-certified candidate. Finish with the planned Aug 31+ certification flip (AK-senate 4th spot decision is part of the same event).
2. Primary-pending states (MA Sep 1, NH Sep 8, RI Sep 9, DE Sep 15, LA Nov 3): out of scope by design until their fields exist.

## Future re-checks worth doing (specific reasons, not generic re-hunts)
- NM-2 Cunningham (Trump-endorsed battleground): campaign site had no issues pages yet; re-probe when his platform publishes.
- Zamora (NM-3): nmlegis.gov is JS-blocked from this environment; his state-house voting record is the untapped source.
- Achilles (ID senate): KTVB profile bot-blocked; a reform-minded independent likely has scorable democracy positions somewhere.
- OH-senate advancing array references fec-S6OH00429 / fec-S6OH00395 with no matching entries (pre-existing data error, flagged only).
- FEC stale-incumbent flags copied verbatim per rule and logged: Ivey (MD-4), Gillen (NY-4), Stutzman (IN-3), McGuire (VA-7), Menefee (TX-18).
- Odd rosters flagged in ledgers: TN-1 Cody (disqualified per Ballotpedia yet listed), TN-7 Koontz district mismatch, MI-13 Green candidate name differs from politics1, Cleophus Dulaney (OH-3) FEC-listed Republican with a Democratic-reading platform, Steve Cohen (CA-50) similar shape.
- Blocked hosts this session (retry another day/environment): web.archive.org, justfacts.votesmart.org, several Ballotpedia pages (intermittent robots), KTVB, capitol.hawaii.gov, washingtontimes.com.

## Process notes
- 20 parallel worker runs over 6 waves plus 2 overlap-closer runs; disjoint state ownership; per-worker ledgers in docs/ledgers/.
- WebSearch quota (200/session) exhausted during wave 2; later waves ran WebFetch-only off politics1.com per-state candidate/URL indexes, Ballotpedia direct URLs, house.gov, clerk.house.gov rolls (23/102/190 reused across every delegation), and state-outlet Q&As.
- Verify gates caught and fixed real defects: one worker's unconfirmable quotes (WI Fitzgibbon, retracted), one schema deviation (NC lists -> dicts), five party-field normalizations reverted to FEC verbatim, mislabeled source URLs (IL), a dropped SALT quote (Kean), and two stale overlap fields (TX).
- Mechanical gate now passes CLEAN across all 43 changed files: FEC-verbatim fields, 10 axis keys, source per score, note per null, no em-dashes, no duplicate ids, bundler exit 0.

## Delivery
- ZIP: m2v-unsourced-pass-complete-aug29.zip = 43 data/curated files + docs/ledgers/ + this report + the agent guide. Upload via GitHub web UI per directory (data/curated, then docs), then run node pipeline/bundle-data.mjs and commit the rebundle, or let the next build pick it up.

NEXT STEP: Run the completed candidate dataset through the Google Gemini API for a full independent source-by-source fact-check before considering the research final.
