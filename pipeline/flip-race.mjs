// Flip a primary-pending race to general in one clean operation.
//
//   node pipeline/flip-race.mjs <raceId> <winnerId> [otherAdvancingId ...] [--note "..."]
//
// Example, the morning after the Aug 18 Alaska primary:
//   node pipeline/flip-race.mjs AK-senate fec-S4AK00214 fec-S6AK00276 \
//     --note "Sullivan and Peltola advanced from the Aug 18 top-4 primary to the ranked-choice general."
//
// What it does to data/curated/<STATE>.json:
//   - race.status -> "general"; primaryDate removed; advancing = the ids given
//   - every curated candidate in that race: in the list -> ballotStatus "nominee",
//     not in the list -> ballotStatus "lost" (they drop off Browse AND the ballot)
//   - statusNote replaced if --note given, otherwise prefixed with "UPDATE ME:"
// Then run `node pipeline/bundle-data.mjs`, spot-check, commit, push.
// The winner's nullNotes should get a fresh backfill pass afterward.
import { readFile, writeFile } from 'node:fs/promises';

const args = process.argv.slice(2);
const noteIdx = args.indexOf('--note');
const note = noteIdx >= 0 ? args[noteIdx + 1] : null;
const positional = noteIdx >= 0 ? args.slice(0, noteIdx) : args;
const [raceId, ...advancing] = positional;
if (!raceId || advancing.length === 0) {
  console.error('usage: node pipeline/flip-race.mjs <raceId> <winnerId> [moreAdvancing...] [--note "..."]');
  process.exit(1);
}
const state = raceId.split('-')[0];
const file = new URL(`../data/curated/${state}.json`, import.meta.url);
const data = JSON.parse(await readFile(file, 'utf8'));
const race = data.races?.[raceId];
if (!race) { console.error(`race ${raceId} not found in ${state}.json`); process.exit(1); }
if (race.status !== 'primary-pending') console.warn(`warning: ${raceId} status is "${race.status}", not primary-pending`);

race.status = 'general';
race.advancing = advancing;
delete race.primaryDate;
race.statusNote = note || `UPDATE ME: ${race.statusNote || ''}`;

const office = raceId.includes('governor') ? 'governor' : raceId.includes('mayor') ? 'mayor' : raceId.includes('senate') ? 'us-senate' : 'us-house';
let flipped = 0, lost = 0;
for (const c of data.candidates) {
  if (c.office !== office) continue;
  if (advancing.includes(c.id)) { c.ballotStatus = 'nominee'; flipped++; }
  else if (c.ballotStatus === null || c.ballotStatus === 'filed') { c.ballotStatus = 'lost'; lost++; }
}
await writeFile(file, JSON.stringify(data, null, 2) + '\n');
console.log(`${raceId} -> general; ${flipped} nominee(s), ${lost} marked lost. Now: bundle, verify, commit.${note ? '' : ' statusNote needs manual text!'}`);
