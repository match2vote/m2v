// Browse screens v2 — nav-driven, back affordance everywhere, curated-only.
import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { ISSUES, stanceLabel, computeMatch } from '@m2v/core';
import { Screen, H1, H2, Body, Card, Button, TierBadge, MatchRing, BackBar } from '../ui';
import { theme, useTheme } from '../theme';
import { STATE_NAMES, getRaces, getCoverage, findRaceById, findCandidateById } from '../ballot';
import { getStateData, savePick, kv } from '../api';
import { useNav } from '../nav';
import { QuizContext } from '../quizContext';

const { space } = theme;

export function StatePicker() {
  const nav = useNav();
  const { colors } = useTheme();
  const { states, totalRaces } = getCoverage();
  return (
    <Screen>
      <H1>Where do you vote?</H1>
      <Body soft style={{ marginBottom: space(4) }}>
        {totalRaces} researched races across {states.length} states — every
        position sourced, nothing guessed. New races weekly.
      </Body>
      <ScrollView style={{ flex: 1 }}>
        {states.map((s) => (
          <Pressable
            key={s.code}
            onPress={() => { kv.set('m2v:ballotState', s.code); nav.go({ name: 'races', state: s.code }); }}
            style={[styles.stateRow, { borderColor: colors.line, backgroundColor: colors.surface }]}
          >
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.ink }}>{s.name}</Text>
            <Text style={{ color: colors.inkSoft, fontWeight: '600' }}>
              {s.races} race{s.races === 1 ? '' : 's'}  ›
            </Text>
          </Pressable>
        ))}
        <Card style={{ marginTop: space(3) }}>
          <Body style={{ fontWeight: '700', marginBottom: 4 }}>Don't see your state?</Body>
          <Body soft style={{ fontSize: 13 }}>
            M2V doesn't cover it yet. We only show candidates whose positions
            we've researched and sourced — no placeholders, no guesses — and
            we're adding races weekly through Election Day.
          </Body>
        </Card>
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}

