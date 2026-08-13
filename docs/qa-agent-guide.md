# M2V QA pass instructions

You are auditing already-shipped files in /home/claude/m2v/data/curated/. Read /home/claude/m2v/docs/curation-agent-guide.md first for the axes, sign convention, and hard rules; this file adds the QA procedure.

## For every race in your assigned state files

1. **Nominee check (worst errors hide here).** Independently verify via WebSearch + WebFetch: right person (watch for relatives and name collisions, e.g. the John E. vs Chris Sununu near-miss), right party, right race, hasn't dropped out or died, and whether any primary/runoff has RESOLVED since the file was written (as of today, Aug 13: Aug 18 and later primaries have NOT happened). If a race is marked `general` but the primary hadn't actually resolved, or vice versa, fix the status/statusNote/ballotStatus. Primary-pending candidates must NEVER read as nominees.
2. **Fetch EVERY positionSources URL** in your files with WebFetch. Dead/unreachable after one retry → the score comes OUT (set the axis to null, delete the positionSources entry, add a nullNotes entry "removed in QA: source URL dead <url>").
3. **Label-support check.** For each fetched page: does it LITERALLY document the claim in the label? "Sounds right" is not enough. If the page doesn't support the claim: remove or fix (if the page supports a different accurate label/score, correct both; otherwise null it with a nullNotes "removed in QA: cited page does not document the claim"). If the score's direction is right but strength wrong per the calibration anchors, adjust and say so.
4. **Standing rules sweep:** no inferred positions; no gun stances on the safety axis (if you find one, remove it); no party-based anything; no em-dashes in text you touch.
5. **Bio sanity:** age/home/now/background against a fetched source; fix errors.

## Output discipline

Edit the state files in place; keep JSON valid (`python3 -m json.tool`). Do NOT run git. Return ONLY a compact table, one row per race:

| race | candidates | URLs checked | problems found | action taken |

plus a final line: "CONFIDENCE: high/medium/low per race" with one clause of reasoning for anything below high. Flag anything you are less than confident in rather than quietly keeping it. Removing a wrong score is a win.
