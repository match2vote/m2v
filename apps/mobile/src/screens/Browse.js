// Browse screens: pick your state → see your federal races → open a race →
// open a candidate profile. All data is real (FEC tier) — names, parties,
// districts, incumbency, FEC filing links. Positions show "Not stated"
// until curated, which is the honest truth.
import React, { useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { ISSUES, stanceLabel, computeMatch } from '@m2v/core';
import { Screen, H1, H2, Body, Card, Button, TierBadge, MatchRing } from '../ui';
import { theme } from '../theme';
import { STATE_LIST, STATE_NAMES, getRaces } from '../ballot';

const { colors, space } = theme;

export function StatePicker({ onPick, onBack }) {
  return (
    <Screen>
      <H1>Where do you vote?</H1>
      <Body soft style={{ marginBottom: space(4) }}>
        Pick your state to see every federal race on your November 2026 ballot.
      </Body>
      <ScrollView style={{ flex: 1 }}>
        {STATE_LIST.map((s) => (
          <Pressable key={s.code} onPress={() => onPick(s.code)} style={styles.stateRow}>
            <Text style={styles.stateName}>{s.name}</Text>
            <Text style={{ color: colors.inkSoft }}>›</Text>
          </Pressable>
        ))}
        <Button kind="ghost" label="Back" onPress={onBack} />
      </ScrollView>
    </Screen>
  );
}

export function Races({ stateCode, onOpenRace, onBack }) {
  const races = getRaces(stateCode);
  const total = races.reduce((n, r) => n + r.candidates.length, 0);
  return (
    <Screen>
      <H1>{STATE_NAMES[stateCode] || stateCode}</H1>
      <Body soft style={{ marginBottom: space(4) }}>
        {races.length} federal race{races.length === 1 ? '' : 's'} · {total} filed
        candidates · live from FEC filings
      </Body>
      <ScrollView style={{ flex: 1 }}>
        {races.map((r) => (
          <Pressable key={r.id} onPress={() => onOpenRace(r)}>
            <Card>
              <H2>{r.title}</H2>
              <Body soft>
                {r.candidates.length} candidate{r.candidates.length === 1 ? '' : 's'}
                {r.candidates.some((c) => c.incumbent) ? ' · includes the incumbent' : ' · open race'}
              </Body>
            </Card>
          </Pressable>
        ))}
        <Button kind="ghost" label="Back to states" onPress={onBack} />
      </ScrollView>
    </Screen>
  );
}

export function Race({ race, answers, matters, onOpenProfile, onBack }) {
  const hasQuiz = answers && Object.values(answers).some((v) => v !== null && v !== undefined);
  return (
    <Screen>
      <H1>{race.title}</H1>
      <Body soft style={{ marginBottom: space(3) }}>
        Everyone who has filed with the FEC for this race. Primary results will
        narrow this list as states finalize ballots.
      </Body>
      <ScrollView style={{ flex: 1 }}>
        {race.candidates.map((c) => {
          const m = hasQuiz ? computeMatch(answers, matters, c.positions || {}) : null;
          return (
            <Pressable key={c.id} onPress={() => onOpenProfile(c)}>
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <H2>{c.name}{c.incumbent ? '  ·  Incumbent' : ''}</H2>
                    <Body soft style={{ marginBottom: 6 }}>{c.party}</Body>
                    <TierBadge tier={c.tier} />
                  </View>
                  {hasQuiz && <MatchRing pct={m.pct} />}
                </View>
              </Card>
            </Pressable>
          );
        })}
        <Button kind="ghost" label="Back" onPress={onBack} />
      </ScrollView>
    </Screen>
  );
}

export function Profile({ candidate, onBack }) {
  const src = candidate.sources?.[0];
  return (
    <Screen>
      <H1>{candidate.name}</H1>
      <Body soft>{candidate.party}{candidate.incumbent ? ' · Incumbent' : ''}</Body>
      <View style={{ marginVertical: space(2) }}>
        <TierBadge tier={candidate.tier} />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {candidate.tier === 'fec' && (
          <Card>
            <Body soft style={{ fontSize: 13 }}>
              This is a real candidate from official FEC filings. M2V hasn't yet
              researched their policy positions — so every issue below reads
              "Not stated." We never guess a position from someone's party.
            </Body>
          </Card>
        )}
        {ISSUES.map((issue) => (
          <Card key={issue.key} style={{ paddingVertical: space(3) }}>
            <Body style={{ fontWeight: '700', marginBottom: 2 }}>{issue.name}</Body>
            <Body
              soft={!((candidate.positions || {})[issue.key] !== null && (candidate.positions || {})[issue.key] !== undefined)}
              style={{ fontSize: 13 }}
            >
              {stanceLabel(issue, (candidate.positions || {})[issue.key])}
            </Body>
          </Card>
        ))}
        {src && (
          <Button
            kind="ghost"
            label={`View source: ${src.label}`}
            onPress={() => Linking.openURL(src.url)}
          />
        )}
        <Button kind="ghost" label="Back" onPress={onBack} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stateRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    borderRadius: theme.radius.sm, paddingVertical: 12, paddingHorizontal: 16, marginBottom: 6,
  },
  stateName: { fontSize: 15, color: colors.ink },
});
