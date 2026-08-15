# Batch 7 Plan: nine states held out of the House sweep

Written August 15, 2026. Purpose: give the person flipping each state's US House races from "primary pending" to general-election status everything they need on the night, so there is nothing left to research. No candidate data is in this file on purpose.

Ground rules that apply to every state below:

- FEC data for each state is already in the repo at `data/fec/<STATE>.json` (AK, FL, WY, OK, MA, NH, RI, DE, LA all exist). Party for FEC-filed candidates comes from FEC, never from a web page.
- Use the official results URL listed. Where the 2026 page did not exist yet on August 15, the row gives the URL pattern the state used in 2024 plus the 2024 page that was confirmed to load. Every URL below was fetched on August 15, 2026; the fetch outcome is stated next to it.
- Do not mark a race final until the results page says something like "official" or the certification date has passed. Until then set status to unofficial.
- Two states in this batch do not actually have a "primary night" ahead: Oklahoma's primary already happened (June 16) and only one House runoff remains (August 25). Louisiana has no House primary before November at all (see the Louisiana section).

## Summary table

| State | Primary date | Runoff date | House seats | Official results URL (fetch status Aug 15) |
|---|---|---|---|---|
| AK | Tue Aug 18, 2026 (top-four) | None (RCV in general) | 1 | https://www.elections.alaska.gov/election-results/e/?id=26prim (loads, empty "No Entries Found" placeholder) |
| FL | Tue Aug 18, 2026 | None | 28 | https://results.elections.myflorida.com/Index.asp?ElectionDate=8/18/2026&DATAMODE= (loads, frameset shell only, no data yet) |
| WY | Tue Aug 18, 2026 | None | 1 | https://sos.wyo.gov/Elections/Docs/2026/2026PrimaryResults.aspx (404 on Aug 15; 2024 twin at .../2024/2024PrimaryResults.aspx loads) |
| OK | Tue Jun 16, 2026 (done) | Tue Aug 25, 2026 | 5 | https://results.okelections.us/OKER/?elecDate=20260825 (returned 403 to our fetcher; index at https://oklahoma.gov/elections/elections-results/election-results/2026-election-results.html loads) |
| MA | Tue Sep 1, 2026 | None | 9 | No official election-night page. Certified results only at https://electionstats.state.ma.us/ (loads) |
| RI | Wed Sep 9, 2026 | None | 2 | https://www.ri.gov/election/results/2026/statewide_primary/ (404 on Aug 15; 2024 twin .../2024/statewide_primary/ loads) |
| NH | Tue Sep 8, 2026 | None | 2 | https://www.sos.nh.gov/2026-state-primary-election-results (pattern; sos.nh.gov returned 403 to our fetcher for every page) |
| DE | Tue Sep 15, 2026 | None | 1 | https://elections.delaware.gov/reports/PR2026.html (404 on Aug 15; 2024 twin .../PR2024.html loads) |
| LA | Tue Nov 3, 2026 (open primary, all parties on one ballot) | Sat Dec 12, 2026 | 6 | https://voterportal.sos.la.gov/graphical (loads) |

Sections below are ordered by date: AK, FL, WY (Aug 18), OK (Aug 25), MA (Sep 1), NH (Sep 8), RI (Sep 9), DE (Sep 15), LA (Nov 3).

---

## Alaska: Tuesday, August 18, 2026

**Seats:** 1 (at-large).

