# VAPP — Voter Match App (full-scale)

Nonpartisan iPhone/Android app for the November 3, 2026 election. Users take a
10-question issue quiz and get matched to the real candidates on their ballot —
by policy, never by party. Full plan: see `VAPP Full-Scale Plan.md` in the
Claude project.

## Layout

```
vapp/
├── apps/mobile/        # the Expo (React Native) app — iOS + Android
├── packages/core/      # shared logic: 10 issues, quiz, matching math (tested)
├── pipeline/           # data pipeline: FEC sync for all 50 states
└── data/               # synced + curated candidate data (JSON, per state)
```

## Core rules (do not break these)

1. Positions are scored −2..+2 per issue, or `null` = **"Not stated."**
2. A position is **never inferred** — not from party, not from anything.
   Unknown stays "Not stated." Every stated position needs a source URL.
3. Match % uses only issues where BOTH user and candidate have values,
   weighted ×2 for issues the user marked "matters."
4. Data tiers: `curated` (sourced, matchable) · `fec` (real candidate,
   positions not yet researched) · `sample` (fictional, clearly labeled).

## Run it

```bash
npm install                 # once, at repo root

npm test                    # matching-engine unit tests (11 tests)

node pipeline/fec-sync.mjs --mock          # test the FEC pipeline offline
FEC_API_KEY=xxx node pipeline/fec-sync.mjs # real 50-state sync (free key:
                                           # https://api.data.gov/signup/)

cd apps/mobile && npx expo start           # run the app; scan the QR code
                                           # with the Expo Go app on a phone
```

## Status (Phase 1 — July 2026)

Done: monorepo scaffold · matching engine ported + 11 passing tests · FEC
sync script (verified against fixture) · app boots with Welcome → Quiz →
Results on sample data.

Next: migrate prototype's curated 8-state policy DB · backend (Supabase or
Cloudflare) serving the candidate DB · curation web tool · address→district
lookup · remaining screens (browse, profile detail, My Ballot, checkout,
how-to-vote) · Newsreader/Public Sans fonts · EAS build + store submission
(target: submit by early October 2026).
