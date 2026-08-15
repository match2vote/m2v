// Shared UI v2, bold type, motion, dark-mode aware, ballot bubbles, tab bar.
import React, { useEffect, useRef } from 'react';
import { Text, View, Pressable, Animated, Easing, StyleSheet } from 'react-native';
import { theme, useTheme, matchColor, typography } from './theme';
import { useReducedMotion } from './screens/VoteScenes';
import { strings } from './strings';

const S = strings.ui;

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
    <Text accessibilityRole="header" style={[typography.display, typography.h1, { color: colors.ink, marginBottom: space(2) }, style]}>
      {children}
    </Text>
  );
}

export function H2({ children, style }) {
  const { colors } = useTheme();
  return (
    <Text accessibilityRole="header" style={[typography.display, typography.h2, { color: colors.ink, marginBottom: space(1) }, style]}>
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

export function Button({ label, onPress, kind = 'primary', disabled, style, small, accessibilityLabel, accessibilityHint }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [
        {
          borderRadius: 14, alignItems: 'center', marginVertical: space(1), minHeight: 44, justifyContent: 'center',
          paddingVertical: small ? space(2) : space(3.5), paddingHorizontal: space(5),
        },
        kind === 'primary' && { backgroundColor: colors.accent },
        kind === 'ghost' && { borderWidth: 1.5, borderColor: colors.accent },
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] },
        style,
      ]}
    >
      <Text style={{ fontSize: small ? 14 : 16.5, fontWeight: '700', textAlign: 'center', color: kind === 'primary' ? colors.onAccent : colors.accent }}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({ value }) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={S.progressA11y({ pct: Math.round(value * 100) })}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={{ height: 8, borderRadius: 4, backgroundColor: colors.line, overflow: 'hidden', marginBottom: space(4) }}
    >
      <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.accentBright, width: `${Math.round(value * 100)}%` }} />
    </View>
  );
}

export function TierBadge({ tier }) {
  const { colors } = useTheme();
  const map = {
    curated: { label: S.tierCurated, color: colors.accent, bg: colors.accentSoft },
    fec: { label: S.tierFec, color: colors.notStated, bg: colors.line },
    sample: { label: S.tierSample, color: colors.sample, bg: colors.line },
  };
  const t = map[tier] || map.fec;
  return (
    <View style={{ alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8, backgroundColor: t.bg }}>
      <Text style={{ color: t.color, fontSize: 12, fontWeight: '700' }}>{t.label}</Text>
    </View>
  );
}

// Animated match ring: number counts up, color reflects non-partisan scale.
// The ring is announced as one element with what the number means; the
// count-up is a JS number ticker (no style is animated), skipped under
// reduced motion. Colour is only a hint: the number and the "match" text
// carry the meaning, so nothing here is communicated by colour alone.
export function MatchRing({ pct, size = 92 }) {
  const { colors } = useTheme();
  const anim = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  const [shown, setShown] = React.useState(pct === null ? null : 0);
  useEffect(() => {
    if (pct === null || pct === undefined) { setShown(null); return undefined; }
    if (reduced) { setShown(pct); return undefined; }
    anim.setValue(0);
    const id = anim.addListener(({ value }) => setShown(Math.round(value * pct)));
    Animated.timing(anim, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
    return () => anim.removeListener(id);
  }, [pct, reduced]);
  const color = matchColor(pct, colors);
  const label = pct === null || pct === undefined
    ? S.matchRingNotScoredA11y
    : S.matchRingPctA11y({ pct });
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={label}
      style={{
        minWidth: size, minHeight: size, borderRadius: 999, borderWidth: 5, borderColor: color, padding: 4,
        alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
      }}
    >
      <Text style={{ fontSize: size * 0.26, fontWeight: '800', color: colors.ink }}>
        {shown === null ? S.matchRingDash : S.matchRingPct({ pct: shown })}
      </Text>
      <Text style={{ fontSize: 10, color: colors.inkSoft, fontWeight: '600' }}>
        {pct === null ? S.matchRingNotEnough : S.matchRingMatch}
      </Text>
    </View>
  );
}

// Ballot bubble, the fillable oval. Fills with a quick satisfying pop.
export function Bubble({ filled, size = 26 }) {
  const scale = useRef(new Animated.Value(filled ? 1 : 0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) { scale.setValue(filled ? 1 : 0); return; }
    Animated.spring(scale, {
      toValue: filled ? 1 : 0, friction: 5, tension: 140, useNativeDriver: true,
    }).start();
  }, [filled, reduced]);
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
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
export function BackBar({ label = S.back, onPress }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={S.backTo({ label })}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 20 }}
      style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space(3), minHeight: 44, alignSelf: 'flex-start' }}
    >
      <Text style={{ color: colors.accent, fontSize: 17, fontWeight: '800' }}>{S.backArrow({ label })}</Text>
    </Pressable>
  );
}

// Category pill: Federal / State, muted colors, never party red/blue.
export function CategoryPill({ kind }) {
  const { colors } = useTheme();
  const fed = kind === 'federal';
  const label = fed ? S.pillFederal : kind === 'local' ? S.pillLocal : S.pillState;
  return (
    <View style={{ borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, backgroundColor: fed ? colors.federalSoft : colors.stateSoft }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: fed ? colors.federal : colors.state }}>
        {label}
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
    { key: 'home', label: S.tabHome, icon: '⌂' },
    { key: 'matches', label: S.tabMatch, icon: '✦' },
    { key: 'races', label: S.tabBrowse, icon: '☰' },
    { key: 'ballot', label: S.tabBallot, icon: '▢' },
    { key: 'howto', label: S.tabHowTo, icon: '✓' },
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
        // No badge on the Ballot tab (kiki, Aug 14): no text, no count. The
        // only marked/unmarked signal is the icon filling in.
        const icon = t.key === 'ballot' && ballotCount > 0 ? '▣' : t.icon;
        const a11yLabel = t.key === 'ballot' && ballotCount > 0 ? S.tabBallotHasMarks : t.label;
        return (
          <Pressable
            key={t.key}
            onPress={() => onChange(t.key)}
            accessibilityRole="tab"
            accessibilityLabel={a11yLabel}
            accessibilityState={{ selected: isActive }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, minHeight: 44 }}
          >
            <Text accessibilityElementsHidden importantForAccessibility="no" style={{ fontSize: 20, color: isActive ? colors.accent : colors.inkSoft }}>{icon}</Text>
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
