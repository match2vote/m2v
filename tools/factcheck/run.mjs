#!/usr/bin/env node
// M2V fact-check bot
// Reads data/curated/*.json, fetches every cited source URL, and asks the
// Gemini API whether the page actually supports each position's label and score.
// Flag-only: never modifies app data. Writes factcheck-results.jsonl (checkpoint),
// factcheck-report.csv and factcheck-report.html into this folder.
//
// Usage:
//   node run.mjs check --key YOUR_GEMINI_KEY            # full run (resumes automatically)
//   node run.mjs check --states VT,CT --key ...         # just some states
//   node run.mjs check --dry-run                        # no API key needed: collect + fetch + URL health only
//   node run.mjs report                                 # rebuild CSV/HTML from results so far
// Options: --model gemini-2.5-flash | gemini-2.5-flash-lite   (default gemini-2.5-flash)
//          --rpm 8            requests per minute (stay under your tier's limit)
//          --max-calls 240    stop after N Gemini calls this run (free daily quota)
//          --limit N          only first N URL groups (for testing)
//          --repo PATH        repo root (default: two levels up from this script)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const cmd = args[0] && !args[0].startsWith('--') ? args[0] : 'check';
function flag(name, dflt) {
  const i = args.indexOf('--' + name);
  if (i === -1) return dflt;
  const v = args[i + 1];
  return (v === undefined || v.startsWith('--')) ? true : v;
}
const REPO = path.resolve(flag('repo', path.join(HERE, '..', '..')));
const DATA_DIR = path.join(REPO, 'data', 'curated');
const KEY = flag('key', process.env.GEMINI_API_KEY || '');
const GH_TOKEN = process.env.GITHUB_TOKEN || '';
// Engine: gemini (needs GEMINI_API_KEY) or github (GitHub Models, needs GITHUB_TOKEN,
// free inside GitHub Actions with `permissions: models: read`). Auto-picks Gemini when a key is set.
const ENGINE = flag('engine', KEY ? 'gemini' : (GH_TOKEN ? 'github' : 'gemini'));
let MODEL = flag('model', ENGINE === 'github' ? 'openai/gpt-4o-mini' : '');

// Ask the Gemini API which models this key can use and pick the best general Flash model.
// Keeps the bot working as Google renames/retires models.
async function resolveGeminiModel() {
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000',
      { headers: { 'x-goog-api-key': KEY } });
    if (!res.ok) throw new Error('ListModels HTTP ' + res.status);
    const j = await res.json();
    const names = (j.models || [])
      .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
      .map(m => m.name.replace(/^models\//, ''));
    const bad = /(lite|image|tts|audio|live|exp|preview|embed|thinking|nano|8b|robotics|computer)/i;
    const flash = names.filter(n => /flash/i.test(n) && !bad.test(n));
    const ver = n => { const m = n.match(/gemini-(\d+(?:\.\d+)?)/); return m ? parseFloat(m[1]) : 0; };
    flash.sort((a, b) => ver(b) - ver(a) || a.length - b.length);
    const pick = flash[0] || names.find(n => /gemini/i.test(n) && !bad.test(n)) || names[0];
    console.log('Models available to this key (sample):', names.slice(0, 15).join(', '));
    if (!pick) throw new Error('No usable model in ListModels response');
    return pick;
  } catch (e) {
    console.log('Model auto-detect failed (' + e.message + '); falling back to gemini-flash-latest');
    return 'gemini-flash-latest';
  }
}
const RPM = Number(flag('rpm', 8));
const MAX_CALLS = Number(flag('max-calls', 100000));
const LIMIT = Number(flag('limit', 0));
const DRY = !!flag('dry-run', false);
const STATES = flag('states', 'ALL');
const RESULTS = path.join(HERE, 'factcheck-results.jsonl');
const CACHE_DIR = path.join(HERE, 'page-cache');

const AXES = {
  cost:       ['Intervene directly: cap prices, subsidies, minimum-wage raises', 'Step back: cut regulations/taxes so markets lower prices'],
  health:     ['Bigger public role: expand Medicare/Medicaid toward universal coverage', 'Bigger private role: competition, less government'],
  housing:    ['Public action: build public/affordable housing, protect renters', 'Unleash building: cut zoning/permits, let the market build'],
  immigration:['Pathways/protections, higher legal immigration', 'Enforcement first: border security, deportations'],
  taxes:      ['Raise taxes on corporations/high earners to fund programs', 'Cut taxes across the board, reduce spending'],
  climate:    ['Act aggressively: rapid clean-energy transition, strict rules', 'Energy independence/cost: expand all sources including oil and gas'],
  education:  ['Into public schools: teacher pay, universal pre-K', 'Into choice: vouchers, charters, parental control'],
  safety:     ['Prevention: mental health, reentry, root causes', 'Enforcement: more police funding, tougher sentencing'],
  repro:      ['Protect access: guarantee the right to abortion', 'Restrict: limit or prohibit abortion'],
  democracy:  ['Easier voting: automatic registration, expanded mail/early voting', 'Stricter safeguards: voter ID, tighter rules'],
};

