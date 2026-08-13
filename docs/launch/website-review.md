# match2vote.org (GoDaddy landing site) — Review & Paste-Ready Fixes

Reviewed Aug 13, 2026, as a first-time visitor and as an app-store reviewer would see it. The site is the GoDaddy Website Builder landing page with pages: Home / About the APP / The Concept / Prototype / Your Feedback.

## The verdict in one paragraph

The bones are good: it says "nonpartisan," it disclaims endorsements, and it reads as sincere. But it describes a *hypothetical* app "in early development" — while the actual app is live, with 31 researched races, sourced positions, a working quiz, and a sample-ballot builder. **The single biggest gap: there is no link to the working app anywhere.** A visitor can't try the thing the site describes, and a Play/App Store reviewer checking the developer website will conclude the product barely exists. Second biggest: no privacy policy link and no contact email — both things store reviewers look for on a developer site.

## Fix list, in priority order

### 1. Add the app link everywhere (5 min, biggest win)
Add a prominent button on the Home page hero and at the bottom of every page:

> **Button text:** `Try M2V now — free, no sign-up`
> **Link:** the web app URL (once DNS is settled; currently the GitHub Pages address)

### 2. Replace "early development" framing — Home page hero
The app is real now. Paste-ready replacement for the homepage description:

> **Match2Vote (M2V) is a free, nonpartisan tool for the November 3, 2026 election.** Answer ten questions about the issues you care about and see how the real candidates on your ballot line up with you — by policy, never by party. Every candidate position is backed by a visible source link. We've researched 31 races across 22 states so far, and add more every week.
>
> M2V is an independent civic project. It does not endorse candidates, parties, or positions.

### 3. Update "About the APP" page
Two of its claims are now stale or slightly off:

- ~~"Survey responses are not saved"~~ → the real app saves your quiz progress **on your own device** so you can resume; nothing is ever uploaded. Paste-ready:
  > **Privacy:** M2V has no accounts, no ads, no analytics, and no trackers. Your quiz answers and ballot choices are stored only on your own device and never leave it. The app's only network request is downloading public candidate data. Full policy: match2vote.org/privacy
- ~~"in early development ... prototype"~~ → Paste-ready:
  > **Status:** The app is live on the web today, with iPhone and Android versions planned for fall 2026. Coverage currently spans 31 researched races across 22 states — every one hand-researched, every position source-linked — with new races added weekly through Election Day.

### 4. Replace the "Prototype" page with a "See it live" page
The prototype screenshots show the old design and set expectations low. Either delete the page or retitle it **"See it live"** with 3-4 current screenshots (cream/gold design: Home, quiz, a candidate profile with source links, the sample ballot) and the app link. I can supply current screenshots any time — there's a fresh 375px set in the repo.

### 5. Add a footer on every page (reviewer-credibility items)
> Contact: match2vote@gmail.com · Privacy policy: match2vote.org/privacy · Open source: github.com/match2vote/m2v
> M2V is nonpartisan. It favors no party and no candidate. Sample ballots in the app are clearly marked as unofficial.

### 6. "The Concept" page — one correction
It describes a "Voting Plan" feature for saving elections "for later review." In the real app this is **My Ballot** — a sample ballot you fill in and export. Paste-ready:

> **Your sample ballot:** Mark your choices race by race — with or without taking the quiz — and export a clearly-labeled sample ballot image to bring with you to the polls.

### 7. Small trust upgrades (optional, later)
- Retitle "Your Feedback" to "Report an error" and point it at match2vote@gmail.com with the promise: corrections reviewed against the record and shipped within hours (that's real — data updates don't need an app-store review).
- Add one line about method: "A candidate scores on an issue only when a public source documents their position. Unknown stays 'Not stated' — never guessed from party."

## Why this matters for the store review

Google's election-app review and Apple's 5.1.1/news guidelines both check the developer website for: (a) who runs it, (b) a privacy policy, (c) whether the product matches the listing. Right now the site describes a prototype-stage project with no privacy policy and no way to reach the developer — the app listing will claim a live, sourced, working tool. Aligning the two removes the most likely reviewer question before it gets asked.
