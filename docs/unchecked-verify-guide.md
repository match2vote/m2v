# Unchecked-claims verification guide (Aug 30, 2026)

The Gemini fact-check bot could not read certain pages (Ballotpedia robots-blocks it, some sites are JS-only, and it chokes on giant roll-call XMLs). Your job: give every such claim its independent check by fetching the cited page yourself with WebFetch (which CAN read Ballotpedia and the roll XMLs) and confirming the page supports the stored label and score.

Read /root/m2v/docs/unsourced-pass-agent-guide.md first for the axes table, sign convention, calibration anchors, and the no-em-dash rule. WebSearch is unavailable; WebFetch only.

Work file: /root/m2v/docs/unchecked-claims.json (fields: state, id, name, axis, score, label, url). Group your claims by URL: one fetch answers all claims citing that page (for roll102.xml and roll190.xml, fetch once and ask for ALL your members' votes in one prompt; roll102 yes = democracy positive, no = negative; roll190 aye = taxes +2 for the member).

Per claim, outcome:
- CONFIRMED: the fetched page supports the label and the score's sign and rough magnitude. No change.
- DRIFT: page dead or content moved; a page you fetch elsewhere on the same site (or an official press release or named news article) documents the same position. Swap url and label to the verified page.
- RELABEL: page supports the position but the stored label or score misstates it. Correct label (verbatim quotes) and score per the calibration anchors.
- UNSUPPORTED: nothing fetchable supports it. Null the axis, delete its positionSources entry, add nullNote "second-check Aug 30, 2026: <what you found>". Never substitute party inference.
If a fetch fails (403/robots/JS), retry once, try one alternate page on the same site, then if the claim's ORIGINAL research fetch is plausible and the label carries a verbatim quote, record outcome UNVERIFIABLE in the ledger and leave the data unchanged; UNVERIFIABLE is for genuinely unreachable pages only.

Edit only data/curated/<STATE>.json for your assigned states. If a null drops a general-status race below the 7-overlap floor, park the race per the main guide. Append every decision to your own ledger file /root/m2v/docs/ledgers/unchecked-verify-<GROUP>.md (one line per claim: state|id|axis|outcome|note). Verify gate: python3 -m json.tool on edited files; node pipeline/bundle-data.mjs exits 0 (retry once after 30s if another agent is mid-write). Final response under 15 lines: per-state counts by outcome, races re-parked, anything odd.