// ---------- 1. Collect claims ----------
function collectClaims() {
  const wanted = STATES === 'ALL' ? null : new Set(String(STATES).toUpperCase().split(',').map(s => s.trim()));
  const claims = [];
  for (const f of fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json')).sort()) {
    const st = f.replace('.json', '');
    if (wanted && !wanted.has(st)) continue;
    let j;
    try { j = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8')); }
    catch (e) { claims.push({ state: st, mech: 'STATE_FILE_INVALID_JSON', note: String(e.message) }); continue; }
    for (const c of (j.candidates || [])) {
      const pos = c.positions || {};
      const srcs = c.positionSources || {};
      for (const [axis, score] of Object.entries(pos)) {
        if (score === null || score === undefined) continue;
        const s = srcs[axis];
        const base = { state: st, id: c.id, name: c.name, party: c.party, office: c.office, axis, score };
        if (!s || !s.url) { claims.push({ ...base, mech: 'SCORED_BUT_NO_SOURCE', label: s?.label || '' }); continue; }
        if (typeof score !== 'number' || score < -2 || score > 2) claims.push({ ...base, mech: 'SCORE_OUT_OF_RANGE', label: s.label, url: s.url });
        if (!AXES[axis]) { claims.push({ ...base, mech: 'UNKNOWN_AXIS', label: s.label, url: s.url }); continue; }
        claims.push({ ...base, label: s.label, url: s.url });
      }
      for (const [axis, s] of Object.entries(srcs)) {
        if ((pos[axis] === null || pos[axis] === undefined) && s)
          claims.push({ state: st, id: c.id, name: c.name, party: c.party, office: c.office, axis, mech: 'SOURCE_BUT_NULL_SCORE', label: s.label || '', url: s.url });
      }
    }
  }
  return claims;
}

// ---------- 2. Fetch pages (cached) ----------
function cachePath(url) {
  const h = [...url].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  return path.join(CACHE_DIR, h.toString(16) + '.json');
}
function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<(nav|footer|header)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>(?=.)/gi, '\n').replace(/<\/(p|div|li|h[1-6]|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n)).replace(/&quot;/g, '"').replace(/&#x27;|&apos;/g, "'")
    .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}
async function fetchPage(url) {
  const cp = cachePath(url);
  if (fs.existsSync(cp)) return JSON.parse(fs.readFileSync(cp, 'utf8'));
  let out;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 25000);
    const res = await fetch(url, {
      signal: ctrl.signal, redirect: 'follow',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
                 'Accept': 'text/html,application/xhtml+xml,application/pdf;q=0.9,*/*;q=0.8', 'Accept-Language': 'en-US,en;q=0.9' },
    });
    clearTimeout(t);
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!res.ok) out = { status: res.status, kind: 'error' };
    else if (ct.includes('pdf') || url.toLowerCase().endsWith('.pdf')) {
      const buf = Buffer.from(await res.arrayBuffer());
      out = buf.length > 6_000_000 ? { status: res.status, kind: 'pdf-too-big' }
                                   : { status: res.status, kind: 'pdf', b64: buf.toString('base64') };
    } else {
      const text = htmlToText(await res.text());
      out = text.length < 200 ? { status: res.status, kind: 'thin', text }
                              : { status: res.status, kind: 'html', text: text.slice(0, 60000) };
    }
  } catch (e) {
    // transient network failure: do NOT cache, so a later run retries the fetch
    return { status: 0, kind: 'unreachable', note: String(e && e.message || e).slice(0, 200) };
  }
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cp, JSON.stringify(out));
  return out;
}

