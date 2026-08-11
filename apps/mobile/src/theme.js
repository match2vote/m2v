// M2V theme v2 — bold, high-contrast, dark-mode-aware.
// Hard rule: no red/blue party coding anywhere. Match strength has its own
// non-partisan scale (neutral sand → amber → deep teal-green).
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

const light = {
  bg: '#FAF6EF',
  surface: '#FFFFFF',
  ink: '#141210',
  inkSoft: '#645E55',
  line: '#E5DED2',
  accent: '#0E5A43',        // deep civic green (brand)
  accentBright: '#12B981',  // energetic green for highlights/motion
  accentSoft: '#E3F2EB',
  gold: '#C78A19',
  goldSoft: '#FBF0DA',
  danger: '#A33B2E',
  notStated: '#98928A',
  sample: '#7A6DB3',
  ballotPaper: '#FFFDF8',
  ballotInk: '#111111',
  tabBg: '#FFFFFF',
};

const dark = {
  bg: '#12110F',
  surface: '#1D1B18',
  ink: '#F4EFE7',
  inkSoft: '#A79F93',
  line: '#312E29',
  accent: '#35C08E',
  accentBright: '#3DDC97',
  accentSoft: '#173A2E',
  gold: '#E3A83A',
  goldSoft: '#33290F',
  danger: '#E0705F',
  notStated: '#7D776E',
  sample: '#A99BE0',
  ballotPaper: '#FFFDF8',   // the ballot stays paper-white even in dark mode
  ballotInk: '#111111',
  tabBg: '#1D1B18',
};

// Non-partisan match-strength scale. Never red/blue.
export function matchColor(pct, c) {
  if (pct === null || pct === undefined) return c.notStated;
  if (pct >= 80) return c.accentBright;
  if (pct >= 60) return c.accent;
  if (pct >= 40) return c.gold;
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
