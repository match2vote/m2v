# M2V fact-check bot

An independent checker for every politician entry in the app. For each candidate's scored positions it fetches the exact source URL stored in `positionSources` and asks Google's Gemini model one question: does this page actually document what the label says, and does it support the stored score's direction and strength? It is deliberately NOT Claude, so it is a second opinion on data Claude helped write.

It is flag-only. It never edits any file under `data/`. The output is a report you (or a Claude session) act on.

## Verdicts

- **TRUE**: the page contains the label's facts and matches the score.
- **MOSTLY_TRUE**: partially supported, or right direction but the score overstates it.
- **FALSE**: the page does not contain the claim, or points the opposite way. Read these first.
- **CANNOT_JUDGE**: the page loaded but has nothing relevant.
- **FETCH_BLOCKED / PAGE_UNREADABLE**: the site refused the bot or returned junk; check by hand in a browser.
- **MECHANICAL**: schema problems found without AI (a scored position with no source, a source on a null score, a score out of range).

Remember the standard from the run book: FALSE means "the cited page does not support it," not necessarily "the fact is wrong in the world." A true fact with the wrong citation still fails the app's own verify-gate rule.

## One-time setup

1. Get a free Gemini API key: go to https://aistudio.google.com/apikey, sign in with any Google account, click "Create API key". No card needed for the free tier.
2. Have Node 18+ installed (`node --version`).

## Running it

From the repo root:

```
node tools/factcheck/run.mjs check --key YOUR_KEY_HERE
```

Useful variants:

```
node tools/factcheck/run.mjs check --dry-run                 # no key needed: finds dead/blocked URLs + mechanical issues only
node tools/factcheck/run.mjs check --states VT,CT --key ...  # limit to some states
node tools/factcheck/run.mjs check --limit 20 --key ...      # small test batch
node tools/factcheck/run.mjs report                          # rebuild the report from results so far
```

## Free-tier pacing (important)

There are about **1,077 unique source URLs** covering the 2,149 scored positions; claims sharing a URL are checked in one API call, so a full pass is roughly 1,050 Gemini calls plus the page fetches.

Google's free tier limits requests per minute and per day, and the numbers change; check https://ai.google.dev/gemini-api/docs/rate-limits for the current ones. As of mid-2026 the free daily cap on `gemini-2.5-flash` meant a full pass took a few days; `--model gemini-2.5-flash-lite` has a much higher daily cap and can usually finish in a day, with slightly less careful judgment.

You do not have to babysit any of this:

- The script throttles itself (`--rpm 8` by default; raise it if your tier allows).
- **Every result is checkpointed** to `factcheck-results.jsonl`. When the daily quota runs out the script stops cleanly; run the same command again tomorrow and it resumes exactly where it left off, skipping everything already judged.
- Pages are cached in `page-cache/` so re-runs never re-download.
- `--max-calls 240` stops after N calls if you want to stay safely under a daily cap.

## Reading the report

Open `tools/factcheck/factcheck-report.html` in a browser: filterable by verdict and state, worst first, each row shows what the checker found next to the stored label, with a link to the source. `factcheck-report.csv` is the same data for spreadsheets.

Fixing flagged entries stays a human/Claude job: re-fetch the page yourself, then correct the score, label, or URL in `data/curated/<STATE>.json`, or set the axis to null with a nullNotes entry, per the House Positions run book.

## Notes

- Sites known to block bots (some state pages, congress.gov) will show FETCH_BLOCKED; that is the site, not an error in your data.
- PDFs are handed to Gemini directly, so PDF sources get judged too.
- The AI's verdict is a lead, not a ruling. Before changing any entry, load the page yourself. Expect some false alarms on pages that load content with JavaScript (the bot sees less of the page than a browser does).
