// Home, matches the Draft 1 mockup: "Your 2026 Ballot" header, countdown,
// honesty callout, espresso quiz card, Browse/How-to cards, then
// "Races we're covering on your ballot" with Federal/State pills.
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { Screen, H2, Body, Card, DarkCard, InfoCallout, CategoryPill, Button } from '../ui';
import { theme, useTheme, typography } from '../theme';
import { getRaces, getCoverage, STATE_NAMES } from '../ballot';
import { getStateData, getPicks, kv } from '../api';
import { useNav } from '../nav';

const { space } = theme;
const ELECTION = new Date('2026-11-03T00:00:00');

export function Home() {
  const { colors, mode, setMode } = useTheme();
  const nav = useNav();
  const [stateCode, setStateCode] = useState(undefined);
  const [data, setData] = useState(null);
  const [picks, setPicks] = useState([]);

  useEffect(() => {
    kv.get('m2v:ballotState').then((s) => setStateCode(s || null));
    getPicks().then(setPicks);
  }, [nav.route]);
  useEffect(() => {
    if (!stateCode) return;
    let alive = true;
    getStateData(stateCode, (fresh) => { if (alive) setData(fresh); })
      .then((d) => { if (alive && d) setData(d); });
    return () => { alive = false; };
  }, [stateCode]);

  const cov = getCoverage();
  const races = stateCode ? getRaces(stateCode, data, { display: true }) : [];
  const chosen = races.filter((r) => picks.some((p) => p.raceId === r.id)).length;
  const days = Math.max(0, Math.ceil((ELECTION - Date.now()) / 86400000));

  return (
    <Screen pad={false}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: space(5), paddingTop: space(14) }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.display, { fontSize: 30, lineHeight: 36, color: colors.ink }]}>
              Your 2026 Ballot
            </Text>
            <Body soft style={{ fontSize: 14, marginTop: 2 }}>
              {stateCode ? STATE_NAMES[stateCode] || stateCode : 'Pick your state to begin'}
            </Body>
          </View>
          <Pressable
            onPress={() => nav.go({ name: 'state' })}
            style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.surface }}
          >
            <Text style={{ fontWeight: '700', fontSize: 13, color: colors.ink }}>⌖ Change</Text>
          </Pressable>
        </View>

        {/* Countdown */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: space(3), marginBottom: space(3) }}>
          <Body soft style={{ fontSize: 13.5 }}>▤ General Election · Nov 3 · </Body>
          <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 13.5 }}>{days} days away</Text>
        </View>

        {/* Honesty callout */}
        <InfoCallout>
          <Text style={{ fontWeight: '800' }}>Every candidate here is real</Text>, rosters from official
          FEC filings, positions researched with a source for every score. We show only the{' '}
          {cov.totalRaces} races across {cov.states.length} states we've actually covered so far, and add more weekly.
        </InfoCallout>

        {/* Quiz hero */}
        <DarkCard>
          <Text style={{ color: colors.accentBright, fontWeight: '800', fontSize: 12, letterSpacing: 1.5 }}>
            ✦ THE MATCH QUIZ
          </Text>
          <Text style={[typography.display, { fontSize: 25, lineHeight: 31, color: '#F6EFE4', marginTop: 8 }]}>
            Answer 10 questions.{'\n'}Meet your candidates.
          </Text>
          <Text style={{ color: 'rgba(246,239,228,0.75)', fontSize: 14, lineHeight: 20, marginTop: 8 }}>
            We'll rank the candidates we've researched by how well they line up with you, never by party.
          </Text>
          <Pressable
            onPress={() => nav.go({ name: 'quiz' })}
            style={({ pressed }) => [{
              backgroundColor: colors.gold, alignSelf: 'flex-start', borderRadius: 12,
              paddingHorizontal: 20, paddingVertical: 12, marginTop: space(4),
            }, pressed && { opacity: 0.85 }]}
          >
            <Text style={{ color: '#FFF9EE', fontWeight: '800', fontSize: 15 }}>Start the quiz  →</Text>
          </Pressable>
          <Pressable onPress={() => nav.go({ name: 'ballot' })} hitSlop={6}>
            <Text style={{ color: 'rgba(246,239,228,0.8)', fontSize: 13, marginTop: space(3), textDecorationLine: 'underline' }}>
              Done your own research? Skip the quiz and fill out your ballot
            </Text>
          </Pressable>
        </DarkCard>

        {/* Browse + How to vote */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={() => nav.go(stateCode ? { name: 'races', state: stateCode } : { name: 'races' })}
            style={{ flex: 1 }}
          >
            <Card style={{ minHeight: 128 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.accent, fontSize: 17, fontWeight: '800' }}>☰</Text>
              </View>
              <H2 style={{ fontSize: 17, marginTop: space(2) }}>Browse candidates</H2>
              <Body soft style={{ fontSize: 12.5 }}>
                {stateCode ? `The races on your ${STATE_NAMES[stateCode] || stateCode} ballot, no quiz needed.` : 'Race by race, no quiz needed.'}
              </Body>
            </Card>
          </Pressable>
          <Pressable onPress={() => nav.go({ name: 'howto' })} style={{ flex: 1 }}>
            <DarkCard style={{ minHeight: 128, padding: space(4) }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(246,239,228,0.12)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#F6EFE4', fontSize: 16 }}>✓</Text>
              </View>
              <Text style={[typography.display, { fontSize: 17, color: '#F6EFE4', marginTop: space(2) }]}>How to vote</Text>
              <Text style={{ color: 'rgba(246,239,228,0.7)', fontSize: 12.5, marginTop: 2 }}>3-min guide & your options.</Text>
            </DarkCard>
          </Pressable>
        </View>

        {/* Races we're covering */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space(4), marginBottom: space(2) }}>
          <Text style={{ fontSize: 12, fontWeight: '800', letterSpacing: 1.2, color: colors.inkSoft }}>
            RACES WE'RE COVERING ON YOUR BALLOT
          </Text>
          {races.length > 0 && (
            <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 13 }}>
              {chosen}/{races.length} chosen
            </Text>
          )}
        </View>

        {!stateCode && (
          <Card>
            <Body soft style={{ fontSize: 14, marginBottom: space(2) }}>
              Pick your state to see the races we've researched for your ballot.
            </Body>
            <Button small label="Choose my state" onPress={() => nav.go({ name: 'races' })} />
          </Card>
        )}
        {stateCode && races.length === 0 && (
          <Card>
            <Body style={{ fontWeight: '700', marginBottom: 4 }}>
              M2V doesn't cover {STATE_NAMES[stateCode] || stateCode} yet.
            </Body>
            <Body soft style={{ fontSize: 13, marginBottom: space(2) }}>
              We're adding races weekly. Here's what we cover now:{' '}
              {cov.states.map((s) => s.code).join(' · ')}
            </Body>
            <Button small kind="ghost" label="See covered states" onPress={() => nav.go({ name: 'races' })} />
          </Card>
        )}
        {races.map((r) => (
          <Pressable key={r.id} onPress={() => nav.go({ name: 'race', id: r.id })}>
            <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: space(3.5) }}>
              <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', marginRight: space(3) }}>
                <Text style={{ color: picks.some((p) => p.raceId === r.id) ? colors.accent : colors.inkSoft }}>
                  {picks.some((p) => p.raceId === r.id) ? '✓' : '⚑'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Body style={{ fontWeight: '700', fontSize: 15.5 }}>{r.title}</Body>
                <Body soft style={{ fontSize: 12 }}>
                  {r.coverage === 'names' ? 'Names only, positions not researched yet' : r.candidates.map((c) => c.name).join(' vs ')}
                </Body>
              </View>
              <CategoryPill kind={r.id.includes('governor') ? 'state' : r.id.includes('mayor') ? 'local' : 'federal'} />
              <Text style={{ color: colors.inkSoft, marginLeft: 8 }}>›</Text>
            </Card>
          </Pressable>
        ))}

        {/* About / housekeeping (About tab folded into Home) */}
        <View style={{ marginTop: space(4) }}>
          {[
            ['How matching works & coverage', () => nav.go({ name: 'about' })],
            ['Contact / report an error', () => Linking.openURL('mailto:match2vote@gmail.com?subject=M2V%20error%20report')],
          ].map(([label, fn]) => (
            <Pressable key={label} onPress={fn} style={{ paddingVertical: space(3), borderTopWidth: 1, borderTopColor: colors.line }}>
              <Body style={{ fontWeight: '600', fontSize: 14 }}>{label}  ›</Body>
            </Pressable>
          ))}
          <Body soft style={{ fontSize: 11.5, textAlign: 'center', marginVertical: space(4) }}>
            M2V is nonpartisan. Every position sourced. Never matched by party.
          </Body>
        </View>
      </ScrollView>
    </Screen>
  );
}
