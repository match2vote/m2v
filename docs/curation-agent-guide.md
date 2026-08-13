# M2V curation guide (for research passes)

You are producing `data/curated/<STATE>.json` in /home/claude/m2v. Study these two canonical examples FIRST and copy their exact schema: `/home/claude/m2v/data/curated/IA.json` (senate race, FEC ids, advancing list) and `/home/claude/m2v/data/curated/KS.json` (senate + governor in one file, governor entries, controversies, statusNote conventions).

## Hard rules (violations are worse than gaps)
1. A position is scored ONLY if a specific URL you actually fetched with WebFetch documents it. Never cite a page you didn't load. If a fetch fails, you may not use that URL.
2. Never infer from party. Undocumented axes stay `null`.
3. Gun stances do NOT map to the `safety` axis. Ignore gun positions entirely for scoring.
4. If the state's primary hasn't happened yet, race `status` = `"primary-pending"`, no `advancing` array, every candidate `ballotStatus: null`, and the statusNote says the primary date and that nominees aren't final. If the primary HAS happened, verify winners with a fetched URL + vote shares, `status: "general"`, `ballotStatus: "nominee"`.
5. Only general-election candidates (or clear primary frontrunners in pending states). Primary losers never appear.

## The 10 axes and sign convention
Score −2..+2 where **negative = stance A, positive = stance B**, 0 = documented mixed/conflicting (quote both sides in the label), null = not documented.

| key | A (negative) | B (positive) |
|---|---|---|
| cost | Intervene directly: cap prices, subsidies, min-wage raises | Step back: cut regs/taxes so markets lower prices |
| health | Bigger public role: expand Medicare/Medicaid toward universal | Bigger private role: competition, less government |
| housing | Public action: build public/affordable housing, protect renters | Unleash building: cut zoning/permits, market builds |
| immigration | Pathways/protections, higher legal immigration | Enforcement first: border security, deportations |
| taxes | Raise taxes on corporations/high earners to fund programs | Cut taxes across the board, reduce spending |
| climate | Act aggressively: rapid clean-energy transition, strict rules | Energy independence/cost: expand all sources incl. oil & gas |
| education | Into public schools: teacher pay, universal pre-K | Into choice: vouchers, charters, parental control |
| safety | Prevention: mental health, reentry, root causes | Enforcement: more police funding, tougher sentencing |
| repro | Protect access: guarantee the right to abortion | Restrict: limit or prohibit abortion |
| democracy | Easier voting: automatic registration, expanded mail/early | Stricter safeguards: voter ID, tighter rules |

Calibration anchors (from shipped data): Medicare for All = health −2; opposing M4A while backing market competition = +1; leading defeat of Medicaid expansion = +2. Voted for making TCJA permanent = taxes +2; targeted household tax cuts with no spending-cut agenda = null (doesn't fit the axis). "Protect the ballot box"/voter ID = democracy +1..+2; John Lewis VRA = −2; 2020 certification objections = +2; institutional democracy-defense orgs = −1; incidental items (deepfake bills) = null. Mixed zoning-dereg + Housing-First = housing 0. A candidate whose only safety item is routine police-funding appropriations = null.

## Per-candidate required fields
`id` (senate: look the person up in `/home/claude/m2v/data/fec/<STATE>.json` and reuse their exact `fec-...` id — REQUIRED so the bundler merges instead of duplicating; governors: `xx-gov-lastname`), `name`, `party`, `office` (`us-senate`/`governor`), `state`, `tier: "curated"`, `ballotStatus`, `incumbent`, `age`, `home`, `now`, `background` (2-4 sentences), `priorities` (top 3), `positions` (all 10 keys, null allowed), `positionSources` (entry per NON-null score: `label` = short evidence phrase ending with (source name), `url` = the fetched URL), `sources` (2-4 incl. FEC filing URL for senate candidates), `curatedAt: "2026-08-13"`, `controversies` only if documented.

## Writing style for labels
One compressed sentence, verbatim quotes where punchy, source name in parentheses. No em-dashes anywhere in any text you write (use commas/colons); the only permitted em-dash in the app is the SAMPLE BALLOT banner.

## Output
Write the completed file to `/home/claude/m2v/data/curated/<STATE>.json` (valid JSON, run `python3 -m json.tool` on it to check). Then return a SHORT summary (10 lines max): race(s), nominees + primary result URL, per-candidate list of scored axes vs nulls, anything uncertain. Do NOT run git commands. Do NOT modify any other file.
