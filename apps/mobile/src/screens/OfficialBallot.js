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
import { getPicks, savePick, removePick, getStateData, getQuizState, kv } from '../api';
import { getRaces, STATE_NAMES } from '../ballot';
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
  const [data, setData] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [shareMsg, setShareMsg] = useState(null);
  const [starInfo, setStarInfo] = useState(null); // race id whose star note is open

  const load = useCallback(async () => {
    const [p, s, q] = await Promise.all([getPicks(), kv.get('m2v:ballotState'), getQuizState()]);
    setPicks(p);
    setQuiz(q && q.done ? q : null);
    const code = s || p[p.length - 1]?.state || null;
    setStateCode(code);
    if (code) getStateData(code, setData).then((d) => d && setData(d));
  }, []);
  useEffect(() => { load(); }, [load]);

  if (picks === null) return <Screen><Body soft>Loading…</Body></Screen>;

  // Ballot view: every likely candidate on the real ballot, researched first.
  // Races with zero candidates still never render.
  const races = stateCode ? getRaces(stateCode, data, { ballotView: true }) : [];
  const pickByRace = Object.fromEntries(picks.map((p) => [p.raceId, p]));
  const marked = races.filter((r) => pickByRace[r.id]).length;

  // The user's own quiz result per race: match % for researched candidates,
  // and the top-match star. Star rules: quiz taken, AND the race has 2+
  // researched candidates (starring the only researched person would mislead),
  // AND the top result has a real percentage.
  const quizResults = {};
  if (quiz) {
    for (const race of races) {
      const researched = race.candidates.filter((c) => c.researched);
      const rows = rankCandidates(quiz.answers, quiz.matters, researched);
      const pctById = Object.fromEntries(rows.map((r) => [r.candidate.id, r.pct]));
      const top = rows[0];
      quizResults[race.id] = {
        pctById,
        starId: researched.length >= 2 && top && top.pct !== null ? top.candidate.id : null,
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
        matchPct: quizResults[race.id]?.pctById?.[cand.id] ?? null,
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
            YOUR SAMPLE BALLOT
          </Text>
          <Text style={{ textAlign: 'center', color: inkB, fontWeight: '600', marginTop: 4, fontSize: 13 }}>
            GENERAL ELECTION. TUESDAY, NOVEMBER 3, 2026
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
            This becomes your plan for election day. Browse your races, pick the
            candidates who actually agree with you, and walk in knowing exactly
            what you'll mark.
          </Body>
        </View>
        <Button label="Find my races" onPress={() => nav.go({ name: 'races' })} style={{ marginTop: space(4) }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <SampleBanner />
        {/* Ballot paper */}
        <View style={{ backgroundColor: paper, borderWidth: 2, borderColor: inkB, borderRadius: 6, padding: space(4), marginTop: space(3) }}>
          {/* Header block */}
          <View style={{ borderBottomWidth: 3, borderColor: inkB, paddingBottom: space(3), marginBottom: space(3) }}>
            <Text style={{ fontFamily: 'Georgia', fontWeight: '800', fontSize: 26, color: inkB, textAlign: 'center' }}>
              {(STATE_NAMES[stateCode] || stateCode).toUpperCase()}
            </Text>
            <Text style={{ textAlign: 'center', color: inkB, fontWeight: '700', marginTop: 2, fontSize: 13, letterSpacing: 0.5 }}>
              GENERAL ELECTION. TUESDAY, NOVEMBER 3, 2026
            </Text>
            <Text style={{ textAlign: 'center', color: '#555', marginTop: 6, fontSize: 12 }}>
              {marked} of {races.length} races marked · tap an oval to mark
            </Text>
          </View>

          {races.map((race) => {
            const qr = quizResults[race.id];
            return (
              <View key={race.id} style={{ marginBottom: space(5) }}>
                <Text style={{ fontWeight: '800', fontSize: 15, color: inkB, letterSpacing: 0.6 }}>
                  {race.title.toUpperCase()}
                </Text>
                <View style={{ height: 1.5, backgroundColor: inkB, marginTop: 4, marginBottom: space(3) }} />
                {race.candidates.map((cand) => {
                  const filled = pickByRace[race.id]?.candidateId === cand.id;
                  const pct = cand.researched ? qr?.pctById?.[cand.id] : undefined;
                  const starred = qr?.starId === cand.id;
                  return (
                    <View key={cand.id}>
                      <Pressable
                        onPress={() => toggle(race, cand)}
                        style={({ pressed }) => [
                          { flexDirection: 'row', alignItems: 'center', paddingVertical: space(2.5) },
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
                              <Pressable onPress={() => setStarInfo(starInfo === race.id ? null : race.id)} hitSlop={6}>
                                <Text style={{ marginLeft: 8, color: '#8a6a14', fontWeight: '800', fontSize: 12 }}>
                                  ★ Your top match
                                </Text>
                              </Pressable>
                            )}
                          </View>
                          <Text style={{ fontSize: 12, color: '#555' }}>
                            {cand.party}
                            {cand.researched && pct !== undefined && pct !== null ? ` · ${pct}% match for your answers` : ''}
                          </Text>
                          {!cand.researched && (
                            <Text style={{ fontSize: 11.5, color: '#8a7f72', fontStyle: 'italic' }}>
                              We haven't researched this candidate's positions.
                            </Text>
                          )}
                        </View>
                        {cand.researched && (
                          <Pressable onPress={() => nav.go({ name: 'candidate', id: cand.id })} hitSlop={8}>
                            <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13 }}>view ›</Text>
                          </Pressable>
                        )}
                      </Pressable>
                      {starred && starInfo === race.id && (
                        <Text style={{ fontSize: 11.5, color: '#555', marginLeft: 46, marginBottom: 6 }}>
                          This star only reflects how YOUR quiz answers line up with this
                          candidate's sourced positions. M2V does not endorse candidates.{' '}
                          <Text style={{ textDecorationLine: 'underline' }} onPress={() => nav.go({ name: 'about' })}>
                            How matching works ›
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
            Take the quiz and your match percentages will appear here next to
            the candidates we've researched.
          </Body>
        )}

        <Button
          label="Share my ballot as an image"
          onPress={async () => {
            const res = await shareBallotImage({ stateName: STATE_NAMES[stateCode] || stateCode, races, picks });
            setShareMsg(res === 'downloaded' ? 'Saved! Check your downloads.' : res === 'shared-text' ? 'Shared.' : 'Could not export on this device.');
          }}
          style={{ marginTop: space(4) }}
        />
        {shareMsg && <Body soft style={{ textAlign: 'center', fontSize: 13 }}>{shareMsg}</Body>}
        <Pressable onPress={() => nav.go({ name: 'state' })}>
          <Body soft style={{ textAlign: 'center', fontSize: 13, textDecorationLine: 'underline', marginVertical: space(3) }}>
            Change ballot state
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
    <View style={{ backgroundColor: colors.gold, borderRadius: 8, paddingVertical: space(2), paddingHorizontal: space(3) }}>
      <Text style={{ color: '#111', fontWeight: '800', fontSize: 13, textAlign: 'center', letterSpacing: 0.4 }}>
        SAMPLE BALLOT — NOT AN OFFICIAL BALLOT
      </Text>
      <Text style={{ color: '#111', fontWeight: '600', fontSize: 11, textAlign: 'center' }}>
        For planning only
      </Text>
    </View>
  );
}
