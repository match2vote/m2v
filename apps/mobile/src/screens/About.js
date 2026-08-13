// About tab: how matching works, coverage, contact, appearance.
import React from 'react';
import { ScrollView, View, Pressable, Linking, Text } from 'react-native';
import { Screen, H1, H2, Body, Card, Button } from '../ui';
import { theme, useTheme } from '../theme';
import { getCoverage } from '../ballot';

const { space } = theme;
const CONTACT = 'match2vote@gmail.com';

export function About() {
  const { colors, mode, setMode } = useTheme();
  const cov = getCoverage();
  const P = (props) => <Body style={{ marginBottom: space(3), fontSize: 14 }} {...props} />;
  return (
    <Screen>
      <H1>About M2V</H1>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Card>
          <H2>Coverage right now</H2>
          <Body style={{ fontSize: 15 }}>
            <Text style={{ fontWeight: '800' }}>{cov.totalRaces} races · {cov.totalCandidates} candidates · {cov.states.length} states</Text>
            {'\n'}Growing weekly through Election Day. We show only what we've
            actually researched, that's a feature, not an apology.
          </Body>
        </Card>

        <H2>How matching works</H2>
        <P>
          You answer 10 questions. We compare your answers with what each
          candidate has publicly said or done, bills signed or vetoed, roll-call
          votes, lawsuits filed, statements on their own campaign site or in
          reputable coverage. Every scored position links to its source.
        </P>
        <P>
          A position is never inferred. If a candidate hasn't stated one, it stays
          "Not stated", never guessed from their party or anything else. Party
          labels are shown for identification only and play zero role in the math.
        </P>
        <P>
          Your match percentage counts only the issues where you both weighed in.
          Issues you star count double. If there's not enough info for a fair
          number, we show a dash instead of a fake percentage.
        </P>
        <P>
          Candidate rosters come from official FEC filings, refreshed nightly,
          plus hand-maintained governor races. Anything illustrative is labeled
          "Sample."
        </P>

        <Card>
          <H2>Spot an error?</H2>
          <Body style={{ fontSize: 14, marginBottom: space(2) }}>
            If a position or source looks wrong, tell us, we review it against
            the record and corrections go live within hours, no app update needed.
          </Body>
          <Button
            kind="ghost"
            label="Contact / report an error"
            onPress={() => Linking.openURL(`mailto:${CONTACT}?subject=M2V%20error%20report`)}
          />
          <Body soft style={{ fontSize: 12, textAlign: 'center' }}>{CONTACT}</Body>
        </Card>

        <Card>
          <H2>Appearance</H2>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['auto', 'light', 'dark'].map((m) => (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                style={{
                  flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center',
                  borderWidth: 1.5, borderColor: mode === m ? colors.accent : colors.line,
                  backgroundColor: mode === m ? colors.accentSoft : 'transparent',
                }}
              >
                <Text style={{ fontWeight: '700', color: mode === m ? colors.accent : colors.inkSoft }}>
                  {m === 'auto' ? 'Auto' : m === 'light' ? 'Light' : 'Dark'}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Button
          kind="ghost"
          small
          label="Open-source code & data (GitHub)"
          onPress={() => Linking.openURL('https://github.com/match2vote/m2v')}
        />
        <Button
          kind="ghost"
          small
          label="Privacy policy"
          onPress={() => Linking.openURL('https://match2vote.github.io/m2v/privacy/')}
        />
        <Body soft style={{ fontSize: 12, textAlign: 'center', marginVertical: space(3) }}>
          M2V is nonpartisan. It favors no party and no candidate.
        </Body>
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}
