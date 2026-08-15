// Ranked-choice notice for the offices that are actually decided that way on
// Nov 3, 2026. Alaska and Maine only. Every sentence here points at one of
// the two official pages linked below, fetched Aug 15, 2026:
//   Alaska Division of Elections, https://www.elections.alaska.gov/RCV.php
//     (RCV covers U.S. Senator, U.S. Representative, Governor/Lt. Governor and
//     the state legislature; the Aug 18 primary is a top-four primary and
//     "Ranked Choice voting is for November 3 General Election"; you do not
//     have to rank all the candidates; if your first choice is eliminated
//     your vote goes to your next choice, otherwise it stays with them)
//   Maine Secretary of State, RCV FAQ,
//     https://www.maine.gov/sos/elections-voting/ranked-choice-voting-frequently-asked-questions
//     (RCV in general elections ONLY for federal offices; the Maine
//     Constitution requires governor and legislature to be decided by a
//     plurality; marking only a first choice is valid; counted in rounds,
//     your vote counts for your candidate throughout all the rounds)
// Non-partisan: says what the voter does, never whether the method is good.
import React from 'react';
import { View, Text, Linking, Pressable } from 'react-native';
import { theme, useTheme } from './theme';
import { strings } from './strings';

const S = strings.rankedChoice;

const { space } = theme;

const AK = {
  url: 'https://www.elections.alaska.gov/RCV.php',
  siteLabel: S.ak.siteLabel,
  how: S.ak.how,
  safe: S.ak.safe,
};
const ME = {
  url: 'https://www.maine.gov/sos/elections-voting/ranked-choice-voting-frequently-asked-questions',
  siteLabel: S.me.siteLabel,
  how: S.me.how,
  safe: S.me.safe,
};

// Which races get the notice. Maine's governor is deliberately absent: the
// Maine Constitution requires that general election to be decided by a
// plurality, so it is not ranked.
export function rankedChoiceFor(raceId) {
  if (!raceId) return null;
  if (raceId === 'AK-senate' || raceId === 'AK-governor' || raceId.startsWith('AK-house-')) return AK;
  if (raceId === 'ME-senate' || raceId.startsWith('ME-house-')) return ME;
  return null;
}

// variant 'race' on race screens; 'ballot' adds the line about how M2V's
// single-pick sample ballot maps onto a ranked real ballot. On the ballot
// paper the palette is fixed ink-on-paper, so it takes an onPaper flag.
export function RankedChoiceNotice({ raceId, variant = 'race', onPaper = false }) {
  const { colors } = useTheme();
  const info = rankedChoiceFor(raceId);
  if (!info) return null;
  const ink = onPaper ? '#3a3128' : colors.ink;
  const soft = onPaper ? '#5a5046' : colors.inkSoft;
  const accent = onPaper ? '#8a6a14' : colors.accent;
  return (
    <View
      style={{
        borderLeftWidth: 3, borderLeftColor: onPaper ? '#8a6a14' : colors.gold,
        paddingLeft: space(3), paddingVertical: space(1), marginBottom: space(3),
      }}
    >
      <Text style={{ color: ink, fontWeight: '800', fontSize: 13, marginBottom: 3 }}>
        {S.title}
      </Text>
      <Text style={{ color: soft, fontSize: 12.5, lineHeight: 18 }}>{info.how}</Text>
      <Text style={{ color: soft, fontSize: 12.5, lineHeight: 18, marginTop: 4 }}>{info.safe}</Text>
      {variant === 'ballot' && (
        <Text style={{ color: soft, fontSize: 12.5, lineHeight: 18, marginTop: 4 }}>
          {S.ballotNote}
        </Text>
      )}
      <Pressable
        onPress={() => Linking.openURL(info.url)}
        accessibilityRole="link"
        accessibilityLabel={S.linkA11y({ siteLabel: info.siteLabel })}
        style={{ alignSelf: 'flex-start', minHeight: 36, justifyContent: 'center' }}
      >
        <Text style={{ color: accent, fontSize: 12.5, fontWeight: '700', textDecorationLine: 'underline', marginTop: 5 }}>
          {S.link({ siteLabel: info.siteLabel })}
        </Text>
      </Pressable>
    </View>
  );
}
