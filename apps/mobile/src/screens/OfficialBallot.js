// My Ballot v3, looks like the paper ballot you fill out at the polls.
// RULE (Aug 13, deliberate change): the ballot mirrors the REAL ballot, every
// likely candidate is listed and markable, researched or not. Unresearched
// candidates are clearly labeled and never get a match number. Researched
// candidates show the user's own match %, and the user's strongest match per
// race gets a star THAT IS EXPLICITLY THE USER'S RESULT, NEVER OUR PICK.
// The SAMPLE BALLOT banner is mandatory and always visible (and in exports).
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { rankCandidates } from '@m2v/core';
import { Screen, H2, Body, Button, Bubble } from '../ui';
import { theme, useTheme } from '../theme';
import { getPicks, savePick, removePick, getStateData, getQuizState, getBallotLocation } from '../api';
import { DistrictLine } from '../DistrictLine';
import { RankedChoiceNotice } from '../RankedChoice';
import { strings } from '../strings';

const S = strings.ballot;
import { getRaces, STATE_NAMES, districtLabel } from '../ballot';
import { useNav } from '../nav';
import { shareBallotImage } from '../share';

const { space } = theme;
const paper = '#FFFDF8';
const inkB = '#111111';

export function OfficialBallot() {
  const { colors } = useTheme();
  const nav = useNav();
  const [picks, setPicks] = useState(null);
  const [stateCode, setStateCode] = useState(null);
  const [district, setDistrict] = useState(null);
  const [data, setData] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [shareMsg, setShareMsg] = useState(null);
  const [starInfo, setStarInfo] = useState(null); // race id whose star note is open

  const load = useCallback(async () => {
    const [p, loc, q] = await Promise.all([getPicks(), getBallotLocation(), getQuizState()]);
    const s = loc.state;
    setDistrict(loc.district);
    setPicks(p);
    // Match numbers require a COMPLETED quiz with 3+ real answers; anything
    // less shows no percentages and no star (see docs/design/match-confidence.md).
    const realAnswers = q ? Object.values(q.answers || {}).filter((v) => v !== null && v !== undefined).length : 0;
    setQuiz(q && q.done && realAnswers >= 3 ? { ...q, realAnswers } : null);
    // Ballot state comes ONLY from the explicit "Where do you vote?" choice.
    // (Previously fell back to the last marked pick's state, which could
    // surface a state the user merely browsed. Killed Aug 13.)
    const code = s || null;
    setStateCode(code);
    if (code) getStateData(code, setData).then((d) => d && setData(d));
  }, []);
  useEffect(() => { load(); }, [load]);

  if (picks === null) return <Screen><Body soft>{S.loading}</Body></Screen>;

  // Ballot view: every likely candidate on the real ballot, researched first.
  // Races with zero candidates still never render.
  const races = stateCode ? getRaces(stateCode, data, { ballotView: true, district }) : [];
  const hasHouse = stateCode ? getRaces(stateCode, data, { ballotView: true }).some((r) => r.id.includes('-house-')) : false;
  const pickByRace = Object.fromEntries(picks.map((p) => [p.raceId, p]));
  const marked = races.filter((r) => pickByRace[r.id]).length;

  // The user's own quiz result per race: match % for researched candidates,
  // and the top-match star. Star rules: quiz completed (3+ real answers), AND
  // the race has 2+ researched candidates (starring the only researched person
  // would mislead), AND the top result has a real percentage, AND the top
  // candidate was scored on at least as many issues as anyone else in the race.
  // That last rule is the denominator guard: a 9-of-10-issue 71% must not
  // outrank a 10-of-10-issue 58% into a star, thin data never wins the star.
  const quizResults = {};
  if (quiz) {
    for (const race of races) {
      const researched = race.candidates.filter((c) => c.researched);
      const rows = rankCandidates(quiz.answers, quiz.matters, researched);
      const byId = Object.fromEntries(rows.map((r) => [r.candidate.id, r]));
      const top = rows[0];
      const scored = rows.filter((r) => r.pct !== null);
      const maxShared = scored.length ? Math.max(...scored.map((r) => r.sharedIssues)) : 0;
      quizResults[race.id] = {
        byId,
        starId:
          researched.length >= 2 && top && top.pct !== null && top.sharedIssues >= maxShared
            ? top.candidate.id
            : null,
      };
    }
  }

  const toggle = async (race, cand) => {
    const existing = pickByRace[race.id];
    if (existing && existing.candidateId === cand.id) {
      setPicks(await removePick(race.id));
    } else {
      setPicks(await savePick({
        raceId: race.id, raceTitle: race.title, state: cand.state,
        candidateId: cand.id, name: cand.name, party: cand.party, tier: cand.tier,
        matchPct: quizResults[race.id]?.byId?.[cand.id]?.pct ?? null,
      }));
    }
  };

  // Empty state that teaches: show the blank form idea + route to Races.
  if (!stateCode || races.length === 0) {
    return (
      <Screen>
        <SampleBanner />
        <View style={{ backgroundColor: paper, borderWidth: 2, borderColor: inkB, borderRadius: 6, padding: space(5), marginTop: space(3) }}>
          <Text style={{ fontFamily: 'Georgia', fontWeight: '800', fontSize: 24, color: inkB, textAlign: 'center' }}>
            {S.emptyTitle}
          </Text>
          <Text style={{ textAlign: 'center', color: inkB, fontWeight: '600', marginTop: 4, fontSize: 13 }}>
            {S.electionLine}
          </Text>
          <View style={{ height: 2, backgroundColor: inkB, marginVertical: space(4) }} />
          {[1, 2, 3].map((i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space(4), opacity: 0.35 }}>
              <Bubble filled={false} />
              <View style={{ marginLeft: space(3), flex: 1 }}>
                <View style={{ height: 12, backgroundColor: '#999', borderRadius: 3, width: '70%' }} />
                <View style={{ height: 8, backgroundColor: '#bbb', borderRadius: 3, width: '35%', marginTop: 6 }} />
              </View>
            </View>
          ))}
          <Body style={{ color: inkB, fontSize: 14, textAlign: 'center', marginTop: space(2) }}>
            {S.emptyBody}
          </Body>
        </View>
        <Button label={S.findMyRaces} onPress={() => nav.go({ name: 'races' })} style={{ marginTop: space(4) }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <SampleBanner />
        <DistrictLine stateCode={stateCode} district={district} hasHouseRaces={hasHouse} style={{ marginTop: space(3), marginBottom: 0 }} />
        {/* Ballot paper */}
        <View style={{ backgroundColor: paper, borderWidth: 2, borderColor: inkB, borderRadius: 6, padding: space(4), marginTop: space(3) }}>
          {/* Header block */}
          <View style={{ borderBottomWidth: 3, borderColor: inkB, paddingBottom: space(3), marginBottom: space(3) }}>
            <Text style={{ fontFamily: 'Georgia', fontWeight: '800', fontSize: 26, color: inkB, textAlign: 'center' }}>
              {(STATE_NAMES[stateCode] || stateCode).toUpperCase()}
            </Text>
            {district ? (
              <Text style={{ textAlign: 'center', color: inkB, fontWeight: '700', marginTop: 2, fontSize: 12, letterSpacing: 0.5 }}>
                {districtLabel(district).toUpperCase()}
              </Text>
            ) : null}
            <Text style={{ textAlign: 'center', color: inkB, fontWeight: '700', marginTop: 2, fontSize: 13, letterSpacing: 0.5 }}>
              {S.electionLine}
            </Text>
            <Text style={{ textAlign: 'center', color: '#555', marginTop: 6, fontSize: 12 }}>
              {S.markedCount({ marked, total: races.length })}
            </Text>
          </View>

          {races.map((race) => {
            const qr = quizResults[race.id];
            const pending = race.meta?.status === 'primary-pending';
            return (
              <View key={race.id} style={{ marginBottom: space(5) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontWeight: '800', fontSize: 15, color: inkB, letterSpacing: 0.6 }}>
                    {race.title.toUpperCase()}
                  </Text>
                  {pending && (
                    <View style={{ borderWidth: 1.5, borderColor: '#8a6a14', borderRadius: 999, paddingHorizontal: 7, paddingVertical: 1 }}>
                      <Text style={{ color: '#8a6a14', fontWeight: '800', fontSize: 9.5 }}>
                        {race.meta?.primaryDate ? S.primaryDate({ date: race.meta.primaryDate }) : S.primaryPending}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{ height: 1.5, backgroundColor: inkB, marginTop: 4, marginBottom: pending ? 4 : space(3) }} />
                <RankedChoiceNotice raceId={race.id} variant="ballot" onPaper />
                {pending && (
                  <Text style={{ fontSize: 11.5, color: '#8a6a14', fontStyle: 'italic', marginBottom: space(2) }}>
                    {S.pendingNote}
                    {pickByRace[race.id] ? S.pendingNoteMarked : ''}
                  </Text>
                )}
                {race.candidates.map((cand) => {
                  const filled = pickByRace[race.id]?.candidateId === cand.id;
                  const row = cand.researched ? qr?.byId?.[cand.id] : undefined;
                  const pct = row?.pct;
                  const starred = qr?.starId === cand.id;
                  return (
                    <View key={cand.id}>
                      {/* The mark control and the small view / star controls
                          are siblings, never nested, so each is its own
                          element for a screen reader. */}
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Pressable
                          onPress={() => toggle(race, cand)}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: filled }}
                          accessibilityLabel={S.rowA11y({
                            name: cand.name, party: cand.party, pct, shared: row?.sharedIssues, total: quiz?.realAnswers ?? 10,
                            researched: cand.researched, starred, filled, race: race.title,
                          })}
                          style={({ pressed }) => [
                            { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: space(2.5), minHeight: 44 },
                            pressed && { opacity: 0.6 },
                          ]}
                        >
                          <Bubble filled={filled} />
                          <View style={{ marginLeft: space(3), flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                              <Text style={{ fontFamily: 'Georgia', fontSize: 17, color: inkB, fontWeight: filled ? '800' : '500' }}>
                                {cand.name}
                              </Text>
                              {starred && (
                                <Text style={{ marginLeft: 8, color: '#8a6a14', fontWeight: '800', fontSize: 12 }}>
                                  {S.topMatch}
                                </Text>
                              )}
                            </View>
                            <Text style={{ fontSize: 12, color: '#555' }}>
                              {cand.party}
                              {cand.researched && pct !== undefined && pct !== null
                                ? S.matchLine({ pct, shared: row.sharedIssues, total: quiz?.realAnswers ?? 10 })
                                : ''}
                            </Text>
                            {!cand.researched && (
                              <Text style={{ fontSize: 11.5, color: '#6b6257', fontStyle: 'italic' }}>
                                {S.notResearched}
                              </Text>
                            )}
                          </View>
                        </Pressable>
                        {(cand.researched || starred) && (
                          <View style={{ alignItems: 'flex-end', marginLeft: 6 }}>
                            {cand.researched && (
                              <Pressable
                                onPress={() => nav.go({ name: 'candidate', id: cand.id })}
                                hitSlop={{ top: 8, bottom: 8, left: 12, right: 8 }}
                                accessibilityRole="button"
                                accessibilityLabel={S.viewA11y({ name: cand.name })}
                                style={{ minHeight: 36, minWidth: 44, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 4 }}
                              >
                                <Text style={{ color: '#8a6a14', fontWeight: '700', fontSize: 13 }}>{S.view}</Text>
                              </Pressable>
                            )}
                            {starred && (
                              <Pressable
                                onPress={() => setStarInfo(starInfo === race.id ? null : race.id)}
                                hitSlop={{ top: 8, bottom: 8, left: 12, right: 8 }}
                                accessibilityRole="button"
                                accessibilityLabel={S.starInfoA11y}
                                accessibilityState={{ expanded: starInfo === race.id }}
                                style={{ minHeight: 36, minWidth: 44, justifyContent: 'center', alignItems: 'flex-end', paddingHorizontal: 4 }}
                              >
                                <Text style={{ color: '#8a6a14', fontWeight: '700', fontSize: 12 }}>{S.starInfo}</Text>
                              </Pressable>
                            )}
                          </View>
                        )}
                      </View>
                      {starred && starInfo === race.id && (
                        <Text style={{ fontSize: 11.5, color: '#555', marginLeft: 46, marginBottom: 6 }}>
                          {S.starNote}
                          <Text accessibilityRole="link" style={{ textDecorationLine: 'underline' }} onPress={() => nav.go({ name: 'about' })}>
                            {S.howMatchingWorks}
                          </Text>
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        {!quiz && (
          <Body soft style={{ fontSize: 12.5, textAlign: 'center', marginTop: space(2) }}>
            {S.takeQuizNote}
          </Body>
        )}

        <Button
          label={S.share}
          onPress={async () => {
            const res = await shareBallotImage({ stateName: STATE_NAMES[stateCode] || stateCode, races, picks });
            setShareMsg(res === 'downloaded' ? S.shareSaved : res === 'shared-text' ? S.shareShared : S.shareFailed);
          }}
          style={{ marginTop: space(4) }}
        />
        {shareMsg && <Body soft style={{ textAlign: 'center', fontSize: 13 }}>{shareMsg}</Body>}
        <Pressable onPress={() => nav.go({ name: 'state' })} accessibilityRole="button" accessibilityLabel={S.changeState} style={{ minHeight: 44, justifyContent: 'center' }}>
          <Body soft style={{ textAlign: 'center', fontSize: 13, textDecorationLine: 'underline', marginVertical: space(3) }}>
            {S.changeState}
          </Body>
        </Pressable>
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}

export function SampleBanner() {
  const { colors } = useTheme();
  return (
    <View accessible accessibilityRole="header" accessibilityLabel={S.bannerA11y} style={{ backgroundColor: colors.gold, borderRadius: 8, paddingVertical: space(2), paddingHorizontal: space(3) }}>
      <Text style={{ color: colors.onAccent, fontWeight: '800', fontSize: 13, textAlign: 'center', letterSpacing: 0.4 }}>
        {S.bannerTitle}
      </Text>
      <Text style={{ color: colors.onAccent, fontWeight: '600', fontSize: 11, textAlign: 'center' }}>
        {S.bannerSub}
      </Text>
    </View>
  );
}