**System:** Top-four open primary. Every candidate of every party is on one ballot; voters pick one. The top four vote-getters advance to November regardless of party. If four or fewer file, all advance. Ranked-choice voting is used only in the November 3 general. The Division of Elections homepage (https://www.elections.alaska.gov/, loads) states this plainly for the 2026 cycle.

**Results URL:** https://www.elections.alaska.gov/election-results/e/?id=26prim. Fetched Aug 15: page loads with the "Election Results" header and "No Entries Found" (placeholder until the night). Fallback map: https://www.elections.alaska.gov/enr/ (loads, currently shows the 2024 general). The 2024 primary page at https://www.elections.alaska.gov/election-results/e/?id=24prim loads and shows how the state formats a finished primary: a summary PDF (ElectionSummaryReport.pdf), a precinct CSV, and per-house-district PDFs. Expect the same layout in 2026. The 2026 summary PDF path (https://www.elections.alaska.gov/results/26PRIM/ElectionSummaryReport.pdf) was 404 on Aug 15.

**Timing (from KTOO / Alaska Beacon reporting of the Division's schedule, fetched Aug 15):**
- Polls close 8 pm AKDT; first numbers about 8:45 to 9 pm AKDT.
- Election-day count posted early Aug 19.
- Absentee batches added Aug 25 and Aug 28 (final unofficial).
- Certification: August 31, 2026. Recount request deadline Sept 5, legal challenge deadline Sept 10.

**Traps:**
- The winner is not the story: you need the top four. Well over four candidates filed for the House seat (the candidate list at https://www.elections.alaska.gov/candidates/?election=26prim loads and shows a long list including Nonpartisan, Undeclared, Libertarian, Democrat, Republican filers), so places 3 and 4 may swap as absentee batches land through Aug 28. Do not lock the general-election field on Aug 18. Suggested: mark the top two as advancing on the night if the gap is large, and hold the rest as "provisional" until Aug 28 or Aug 31.
- Alaska lists ballot party labels like "Nonpartisan" and "Undeclared" (not the same thing). Party in the app still comes from FEC.
- Rural precincts often report late; some report only the next day.
- Withdrawals after the primary can promote the fifth-place finisher; watch the Division's news page after certification.

---

## Florida: Tuesday, August 18, 2026

**Seats:** 28.

**System:** Closed party primary, no runoff. Winner is the plurality leader.

**Results URL:** https://results.elections.myflorida.com/Index.asp?ElectionDate=8/18/2026&DATAMODE=. Fetched Aug 15: the root and this URL load only the old frameset shell ("This page uses frames"). The frame that carries the data is https://results.elections.myflorida.com/SummaryRpt.asp?ElectionDate=8/18/2026&DATAMODE= (loads a Division of Elections header, no contests yet). For comparison the 2024 general version of the same SummaryRpt URL loads and shows the "Official Results" header, so the pattern is right; contests appear once the state starts posting. Results are statewide by contest with county drill-down. Also use the county-level DATAMODE options only if the summary is lagging.

**Timing (state's own "Election Results Reporting Timeline, PE 2026" PDF at https://files.floridados.gov/media/709429/election-results-reporting-timeline-pe-2026-v-20250821.pdf, loads after a redirect from dos.fl.gov):**
- Election night: counties upload early-vote and mail results within 30 minutes of poll close, then every 45 minutes.
- First unofficial returns due to the state noon on the 3rd day (Fri Aug 21).
- Second unofficial returns (only if a machine recount was triggered) 3 pm on the 5th day (Sun Aug 23).
- County official returns noon on the 8th day (Wed Aug 26).
- Elections Canvassing Commission certifies on the 9th day: Thu Aug 27, 2026. (The PDF's extracted text was hard to read; the day counts above follow the timeline. Treat Aug 27 as the certification date and confirm on the DOS site that morning.)

**Traps:**
- New map for 2026. Florida enacted a new congressional map in spring 2026 (signed May 4, 2026); the Florida Supreme Court rejected the challenge on June 10, 2026, and the map is in effect for this primary. District numbers and boundaries differ from the 2022 map. Do not assume an incumbent's old district number still matches. Rebuild the district list from the state's candidate list, not from the 2024 file.
- Cancelled primaries. Where only one candidate qualified per party, that party's primary does not appear on the ballot; the candidate is already the nominee. Where only one candidate qualified for the whole seat, both the primary and the general are cancelled and the candidate is elected outright (Wikipedia's Florida page notes at least one district in this position for 2026; confirm against the state candidate list). Such races will be missing from the results page on the night. That is not an error; mark them "nominated without primary" or "elected unopposed" from the candidate list.
- Candidate list source: https://dos.elections.myflorida.com/candidates/CanList.asp (loads; pick the 2026 primary/general election). Statuses like "Unopposed" show there.
- Write-in candidates: a qualified write-in for the general keeps a party primary closed to that party only. They do not appear on the primary results page and will not appear by name on the November ballot either. Ignore for matching unless they are in FEC.
- Florida's official page is old ASP with frames; if a scraper or fetcher fails, open the SummaryRpt.asp URL directly.

---

## Wyoming: Tuesday, August 18, 2026

**Seats:** 1 (at-large).

**System:** Party primary, plurality, no runoff. Voters pick a party ballot.

**Results URL:** https://sos.wyo.gov/Elections/Docs/2026/2026PrimaryResults.aspx. Fetched Aug 15: 404 (the state creates this page on election night). Same pattern as 2024, where https://sos.wyo.gov/Elections/Docs/2024/2024PrimaryResults.aspx (loads) was the page the Secretary of State pointed the public to for unofficial results, updated over the night and the next day until all 23 counties reported. The 2024 page links a "Statewide Candidates Summary" PDF, county precinct PDFs, and an Excel zip; expect the same. Index page: https://sos.wyo.gov/Elections/ElectionResults.aspx (loads, no 2026 entry yet). 2026 hub: https://sos.wyo.gov/Elections/2026ElectionInformation.aspx (loads; links the primary candidate roster PDF/CSV and withdrawn list at https://sos.wyo.gov/Elections/Docs/2026/2026_WY_Primary_Election_Candidates.pdf and .csv, and https://sos.wyo.gov/Elections/Docs/2026/2026_WY_Withdrawn_Primary_Election_Candidates.pdf).

**Timing (2026 Election Calendar PDF, https://sos.wyo.gov/Elections/Docs/2026/2026_Election_Calendar.pdf, loads):**
- Polls 7 am to 7 pm MDT.
- County canvassing boards certify by Fri Aug 21.
- State Canvassing Board certifies by Wed Aug 26, 2026.

**Traps:**
- Results are posted as PDFs, not a live table, and in 2024 the statewide summary was still filling in the next afternoon. Plan to check Aug 19 and again after Aug 21.
- Write-in nominations are possible: if a party has no filed candidate, a write-in who reaches the threshold can be notified as nominee within 48 hours of the county canvass, and write-in counts can be requested up to two days after the county canvass. Do not finalize a party slot as "empty" until after Aug 26.
- The 2024 page labels itself "Official" once certified; before that treat it as unofficial even if the label is absent.

---

## Oklahoma: primary already held June 16, 2026; runoff Tuesday, August 25, 2026

**Seats:** 5.

**System:** Party primaries; majority required or top two go to a runoff on the fourth Tuesday in August. Dates confirmed on the State Election Board's statutory calendar (https://oklahoma.gov/elections/elections-results/next-election/2026-statutory-election-dates-and-deadlines.html, loads): primary June 16, runoff primary Aug 25, general Nov 3.

**What is left:** Per Wikipedia's Oklahoma House page (fetched Aug 15; verify against the June 16 official results), only OK-1's Republican nomination went to a runoff; the other four districts and OK-1's Democratic slot were settled June 16. The Oklahoma Voice runoff voter guide (loads) lists no US House race on the Aug 25 runoff ballot in its summary, so double-check the official ballot list before the night. Either way, four of five districts can be flipped to general status now from the June 16 official results, and only OK-1 waits for Aug 25.

**Results URLs:**
- Runoff night: https://results.okelections.us/OKER/?elecDate=20260825. Our fetcher got HTTP 403 for both this and the June 16 version (https://results.okelections.us/OKER/?elecDate=20260616); this looks like a bot block, not a dead page. Open in a normal browser. Entry point that does load: https://oklahoma.gov/elections/elections-results/election-results/2026-election-results.html (lists June 16 with a link, Aug 25 as a placeholder with no link yet) and the June 16 page https://oklahoma.gov/elections/elections-results/election-results/2026-election-results/june-primary-election.html (loads, links to the OKER portal). Also the "Next Election" page https://oklahoma.gov/elections/elections-results/next-election.html (loads) which currently points to https://hosting.okelections.gov/electionlist.html (loads; it is the ballot list for Aug 25, not results).

**Timing:** Polls 7 am to 7 pm CDT. Early voting Aug 20 to 22. Certification date not published on the pages fetched; the State Election Board customarily certifies state and federal races on the Friday after the election (that would be Aug 28), so confirm on the results page rather than assuming.

**Traps:**
- The OKER results portal blocks scripted fetches; the person on the night needs a browser.
- Do not confuse the runoff with a general; the Aug 25 winner is the party nominee only.

---

## Massachusetts: Tuesday, September 1, 2026

**Seats:** 9.

**System:** Party primaries, plurality, no runoff. The primary was set for Sept 1 by statute passed in 2025 (Massachusetts Senate press release, https://malegislature.gov/PressRoom/Detail?pressReleaseId=255, loads).

**Results URL:** There is no official election-night page. The Secretary of the Commonwealth's Elections Division (https://www.sec.state.ma.us/divisions/elections/elections-and-voting.htm, loads) says: "We publish election results here after they're certified. We don't publish results on Election Night." Certified results go to https://electionstats.state.ma.us/ (loads; last data update shown Mar 31, 2026). Explanation page: https://www.sec.state.ma.us/divisions/elections/voting-information/announcing-certifying.htm (loads): local officials release unofficial results to media on the night; cities and towns have 4 days to send certified primary results to the state.

**Practical plan for the night:** Use AP (or NPR/major outlets carrying AP) for unofficial primary results, then confirm on electionstats when the state posts certified primary results (in past cycles that has taken one to a few weeks). Set app status to "unofficial, media-reported" until electionstats shows the 2026 State Primary.

**Certification:** No fixed date published. Local certification within 4 days (by about Sept 5), state tabulation after that; the site's late-Nov/early-Dec Governor's Council language applies to the general, not the primary.

**Traps:**
- Many House incumbents are unopposed in their primary; the state still holds the primary and reports votes, but nothing changes for the general field. Third-party and unenrolled general-election candidates never appear in the primary; they come from the state's general-election candidate list, not primary results.
- Write-in nominations: a party slot with no printed candidate can be filled by a write-in who reaches the statutory threshold, and that only becomes known after certification. Do not mark a party slot empty until the certified results are up.
- Candidate list: https://www.sec.state.ma.us/divisions/elections/research-and-statistics/candidates2026.htm (loads; links separate Democratic and Republican primary lists).
- The old sec.state.ma.us URL patterns (elections.htm, upcoming-elections.htm) are 404; use the two pages above.

---

## New Hampshire: Tuesday, September 8, 2026

**Seats:** 2.

**System:** Party primaries, plurality, no runoff. Undeclared voters may pick a party ballot on the day.

**Results URL:** The Secretary of State posts results by town under a page named like https://www.sos.nh.gov/2024-state-primary-election-results (2024 pattern), so 2026 should be https://www.sos.nh.gov/2026-state-primary-election-results. Every sos.nh.gov URL we tried on Aug 15 (elections home, political calendar, 2024 results page, an Aug 10, 2026 press release PDF) returned HTTP 403 to our fetcher, and sos.nh.gov/2026-state-primary-election-results failed on robots.txt. This is a bot block; the site is expected to work in a browser. Do not rely on scripted fetching for New Hampshire.

**Dates (New Hampshire Bulletin 2026 primary voter guide, https://newhampshirebulletin.com/voter-guides/2026-primary-election/, loads):** primary Sept 8, general Nov 3; recount requests due to the Secretary of State by Sept 11.

**Certification:** Not published on a page we could load. New Hampshire has no formal statewide certification meeting for primaries in the way other states do; the Secretary of State's posted results become the record after the recount window (Sept 11) closes. Treat results as unofficial until the SoS page stops updating and the recount deadline passes.

**Traps:**
- Results are posted town by town in tables and get updated over several days as towns file returns; the first version can be incomplete without saying so.
- Write-in nominations happen in New Hampshire when a party fielded no filed candidate; the SoS lists write-in nominees after tallying. Check the SoS page for a "write-in" note before marking a party slot empty.
- Both CDs are single statewide-style pages; make sure you are reading the correct district's table.

---

## Rhode Island: Wednesday, September 9, 2026

**Seats:** 2.

**System:** Party primaries, plurality, no runoff. Note the day: the primary is on a Wednesday. The Board of Elections calendar (https://elections.ri.gov/elections/upcoming-elections, loads, updated July 31, 2026) lists "9/9/26 Statewide Primary" and "11/3/26 Statewide General"; a Department of State release (https://www.ri.gov/press/view/50774, loads) says the date moved to Sept 9 "due to the Labor Day holiday". Some town pages and third-party calendars still say Sept 8; they are wrong.

**Results URL:** https://www.ri.gov/election/results/2026/statewide_primary/. Fetched Aug 15: 404 (created on election night). The 2024 twin https://www.ri.gov/election/results/2024/statewide_primary/ loads and shows the format: statewide contests grouped by party, "Representative in Congress District 1" and "District 2" for both parties, votes split into polling place, mail, and early voting, and a header that says "Official results: Updated ..." once final. Board of Elections index of past results: https://elections.ri.gov/elections/previous-election-results (loads).

**Certification:** Not published on the pages fetched. The Board of Elections certifies after mail ballots and provisionals are counted, typically within about a week to ten days; the ri.gov results header flips from unofficial to "Official results" when done. Use that header as the signal.

**Traps:**
- Wednesday election night, not Tuesday.
- Where a party has only one candidate for an office, Rhode Island does not hold that primary; the office will not appear under that party on the results page. Fill from the Department of State candidate list, not from results.
- Independent and third-party candidates skip the primary and appear only in the general.
- The 2024 page carries a warning that precincts with more than one scanner can show 100% reported when only one scanner has been received; do not treat "100%" on the night as final.
- Party labels on the state page are the ballot party; the app still uses FEC party.

---

## Delaware: Tuesday, September 15, 2026

**Seats:** 1 (at-large).

**System:** Closed party primaries, plurality, no runoff. Primary page: https://elections.delaware.gov/elections/primary/primary.html (loads; "Tuesday, September 15, 2026", polls 7 am to 8 pm).

**Results URL:** https://elections.delaware.gov/reports/PR2026.html. Fetched Aug 15: 404 (created on election night). The 2024 twin https://elections.delaware.gov/reports/PR2024.html loads and shows the format: a statewide summary per contest with drill-down by state representative district and county, separate Democratic and Republican results, and an "OFFICIAL RESULTS as of ..." stamp once certified. General results index: https://elections.delaware.gov/results/index.html (loads, currently shows only February 2026 school referenda).

**Certification (2026 State of Delaware Election Calendar PDF, https://elections.delaware.gov/public/calendar/pdfs/2026ElectionCalendar.pdf, loads):** "September 18, 2026: Department of Elections certifies the results of the September 15, 2026 State Primary Election." Protests due Sept 17 by 8 pm.

**Traps:**
- Unopposed candidates never appear on the primary ballot. The candidate list page (https://elections.delaware.gov/candidates/candidatelist/, loads) states: "Filed candidates appear on the General Election list unless and until a Primary Election is created by a subsequent candidate from the same political party filing for the same office." So if a party's House slot is missing from PR2026.html on the night, take the nominee from the General Election candidate list, not from results.
- The results page shows breakdowns by state representative district (41 of them); read the statewide summary line, not a district row.

---

## Louisiana: Tuesday, November 3, 2026 (open primary), runoff Saturday, December 12, 2026

**Seats:** 6.

**What happened to the closed party primary:** Louisiana's 2024 law created closed party primaries for Congress starting in 2026, and the 2026 US House party primary was set for May 16 with a second party primary June 27. After the US Supreme Court's decision in Louisiana v. Callais, Governor Landry suspended the House primaries only (Office of the Governor release, April 30, 2026, https://gov.louisiana.gov/news/5093, loads). The Legislature then passed HB 842 (WAFB, https://www.wafb.com/2026/05/14/louisiana-house-passes-hb-842-changes-2026-race-congress/, loads), which voids any House votes cast May 16 or June 27 and moves the 2026 US House races into the traditional fall open primary: all candidates of all parties on one ballot on November 3, majority wins, otherwise top two to a runoff on December 12, 2026. Secretary of State Nancy Landry confirmed the closed-primary House races are "officially cancelled" and will run through the fall open primary (AP via AOL, May 15, 2026, https://www.aol.com/news/louisiana-us-house-races-moved-215932961.html, loads). Qualifying ran Aug 5 to 7, 2026. A new six-district congressional map (SB 121) was signed May 29, 2026 (redistrictingonline.org, loads).

So for the app: November 3 is not a "party general" for Louisiana House. It is a first round. A candidate wins outright on Nov 3 only with a majority. Otherwise the top two go to Dec 12 regardless of party.

**Results URL:** https://voterportal.sos.la.gov/graphical (loads; the Secretary of State's live results portal with a Congressional tab, auto-refresh, and a download option). The sos.la.gov news and dates pages are blocked by robots.txt for scripted fetch (https://www.sos.la.gov/Pages/NewsandEvents.aspx and the election-dates page both refused), so use the portal and a browser.

**Certification:** Not published on a page we could load. Louisiana parishes promulgate about a week after the election and the Secretary of State certifies after that; watch the portal's status text.

**Traps:**
- Ballotpedia's Louisiana 2026 page (fetched Aug 15) still shows the old May 16 / June 27 party primary dates. It is stale for House. Trust the Governor and Secretary of State statements above.
- New map: district lines and numbering changed May 29, 2026. Rebuild the district list from qualifying results, not from the 2024 file. FEC district codes filed before the map may be stale for some candidates.
- Party labels on the Louisiana ballot include "No Party" and "Other"; app party still comes from FEC.
- The FEC file `data/fec/LA.json` may still contain candidates who filed for the cancelled May primary but did not qualify in August. Only candidates who qualified Aug 5 to 7 are on the Nov 3 ballot.
- Runoff mechanics: after Nov 3, set any district without a majority winner to "runoff Dec 12" with the top two.

---

## Checklist for the person on each night

1. Open the results URL from the table. If it 404s, use the 2024 twin's URL pattern with the year changed, or the state's results index listed in the section.
2. Confirm the page's own status word (unofficial/official) and copy it into the app status.
3. Flip each district's status only after every party primary in that district is resolved (or is confirmed as "no primary held" from the state candidate list: FL, RI, DE, MA, NH all have this case).
4. Party for every FEC-filed candidate comes from `data/fec/<STATE>.json`, never from the results page.
5. Re-check on the certification date in the section (AK Aug 31, FL Aug 27, WY Aug 26, DE Sept 18; others by status text) and update from unofficial to certified.