// ---------- 3. Gemini ----------
let lastCall = 0;
async function throttle() {
  const gap = Math.ceil(60000 / RPM);
  const wait = lastCall + gap - Date.now();
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCall = Date.now();
}
function buildPrompt(group, page) {
  const claimLines = group.map((c, i) => {
    const [neg, pos] = AXES[c.axis];
    return `CLAIM ${i + 1}: Candidate ${c.name} (${c.party}, ${c.office}, ${c.state}).\n` +
      `Issue axis "${c.axis}": negative scores (-1,-2) mean "${neg}"; positive scores (+1,+2) mean "${pos}"; 0 means the page documents a genuinely mixed/conflicting record.\n` +
      `Stored score: ${c.score >= 0 ? '+' + c.score : c.score}. Stored evidence label: "${c.label}"`;
  }).join('\n\n');
  return `You are an independent fact-checker for a nonpartisan voter guide. Below ${group.length === 1 ? 'is one claim' : 'are ' + group.length + ' claims'} about political candidates, each citing the attached source page as evidence.

For EACH claim, judge ONLY what the attached page contains. The test is not whether the claim is true in the world; the test is whether THIS PAGE documents it.

${claimLines}

For each claim answer:
- label_check: "supported" (the page contains the facts the label states), "partial" (some of it, or weaker than stated), or "not_on_page" (the page does not contain it)
- score_check: "consistent" (what the page documents matches the stored score's sign and rough strength on that axis), "too_strong" (right direction, magnitude overstated), "wrong_direction" (the page suggests the opposite sign), or "cannot_judge" (page has nothing relevant to this axis)
- verdict: overall "TRUE" if label_check=supported and score_check=consistent; "MOSTLY_TRUE" for partial/too_strong; "FALSE" if not_on_page or wrong_direction; "CANNOT_JUDGE" otherwise
- note: one sentence quoting or citing what the page actually says (or that it says nothing)

Respond with ONLY a JSON array, one object per claim in order, each: {"claim":1,"label_check":"...","score_check":"...","verdict":"...","note":"..."}`;
}
async function askGitHubModels(group, page) {
  const content = buildPrompt(group, page) + '\n\n----- SOURCE PAGE TEXT (extracted from ' + group[0].url + ') -----\n' + (page.text || '');
  const body = { model: MODEL, messages: [{ role: 'user', content }], temperature: 0.1, max_tokens: 4000 };
  for (let attempt = 1; attempt <= 5; attempt++) {
    await throttle();
    const res = await fetch('https://models.github.ai/inference/chat/completions',
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GH_TOKEN, 'Accept': 'application/vnd.github+json' }, body: JSON.stringify(body) });
    if (res.status === 429 || res.status >= 500) {
      const ra = Number(res.headers.get('retry-after')) || 0;
      const wait = ra ? (ra + 2) * 1000 : Math.min(120000, 7000 * attempt * attempt);
      process.stdout.write(`  [${res.status}, retry in ${Math.round(wait / 1000)}s]`);
      await res.text();
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) throw new Error('GitHub Models HTTP ' + res.status + ': ' + (await res.text()).slice(0, 300));
    const j = await res.json();
    const text = j.choices?.[0]?.message?.content || '';
    const m = text.match(/\[[\s\S]*\]/);
    if (!m) throw new Error('No JSON in reply: ' + text.slice(0, 200));
    return JSON.parse(m[0]);
  }
  throw new Error('Rate-limited after 5 attempts. Daily quota may be exhausted; rerun tomorrow, it will resume.');
}
async function askGemini(group, page) {
  if (ENGINE === 'github') return askGitHubModels(group, page);
  const parts = [{ text: buildPrompt(group, page) }];
  if (page.kind === 'pdf') parts.push({ inline_data: { mime_type: 'application/pdf', data: page.b64 } });
  else parts.push({ text: '\n----- SOURCE PAGE TEXT (extracted from ' + group[0].url + ') -----\n' + (page.text || '') });
  const body = { contents: [{ parts }], generationConfig: { temperature: 0.1, maxOutputTokens: 4000 } };
  for (let attempt = 1; attempt <= 5; attempt++) {
    await throttle();
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.status === 429 || res.status >= 500) {
      const txt = await res.text();
      const m = txt.match(/"retryDelay"\s*:\s*"(\d+)s"/);
      const wait = m ? (Number(m[1]) + 2) * 1000 : Math.min(90000, 5000 * attempt * attempt);
      process.stdout.write(`  [${res.status}, retry in ${Math.round(wait / 1000)}s]`);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) throw new Error('Gemini HTTP ' + res.status + ': ' + (await res.text()).slice(0, 300));
    const j = await res.json();
    const text = j.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';
    const m = text.match(/\[[\s\S]*\]/);
    if (!m) throw new Error('No JSON in Gemini reply: ' + text.slice(0, 200));
    return JSON.parse(m[0]);
  }
  throw new Error('Rate-limited after 5 attempts. Daily quota may be exhausted; rerun tomorrow, it will resume.');
}

