// M2V theme v2, bold, high-contrast, dark-mode-aware.
// Hard rule: no red/blue party coding anywhere. Match strength has its own
// non-partisan scale (neutral sand → amber → deep teal-green).
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

// Palette source of truth: warm cream, deep aubergine as the only strong
// color, espresso dark cards. Never party red/blue anywhere. Aubergine was
// chosen Aug 18 to unify with the logo and the marketing site; it keeps red
// underneath so it still belongs on the warm cream rather than sitting on it.
// The keys are still named gold/goldSoft for now so nothing downstream breaks;
// renaming them to accent/accentSoft is a separate tidy-up.
const light = {
  bg: '#FAF8F5',            // warm cream, never white
  surface: '#FFFFFF',
  ink: '#262019',           // warm espresso ink
  inkSoft: '#7A7167',
  line: '#EAE4DB',
  // Deep aubergine. CTAs, countdown, counters, active tab. Replaced the gold
  // #8B6318 on Aug 18. Contrast improved rather than regressed: 12.1:1 on
  // cream and 12.8:1 on white, against gold's 5.1 and 5.4. Still the one
  // interaction accent, never a data color.
  accent: '#4A2545',
  accentBright: '#C9A2BC',  // light mauve, ONLY for text on espresso cards
  accentSoft: '#F2E9EF',
  gold: '#4A2545',
  goldSoft: '#F2E9EF',
  onAccent: '#FFFFFF',      // text on an aubergine fill, 12.8:1
  espresso: '#2E2621',      // dark cards
  espressoGlow: '#4A3340',  // soft corner gradient on dark cards, plum-warm
  green: '#3D5A46',         // info callout ink
  greenSoft: '#E9EFE6',     // the green info callout
  federal: '#4F6683', federalSoft: '#E4EAF2',   // muted category pills (not party colors)
  state: '#3F6E63', stateSoft: '#E2EEEA',
  danger: '#9C4E35',
  dangerSoft: '#F6E7E0',
  notStated: '#6A625A',
  sample: '#5B4F9C',
  ballotPaper: '#FFFDF8',
  ballotInk: '#211B14',
  tabBg: '#FFFFFF',
};

const dark = {
  bg: '#191512',
  surface: '#241E19',
  ink: '#F2EBE1',
  inkSoft: '#A89C8E',
  line: '#38302A',
  accent: '#D3A8C4',
  accentBright: '#DCB6CD',
  accentSoft: '#3A2430',
  gold: '#D3A8C4',
  goldSoft: '#3A2430',
  onAccent: '#241E19',      // dark ink on a mauve fill, 8.0:1
  espresso: '#2E2621',
  espressoGlow: '#4A3340',
  green: '#9DBBA5',
  greenSoft: '#25302A',
  federal: '#93A9C4', federalSoft: '#242C38',
  state: '#8EB5AB', stateSoft: '#22302C',
  danger: '#D08A73',
  dangerSoft: '#3A2822',
  notStated: '#A39789',
  sample: '#A99BE0',
  ballotPaper: '#FFFDF8',   // the ballot stays paper even in dark mode
  ballotInk: '#211B14',
  tabBg: '#241E19',
};

// Non-partisan match-strength scale. Never red/blue.
export function matchColor(pct, c) {
  if (pct === null || pct === undefined) return c.notStated;
  if (pct >= 80) return c.green === '#3D5A46' ? '#3D6B4F' : '#7FB08D';
  if (pct >= 55) return c.accent;
  return c.inkSoft;
}

export const typography = {
  display: { fontFamily: 'Georgia', fontWeight: '700' },
  h1: { fontSize: 34, lineHeight: 40 },
  h2: { fontSize: 21, lineHeight: 27 },
  body: { fontSize: 16, lineHeight: 24 },
};

const base = {
  radius: { sm: 10, md: 16, lg: 24 },
  space: (n) => n * 4,
  font: { display: typography.display, body: {} },
};

// Legacy static export (light) so anything un-migrated keeps working.
export const theme = { colors: light, ...base };

const ThemeCtx = createContext({ colors: light, ...base, scheme: 'light', setMode: () => {}, mode: 'auto' });

export function ThemeProvider({ children, getStored, setStored }) {
  const system = useColorScheme();
  const [mode, setMode] = useState('auto'); // 'auto' | 'light' | 'dark'
  useEffect(() => {
    (async () => {
      try { const m = await getStored?.('m2v:themeMode'); if (m) setMode(m); } catch {}
    })();
  }, []);
  const scheme = mode === 'auto' ? (system || 'light') : mode;
  const value = useMemo(() => ({
    colors: scheme === 'dark' ? dark : light,
    ...base,
    scheme,
    mode,
    setMode: (m) => { setMode(m); try { setStored?.('m2v:themeMode', m); } catch {} },
  }), [scheme, mode]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}
