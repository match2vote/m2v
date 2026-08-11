// How to vote, the prototype's chaptered guide, carried forward as a written
// guide (no fake video player). Same chapters, same green info callout.
import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Screen, H2, Body, Card, InfoCallout, BackBar, DarkCard } from '../ui';
import { theme, useTheme, typography } from '../theme';
import { useNav } from '../nav';
import { VoteScene } from './VoteScenes';

const { space } = theme;

const CHAPTERS = [
  { title: 'Before you go', body: 'Make sure you are registered, know where your polling place is, and bring an accepted photo ID just in case. Check your registration early, deadlines in many states fall weeks before Election Day.' },
  { title: 'Vote by mail', body: 'Request your ballot online or by form. When it arrives, mark it at home, seal it in the signed return envelope exactly as instructed, and return it by mail or at an official drop box before the deadline. You can usually track it online to confirm it was counted.' },
  { title: 'Vote early in person', body: 'Many areas open early-voting sites in the weeks before Election Day, often including evenings and weekends, and often any center in your area rather than one assigned place. Same ballot, usually shorter lines.' },
  { title: 'Vote on Election Day', body: 'Go to your assigned polling place during open hours and bring an accepted photo ID if your state requires one. If you make a mistake, ask a poll worker for a fresh ballot. If you are in line when polls close, stay in line, you can still vote.' },
  { title: 'Fill out your ballot', body: 'Vote every race you care about, follow the "vote for one" notes, and review your choices before you submit. Your M2V sample ballot is your plan, bring it (on your phone or printed) and copy your marks across.' },
];

export function HowTo() {
  const { colors } = useTheme();
  const nav = useNav();
  return (
    <Screen>
      <BackBar label="Home" onPress={() => nav.go({ name: 'home' }, { replace: true })} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={[typography.display, { fontSize: 28, lineHeight: 34, color: colors.ink }]}>How to vote</Text>
        <Body soft style={{ fontSize: 14, marginTop: 4, marginBottom: space(3) }}>
          A 3-minute guide to your options. Rules vary by state, your state's
          official election site is always the final word.
        </Body>
        <InfoCallout>
          You don't need to be an expert to vote. Pick whichever way fits your
          life, by mail, early, or on the day. Your vote counts the same.
        </InfoCallout>
        {CHAPTERS.map((c, i) => (
          <Card key={c.title} style={{ paddingVertical: space(4) }}>
            <VoteScene index={i} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space(2) }}>
              <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginRight: space(2.5) }}>
                <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 13 }}>{i + 1}</Text>
              </View>
              <Text style={[typography.display, { fontSize: 18, color: colors.ink }]}>{c.title}</Text>
            </View>
            <Body soft style={{ fontSize: 14, lineHeight: 21 }}>{c.body}</Body>
          </Card>
        ))}
        <DarkCard>
          <Text style={[typography.display, { fontSize: 18, color: '#F6EFE4' }]}>Walk in with a plan</Text>
          <Text style={{ color: 'rgba(246,239,228,0.75)', fontSize: 13.5, lineHeight: 20, marginTop: 6, marginBottom: space(3) }}>
            Mark your picks on your M2V sample ballot and bring it with you,
            it's the fastest way to vote confidently, top to bottom.
          </Text>
          <Text
            onPress={() => nav.go({ name: 'ballot' })}
            style={{ color: colors.accentBright, fontWeight: '800', fontSize: 15 }}
          >
            Review my ballot  →
          </Text>
        </DarkCard>
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}
