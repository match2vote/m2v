// Shared UI components — the React Native port of the prototype's ui.jsx.
import React from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { theme } from './theme';

const { colors, radius, space } = theme;

export function Screen({ children, style }) {
  return <View style={[styles.screen, style]}>{children}</View>;
}

export function H1({ children, style }) {
  return <Text style={[styles.h1, style]}>{children}</Text>;
}

export function H2({ children, style }) {
  return <Text style={[styles.h2, style]}>{children}</Text>;
}

export function Body({ children, style, soft }) {
  return <Text style={[styles.body, soft && { color: colors.inkSoft }, style]}>{children}</Text>;
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({ label, onPress, kind = 'primary', disabled, style }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        kind === 'primary' && styles.btnPrimary,
        kind === 'ghost' && styles.btnGhost,
        disabled && { opacity: 0.4 },
        pressed && { opacity: 0.75 },
        style,
      ]}
    >
      <Text style={[styles.btnLabel, kind === 'primary' ? { color: '#fff' } : { color: colors.accent }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({ value }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.round(value * 100)}%` }]} />
    </View>
  );
}

// Badge for data honesty tiers: curated / fec ("Not stated") / sample.
export function TierBadge({ tier }) {
  const map = {
    curated: { label: 'Sourced positions', color: colors.accent, bg: colors.accentSoft },
    fec: { label: 'Positions not stated yet', color: colors.notStated, bg: '#F1EFEA' },
    sample: { label: 'Sample — not a real candidate', color: colors.sample, bg: '#EFEDF7' },
  };
  const t = map[tier] || map.fec;
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }]}>
      <Text style={{ color: t.color, fontSize: 12, fontWeight: '600' }}>{t.label}</Text>
    </View>
  );
}

export function MatchRing({ pct }) {
  // Simple textual ring stand-in (SVG ring lands with react-native-svg later).
  return (
    <View style={styles.ring}>
      <Text style={styles.ringPct}>{pct === null ? '—' : `${pct}%`}</Text>
      <Text style={styles.ringLabel}>{pct === null ? 'not enough info' : 'match'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: space(5), paddingTop: space(16) },
  h1: { ...theme.font.display, fontSize: 30, lineHeight: 36, color: colors.ink, marginBottom: space(2) },
  h2: { ...theme.font.display, fontSize: 20, lineHeight: 26, color: colors.ink, marginBottom: space(1) },
  body: { fontSize: 15, lineHeight: 22, color: colors.ink },
  card: {
    backgroundColor: colors.surface, borderRadius: radius.md, padding: space(4),
    borderWidth: 1, borderColor: colors.line, marginBottom: space(3),
  },
  btn: {
    borderRadius: radius.lg, paddingVertical: space(3.5), paddingHorizontal: space(5),
    alignItems: 'center', marginVertical: space(1),
  },
  btnPrimary: { backgroundColor: colors.accent },
  btnGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.accent },
  btnLabel: { fontSize: 16, fontWeight: '600' },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden', marginBottom: space(4) },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: colors.accent },
  badge: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8 },
  ring: {
    width: 96, height: 96, borderRadius: 48, borderWidth: 4, borderColor: colors.accent,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
  },
  ringPct: { fontSize: 22, fontWeight: '700', color: colors.ink },
  ringLabel: { fontSize: 10, color: colors.inkSoft },
});
