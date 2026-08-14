# M2V — Google Play Console Launch Pack

Everything Play Console will ask for, ready to paste. Prepared Aug 13, 2026 from the actual codebase (not assumptions). Items only kiki can do are in the checklist at the end.

---

## 1. Store listing

**App name (30 chars max):**
```
M2V: Match to Vote
```

**Short description (80 chars max, 79 used):**
```
See which 2026 candidates actually agree with you. By policy, never by party.
```

**Full description (4000 chars max, ~2,300 used):**
```
Ten questions. Real candidates. Zero party labels doing the thinking for you.

M2V (Match to Vote) is a nonpartisan guide to the November 3, 2026 election. Answer a 10-question quiz about the issues you actually care about — cost of living, healthcare, housing, immigration, taxes, climate, education, public safety, reproductive rights, and democracy — and see how the real candidates on your ballot line up with you, ranked by policy agreement, never by party.

WHY M2V IS DIFFERENT

• Every position is sourced. Every score a candidate gets carries a link to the page that documents it — a campaign site, a news report, a voting record. Tap any position to see the receipt.
• Nothing is ever inferred. If a candidate hasn't stated a position, we show "Not stated." We never guess from party affiliation. Our database physically rejects a scored position without a source.
• No party-based matching, ever. The matching engine doesn't know what a party is. Some of our results surprise people — that's the point.
• Honest coverage. We only show races we've actually researched. If we haven't covered your state yet, we say so plainly instead of showing you empty lists or placeholder names.

WHAT YOU CAN DO

• Take the quiz and get ranked matches for every covered race on your ballot, with a percentage based only on issues where both you and the candidate have a stated position.
• Skip the quiz entirely if you've done your own research, and go straight to marking up your ballot.
• Read full candidate profiles: background, top priorities, sourced positions, and documented controversies.
• Build a sample ballot that looks like the real thing, fill in the ovals, and export it as an image to bring to the polls. (It's clearly marked SAMPLE BALLOT — NOT AN OFFICIAL BALLOT.)
• Learn how to vote with a plain-language guide: registration, vote by mail, early voting, and Election Day.
• Works offline after the first load — even in a polling place with no signal.

PRIVACY, FOR REAL

No account. No ads. No analytics. No trackers. Your quiz answers and ballot choices never leave your phone. The app downloads public candidate data, and if you tap the button asking us to cover your state, it sends your two-letter state code and nothing else. Full policy: https://match2vote.github.io/m2v/privacy/

Match to Vote is a project of Page Not Found, a 501(c)(3) nonprofit organization based in Greenwich, Connecticut. It does not endorse candidates, parties, or positions. Candidate data comes from official FEC filings, state election records, and hand-researched, source-linked policy positions, updated continuously through Election Day.

Questions or corrections: match2vote@gmail.com
```

**App category:** News & Magazines (alternative: Books & Reference). NOT "Social."
**Tags:** elections, voting, civic engagement
**Contact email:** match2vote@gmail.com
**Website:** https://match2vote.org (marketing site) · app: https://match2vote.github.io/m2v/
**Privacy policy URL (required):** https://match2vote.github.io/m2v/privacy/

Graphics: 512×512 icon (in repo: `apps/mobile/assets/icon.png`, the real M2V mark as of Aug 14), 1024×500 feature graphic (in repo: `docs/launch/feature-graphic.png`), at least 2 phone screenshots (we have 375px screenshots; Play wants 16:9 or 9:16, min 320px — our ballot/quiz/profile screenshots work).

---

## 2. Data Safety form — answer key (verified against code Aug 14, 2026)

