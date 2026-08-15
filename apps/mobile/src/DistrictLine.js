// One-line district status shown above race lists on Ballot, Browse and
// Matches. District set: "District 12 · change". Not set: we don't know your
// district, we don't guess, every House race is below, here is how to find
// it. Unobtrusive either way; the app is fully usable with no district.
import React from 'react';
import { View, Text, Linking } from 'react-native';
import { theme, useTheme } from './theme';
import { STATE_NAMES, districtLabel, districtFinder, isSingleDistrict } from './ballot';
import { useNav } from './nav';
import { strings } from './strings';

const S = strings.districtLine;

const { space } = theme;

export function DistrictLine({ stateCode, district, style, hasHouseRaces = true }) {
  const { colors } = useTheme();
  const nav = useNav();
  if (!stateCode || isSingleDistrict(stateCode)) return null;
  if (!district && !hasHouseRaces) return null; // nothing to filter, nothing to explain
  const finder = districtFinder(stateCode);
  const name = STATE_NAMES[stateCode] || stateCode;
  const link = { color: colors.accent, fontWeight: '700', textDecorationLine: 'underline' };

  if (district) {
    return (
      <View style={[{ marginBottom: space(3) }, style]}>
        <Text style={{ color: colors.inkSoft, fontSize: 13 }}>
          {districtLabel(district)} ·{' '}
          <Text accessibilityRole="link" accessibilityLabel={S.changeA11y} style={link} onPress={() => nav.go({ name: 'district' })}>{S.change}</Text>
        </Text>
      </View>
    );
  }

  return (
    <View style={[{ marginBottom: space(3), borderLeftWidth: 3, borderLeftColor: colors.line, paddingLeft: space(3) }, style]}>
      <Text style={{ color: colors.inkSoft, fontSize: 13, lineHeight: 19 }}>
        {S.setDistrictLead({ name })}
        <Text accessibilityRole="link" style={link} onPress={() => nav.go({ name: 'district' })}>{S.setMyDistrict}</Text>
        {S.orLookItUpOn}
        <Text accessibilityRole="link" style={link} onPress={() => Linking.openURL(finder.url)}>{finder.label}</Text>{S.period}
        {finder.redrawn ? S.redrawn({ name }) : ''}
      </Text>
    </View>
  );
}
