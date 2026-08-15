// "What you're voting for": one card per office on the ballot, in the same
// chaptered pattern as How to Vote. Each chapter: an animated scene, a title,
// a few plain sentences about the job, a bold "What this means to you" line,
// and a "Where this comes from" link to the official page the text was
// checked against. Strictly non-partisan: describes the office, never
// whether a power is good. Nothing here was written from memory.
import React from 'react';
import { ScrollView, View, Text, Linking, Pressable } from 'react-native';
import { Screen, Body, Card, InfoCallout, BackBar, DarkCard } from '../ui';
import { theme, useTheme, typography } from '../theme';
import { useNav } from '../nav';
import { RoleScene } from './RoleScenes';
import { strings } from '../strings';

const S = strings.roles;

const { space } = theme;

// Sources are the pages actually fetched on Aug 15, 2026:
//   NGA, Governors' Powers & Authority
//   senate.gov, The Senate and the Constitution; senate.gov, Powers & Procedures
//   house.gov, The House Explained; constitution.congress.gov Article I
//   census.gov, 2020 apportionment (761,169 people per district on average)
//   delbene.house.gov casework page (an example of a member's casework list)
// Text lives in strings.js (strings.roles.chapters, same order); this array
// carries the keys and the source URLs, which are data, not copy.
const SOURCE_URLS = {
  governor: [
    'https://www.nga.org/governors/powers-and-authority/',
    'https://www.nga.org/bestpractices/homeland-security/',
  ],
  senator: [
    'https://www.senate.gov/about/origins-foundations/senate-and-constitution/constitution.htm',
    'https://www.senate.gov/about/powers-procedures.htm',
    'https://constitution.congress.gov/browse/article-1/section-7/',
  ],
  representative: [
    'https://www.house.gov/the-house-explained',
    'https://constitution.congress.gov/browse/article-1/section-2/',
    'https://constitution.congress.gov/browse/article-1/section-7/',
    'https://www.census.gov/library/stories/2021/04/2020-census-data-release.html',
    'https://delbene.house.gov/constituent-services/casework/',
  ],
  delegate: [
    'https://www.house.gov/the-house-explained',
    'https://www.house.gov/representatives',
  ],
};
export const CHAPTERS = S.chapters.map((c, i) => ({
  ...c,
  key: Object.keys(SOURCE_URLS)[i],
  sources: c.sources.map((src, j) => ({ ...src, url: SOURCE_URLS[Object.keys(SOURCE_URLS)[i]][j] })),
}));

export function WhatYouVoteFor() {
  const { colors } = useTheme();
  const nav = useNav();
  return (
    <Screen>
      <BackBar label={S.home} onPress={() => nav.go({ name: 'home' }, { replace: true })} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text accessibilityRole="header" style={[typography.display, { fontSize: 28, lineHeight: 34, color: colors.ink }]}>{S.title}</Text>
        <Body soft style={{ fontSize: 14, marginTop: 4, marginBottom: space(3) }}>
          {S.intro}
        </Body>
        <InfoCallout>
          {S.callout}
        </InfoCallout>
        {CHAPTERS.map((c, i) => (
          <Card key={c.key} style={{ paddingVertical: space(4) }}>
            <RoleScene index={i} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space(2) }}>
              <View style={{ minWidth: 26, minHeight: 26, borderRadius: 999, paddingHorizontal: 6, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginRight: space(2.5) }}>
                <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 13 }}>{i + 1}</Text>
              </View>
              <Text accessibilityRole="header" style={[typography.display, { fontSize: 18, color: colors.ink, flex: 1 }]}>{c.title}</Text>
            </View>
            {c.lines.map((line) => (
              <Body key={line} soft style={{ fontSize: 14, lineHeight: 21, marginBottom: 6 }}>{line}</Body>
            ))}
            <Body style={{ fontSize: 14, lineHeight: 21, fontWeight: '800', marginTop: space(1) }}>
              {S.meansLead}<Text style={{ fontWeight: '500' }}>{c.means}</Text>
            </Body>
            <View style={{ marginTop: space(2) }}>
              <Body soft style={{ fontSize: 12, fontWeight: '700' }}>{S.whereFrom}</Body>
              {c.sources.map((s) => (
                <Pressable
                  key={s.url}
                  onPress={() => Linking.openURL(s.url)}
                  accessibilityRole="link"
                  accessibilityLabel={S.sourceA11y({ label: s.label })}
                  style={{ alignSelf: 'flex-start', minHeight: 32, justifyContent: 'center' }}
                >
                  <Text style={{ color: colors.accent, fontSize: 12, textDecorationLine: 'underline' }}>
                    {S.sourceLink({ label: s.label })}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Card>
        ))}
        <DarkCard>
          <Text style={[typography.display, { fontSize: 18, color: '#F6EFE4' }]}>{S.nextTitle}</Text>
          <Text style={{ color: 'rgba(246,239,228,0.75)', fontSize: 13.5, lineHeight: 20, marginTop: 6, marginBottom: space(3) }}>
            {S.nextBody}
          </Text>
          <Pressable onPress={() => nav.go({ name: 'races' })} accessibilityRole="button" accessibilityLabel={S.browseA11y} style={{ alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ color: colors.accentBright, fontWeight: '800', fontSize: 15 }}>
              {S.browse}
            </Text>
          </Pressable>
        </DarkCard>
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}
