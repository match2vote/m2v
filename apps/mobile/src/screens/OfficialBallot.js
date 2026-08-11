// My Ballot v2 — looks like the paper ballot you fill out at the polls.
// Ruled sections, ALL-CAPS race titles, fillable ovals that mark with a pop.
// The SAMPLE BALLOT banner is mandatory and always visible (and baked into exports).
import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Screen, H2, Body, Button, Bubble } from '../ui';
import { theme, useTheme } from '../theme';
import { getPicks, savePick, removePick, getStateData, kv } from '../api';
import { getRaces, getCoverage, STATE_NAMES } from '../ballot';
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
  const [shareMsg, setShareMsg] = useState(null);

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([getPicks(), kv.get('m2v:ballotState')]);
    setPicks(p);
    const code = s || p[p.length - 1]?.state || null;
    setStateCode(code);
    if (code) getStateData(code, setData).then((d) => d && setData(d));
  }, []);
  useEffect(() => { load(); }, [load]);

  if (picks === null) return <Screen><Body soft>Loading…</Body></Screen>;

  const races = stateCode ? getRaces(stateCode, data, { curatedOnly: true }) : [];
  const pickByRace = Object.fromEntries(picks.map((p) => [p.raceId, p]));
  const marked = races.filter((r) => pickByRace[r.id]).length;

  const toggle = async (race, cand) => {
    const existing = pickByRace[race.id];
    if (existing && existing.candidateId === cand.id) {
      setPicks(await removePick(race.id));
    } else {
      setPicks(await savePick({
        raceId: race.id, raceTitle: race.title, state: cand.state,
        candidateId: cand.id, name: cand.name, party: cand.party, tier: cand.tier,
        matchPct: existing?.matchPct ?? null,
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
            GENERAL ELECTION — TUESDAY, NOVEMBER 3, 2026
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
              GENERAL ELECTION — TUESDAY, NOVEMBER 3, 2026
            </Text>
            <Text style={{ textAlign: 'center', color: '#555', marginTop: 6, fontSize: 12 }}>
              {marked} of {races.length} races marked · tap an oval to mark
            </Text>
          </View>

          {races.map((race) => (
            <View key={race.id} style={{ marginBottom: space(5) }}>
              <Text style={{ fontWeight: '800', fontSize: 15, color: inkB, letterSpacing: 0.6 }}>
                {race.title.toUpperCase()}
              </Text>
              <View style={{ height: 1.5, backgroundColor: inkB, marginTop: 4, marginBottom: space(3) }} />
              {race.candidates.map((cand) => {
                const filled = pickByRace[race.id]?.candidateId === cand.id;
                return (
                  <Pressable
                    key={cand.id}
                    onPress={() => toggle(race, cand)}
                    style={({ pressed }) => [
                      { flexDirection: 'row', alignItems: 'center', paddingVertical: space(2.5) },
                      pressed && { opacity: 0.6 },
                    ]}
                  >
                    <Bubble filled={filled} />
                    <View style={{ marginLeft: space(3), flex: 1 }}>
                      <Text style={{ fontFamily: 'Georgia', fontSize: 17, color: inkB, fontWeight: filled ? '800' : '500' }}>
                        {cand.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: '#555' }}>{cand.party}</Text>
                    </View>
                    <Pressable onPress={() => nav.go({ name: 'candidate', id: cand.id })} hitSlop={8}>
                      <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13 }}>view ›</Text>
                    </Pressable>
                  </Pressable>
                );
              })}
              {race.hiddenCount > 0 && (
                <Text style={{ fontSize: 11, color: '#777', marginTop: 4 }}>
                  {race.hiddenCount} other filed candidate{race.hiddenCount === 1 ? '' : 's'} not yet researched — never guessed.
                </Text>
              )}
            </View>
          ))}
        </View>

        <Button
          label="Share my ballot as an image"
          onPress={async () => {
            const res = await shareBallotImage({ stateName: STATE_NAMES[stateCode] || stateCode, races, picks });
            setShareMsg(res === 'downloaded' ? 'Saved! Check your downloads.' : res === 'shared-text' ? 'Shared.' : 'Could not export on this device.');
          }}
          style={{ marginTop: space(4) }}
        />
        {shareMsg && <Body soft style={{ textAlign: 'center', fontSize: 13 }}>{shareMsg}</Body>}
        <Pressable onPress={() => { kv.set('m2v:ballotState', ''); setStateCode(null); }}>
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