// ---------- 4. Results + report ----------
function loadDone() {
  const done = new Map();
  if (fs.existsSync(RESULTS))
    for (const line of fs.readFileSync(RESULTS, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      try { const r = JSON.parse(line); done.set(r.key, r); } catch {}
    }
  return done;
}
const keyOf = c => `${c.state}|${c.id}|${c.axis}`;
function record(rows) {
  fs.appendFileSync(RESULTS, rows.map(r => JSON.stringify(r)).join('\n') + '\n');
}
const SEV = { FALSE: 0, MOSTLY_TRUE: 1, CANNOT_JUDGE: 2, FETCH_BLOCKED: 3, PAGE_UNREADABLE: 3, API_ERROR: 4, MECHANICAL: 5, TRUE: 6 };
function writeReport() {
  const rows = [...loadDone().values()];
  rows.sort((a, b) => (SEV[a.verdict] ?? 9) - (SEV[b.verdict] ?? 9) || a.state.localeCompare(b.state) || String(a.name).localeCompare(String(b.name)));
  const esc = v => { v = String(v ?? ''); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  const cols = ['verdict', 'state', 'name', 'party', 'office', 'axis', 'score', 'label_check', 'score_check', 'note', 'label', 'url'];
  fs.writeFileSync(path.join(HERE, 'factcheck-report.csv'), cols.join(',') + '\n' + rows.map(r => cols.map(c => esc(r[c])).join(',')).join('\n'));
  const counts = {};
  for (const r of rows) counts[r.verdict] = (counts[r.verdict] || 0) + 1;
  const badge = v => ({ TRUE: '#1a7f37', MOSTLY_TRUE: '#9a6700', FALSE: '#cf222e', CANNOT_JUDGE: '#57606a', FETCH_BLOCKED: '#8250df', PAGE_UNREADABLE: '#8250df', API_ERROR: '#57606a', MECHANICAL: '#0969da' }[v] || '#57606a');
  const he = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const html = `<!doctype html><meta charset="utf-8"><title>M2V fact-check report</title>
<style>body{font:14px/1.5 system-ui;margin:24px;color:#1f2328;background:#fff}h1{font-size:20px}
.sum span{display:inline-block;margin:2px 8px 2px 0;padding:2px 10px;border-radius:12px;color:#fff;font-weight:600}
table{border-collapse:collapse;width:100%;margin-top:14px}th,td{border-bottom:1px solid #d0d7de;padding:6px 8px;text-align:left;vertical-align:top}
th{position:sticky;top:0;background:#f6f8fa}td.v{white-space:nowrap;font-weight:700}
select,input{padding:4px 6px;margin-right:8px}a{color:#0969da}small{color:#57606a}</style>
<h1>M2V fact-check report</h1><p><small>Generated ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC. ${rows.length} checks. Flag-only: nothing in the app data was changed.</small></p>
<p class="sum">${Object.entries(counts).map(([v, n]) => `<span style="background:${badge(v)}">${v}: ${n}</span>`).join('')}</p>
<p><select id="fv"><option value="">all verdicts</option>${Object.keys(counts).map(v => `<option>${v}</option>`).join('')}</select>
<select id="fs"><option value="">all states</option>${[...new Set(rows.map(r => r.state))].sort().map(s => `<option>${s}</option>`).join('')}</select>
<input id="fq" placeholder="search name/axis/note" size="30"></p>
<table><thead><tr><th>Verdict</th><th>State</th><th>Candidate</th><th>Axis</th><th>Score</th><th>What the checker found</th><th>Stored label</th><th>Source</th></tr></thead><tbody>
${rows.map(r => `<tr data-v="${he(r.verdict)}" data-s="${he(r.state)}"><td class="v" style="color:${badge(r.verdict)}">${he(r.verdict)}</td><td>${he(r.state)}</td><td>${he(r.name)}<br><small>${he(r.party)} · ${he(r.office)}</small></td><td>${he(r.axis)}</td><td>${r.score ?? ''}</td><td>${he(r.note)}${r.label_check ? `<br><small>label: ${he(r.label_check)} · score: ${he(r.score_check)}</small>` : ''}</td><td><small>${he(r.label)}</small></td><td>${r.url ? `<a href="${he(r.url)}" target="_blank">link</a>` : ''}</td></tr>`).join('\n')}
</tbody></table>
<script>const f=()=>{const v=fv.value,s=fs.value,q=fq.value.toLowerCase();for(const tr of document.querySelectorAll('tbody tr')){tr.style.display=(!v||tr.dataset.v===v)&&(!s||tr.dataset.s===s)&&(!q||tr.textContent.toLowerCase().includes(q))?'':'none'}};fv.onchange=fs.onchange=f;fq.oninput=f;</script>`;
  fs.writeFileSync(path.join(HERE, 'factcheck-report.html'), html);
  console.log('\nReport written: factcheck-report.csv, factcheck-report.html');
  console.log('Verdicts:', Object.entries(counts).map(([v, n]) => `${v}=${n}`).join('  '));
}

// ---------- main ----------
async function main() {
  if (cmd === 'report') return writeReport();
  if (!fs.existsSync(DATA_DIR)) { console.error('Cannot find ' + DATA_DIR + ' (use --repo)'); process.exit(1); }
  if (!DRY && !KEY && !(ENGINE === 'github' && GH_TOKEN)) { console.error('No credentials. Pass --key / set GEMINI_API_KEY, or set GITHUB_TOKEN with --engine github, or use --dry-run.'); process.exit(1); }
  if (!MODEL) MODEL = ENGINE === 'github' ? 'openai/gpt-4o-mini' : (DRY ? '(dry run)' : await resolveGeminiModel());
  if (!DRY) console.log(`Engine: ${ENGINE} (${MODEL})`);

  const all = collectClaims();
  const mech = all.filter(c => c.mech);
  const checkable = all.filter(c => !c.mech && c.url);
  console.log(`Collected ${checkable.length} sourced positions (${mech.length} mechanical findings) across ${new Set(all.map(c => c.state)).size} states.`);

  const done = loadDone();
  for (const m of mech) {
    const k = keyOf(m) + '|mech|' + m.mech;
    if (!done.has(k)) { record([{ key: k, ...m, verdict: 'MECHANICAL', note: m.mech, label_check: '', score_check: '' }]); done.set(k, m); }
  }

  const groups = new Map();
  for (const c of checkable) {
    const prev = done.get(keyOf(c));
    if (prev && prev.verdict !== 'API_ERROR') continue; // API_ERROR rows are retried (last write wins in the report)
    if (!groups.has(c.url)) groups.set(c.url, []);
    groups.get(c.url).push(c);
  }
  let list = [...groups.entries()];
  if (LIMIT) list = list.slice(0, LIMIT);
  console.log(`${list.length} source URLs to process this run (${[...groups.values()].flat().length} claims remaining total).${DRY ? ' DRY RUN: fetch only.' : ''}`);

  let calls = 0, i = 0;
  for (const [url, group] of list) {
    i++;
    process.stdout.write(`[${i}/${list.length}] ${group.length} claim(s) ← ${url.slice(0, 90)} `);
    const page = await fetchPage(url);
    if (page.kind === 'error' || page.kind === 'unreachable' || page.kind === 'thin' || page.kind === 'pdf-too-big') {
      const verdict = page.kind === 'unreachable' ? 'API_ERROR' // retried next run
        : (page.status === 403 || page.status === 999 ? 'FETCH_BLOCKED' : 'PAGE_UNREADABLE');
      record(group.map(c => ({ key: keyOf(c), ...c, verdict, label_check: '', score_check: '', note: `Could not read page (HTTP ${page.status || 'none'}, ${page.kind}${page.note ? ': ' + page.note : ''}). Needs a manual look.` })));
      console.log('→ ' + verdict);
      continue;
    }
    if (DRY) { console.log('→ fetched ok (' + page.kind + ')'); continue; }
    if (page.kind === 'pdf' && ENGINE === 'github') {
      record(group.map(c => ({ key: keyOf(c), ...c, verdict: 'PAGE_UNREADABLE', label_check: '', score_check: '', note: 'PDF source; this engine cannot read PDFs. Check manually or rerun with a Gemini key.' })));
      console.log('→ PDF skipped (github engine)');
      continue;
    }
    if (calls >= MAX_CALLS) { console.log('\nReached --max-calls; rerun later to resume.'); break; }
    try {
      const verdicts = await askGemini(group, page);
      calls++;
      record(group.map((c, idx) => {
        const v = verdicts.find(x => x.claim === idx + 1) || verdicts[idx] || {};
        return { key: keyOf(c), ...c, verdict: v.verdict || 'API_ERROR', label_check: v.label_check || '', score_check: v.score_check || '', note: v.note || 'No verdict returned' };
      }));
      console.log('→ ' + verdicts.map(v => v.verdict).join(', '));
    } catch (e) {
      console.log('→ API_ERROR: ' + String(e.message).slice(0, 140));
      if (/quota|Rate-limited/i.test(String(e.message))) break; // stop cleanly, resume later
      record(group.map(c => ({ key: keyOf(c), ...c, verdict: 'API_ERROR', label_check: '', score_check: '', note: String(e.message).slice(0, 200) })));
    }
  }
  writeReport();
}
main().catch(e => { console.error(e); process.exit(1); });
