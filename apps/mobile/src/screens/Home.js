// Home, matches the Draft 1 mockup: "Your 2026 Ballot" header, countdown,
// honesty callout, espresso quiz card, Browse/How-to cards, then
// "Races we're covering on your ballot" with Federal/State pills.
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking, Image } from 'react-native';
import { Screen, H2, Body, Card, DarkCard, InfoCallout, CategoryPill, Button } from '../ui';
import { theme, useTheme, typography } from '../theme';
import { getRaces, getCoverage, coverageSentence, STATE_NAMES, districtLabel, statesPhrase } from '../ballot';
import { DistrictLine } from '../DistrictLine';
import { InterestButton } from '../InterestButton';
import { getStateData, getPicks, getBallotLocation } from '../api';
import { useNav } from '../nav';
import { strings } from '../strings';

const S = strings.home;

const { space } = theme;
const ELECTION = new Date('2026-11-03T00:00:00');

export function Home() {
  const { colors, mode, setMode } = useTheme();
  const nav = useNav();
  const [stateCode, setStateCode] = useState(undefined);
  const [district, setDistrict] = useState(null);
  const [data, setData] = useState(null);
  const [picks, setPicks] = useState([]);

  useEffect(() => {
    getBallotLocation().then(({ state, district: d }) => { setStateCode(state); setDistrict(d); });
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
  const races = stateCode ? getRaces(stateCode, data, { display: true, district }) : [];
  const hasHouse = stateCode ? getRaces(stateCode, data, { display: true }).some((r) => r.id.includes('-house-')) : false;
  const chosen = races.filter((r) => picks.some((p) => p.raceId === r.id)).length;
  const days = Math.max(0, Math.ceil((ELECTION - Date.now()) / 86400000));

  return (
    <Screen pad={false}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: space(5), paddingTop: space(10) }} showsVerticalScrollIndicator={false}>
        {/* Brand mark */}
        <Image
          source={require('../../assets/logo-mark.png')}
          accessible
          accessibilityRole="image"
          accessibilityLabel={S.logoA11y}
          style={{ width: 36, height: 36, marginBottom: space(3) }}
        />

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.display, { fontSize: 30, lineHeight: 36, color: colors.ink }]}>
              {S.title}
            </Text>
            <Body soft style={{ fontSize: 14, marginTop: 2 }}>
              {stateCode
                ? (district ? S.stateAndDistrict({ state: STATE_NAMES[stateCode] || stateCode, district: districtLabel(district) }) : STATE_NAMES[stateCode] || stateCode)
                : S.pickState}
            </Body>
          </View>
          <Pressable
            onPress={() => nav.go({ name: 'state' })}
            accessibilityRole="button"
            accessibilityLabel={stateCode ? S.changeA11yState : S.changeA11yNoState}
            hitSlop={8}
            style={{ borderWidth: 1, borderColor: colors.line, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7, minHeight: 36, justifyContent: 'center', backgroundColor: colors.surface }}
          >
            <Text style={{ fontWeight: '700', fontSize: 13, color: colors.ink }}>{S.change}</Text>
          </Pressable>
        </View>

        {/* Countdown */}
        <View accessible accessibilityRole="text" accessibilityLabel={S.countdownA11y({ days })} style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: space(3), marginBottom: space(3) }}>
          <Body soft style={{ fontSize: 13.5 }}>{S.countdownLead}</Body>
          <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 13.5 }}>{S.countdownDays({ days })}</Text>
        </View>

        {/* Honesty callout */}
        <InfoCallout>
          <Text style={{ fontWeight: '800' }}>{S.honestyBold}</Text>{S.honestyRest({ races: cov.totalRaces, statesPhrase: statesPhrase(cov) })}
        </InfoCallout>

        {/* Quiz hero */}
        <DarkCard>
          <Text style={{ color: colors.accentBright, fontWeight: '800', fontSize: 12, letterSpacing: 1.5 }}>
            {S.quizEyebrow}
          </Text>
          <Text style={[typography.display, { fontSize: 25, lineHeight: 31, color: '#F6EFE4', marginTop: 8 }]}>
            {S.quizTitle}
          </Text>
          <Text style={{ color: 'rgba(246,239,228,0.75)', fontSize: 14, lineHeight: 20, marginTop: 8 }}>
            {S.quizBody}
          </Text>
          <Pressable
            onPress={() => nav.go({ name: 'quiz' })}
            accessibilityRole="button"
            accessibilityLabel={S.quizStartA11y}
            style={({ pressed }) => [{
              backgroundColor: colors.gold, alignSelf: 'flex-start', borderRadius: 12, minHeight: 44, justifyContent: 'center',
              paddingHorizontal: 20, paddingVertical: 12, marginTop: space(4),
            }, pressed && { opacity: 0.85 }]}
          >
            <Text style={{ color: colors.onAccent, fontWeight: '800', fontSize: 15 }}>{S.quizStart}</Text>
          </Pressable>
          <Pressable onPress={() => nav.go({ name: 'ballot' })} hitSlop={10} accessibilityRole="link" accessibilityLabel={S.skipQuizA11y} style={{ minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ color: 'rgba(246,239,228,0.8)', fontSize: 13, marginTop: space(3), textDecorationLine: 'underline' }}>
              {S.skipQuiz}
            </Text>
          </Pressable>
        </DarkCard>

        {/* Browse + How to vote */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pressable
            onPress={() => nav.go(stateCode ? { name: 'races', state: stateCode } : { name: 'races' })}
            accessibilityRole="button"
            accessibilityLabel={stateCode ? S.browseA11yState({ state: STATE_NAMES[stateCode] || stateCode }) : S.browseA11y}
            style={{ flex: 1 }}
          >
            <Card style={{ minHeight: 128 }}>
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ minWidth: 36, minHeight: 36, alignSelf: 'flex-start', borderRadius: 10, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.accent, fontSize: 17, fontWeight: '800' }}>☰</Text>
              </View>
              <H2 style={{ fontSize: 17, marginTop: space(2) }}>{S.browseTitle}</H2>
              <Body soft style={{ fontSize: 12.5 }}>
                {stateCode ? S.browseBodyState({ state: STATE_NAMES[stateCode] || stateCode }) : S.browseBody}
              </Body>
            </Card>
          </Pressable>
          <Pressable onPress={() => nav.go({ name: 'howto' })} accessibilityRole="button" accessibilityLabel={S.howToA11y} style={{ flex: 1 }}>
            <DarkCard style={{ minHeight: 128, padding: space(4) }}>
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ minWidth: 36, minHeight: 36, alignSelf: 'flex-start', borderRadius: 10, backgroundColor: 'rgba(246,239,228,0.12)', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#F6EFE4', fontSize: 16 }}>✓</Text>
              </View>
              <Text style={[typography.display, { fontSize: 17, color: '#F6EFE4', marginTop: space(2) }]}>{S.howToTitle}</Text>
              <Text style={{ color: 'rgba(246,239,228,0.7)', fontSize: 12.5, marginTop: 2 }}>{S.howToBody}</Text>
            </DarkCard>
          </Pressable>
        </View>

        {/* What you're voting for, beside How to vote */}
        <Pressable onPress={() => nav.go({ name: 'roles' })} accessibilityRole="button" accessibilityLabel={S.rolesA11y} style={{ marginTop: 10 }}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: space(3.5) }}>
            <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ minWidth: 36, minHeight: 36, alignSelf: 'flex-start', borderRadius: 10, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginRight: space(3) }}>
              <Text style={{ color: colors.accent, fontSize: 17, fontWeight: '800' }}>?</Text>
            </View>
            <View style={{ flex: 1 }}>
              <H2 style={{ fontSize: 17, marginBottom: 0 }}>{S.rolesTitle}</H2>
              <Body soft style={{ fontSize: 12.5 }}>{S.rolesBody}</Body>
            </View>
            <Text style={{ color: colors.inkSoft, marginLeft: 8 }}>›</Text>
          </Card>
        </Pressable>

        {/* Races we're covering */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space(4), marginBottom: space(2) }}>
          <Text style={{ fontSize: 12, fontWeight: '800', letterSpacing: 1.2, color: colors.inkSoft }}>
            {S.racesHeader}
          </Text>
          {races.length > 0 && (
            <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 13 }}>
              {S.chosenCount({ chosen, total: races.length })}
            </Text>
          )}
        </View>

        {!stateCode && (
          <Card>
            <Body soft style={{ fontSize: 14, marginBottom: space(2) }}>
              {S.pickStateBody}
            </Body>
            <Button small label={S.chooseMyState} onPress={() => nav.go({ name: 'races' })} />
          </Card>
        )}
        {stateCode && races.length > 0 && <DistrictLine stateCode={stateCode} district={district} hasHouseRaces={hasHouse} />}
        {stateCode && races.length === 0 && (
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
        {races.map((r) => {
          const isChosen = picks.some((p) => p.raceId === r.id);
          const who = r.coverage === 'names' ? S.raceA11yNamesOnly : r.candidates.map((c) => c.name).join(S.raceA11yVersus);
          return (
          <Pressable
            key={r.id}
            onPress={() => nav.go({ name: 'race', id: r.id })}
            accessibilityRole="button"
            accessibilityLabel={S.raceA11y({ title: r.title, who, marked: isChosen, pending: r.meta?.status === 'primary-pending' })}
          >
            <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: space(3.5) }}>
              <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ minWidth: 34, minHeight: 34, borderRadius: 9, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center', marginRight: space(3) }}>
                <Text style={{ color: picks.some((p) => p.raceId === r.id) ? colors.accent : colors.inkSoft }}>
                  {picks.some((p) => p.raceId === r.id) ? '✓' : '⚑'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Body style={{ fontWeight: '700', fontSize: 15.5 }}>{r.title}</Body>
                <Body soft style={{ fontSize: 12 }}>
                  {r.coverage === 'names' ? S.namesOnly : r.candidates.map((c) => c.name).join(S.vs)}
                </Body>
              </View>
              {r.meta?.status === 'primary-pending' && (
                <View style={{ borderWidth: 1.5, borderColor: colors.gold, borderRadius: 999, paddingHorizontal: 7, paddingVertical: 2, marginRight: 6 }}>
                  <Text style={{ color: colors.gold, fontWeight: '800', fontSize: 9.5 }}>
                    {r.meta?.primaryDate ? S.primaryDate({ date: r.meta.primaryDate }) : S.primaryPending}
                  </Text>
                </View>
              )}
              <CategoryPill kind={r.id.includes('governor') ? 'state' : r.id.includes('mayor') ? 'local' : 'federal'} />
              <Text style={{ color: colors.inkSoft, marginLeft: 8 }}>›</Text>
            </Card>
          </Pressable>
          );
        })}

        {/* About / housekeeping (About tab folded into Home) */}
        <View style={{ marginTop: space(4) }}>
          {[
            [S.aboutLink, () => nav.go({ name: 'about' })],
            [S.contactLink, () => Linking.openURL('mailto:match2vote@gmail.com?subject=M2V%20error%20report')],
          ].map(([label, fn]) => (
            <Pressable key={label} onPress={fn} accessibilityRole="button" accessibilityLabel={label} style={{ paddingVertical: space(3), minHeight: 44, justifyContent: 'center', borderTopWidth: 1, borderTopColor: colors.line }}>
              <Body style={{ fontWeight: '600', fontSize: 14 }}>{S.linkArrow({ label })}</Body>
            </Pressable>
          ))}
          <Body soft style={{ fontSize: 11.5, textAlign: 'center', marginVertical: space(4) }}>
            {S.footer}
          </Body>
        </View>
      </ScrollView>
    </Screen>
  );
}
