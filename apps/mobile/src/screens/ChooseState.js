// "Where do you vote?", the ONLY place your ballot state gets set.
// Lists every state. Coverage is the rule now, not the exception, so covered
// states render in NORMAL styling and the few uncovered ones are visibly
// de-emphasized with the reason ("no 2026 race"). Gold is the interaction
// accent here (the row you're pressing), never a coverage highlight: when 47
// of 51 tiles glow, nothing is highlighted.
import React from 'react';
import { ScrollView, Text, Pressable } from 'react-native';
import { Screen, Body, BackBar } from '../ui';
import { theme, useTheme, typography } from '../theme';
import { STATE_LIST, getCoverage, getUncoveredStates } from '../ballot';
import { kv } from '../api';
import { useNav } from '../nav';

const { space } = theme;

export function ChooseState({ onboarding, onDone }) {
  const { colors } = useTheme();
  const nav = useNav();
  const cov = getCoverage();
  const covered = Object.fromEntries(cov.states.map((s) => [s.code, s]));
  const uncoveredCount = getUncoveredStates().length;
  // Covered first for scanning; the few uncovered states sink to the bottom.
  const shown = [
    ...STATE_LIST.filter((s) => covered[s.code]),
    ...STATE_LIST.filter((s) => !covered[s.code]),
  ];

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
        {uncoveredCount > 0 ? ` The few states with no 2026 statewide race are at the bottom.` : ''}
      </Body>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {shown.map((s) => {
          const c = covered[s.code];
          return (
            <Pressable
              key={s.code}
              onPress={() => pick(s.code)}
              style={({ pressed }) => [{
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                paddingVertical: 13, paddingHorizontal: 16, borderWidth: 1, borderRadius: 14, marginBottom: 8,
                borderColor: colors.line,
                backgroundColor: c ? colors.surface : 'transparent',
              },
              !c && { opacity: 0.55 },
              // Gold marks the row being pressed, the interaction, not coverage.
              pressed && { borderColor: colors.accent, opacity: 0.85 }]}
            >
              <Text style={{ fontSize: 16, fontWeight: c ? '700' : '500', color: c ? colors.ink : colors.inkSoft }}>
                {s.name}
              </Text>
              {c ? (
                <Text style={{ color: colors.inkSoft, fontWeight: '600', fontSize: 12.5 }}>
                  {c.races} race{c.races === 1 ? '' : 's'}
                </Text>
              ) : (
                <Text style={{ color: colors.inkSoft, fontSize: 12.5, fontStyle: 'italic' }}>no 2026 race</Text>
              )}
            </Pressable>
          );
        })}
        <Body soft style={{ fontSize: 12.5, marginVertical: space(3), textAlign: 'center' }}>
          Every state gets the how-to-vote guide, including the ones with no
          statewide race this year.
        </Body>
      </ScrollView>
    </Screen>
  );
}
