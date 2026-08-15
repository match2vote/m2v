// About tab: how matching works, coverage, contact, appearance.
import React from 'react';
import { ScrollView, View, Pressable, Linking, Text } from 'react-native';
import { Screen, H1, H2, Body, Card, Button } from '../ui';
import { theme, useTheme } from '../theme';
import { getCoverage } from '../ballot';
import { strings } from '../strings';

const S = strings.about;

const { space } = theme;
const CONTACT = 'match2vote@gmail.com';

export function About() {
  const { colors, mode, setMode } = useTheme();
  const cov = getCoverage();
  const P = (props) => <Body style={{ marginBottom: space(3), fontSize: 14 }} {...props} />;
  return (
    <Screen>
      <H1>{S.title}</H1>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Card>
          <H2>{S.coverageTitle}</H2>
          <Body style={{ fontSize: 15 }}>
            <Text style={{ fontWeight: '800' }}>{S.coverageBold({ races: cov.totalRaces, candidates: cov.totalCandidates, states: cov.states.length })}</Text>
            {S.coverageRest}
          </Body>
        </Card>

        <H2>{S.howTitle}</H2>
        <P>{S.how1}</P>
        <P>{S.how2}</P>
        <P>{S.how3}</P>
        <P>{S.how4}</P>
        <P>{S.how5}</P>

        <Card>
          <H2>{S.errorTitle}</H2>
          <Body style={{ fontSize: 14, marginBottom: space(2) }}>
            {S.errorBody}
          </Body>
          <Button
            kind="ghost"
            label={S.contact}
            onPress={() => Linking.openURL(`mailto:${CONTACT}?subject=M2V%20error%20report`)}
          />
          <Body soft style={{ fontSize: 12, textAlign: 'center' }}>{CONTACT}</Body>
        </Card>

        <Card>
          <H2>{S.appearance}</H2>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['auto', 'light', 'dark'].map((m) => (
              <Pressable
                key={m}
                onPress={() => setMode(m)}
                accessibilityRole="radio"
                accessibilityState={{ selected: mode === m, checked: mode === m }}
                accessibilityLabel={m === 'auto' ? S.modeAutoA11y : m === 'light' ? S.modeLightA11y : S.modeDarkA11y}
                style={{
                  flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', minHeight: 44, justifyContent: 'center',
                  borderWidth: 1.5, borderColor: mode === m ? colors.accent : colors.line,
                  backgroundColor: mode === m ? colors.accentSoft : 'transparent',
                }}
              >
                <Text style={{ fontWeight: '700', color: mode === m ? colors.accent : colors.inkSoft }}>
                  {m === 'auto' ? S.modeAuto : m === 'light' ? S.modeLight : S.modeDark}
                </Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <Button
          kind="ghost"
          small
          label={S.github}
          onPress={() => Linking.openURL('https://github.com/match2vote/m2v')}
        />
        <Button
          kind="ghost"
          small
          label={S.privacy}
          onPress={() => Linking.openURL('https://match2vote.github.io/m2v/privacy/')}
        />
        <Body soft style={{ fontSize: 12, textAlign: 'center', marginTop: space(3) }}>
          {S.nonpartisan}
        </Body>
        <Body soft style={{ fontSize: 12, textAlign: 'center', marginTop: space(1), marginBottom: space(3) }}>
          {S.org}
        </Body>
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}
