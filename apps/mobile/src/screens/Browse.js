// Browse screens v2, nav-driven, back affordance everywhere, curated-only.
import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { ISSUES, stanceLabel, computeMatch } from '@m2v/core';
import { Screen, H1, H2, Body, Card, Button, TierBadge, MatchRing, BackBar } from '../ui';
import { theme, useTheme } from '../theme';
import { STATE_NAMES, getRaces, getCoverage, coverageSentence, findRaceById, findCandidateById, REDRAWN_2026, statesPhrase } from '../ballot';
import { InterestButton } from '../InterestButton';
import { getStateData, savePick, getBallotLocation, setBallotState } from '../api';
import { DistrictLine } from '../DistrictLine';
import { RankedChoiceNotice } from '../RankedChoice';
import { useNav } from '../nav';
import { QuizContext } from '../quizContext';
import { strings } from '../strings';

const S = strings.browse;

const hasResearch = (c) =>
  !!c && (c.tier === 'researched' || c.tier === 'curated') &&
  Object.values(c.positions || {}).some((v) => v !== null && v !== undefined);

const { space } = theme;

export function StatePicker() {
  const nav = useNav();
  const { colors } = useTheme();
  const cov = getCoverage();
  const { states, totalRaces } = cov;
  return (
    <Screen>
      <H1>{S.title}</H1>
      <Body soft style={{ marginBottom: space(4) }}>
        {S.intro({ races: totalRaces, statesPhrase: statesPhrase(cov) })}
      </Body>
      <ScrollView style={{ flex: 1 }}>
        {states.map((s) => (
          <Pressable
            key={s.code}
            onPress={() => nav.go({ name: 'races', state: s.code })}
            accessibilityRole="button"
            accessibilityLabel={S.stateA11y({ name: s.name, races: s.races })}
            style={[styles.stateRow, { borderColor: colors.line, backgroundColor: colors.surface }]}
          >
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.ink }}>{s.name}</Text>
            <Text style={{ color: colors.inkSoft, fontWeight: '600' }}>
              {S.stateRaces({ races: s.races })}
            </Text>
          </Pressable>
        ))}
        <Card style={{ marginTop: space(3) }}>
          <Body style={{ fontWeight: '700', marginBottom: 4 }}>{S.dontSeeTitle}</Body>
          <Body soft style={{ fontSize: 13 }}>
            {S.dontSeeBody}
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
  const [loc, setLoc] = useState({ state: null, district: null });
  useEffect(() => {
    let alive = true;
    getStateData(stateCode, (fresh) => { if (alive) setData(fresh); })
      .then((d) => { if (alive && d) setData(d); });
    getBallotLocation().then((l) => { if (alive) setLoc(l); });
    return () => { alive = false; };
  }, [stateCode]);
  // The district applies only when browsing your own ballot state. Browsing
  // another state shows every race there and never touches your district.
  const isHome = loc.state === stateCode;
  const district = isHome ? loc.district : null;
  const allRaces = getRaces(stateCode, data, { display: true });
  const races = district ? getRaces(stateCode, data, { display: true, district }) : allRaces;
  const hasHouse = allRaces.some((r) => r.id.includes('-house-'));
  const full = races.filter((r) => r.coverage === 'full').length;
  return (
    <Screen>
      <BackBar label={S.allStates} onPress={() => nav.go({ name: 'races' }, { replace: true })} />
      <H1>{STATE_NAMES[stateCode] || stateCode}</H1>
      <Body soft style={{ marginBottom: space(4) }}>
        {S.coveringHere({ full, names: races.length - full })}
      </Body>
      <ScrollView style={{ flex: 1 }}>
        {isHome && <DistrictLine stateCode={stateCode} district={district} hasHouseRaces={hasHouse} />}
        {races.map((r) => {
          const pending = r.meta?.status === 'primary-pending';
          const who = r.candidates.map((c) => c.name).join(pending ? S.raceA11yPendingSep : S.raceA11yVersus);
          return (
          <Pressable
            key={r.id}
            onPress={() => nav.go({ name: 'race', id: r.id })}
            accessibilityRole="button"
            accessibilityLabel={S.raceA11y({ title: r.title, who, pending, namesOnly: r.coverage === 'names' })}
          >
            <Card>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <H2>{r.title}</H2>
                {pending && <PendingPill date={r.meta?.primaryDate} />}
              </View>
              <Body soft>{r.candidates.map((c) => c.name).join(pending ? S.pendingSep : S.vs)}</Body>
              {pending && (
                <Body soft style={{ fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>
                  {S.pendingRowNote}
                </Body>
              )}
              {r.coverage === 'names' && (
                <Body soft style={{ fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>
                  {r.candidates.some(hasResearch) ? S.researchedRowNote : S.namesOnlyRowNote}
                </Body>
              )}
            </Card>
          </Pressable>
          );
        })}
        {races.length === 0 && (
          <Card>
            <Body style={{ fontWeight: '700', marginBottom: 4 }}>
              {S.notCovered({ state: STATE_NAMES[stateCode] || stateCode })}
            </Body>
            <Body soft style={{ fontSize: 13, marginBottom: space(2) }}>
              {coverageSentence()}
            </Body>
            <Button small kind="ghost" label={S.howToInYourState} onPress={() => nav.go({ name: 'howto' })} />
            <InterestButton stateCode={stateCode} />
          </Card>
        )}
      </ScrollView>
    </Screen>
  );
}

// Gold-outline pill for primary-pending races; shows the actual primary date.
function PendingPill({ date }) {
  const { colors } = useTheme();
  return (
    <View style={{ borderWidth: 1.5, borderColor: colors.gold, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
      <Text style={{ color: colors.gold, fontWeight: '800', fontSize: 10, letterSpacing: 0.5 }}>
        {date ? S.primaryDate({ date }) : S.primaryPending}
      </Text>
    </View>
  );
}

export function Race({ raceId }) {
  const nav = useNav();
  const { colors } = useTheme();
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
        <BackBar label={S.races} onPress={() => nav.back({ name: 'races' })} />
        <Body soft>{S.raceMissing}</Body>
        <Button label={S.browseCovered} onPress={() => nav.go({ name: 'races' })} />
      </Screen>
    );
  }
  const hasQuiz = answers && Object.values(answers).some((v) => v !== null && v !== undefined);
  const namesOnly = race.coverage === 'names';
  return (
    <Screen>
      <BackBar label={STATE_NAMES[stateCode] || S.races} onPress={() => nav.go({ name: 'races', state: stateCode }, { replace: true })} />
      <H1>{race.title}</H1>
      <Body soft style={{ marginBottom: space(3) }}>
        {race.meta?.statusNote || S.raceDefaultNote}
      </Body>
      {race.meta?.status === 'primary-pending' && (
        <Card style={{ borderColor: colors.gold, borderWidth: 1.5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <PendingPill date={race.meta?.primaryDate} />
            <Body style={{ fontWeight: '700', fontSize: 13, flex: 1 }}>
              {S.pendingTitle}
            </Body>
          </View>
          <Body soft style={{ fontSize: 12.5, marginTop: 4 }}>
            {S.pendingBody}
          </Body>
        </Card>
      )}
      {race.id.includes('-house-') && REDRAWN_2026.has(stateCode) && (
        <Body soft style={{ fontSize: 12.5, fontStyle: 'italic', marginBottom: space(3) }}>
          {S.redrawn}
        </Body>
      )}
      <RankedChoiceNotice raceId={race.id} variant="race" />
      {namesOnly && (
        <Card>
          <Body style={{ fontWeight: '700', fontSize: 14 }}>
            {race.candidates.some(hasResearch) ? S.researchedTitle : S.namesOnlyTitle}
          </Body>
          <Body soft style={{ fontSize: 13, marginTop: 4 }}>
            {race.candidates.some(hasResearch) ? S.researchedBody : S.namesOnlyBody}
          </Body>
          {(race.meta?.sources || []).map((s) => (
            <Button key={s.url} kind="ghost" small label={`Source: ${s.label}`} onPress={() => Linking.openURL(s.url)} />
          ))}
        </Card>
      )}
      <ScrollView style={{ flex: 1 }}>
        {race.candidates.map((c) => {
          const m = hasQuiz && !namesOnly ? computeMatch(answers, matters, c.positions || {}) : null;
          const status = c.ballotStatus === 'nominee' ? S.candA11yNominee : c.incumbent ? S.candA11yIncumbent : '';
          const matchText = m ? (m.pct === null ? S.candA11yNotScored : S.candA11yPct({ pct: m.pct })) : '';
          return (
            <Pressable
              key={c.id}
              onPress={() => nav.go({ name: 'candidate', id: c.id })}
              accessibilityRole="button"
              accessibilityLabel={S.candA11y({ name: c.name, party: c.party, status, match: matchText })}
            >
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <H2>
                      {c.name}
                      {c.ballotStatus === 'nominee' ? S.nominee : c.incumbent ? S.incumbent : ''}
                    </H2>
                    <Body soft style={{ marginBottom: 6 }}>{c.party}</Body>
                    {!namesOnly ? <TierBadge tier={c.tier} /> : hasResearch(c) ? <TierBadge tier="researched" /> : null}
                  </View>
                  {m && <MatchRing pct={m.pct} />}
                </View>
              </Card>
            </Pressable>
          );
        })}
        {race.hiddenCount > 0 && (
          <Body soft style={{ fontSize: 13, marginBottom: space(3) }}>
            {S.hidden({ n: race.hiddenCount })}
          </Body>
        )}
        {!hasQuiz && (
          <Button
            kind="ghost"
            label={hasQuiz ? S.seeResults : S.takeQuiz}
            onPress={() => nav.go({ name: hasQuiz ? 'matches' : 'quiz' })}
          />
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
        <BackBar label={S.races} onPress={() => nav.back({ name: 'races' })} />
        <Body soft>{S.candidateMissing}</Body>
        <Button label={S.browseCovered} onPress={() => nav.go({ name: 'races' })} />
      </Screen>
    );
  }
  const { candidate, race } = found;
  const positions = candidate.positions || {};
  const posSources = candidate.positionSources || {};
  const isNamesOnly = race.coverage === 'names' || candidate.tier !== 'curated';
  const showPositions = !isNamesOnly || hasResearch(candidate);
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
            {candidate.ballotStatus === 'nominee' ? S.profNominee : candidate.incumbent ? S.profIncumbent : ''}
          </Body>
        </View>
        {hasQuiz && <MatchRing pct={match.pct} size={76} />}
      </View>
      <View style={{ marginVertical: space(2) }}>
        <TierBadge tier={isNamesOnly ? (hasResearch(candidate) ? 'researched' : 'fec') : candidate.tier} />
      </View>
      <ScrollView style={{ flex: 1 }}>
        {candidate.quote ? (
          <Body style={{ fontFamily: 'Georgia', fontStyle: 'italic', fontSize: 17, lineHeight: 25, color: colors.accent, marginBottom: space(3) }}>
            {S.quote({ quote: candidate.quote })}
          </Body>
        ) : null}
        {candidate.controversies?.length ? (
          <Card style={{ backgroundColor: colors.dangerSoft, borderColor: colors.dangerSoft }}>
            <Body style={{ color: colors.danger, fontWeight: '700', fontSize: 13, marginBottom: 4 }}>
              {S.controversies({ n: candidate.controversies.length })}
            </Body>
            {candidate.controversies.map((s, i) => {
              // Canonical shape is {label, url}; tolerate legacy {title, detail}
              // so schema drift can never render a blank allegation again.
              const text = s.label || [s.title, s.detail].filter(Boolean).join(S.controversyJoin);
              if (!text) return null;
              return (
                <View key={s.url || text || i} style={{ marginBottom: 6 }}>
                  <Body style={{ fontSize: 12.5 }}>{text}</Body>
                  {s.url ? (
                    <Pressable
                      onPress={() => Linking.openURL(s.url)}
                      accessibilityRole="link"
                      accessibilityLabel={S.controversySourceA11y({ text })}
                      hitSlop={{ top: 10, bottom: 10, left: 6, right: 12 }}
                      style={{ alignSelf: 'flex-start', minHeight: 32, justifyContent: 'center' }}
                    >
                      <Text style={{ fontSize: 12, color: colors.danger, textDecorationLine: 'underline', marginTop: 1 }}>
                        {S.controversySource}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              );
            })}
          </Card>
        ) : null}
        {showPositions && Object.values(positions).filter((v) => v !== null && v !== undefined).length <= 3 ? (
          <Card>
            <Body soft style={{ fontSize: 13 }}>
              {S.fewPositions}
            </Body>
          </Card>
        ) : null}
        {(candidate.age || candidate.home) ? (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {candidate.age ? <Tile label={S.tileAge} value={candidate.age} /> : null}
            {candidate.home ? <Tile label={S.tileHome} value={candidate.home} /> : null}
          </View>
        ) : null}
        {candidate.now ? <Tile label={S.tileNow} value={candidate.now} wide /> : null}
        {candidate.background && (
          <>
            <H2 style={{ marginTop: space(2) }}>{S.background}</H2>
            <Body soft style={{ fontSize: 14, lineHeight: 21, marginBottom: space(3) }}>{candidate.background}</Body>
          </>
        )}
        {candidate.priorities?.length ? (
          <>
            <H2>{S.priorities}</H2>
            {candidate.priorities.map((p, i) => (
              <View key={p} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space(2) }}>
                <View style={{ minWidth: 22, minHeight: 22, borderRadius: 999, paddingHorizontal: 5, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginRight: space(2.5) }}>
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
              {hasResearch(candidate) ? S.profResearchedTitle : S.profNamesOnlyTitle}
            </Body>
            <Body soft style={{ fontSize: 13, marginTop: 4 }}>
              {hasResearch(candidate) ? S.profResearchedBody : S.profNamesOnlyBody}
            </Body>
          </Card>
        )}
        {showPositions && ISSUES.map((issue) => {
          const val = positions[issue.key];
          const stated = val !== null && val !== undefined;
          const src = posSources[issue.key];
          return (
            <Card key={issue.key} style={{ paddingVertical: space(3) }}>
              <Body style={{ fontWeight: '700', marginBottom: 2 }}>{issue.name}</Body>
              <Body soft={!stated} style={{ fontSize: 13 }}>{stanceLabel(issue, val)}</Body>
              {stated && src && (
                <Pressable
                  onPress={() => Linking.openURL(src.url)}
                  accessibilityRole="link"
                  accessibilityLabel={S.positionSourceA11y({ issue: issue.name, label: src.label })}
                  hitSlop={{ top: 10, bottom: 10, left: 6, right: 12 }}
                  style={{ alignSelf: 'flex-start', minHeight: 32, justifyContent: 'center' }}
                >
                  <Body style={{ fontSize: 11, color: colors.accent, marginTop: 4 }}>
                    {S.positionSource({ label: src.label })}
                  </Body>
                </Pressable>
              )}
            </Card>
          );
        })}
        {(candidate.sources || []).map((s) => (
          <Button key={s.url} kind="ghost" small label={S.sourceButton({ label: s.label })} onPress={() => Linking.openURL(s.url)} />
        ))}
        <Button
          label={added ? S.marked : S.mark}
          accessibilityLabel={added ? S.markedA11y({ name: candidate.name }) : S.markA11y({ name: candidate.name, race: race.title })}
          onPress={async () => {
            if (added) { nav.go({ name: 'ballot' }); return; }
            await savePick({
              raceId: race.id, raceTitle: race.title, state: candidate.state,
              candidateId: candidate.id, name: candidate.name, party: candidate.party,
              tier: candidate.tier, matchPct: match?.pct ?? null,
            });
            // Only adopt this state as the user's ballot state if they have none,
            // marking a candidate while browsing must never silently switch states.
            const cur = await getBallotLocation();
            if (!cur.state) await setBallotState(candidate.state);
            setAdded(true);
          }}
        />
        {added && (
          <Body soft style={{ textAlign: 'center', fontSize: 13 }}>
            {S.tapAgain}
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