export function Races({ stateCode }) {
  const nav = useNav();
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    getStateData(stateCode, (fresh) => { if (alive) setData(fresh); })
      .then((d) => { if (alive && d) setData(d); });
    return () => { alive = false; };
  }, [stateCode]);
  const races = getRaces(stateCode, data, { display: true });
  const full = races.filter((r) => r.coverage === 'full').length;
  return (
    <Screen>
      <BackBar label="All states" onPress={() => nav.go({ name: 'races' }, { replace: true })} />
      <H1>{STATE_NAMES[stateCode] || stateCode}</H1>
      <Body soft style={{ marginBottom: space(4) }}>
        Races we're covering here: {full} fully researched
        {races.length > full ? ` · ${races.length - full} names-only` : ''}
      </Body>
      <ScrollView style={{ flex: 1 }}>
        {races.map((r) => (
          <Pressable key={r.id} onPress={() => nav.go({ name: 'race', id: r.id })}>
            <Card>
              <H2>{r.title}</H2>
              <Body soft>{r.candidates.map((c) => c.name).join(' vs ')}</Body>
              {r.coverage === 'names' && (
                <Body soft style={{ fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>
                  Names only — we haven't researched positions here yet.
                </Body>
              )}
            </Card>
          </Pressable>
        ))}
        {races.length === 0 && (
          <Card>
            <Body soft>
              No researched races here yet — we're adding races weekly.
            </Body>
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

export function Race({ raceId }) {
  const nav = useNav();
  const { answers, matters } = useContext(QuizContext);
  const [data, setData] = useState(null);
  const stateCode = (raceId || '').split('-')[0];
  useEffect(() => {
    let alive = true;
    if (stateCode) {
      getStateData(stateCode, (fresh) => { if (alive) setData(fresh); })
        .then((d) => { if (alive && d) setData(d); });
    }
    return () => { alive = false; };
  }, [stateCode]);
  const race = findRaceById(raceId, data);
  if (!race) {
    return (
      <Screen>
        <BackBar label="Races" onPress={() => nav.back({ name: 'races' })} />
        <Body soft>We don't cover this race yet — races are added weekly.</Body>
        <Button label="Browse covered races" onPress={() => nav.go({ name: 'races' })} />
      </Screen>
    );
  }
  const hasQuiz = answers && Object.values(answers).some((v) => v !== null && v !== undefined);
  const namesOnly = race.coverage === 'names';
  return (
    <Screen>
      <BackBar label={STATE_NAMES[stateCode] || 'Races'} onPress={() => nav.go({ name: 'races', state: stateCode }, { replace: true })} />
      <H1>{race.title}</H1>
      <Body soft style={{ marginBottom: space(3) }}>
        {race.meta?.statusNote || 'Candidates with researched, sourced positions.'}
      </Body>
      {namesOnly && (
        <Card>
          <Body style={{ fontWeight: '700', fontSize: 14 }}>
            We know who's running here. We haven't researched their positions yet.
          </Body>
          <Body soft style={{ fontSize: 13, marginTop: 4 }}>
            So there are no match percentages in this race — M2V never guesses
            a position from someone's party.
          </Body>
        </Card>
      )}
      <ScrollView style={{ flex: 1 }}>
        {race.candidates.map((c) => {
          const m = hasQuiz && !namesOnly ? computeMatch(answers, matters, c.positions || {}) : null;
          return (
            <Pressable key={c.id} onPress={() => nav.go({ name: 'candidate', id: c.id })}>
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <H2>
                      {c.name}
                      {c.ballotStatus === 'nominee' ? '  ·  Nominee' : c.incumbent ? '  ·  Incumbent' : ''}
                    </H2>
                    <Body soft style={{ marginBottom: 6 }}>{c.party}</Body>
                    {!namesOnly && <TierBadge tier={c.tier} />}
                  </View>
                  {m && <MatchRing pct={m.pct} />}
                </View>
              </Card>
            </Pressable>
          );
        })}
        {race.hiddenCount > 0 && (
          <Body soft style={{ fontSize: 13, marginBottom: space(3) }}>
            {race.hiddenCount} other filed candidate{race.hiddenCount === 1 ? '' : 's'} in this race
            {race.hiddenCount === 1 ? " isn't" : " aren't"} shown — positions not researched yet, and M2V never guesses.
          </Body>
        )}
        {!hasQuiz && (
          <Button kind="ghost" label="Take the quiz to see your match %" onPress={() => nav.go({ name: 'quiz' })} />
        )}
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}

export function Profile({ candidateId }) {
  const nav = useNav();
  const { colors } = useTheme();
  const { answers, matters } = useContext(QuizContext);
  const [added, setAdded] = useState(false);
  const found = findCandidateById(candidateId);
  if (!found) {
    return (
      <Screen>
        <BackBar label="Races" onPress={() => nav.back({ name: 'races' })} />
        <Body soft>This candidate isn't in our researched set (yet).</Body>
        <Button label="Browse covered races" onPress={() => nav.go({ name: 'races' })} />
      </Screen>
    );
  }
  const { candidate, race } = found;
  const positions = candidate.positions || {};
  const posSources = candidate.positionSources || {};
  const isNamesOnly = race.coverage === 'names' || candidate.tier !== 'curated';
  const hasQuiz = !isNamesOnly && answers && Object.values(answers).some((v) => v !== null && v !== undefined);
  const match = hasQuiz ? computeMatch(answers, matters || {}, positions) : null;

  const Tile = ({ label, value, wide }) => (
    <Card style={{ flex: wide ? undefined : 1, paddingVertical: space(3), marginBottom: space(2) }}>
      <Body soft style={{ fontSize: 10.5, fontWeight: '800', letterSpacing: 1 }}>{label}</Body>
      <Body style={{ fontSize: 15, fontWeight: '600', marginTop: 2 }}>{value}</Body>
    </Card>
  );

  return (
    <Screen>
      <BackBar label={race.title} onPress={() => nav.go({ name: 'race', id: race.id }, { replace: true })} />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <H1 style={{ marginBottom: 0 }}>{candidate.name}</H1>
          <Body soft>
            {candidate.party}
            {candidate.ballotStatus === 'nominee' ? ' · Nominee' : candidate.incumbent ? ' · Incumbent' : ''}
          </Body>
        </View>
        {hasQuiz && <MatchRing pct={match.pct} size={76} />}
      </View>
      <View style={{ marginVertical: space(2) }}>
        <TierBadge tier={isNamesOnly ? 'fec' : candidate.tier} />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {candidate.quote ? (
          <Body style={{ fontFamily: 'Georgia', fontStyle: 'italic', fontSize: 17, lineHeight: 25, color: colors.accent, marginBottom: space(3) }}>
            “{candidate.quote}”
          </Body>
        ) : null}
        {candidate.controversies?.length ? (
          <Card style={{ backgroundColor: colors.dangerSoft, borderColor: colors.dangerSoft }}>
            <Body style={{ color: colors.danger, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>
              ✳ {candidate.controversies.length} reported controvers{candidate.controversies.length === 1 ? 'y' : 'ies'} on record
            </Body>
            {candidate.controversies.map((s) => (
              <Body key={s.title} style={{ fontSize: 12.5, marginBottom: 4 }}>
                <Body style={{ fontWeight: '700', fontSize: 12.5 }}>{s.title}: </Body>{s.detail}
              </Body>
            ))}
          </Card>
        ) : null}
        {(candidate.age || candidate.home) ? (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {candidate.age ? <Tile label="AGE" value={candidate.age} /> : null}
            {candidate.home ? <Tile label="HOME" value={candidate.home} /> : null}
          </View>
        ) : null}
        {candidate.now ? <Tile label="NOW" value={candidate.now} wide /> : null}
        {candidate.background && (
          <>
            <H2 style={{ marginTop: space(2) }}>Background</H2>
            <Body soft style={{ fontSize: 14, lineHeight: 21, marginBottom: space(3) }}>{candidate.background}</Body>
          </>
        )}
        {candidate.priorities?.length ? (
          <>
            <H2>Top priorities</H2>
            {candidate.priorities.map((p, i) => (
              <View key={p} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space(2) }}>
                <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginRight: space(2.5) }}>
                  <Body style={{ color: colors.accent, fontWeight: '800', fontSize: 12 }}>{i + 1}</Body>
                </View>
                <Body style={{ fontSize: 14, flex: 1 }}>{p}</Body>
              </View>
            ))}
            <View style={{ height: space(2) }} />
          </>
        ) : null}
        {isNamesOnly && (
          <Card>
            <Body style={{ fontWeight: '700', fontSize: 13.5 }}>
              We haven't researched this candidate's positions yet.
            </Body>
            <Body soft style={{ fontSize: 13, marginTop: 4 }}>
              No match percentage is shown, because M2V never guesses from party.
              This candidate is on the ballot per official filings.
            </Body>
          </Card>
        )}
        {!isNamesOnly && ISSUES.map((issue) => {
          const val = positions[issue.key];
          const stated = val !== null && val !== undefined;
          const src = posSources[issue.key];
          return (
            <Card key={issue.key} style={{ paddingVertical: space(3) }}>
              <Body style={{ fontWeight: '700', marginBottom: 2 }}>{issue.name}</Body>
              <Body soft={!stated} style={{ fontSize: 13 }}>{stanceLabel(issue, val)}</Body>
              {stated && src && (
                <Pressable onPress={() => Linking.openURL(src.url)}>
                  <Body style={{ fontSize: 11, color: colors.accent, marginTop: 4 }}>
                    Source: {src.label} ↗
                  </Body>
                </Pressable>
              )}
            </Card>
          );
        })}
        {(candidate.sources || []).map((s) => (
          <Button key={s.url} kind="ghost" small label={`Source: ${s.label}`} onPress={() => Linking.openURL(s.url)} />
        ))}
        <Button
          label={added ? '✓ Marked on your ballot' : 'Mark on my ballot'}
          onPress={async () => {
            if (added) { nav.go({ name: 'ballot' }); return; }
            await savePick({
              raceId: race.id, raceTitle: race.title, state: candidate.state,
              candidateId: candidate.id, name: candidate.name, party: candidate.party,
              tier: candidate.tier, matchPct: match?.pct ?? null,
            });
            kv.set('m2v:ballotState', candidate.state);
            setAdded(true);
          }}
        />
        {added && (
          <Body soft style={{ textAlign: 'center', fontSize: 13 }}>
            Tap again to see your ballot.
          </Body>
        )}
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stateRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1, borderRadius: 12, marginBottom: 8,
  },
});
