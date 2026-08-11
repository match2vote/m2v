// M2V theme v2 — bold, high-contrast, dark-mode-aware.
// Hard rule: no red/blue party coding anywhere. Match strength has its own
// non-partisan scale (neutral sand → amber → deep teal-green).
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

// Palette source of truth: Draft 1 mockup. Warm cream, deep gold as the only
// strong color, espresso dark cards. Never party red/blue anywhere.
const light = {
  bg: '#FAF8F5',            // warm cream, never white
  surface: '#FFFFFF',
  ink: '#262019',           // warm espresso ink
  inkSoft: '#7A7167',
  line: '#EAE4DB',
  accent: '#A87722',        // deep gold — CTAs, countdown, counters, active tab
  accentBright: '#C08A2D',
  accentSoft: '#F5EBDA',
  gold: '#A87722',
  goldSoft: '#F5EBDA',
  espresso: '#2E2621',      // dark cards
  espressoGlow: '#4A3A28',  // soft corner gradient on dark cards
  green: '#3D5A46',         // info callout ink
  greenSoft: '#E9EFE6',     // the green info callout
  federal: '#5A7291', federalSoft: '#E4EAF2',   // muted category pills (not party colors)
  state: '#4A7A6F', stateSoft: '#E2EEEA',
  danger: '#A3543B',
  dangerSoft: '#F6E7E0',
  notStated: '#9A9188',
  sample: '#7A6DB3',
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
  accent: '#D2A24C',
  accentBright: '#E0B15C',
  accentSoft: '#3A2E1B',
  gold: '#D2A24C',
  goldSoft: '#3A2E1B',
  espresso: '#2E2621',
  espressoGlow: '#4A3A28',
  green: '#9DBBA5',
  greenSoft: '#25302A',
  federal: '#93A9C4', federalSoft: '#242C38',
  state: '#8EB5AB', stateSoft: '#22302C',
  danger: '#D08A73',
  dangerSoft: '#3A2822',
  notStated: '#847A6F',
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
