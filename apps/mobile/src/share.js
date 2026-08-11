// Shareable images, drawn on a canvas (web). Native falls back to the share
// sheet with text until view-shot is wired into the dev build.
// Rules baked in: no party red/blue; the SAMPLE BALLOT banner is part of the
// exported ballot image and cannot be cropped out of the layout top.
import { Platform, Share } from 'react-native';

const BRAND = { bg: '#0E5A43', paper: '#FFFDF8', ink: '#141210', soft: '#645E55', bright: '#3DDC97', gold: '#C78A19' };
const URL_LINE = 'match2vote.github.io/m2v';

function download(canvas, filename) {
  try {
    const a = document.createElement('a');
    a.download = filename;
    a.href = canvas.toDataURL('image/png');
    a.click();
    return true;
  } catch { return false; }
}

// ---- Result card: story-sized (1080x1920) "my top matches" ----
export async function shareResultCard({ stateName, rows }) {
  const top = rows.slice(0, 3);
  if (Platform.OS !== 'web') {
    const msg = [
      `My top matches in ${stateName} — via M2V (Match to Vote)`,
      ...top.map((r, i) => `${i + 1}. ${r.name}${r.pct != null ? ` — ${r.pct}% match` : ''} (${r.raceTitle})`),
      '',
      `Who actually agrees with YOU? ${URL_LINE}`,
      'Every position sourced. Never matched by party.',
    ].join('\n');
    try { await Share.share({ message: msg }); } catch {}
    return 'shared-text';
  }
  const c = document.createElement('canvas');
  c.width = 1080; c.height = 1920;
  const x = c.getContext('2d');
  // background
  x.fillStyle = BRAND.bg; x.fillRect(0, 0, 1080, 1920);
  x.fillStyle = BRAND.bright; x.fillRect(0, 0, 1080, 14);
  // brand
  x.fillStyle = '#fff';
  x.font = '800 64px Georgia, serif';
  x.fillText('M2V', 80, 170);
  x.font = '600 34px system-ui, sans-serif';
  x.fillStyle = 'rgba(255,255,255,0.85)';
  x.fillText('MATCH TO VOTE', 80, 224);
  // headline
  x.fillStyle = '#fff';
  x.font = '700 76px Georgia, serif';
  x.fillText('Here’s who actually', 80, 400);
  x.fillText('agrees with me', 80, 490);
  x.font = '600 40px system-ui, sans-serif';
  x.fillStyle = BRAND.bright;
  x.fillText(`${stateName} · November 2026 ballot`, 80, 570);
  // match rows
  let y = 700;
  top.forEach((r, i) => {
    // card
    x.fillStyle = BRAND.paper;
    roundRect(x, 60, y, 960, 260, 28); x.fill();
    // pct circle
    x.beginPath(); x.arc(210, y + 130, 92, 0, Math.PI * 2);
    x.lineWidth = 14; x.strokeStyle = r.pct >= 80 ? BRAND.bright : r.pct >= 60 ? BRAND.bg : BRAND.gold; x.stroke();
    x.fillStyle = BRAND.ink;
    x.font = '800 60px system-ui, sans-serif';
    x.textAlign = 'center';
    x.fillText(r.pct != null ? `${r.pct}%` : '—', 210, y + 152);
    x.textAlign = 'left';
    // name + race
    x.font = '700 52px Georgia, serif';
    x.fillText(r.name, 350, y + 110, 630);
    x.font = '500 34px system-ui, sans-serif';
    x.fillStyle = BRAND.soft;
    x.fillText(`${r.raceTitle}${r.party ? ` · ${r.party}` : ''}`, 350, y + 165, 630);
    x.font = '600 28px system-ui, sans-serif';
    x.fillStyle = BRAND.bg;
    x.fillText('every position sourced ✓', 350, y + 215);
    y += 300;
  });
  // footer
  x.fillStyle = 'rgba(255,255,255,0.92)';
  x.font = '600 40px system-ui, sans-serif';
  x.fillText('Take the quiz — never matched by party:', 80, 1740);
  x.fillStyle = BRAND.bright;
  x.font = '800 52px system-ui, sans-serif';
  x.fillText(URL_LINE, 80, 1810);
  return download(c, 'm2v-my-matches.png') ? 'downloaded' : 'failed';
}

