// Shared UI v2, bold type, motion, dark-mode aware, ballot bubbles, tab bar.
import React, { useEffect, useRef } from 'react';
import { Text, View, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import { theme, useTheme, matchColor, typography } from './theme';

const { radius, space } = theme;

export function Screen({ children, style, pad = true }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        { flex: 1, backgroundColor: colors.bg },
        pad && { paddingHorizontal: space(5), paddingTop: space(14) },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function H1({ children, style }) {
  const { colors } = useTheme();
  return (
    <Text style={[typography.display, typography.h1, { color: colors.ink, marginBottom: space(2) }, style]}>
      {children}
    </Text>
  );
}

export function H2({ children, style }) {
  const { colors } = useTheme();
  return (
    <Text style={[typography.display, typography.h2, { color: colors.ink, marginBottom: space(1) }, style]}>
      {children}
    </Text>
  );
}

export function Body({ children, style, soft, onPress }) {
  const { colors } = useTheme();
  return (
    <Text onPress={onPress} style={[typography.body, { color: soft ? colors.inkSoft : colors.ink }, style]}>
      {children}
    </Text>
  );
}

export function Card({ children, style }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface, borderRadius: radius.md, padding: space(4),
          borderWidth: 1, borderColor: colors.line, marginBottom: space(3),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function Button({ label, onPress, kind = 'primary', disabled, style, small }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          borderRadius: 14, alignItems: 'center', marginVertical: space(1),
          paddingVertical: small ? space(2) : space(3.5), paddingHorizontal: space(5),
        },
        kind === 'primary' && { backgroundColor: colors.accent },
        kind === 'ghost' && { borderWidth: 1.5, borderColor: colors.accent },
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] },
        style,
      ]}
    >
      <Text style={{ fontSize: small ? 14 : 16.5, fontWeight: '700', color: kind === 'primary' ? '#FFF9EE' : colors.accent }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({ value }) {
  const { colors } = useTheme();
  return (
    <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.line, overflow: 'hidden', marginBottom: space(4) }}>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.accentBright, width: `${Math.round(value * 100)}%` }} />
    </View>
  );
}

export function TierBadge({ tier }) {
  const { colors } = useTheme();
  const map = {
    curated: { label: 'Every position sourced', color: colors.accent, bg: colors.accentSoft },
    fec: { label: 'Positions not stated yet', color: colors.notStated, bg: colors.line },
    sample: { label: 'Sample, not a real candidate', color: colors.sample, bg: colors.line },
  };
  const t = map[tier] || map.fec;
  return (
    <View style={{ alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8, backgroundColor: t.bg }}>
      <Text style={{ color: t.color, fontSize: 12, fontWeight: '700' }}>{t.label}</Text>
    </View>
  );
}

// Animated match ring: number counts up, color reflects non-partisan scale.
export function MatchRing({ pct, size = 92 }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const [shown, setShown] = React.useState(pct === null ? null : 0);
  useEffect(() => {
    if (pct === null || pct === undefined) { setShown(null); return; }
    anim.setValue(0);
    const id = anim.addListener(({ value }) => setShown(Math.round(value * pct)));
    Animated.timing(anim, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => anim.removeListener(id);
  }, [pct]);
  const color = matchColor(pct, colors);
  return (
    <View
      style={{
        width: size, height: size, borderRadius: size / 2, borderWidth: 5, borderColor: color,
        alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
      }}
    >
      <Text style={{ fontSize: size * 0.26, fontWeight: '800', color: colors.ink }}>
        {shown === null ? '-' : `${shown}%`}
      </Text>
      <Text style={{ fontSize: 10, color: colors.inkSoft, fontWeight: '600' }}>
        {pct === null ? 'not enough info' : 'match'}
      </Text>
    </View>
  );
}

// Ballot bubble, the fillable oval. Fills with a quick satisfying pop.
export function Bubble({ filled, size = 26 }) {
  const scale = useRef(new Animated.Value(filled ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(scale, {
      toValue: filled ? 1 : 0, friction: 5, tension: 140, useNativeDriver: true,
    }).start();
  }, [filled]);
  return (
    <View
      style={{
        width: size * 1.5, height: size, borderRadius: size / 2, borderWidth: 2.5,
        borderColor: '#111', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
      }}
    >
      <Animated.View
        style={{
          width: size * 1.5 - 8, height: size - 8, borderRadius: (size - 8) / 2,
          backgroundColor: '#111', transform: [{ scale }],
        }}
      />
    </View>
  );
}

// Back affordance for any pushed screen.
export function BackBar({ label = 'Back', onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space(3) }}>
      <Text style={{ color: colors.accent, fontSize: 17, fontWeight: '800' }}>‹  {label}</Text>
    </Pressable>
  );
}

// Category pill: Federal / State, muted colors, never party red/blue.
export function CategoryPill({ kind }) {
  const { colors } = useTheme();
  const fed = kind === 'federal';
  return (
    <View style={{ borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: fed ? colors.federalSoft : colors.stateSoft }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: fed ? colors.federal : colors.state }}>
        {fed ? 'Federal' : 'State'}
      </Text>
    </View>
  );
}

// The green info callout carried over from the prototype's how-to guide.
export function InfoCallout({ children }) {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.greenSoft, borderRadius: radius.md, padding: space(3.5), marginBottom: space(3) }}>
      <Text style={{ color: colors.green, fontSize: 13, lineHeight: 19, fontWeight: '500' }}>{children}</Text>
    </View>
  );
}

// Espresso dark card with a soft corner glow, the mockup's hero card.
export function DarkCard({ children, style }) {
  const { colors } = useTheme();
  return (
    <View style={[{ backgroundColor: colors.espresso, borderRadius: 22, padding: space(5), overflow: 'hidden', marginBottom: space(3) }, style]}>
      <View
        style={{
          position: 'absolute', right: -50, top: -50, width: 160, height: 160, borderRadius: 80,
          backgroundColor: colors.espressoGlow, opacity: 0.55,
        }}
      />
      {children}
    </View>
  );
}

// Persistent bottom tab bar: Home · Match · Browse · Ballot · How to Vote.
export function TabBar({ active, onChange, ballotCount }) {
  const { colors } = useTheme();
  const tabs = [
    { key: 'home', label: 'Home', icon: '⌂' },
    { key: 'matches', label: 'Match', icon: '✦' },
    { key: 'races', label: 'Browse', icon: '☰' },
    { key: 'ballot', label: 'Ballot', icon: '▢' },
    { key: 'howto', label: 'How to Vote', icon: '✓' },
  ];
  return (
    <View
      style={{
        flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.line,
        backgroundColor: colors.tabBg, paddingBottom: space(5), paddingTop: space(2),
      }}
    >
      {tabs.map((t) => {
        const isActive = active === t.key;
        return (
          <Pressable key={t.key} onPress={() => onChange(t.key)} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
            <View>
              <Text style={{ fontSize: 20, color: isActive ? colors.accent : colors.inkSoft }}>{t.icon}</Text>
              {/* Only when something is marked, and labeled so it never reads
                  like a notification count. */}
              {t.key === 'ballot' && ballotCount > 0 && (
                <View
                  style={{
                    position: 'absolute', top: -7, right: -26, height: 15, borderRadius: 8,
                    backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>{ballotCount} marked</Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 10, fontWeight: isActive ? '800' : '600', color: isActive ? colors.accent : colors.inkSoft }}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export { matchColor };