Audit basis: the app makes two kinds of network call (`api.js`). (1) A read-only GET to Supabase REST to download public candidate data. (2) Only when the user taps "I want M2V to cover my state" on an uncovered-state screen: a single INSERT of the two-letter state code to an insert-only table; the row stores the code and a server timestamp and nothing else (no IP retained in the table, no device/user/session id, no user agent; the app's key cannot read the table). All other user state (ballot state, quiz answers, picks, theme) is AsyncStorage/localStorage on device. No analytics SDK, no ads SDK, no crash reporting, no accounts, no permissions beyond INTERNET.

| Play question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **No** — see the state-code note below |
| Data collected: Location | No (state selection is a manual pick, stored on device; the optional "cover my state" tap sends a bare two-letter state code with no identifier attached — see note) |
| Data collected: Personal info (name, email, IDs) | No |
| Data collected: Financial info | No |
| Data collected: Health info | No |
| Data collected: Messages / Photos / Audio / Files | No |
| Data collected: App activity (in-app search, installed apps, other actions) | No (quiz answers and ballot picks are stored locally only, never transmitted) |
| Data collected: Web browsing | No |
| Data collected: App info and performance (crash logs, diagnostics) | No (no crash-reporting SDK) |
| Data collected: Device or other IDs | No (no advertising ID, no device ID collection) |
| Is data encrypted in transit? | Yes (the one network call is HTTPS) — only shown if you answer yes above; you won't need it |
| Can users request data deletion? | N/A — nothing is collected; deleting the app deletes all local data |

**Note on IP addresses:** server logs at the hosting level (Supabase) transiently process IPs to serve requests, like any website. Google's form treats ephemeral processing for delivery as NOT "collection" (their definition: collected = transmitted off device AND used beyond serving the request). Answer "No collection" is accurate. The privacy policy discloses the transient IP processing anyway, which is the belt-and-suspenders position.

**Note on the "cover my state" tap (added Aug 14):** the tap transmits a bare two-letter state code stored with a server timestamp and no identifier of any kind. Google's Data Safety guidance excludes data that is anonymized such that it can no longer be associated with an individual user; a state code shared by millions, with nothing to link it to a person or device, meets that bar, so the recommended answer above stays "No." If you want the zero-risk conservative posture instead, declare: Approximate location → collected (user-provided state), optional, NOT linked to identity, NOT shared, purpose "App functionality"; everything else unchanged. Either answer must match the shipped behavior, which it does; do not change the app without revisiting this table.

---

## 3. Content rating questionnaire — answer key

Category to pick: **"Reference, News, or Educational."**

| Question | Answer |
|---|---|
| Violence, blood, gore | No |
| Sexual content / nudity | No |
| Profanity or crude humor | No |
| Drugs, alcohol, tobacco references | **Yes → "reference only"** (some candidate positions reference cannabis-legalization policy; this is factual news/reference content). If the form only asks about *depictions or glamorization*: No. |
| Gambling | No |
| User-generated content or user interaction | No (no accounts, no chat, no content sharing between users) |
| Does the app share user location | No |
| In-app purchases | No |
| Ads | No |

Expected rating: **Everyone / PEGI 3** (possibly Everyone 10+ if the cannabis-reference answer is taken conservatively — either is fine).

---

## 4. Election-app compliance notes (for the "Government / News / Election" review, and any reviewer question)

Google's misinformation and election policies require election apps to be transparent about who they are and where information comes from. Paste-ready answers:

**Who publishes this app?**
Match to Vote is a project of Page Not Found, a 501(c)(3) public charity based in Greenwich, Connecticut (IRS-recognized, on the Publication 78 list). All code and data are public at github.com/match2vote/m2v. It is not affiliated with any party, campaign, PAC, or government agency, accepts no advertising, and endorses no one.

**Where does candidate data come from?**
Candidate rosters come from official FEC bulk data (nightly sync, visible in the repo's commit history) and state election records for governors. Policy positions are hand-researched: a position is shown only when a specific public source URL (campaign site, voting record, established news organization) documents it, and that source link is displayed to users next to every single scored position. Our database schema enforces this: it rejects any scored position lacking a source URL.

**How does matching work? Is it biased?**
Matching compares the user's stated issue positions to candidates' documented issue positions on a −2..+2 scale, computed only across issues where BOTH have a stated position. Party is not an input to the algorithm — the code is public and auditable. Candidates with no documented position on an issue are shown as "Not stated" rather than estimated, and races we haven't researched are either shown as names-only (clearly labeled) or not shown at all.

**Does the app tell users it isn't official?**
Yes. The sample ballot carries a permanent "SAMPLE BALLOT — NOT AN OFFICIAL BALLOT — For planning only" banner on screen and baked into every exported image. The app directs users to official state resources for registration and polling places, and its coverage messaging explicitly says when we haven't researched a state.

**Primary-election accuracy:**
Candidates in races whose primaries haven't happened are labeled as pending, never as nominees. Data updates ship server-side within hours, with no app update needed, so post-primary corrections are fast.

---

## 5. What only kiki can do — in order, with time estimates

1. **Finish the developer account** (~15 min + up to 2 days for Google's ID check): choose "Yourself" → legal name, address, phone SMS verification, government ID upload, $25 fee. Use match2vote@gmail.com (already signed in). DO NOT let anyone else's name go on this — it's permanent.
2. **Accept the developer agreements** (2 min): Play Console will show the Developer Distribution Agreement checkbox at the end of signup.
3. **Recruit 12+ Android testers** (start now, costs nothing): friends/family with Android phones who'll opt in to the closed test and keep the app installed for 14 continuous days. Get 15-16 emails so dropouts don't sink the count. Collect their Gmail addresses in a list.
4. **Once the account clears:** create the app in Play Console ("M2V: Match to Vote", App, Free) — 5 min. Then paste sections 1-4 of this pack into Store listing, Data safety, Content rating, and App content — ~30 min total.
5. **Expo/EAS token** (5 min, separate from Google): sign up at expo.dev with match2vote@gmail.com, create access token `m2v-builds`, add as GitHub secret `EXPO_TOKEN`. I build and upload the actual .aab from there.

## ⚠️ THE CLOSED-TEST CLOCK (the one hard deadline)

Personal Play accounts created now must run a closed test with **at least 12 testers opted in for 14 continuous days** before Google will grant production (public) access. After the 14 days, you apply for production and Google reviews the application (typically ~1-7 days).

Working backward from an early-October public launch (target Oct 1, hard deadline Oct 5):

| Milestone | Date |
|---|---|
| Public launch target | Oct 1-5 |
| Production-access review buffer | ~7 days → apply by **Sep 24** |
| 14 continuous test days end | Sep 23 |
| **LATEST safe closed-test start** | **Tuesday, Sep 9, 2026** |
| Recommended start (one-week cushion) | **Tuesday, Sep 2, 2026** |

Which means: developer account verified by ~Aug 28, EAS build uploaded and 12+ testers opted in by Sep 2. Tester recruitment is the long pole — start asking people now.