// ---- Ballot image: the official-style sample ballot as a PNG ----
export async function shareBallotImage({ stateName, races, picks }) {
  const pickBy = Object.fromEntries(picks.map((p) => [p.raceId, p.candidateId]));
  if (Platform.OS !== 'web') {
    const msg = [
      'SAMPLE BALLOT — NOT AN OFFICIAL BALLOT. For planning only.',
      `${stateName.toUpperCase()} · GENERAL ELECTION — TUESDAY, NOVEMBER 3, 2026`,
      '',
      ...races.map((r) => {
        const picked = r.candidates.find((cd) => cd.id === pickBy[r.id]);
        return `${r.title.toUpperCase()}: ${picked ? `● ${picked.name} (${picked.party})` : '○ (not marked yet)'}`;
      }),
      '',
      `via M2V · ${URL_LINE} · every position sourced`,
    ].join('\n');
    try { await Share.share({ message: msg }); } catch {}
    return 'shared-text';
  }
  const rowH = 96, sectionPad = 150;
  const height = 620 + races.reduce((h, r) => h + sectionPad + r.candidates.length * rowH, 0) + 200;
  const c = document.createElement('canvas');
  c.width = 1080; c.height = Math.max(height, 1400);
  const x = c.getContext('2d');
  x.fillStyle = BRAND.paper; x.fillRect(0, 0, c.width, c.height);
  // MANDATORY sample banner — part of the image itself
  x.fillStyle = BRAND.gold; x.fillRect(0, 0, 1080, 110);
  x.fillStyle = '#111'; x.font = '800 40px system-ui, sans-serif'; x.textAlign = 'center';
  x.fillText('SAMPLE BALLOT — NOT AN OFFICIAL BALLOT', 540, 62);
  x.font = '600 28px system-ui, sans-serif';
  x.fillText('For planning only', 540, 98);
  // header block
  x.fillStyle = '#111';
  x.fillRect(60, 150, 960, 6);
  x.font = '800 58px Georgia, serif';
  x.fillText(stateName.toUpperCase(), 540, 250);
  x.font = '600 34px system-ui, sans-serif';
  x.fillText('GENERAL ELECTION — TUESDAY, NOVEMBER 3, 2026', 540, 305);
  x.fillRect(60, 340, 960, 3);
  x.textAlign = 'left';
  let y = 420;
  for (const r of races) {
    x.font = '800 38px system-ui, sans-serif';
    x.fillStyle = '#111';
    x.fillText(r.title.toUpperCase(), 80, y);
    x.fillRect(80, y + 16, 920, 2);
    y += 70;
    for (const cd of r.candidates) {
      const filled = pickBy[r.id] === cd.id;
      // oval
      x.beginPath();
      x.ellipse(130, y + 18, 34, 20, 0, 0, Math.PI * 2);
      x.lineWidth = 4; x.strokeStyle = '#111'; x.stroke();
      if (filled) {
        x.beginPath(); x.ellipse(130, y + 18, 26, 13, 0, 0, Math.PI * 2);
        x.fillStyle = '#111'; x.fill();
      }
      x.fillStyle = '#111';
      x.font = filled ? '800 40px Georgia, serif' : '500 40px Georgia, serif';
      x.fillText(cd.name, 200, y + 32, 640);
      x.font = '500 28px system-ui, sans-serif';
      x.fillStyle = BRAND.soft;
      x.fillText(cd.party || '', 850, y + 30, 180);
      y += rowH;
    }
    y += sectionPad - 70;
  }
  x.fillStyle = BRAND.soft;
  x.font = '600 28px system-ui, sans-serif';
  x.fillText(`Marked with M2V · ${URL_LINE} · every position sourced · never by party`, 80, c.height - 80);
  return download(c, 'm2v-sample-ballot.png') ? 'downloaded' : 'failed';
}

function roundRect(x, x0, y0, w, h, r) {
  x.beginPath();
  x.moveTo(x0 + r, y0);
  x.arcTo(x0 + w, y0, x0 + w, y0 + h, r);
  x.arcTo(x0 + w, y0 + h, x0, y0 + h, r);
  x.arcTo(x0, y0 + h, x0, y0, r);
  x.arcTo(x0, y0, x0 + w, y0, r);
  x.closePath();
}
