// Browse screens: pick your state → see your federal races → open a race →
// open a candidate profile. All data is real (FEC tier) — names, parties,
// districts, incumbency, FEC filing links. Positions show "Not stated"
// until curated, which is the honest truth.
import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { ISSUES, stanceLabel, computeMatch } from '@m2v/core';
import { Screen, H1, H2, Body, Card, Button, TierBadge, MatchRing } from '../ui';
import { theme } from '../theme';
import { STATE_LIST, STATE_NAMES, getRaces } from '../ballot';
import { getStateData } from '../api';

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
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    getStateData(stateCode, (fresh) => { if (alive) setData(fresh); })
      .then((d) => { if (alive && d) setData(d); });
    return () => { alive = false; };
  }, [stateCode]);
  const races = getRaces(stateCode, data);
  const total = races.reduce((n, r) => n + r.candidates.length, 0);
  return (
    <Screen>
      <H1>{STATE_NAMES[stateCode] || stateCode}</H1>
      <Body soft style={{ marginBottom: space(4) }}>
        {races.length} race{races.length === 1 ? '' : 's'} · {total} candidates ·{' '}
        {data?.live ? 'live data' : 'offline snapshot'} from FEC filings
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
  const onBallot = race.candidates.filter((c) => c.ballotStatus !== 'not-advancing');
  const notAdvancing = race.candidates.filter((c) => c.ballotStatus === 'not-advancing');

  const row = (c) => {
    const m = hasQuiz ? computeMatch(answers, matters, c.positions || {}) : null;
    return (
      <Pressable key={c.id} onPress={() => onOpenProfile(c)}>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <H2>
                {c.name}
                {c.ballotStatus === 'nominee' ? '  ·  Nominee' : c.incumbent ? '  ·  Incumbent' : ''}
              </H2>
              <Body soft style={{ marginBottom: 6 }}>{c.party}</Body>
              <TierBadge tier={c.tier} />
            </View>
            {hasQuiz && <MatchRing pct={m.pct} />}
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <Screen>
      <H1>{race.title}</H1>
      <Body soft style={{ marginBottom: space(3) }}>
        {race.meta?.statusNote ||
          'Everyone who has filed with the FEC for this race. Primary results will narrow this list as states finalize ballots.'}
      </Body>
      <ScrollView style={{ flex: 1 }}>
        {onBallot.map(row)}
        {notAdvancing.length > 0 && (
          <>
            <Body soft style={{ marginTop: space(3), marginBottom: space(2), fontSize: 13 }}>
              Filed with the FEC but not advancing to the November ballot:
            </Body>
            {notAdvancing.map(row)}
          </>
        )}
        <Button kind="ghost" label="Back" onPress={onBack} />
      </ScrollView>
    </Screen>
  );
}

export function Profile({ candidate, onBack }) {
  const positions = candidate.positions || {};
  const posSources = candidate.positionSources || {};
  return (
    <Screen>
      <H1>{candidate.name}</H1>
      <Body soft>
        {candidate.party}
        {candidate.ballotStatus === 'nominee' ? ' · Nominee' : candidate.incumbent ? ' · Incumbent' : ''}
      </Body>
      <View style={{ marginVertical: space(2) }}>
        <TierBadge tier={candidate.tier} />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {candidate.background && (
          <Card>
            <Body style={{ fontSize: 13 }}>{candidate.background}</Body>
          </Card>
        )}
        {candidate.tier === 'fec' && (
          <Card>
            <Body soft style={{ fontSize: 13 }}>
              This is a real candidate from official FEC filings. M2V hasn't yet
              researched their policy positions — so every issue below reads
              "Not stated." We never guess a position from someone's party.
            </Body>
          </Card>
        )}
        {ISSUES.map((issue) => {
          const val = positions[issue.key];
          const stated = val !== null && val !== undefined;
          const src = posSources[issue.key];
          return (
            <Card key={issue.key} style={{ paddingVertical: space(3) }}>
              <Body style={{ fontWeight: '700', marginBottom: 2 }}>{issue.name}</Body>
              <Body soft={!stated} style={{ fontSize: 13 }}>
                {stanceLabel(issue, val)}
              </Body>
              {stated && src && (
                <Pressable onPress={() => Linking.openURL(src.url)}>
                  <Body style={{ fontSize: 11, color: theme.colors.accent, marginTop: 4 }}>
                    Source: {src.label} ↗
                  </Body>
                </Pressable>
              )}
            </Card>
          );
        })}
        {(candidate.sources || []).map((s) => (
          <Button
            key={s.url}
            kind="ghost"
            label={`View source: ${s.label}`}
            onPress={() => Linking.openURL(s.url)}
          />
        ))}
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
