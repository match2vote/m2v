// "Where do you vote?", the ONLY place your ballot state gets set.
// Lists every state. Coverage is the rule now, not the exception, so covered
// states render in NORMAL styling and the few uncovered ones are visibly
// de-emphasized with the reason ("no 2026 race"). Gold is the interaction
// accent here (the row you're pressing), never a coverage highlight: when 47
// of 51 tiles glow, nothing is highlighted.
//
// After the state, a district step (ChooseDistrict below). Two doors of equal
// weight: the state's district numbers, or "I'm not sure which district I'm
// in". Single-district states resolve to at-large and skip the question.
// Changing state always clears the district; it never carries over.
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { Screen, Body, BackBar } from '../ui';
import { theme, useTheme, typography } from '../theme';
import {
  STATE_LIST, STATE_NAMES, getCoverage, getUncoveredStates,
  districtOptions, isSingleDistrict, districtFinder, HOUSE_SEATS,
} from '../ballot';
import { setBallotState, setBallotDistrict, getBallotLocation } from '../api';
import { useNav } from '../nav';
import { strings } from '../strings';

const S = strings.chooseState;
const D = strings.chooseDistrict;

const { space } = theme;

export function ChooseState({ onboarding, onDone }) {
  const { colors } = useTheme();
  const nav = useNav();
  const [picked, setPicked] = useState(null); // state code awaiting a district
  const cov = getCoverage();
  const covered = Object.fromEntries(cov.states.map((s) => [s.code, s]));
  const uncoveredCount = getUncoveredStates().length;
  // Covered first for scanning; the few uncovered states sink to the bottom.
  const shown = [
    ...STATE_LIST.filter((s) => covered[s.code]),
    ...STATE_LIST.filter((s) => !covered[s.code]),
  ];

  const finish = () => {
    if (onDone) onDone();
    else nav.go({ name: 'home' }, { replace: true });
  };

  const pick = async (code) => {
    await setBallotState(code);
    if (isSingleDistrict(code)) {
      // One seat: the district is a fact, not a question.
      await setBallotDistrict('at-large');
      finish();
      return;
    }
    setPicked(code);
  };

  if (picked) {
    return (
      <ChooseDistrict
        stateCode={picked}
        onBack={() => setPicked(null)}
        onDone={finish}
      />
    );
  }

  return (
    <Screen>
      {!onboarding && <BackBar label={S.home} onPress={() => nav.go({ name: 'home' }, { replace: true })} />}
      <Text style={[typography.display, { fontSize: 28, lineHeight: 34, color: colors.ink }]}>
        {S.title}
      </Text>
      <Body soft style={{ fontSize: 14, marginTop: 4, marginBottom: space(3) }}>
        {S.intro}
        {uncoveredCount > 0 ? S.introUncovered : ''}
      </Body>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {shown.map((s) => {
          const c = covered[s.code];
          return (
            <Pressable
              key={s.code}
              onPress={() => pick(s.code)}
              accessibilityRole="button"
              accessibilityLabel={c ? S.rowA11y({ name: s.name, races: c.races }) : S.rowA11yUncovered({ name: s.name })}
              style={({ pressed }) => [{
                flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                paddingVertical: 13, paddingHorizontal: 16, borderWidth: 1, borderRadius: 14, marginBottom: 8, minHeight: 48,
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
                  {S.rowRaces({ races: c.races })}
                </Text>
              ) : (
                <Text style={{ color: colors.inkSoft, fontSize: 12.5, fontStyle: 'italic' }}>{S.rowNoRace}</Text>
              )}
            </Pressable>
          );
        })}
        <Body soft style={{ fontSize: 12.5, marginVertical: space(3), textAlign: 'center' }}>
          {S.footer}
        </Body>
      </ScrollView>
    </Screen>
  );
}

// The district step. Reached from ChooseState right after a state is picked,
// and on its own at /district from any "change district" control.
export function ChooseDistrict({ stateCode, onBack, onDone }) {
  const { colors } = useTheme();
  const nav = useNav();
  const [code, setCode] = useState(stateCode || null);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (stateCode) return;
    getBallotLocation().then(({ state, district }) => { setCode(state); setCurrent(district); });
  }, [stateCode]);

  const finish = () => {
    if (onDone) onDone();
    else nav.go({ name: 'home' }, { replace: true });
  };
  const back = () => {
    if (onBack) onBack();
    else nav.go({ name: 'home' }, { replace: true });
  };

  if (!code) {
    // Standalone route with no state chosen yet: send them to the state step.
    return (
      <Screen>
        <BackBar label={D.home} onPress={back} />
        <Body soft>{D.pickStateFirst}</Body>
        <Pressable onPress={() => nav.go({ name: 'state' }, { replace: true })} accessibilityRole="button" accessibilityLabel={D.chooseMyStateA11y} style={{ marginTop: space(3), minHeight: 44, justifyContent: 'center' }}>
          <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 16 }}>{D.chooseMyState}</Text>
        </Pressable>
      </Screen>
    );
  }

  const name = STATE_NAMES[code] || code;
  const options = districtOptions(code);
  const seats = HOUSE_SEATS[code] || 0;
  const finder = districtFinder(code);

  const choose = async (d) => {
    await setBallotDistrict(d);
    finish();
  };

  const doorStyle = {
    backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.line,
    padding: space(4), marginBottom: space(3),
  };

  return (
    <Screen>
      <BackBar label={onBack ? D.states : D.home} onPress={back} />
      <Text style={[typography.display, { fontSize: 28, lineHeight: 34, color: colors.ink }]}>
        {D.title}
      </Text>
      <Body soft style={{ fontSize: 14, marginTop: 4, marginBottom: space(3) }}>
        {D.intro({ name, seats })}
      </Body>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Two doors, side by side, equal weight, both visible above the
            fold even in a 52-district state. Door 1 labels the grid below;
            door 2 is the way through for anyone who does not know. */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: space(3) }}>
          <View style={[doorStyle, { flex: 1, marginBottom: 0 }]}>
            <Text style={[typography.display, { fontSize: 17, lineHeight: 22, color: colors.ink }]}>
              {D.knowTitle}
            </Text>
            <Body soft style={{ fontSize: 13, marginTop: 6 }}>
              {D.knowBody}
            </Body>
          </View>
          <Pressable
            onPress={() => choose('')}
            accessibilityRole="button"
            accessibilityLabel={D.unsureA11y({ name })}
            style={({ pressed }) => [doorStyle, { flex: 1, marginBottom: 0 }, pressed && { borderColor: colors.accent, opacity: 0.85 }]}
          >
            <Text style={[typography.display, { fontSize: 17, lineHeight: 22, color: colors.ink }]}>
              {D.unsureTitle}
            </Text>
            <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 13, marginTop: 6 }}>
              {D.unsureCta}
            </Text>
          </Pressable>
        </View>
        <Body soft style={{ fontSize: 13, marginBottom: space(3) }}>
          {D.unsureNote({ name })}
        </Body>

        {/* The district numbers */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: space(3) }}>
          {options.map((d) => {
            const isCurrent = current === d;
            return (
              <Pressable
                key={d}
                onPress={() => choose(d)}
                accessibilityRole="button"
                accessibilityLabel={D.tileA11y({ label: d === 'at-large' ? D.atLarge : D.districtN({ d }), current: isCurrent })}
                accessibilityState={{ selected: isCurrent }}
                style={({ pressed }) => [{
                  minWidth: 56, minHeight: 48, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5,
                  alignItems: 'center', justifyContent: 'center',
                  borderColor: isCurrent ? colors.accent : colors.line,
                  backgroundColor: isCurrent ? colors.accentSoft : colors.surface,
                }, pressed && { borderColor: colors.accent, opacity: 0.85 }]}
              >
                <Text style={{ fontSize: 17, fontWeight: '800', color: colors.ink }}>
                  {d === 'at-large' ? D.atLarge : d}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* How to find it */}
        <View style={{ paddingHorizontal: space(1), marginBottom: space(3) }}>
          <Body soft style={{ fontSize: 13.5 }}>
            {D.lookupLead}
            <Text accessibilityRole="link" style={{ color: colors.accent, fontWeight: '700', textDecorationLine: 'underline' }} onPress={() => Linking.openURL(finder.url)}>
              {finder.label}
            </Text>
            {D.lookupTail}
          </Body>
          {finder.redrawn && (
            <Body soft style={{ fontSize: 13.5, marginTop: space(2) }}>
              {D.redrawn({ name })}
            </Body>
          )}
        </View>
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}
