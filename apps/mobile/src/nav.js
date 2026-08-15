// Tiny cross-platform router. On web it syncs real URLs (browser back/forward,
// shareable deep links); on native it's plain state with a back stack.
// Routes: /ballot /races /races/:state /race/:id /candidate/:id /matches /about /quiz /state /district
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

const BASE = '/m2v';
const NavCtx = createContext(null);

function routeToPath(r) {
  switch (r.name) {
    case 'home': return '/';
    case 'howto': return '/howto';
    case 'roles': return '/roles';
    case 'state': return '/state';
    case 'district': return '/district';
    case 'ballot': return '/ballot';
    case 'races': return r.state ? `/races/${r.state}` : '/races';
    case 'race': return `/race/${encodeURIComponent(r.id)}`;
    case 'candidate': return `/candidate/${encodeURIComponent(r.id)}`;
    case 'matches': return '/matches';
    case 'quiz': return '/quiz';
    case 'about': return '/about';
    default: return '/';
  }
}

export function pathToRoute(pathname) {
  let p = pathname || '/';
  if (p.startsWith(BASE)) p = p.slice(BASE.length);
  const seg = p.split('/').filter(Boolean);
  if (!seg.length) return { name: 'home' };
  if (seg[0] === 'home') return { name: 'home' };
  if (seg[0] === 'howto') return { name: 'howto' };
  if (seg[0] === 'roles') return { name: 'roles' };
  if (seg[0] === 'state') return { name: 'state' };
  if (seg[0] === 'district') return { name: 'district' };
  if (seg[0] === 'ballot') return { name: 'ballot' };
  if (seg[0] === 'races') return seg[1] ? { name: 'races', state: seg[1].toUpperCase() } : { name: 'races' };
  if (seg[0] === 'race' && seg[1]) return { name: 'race', id: decodeURIComponent(seg[1]) };
  if (seg[0] === 'candidate' && seg[1]) return { name: 'candidate', id: decodeURIComponent(seg[1]) };
  if (seg[0] === 'matches') return { name: 'matches' };
  if (seg[0] === 'quiz') return { name: 'quiz' };
  if (seg[0] === 'about') return { name: 'about' };
  return { name: 'home' };
}

export function NavProvider({ children }) {
  const isWeb = Platform.OS === 'web' && typeof window !== 'undefined';
  const [route, setRouteState] = useState(() =>
    isWeb ? pathToRoute(window.location.pathname) : { name: 'home' }
  );
  const [stack, setStack] = useState([]);

  useEffect(() => {
    if (!isWeb) return;
    const onPop = () => setRouteState(pathToRoute(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [isWeb]);

  const value = useMemo(() => {
    const go = (r, { replace = false } = {}) => {
      setStack((s) => (replace ? s : [...s, route]));
      setRouteState(r);
      if (isWeb) {
        const url = BASE + routeToPath(r);
        try {
          if (replace) window.history.replaceState({}, '', url);
          else window.history.pushState({}, '', url);
        } catch {}
      }
    };
    const back = (fallback) => {
      if (isWeb && window.history.length > 1 && stack.length > 0) {
        setStack((s) => s.slice(0, -1));
        window.history.back();
        return;
      }
      setStack((s) => {
        const prev = s[s.length - 1];
        setRouteState(prev || fallback || { name: 'home' });
        return s.slice(0, -1);
      });
    };
    return { route, go, back };
  }, [route, stack, isWeb]);

  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>;
}

export function useNav() {
  return useContext(NavCtx);
}

// Which tab a route belongs to (for highlighting the tab bar).
export function tabOf(route) {
  switch (route.name) {
    case 'home': case 'about': case 'state': case 'district': return 'home';
    case 'howto': case 'roles': return 'howto';
    case 'ballot': return 'ballot';
    case 'matches': case 'quiz': return 'matches';
    default: return 'races';
  }
}
