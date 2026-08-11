// "Where do you vote?" — the ONLY place your ballot state gets set.
// Lists every state; covered ones are marked. Browsing never changes this.
import React from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Screen, Body, BackBar } from '../ui';
import { theme, useTheme, typography } from '../theme';
import { STATE_LIST, getCoverage } from '../ballot';
import { kv } from '../api';
import { useNav } from '../nav';

const { space } = theme;

export function ChooseState({ onboarding, onDone }) {
  const { colors } = useTheme();
  const nav = useNav();
  const cov = getCoverage();
  const covered = Object.fromEntries(cov.states.map((s) => [s.code, s]));

  const pick = (code) => {
    kv.set('m2v:ballotState', code);
    if (onDone) onDone(code);
    else nav.go({ name: 'home' }, { replace: true });
  };

  return (
    <Screen>
      {!onboarding && <BackBar label="Home" onPress={() => nav.go({ name: 'home' }, { replace: true })} />}
      <Text style={[typography.display, { fontSize: 28, lineHeight: 34, color: colors.ink }]}>
        Where do you vote?
      </Text>
      <Body soft style={{ fontSize: 14, marginTop: 4, marginBottom: space(3) }}>
        This sets which ballot you see. You can change it anytime from Home.
      </Body>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {STATE_LIST.map((s) => {
          const c = covered[s.code];
          return (
            <Pressable
              key={s.code}
              onPress={() => pick(s.code)}
              style={({ pressed }) => [{
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                paddingVertical: 13, paddingHorizontal: 16, borderWidth: 1, borderRadius: 14, marginBottom: 8,
                borderColor: c ? colors.accent : colors.line,
                backgroundColor: colors.surface,
              }, pressed && { opacity: 0.7 }]}
            >
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.ink }}>{s.name}</Text>
              {c ? (
                <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 12.5 }}>
                  {c.races} race{c.races === 1 ? '' : 's'} covered
                </Text>
              ) : (
                <Text style={{ color: colors.inkSoft, fontSize: 12.5 }}>not covered yet</Text>
              )}
            </Pressable>
          );
        })}
        <Body soft style={{ fontSize: 12.5, marginVertical: space(3), textAlign: 'center' }}>
          Not-covered states still get the how-to-vote guide — and we're adding
          races weekly through Election Day.
        </Body>
      </ScrollView>
    </Screen>
  );
}
