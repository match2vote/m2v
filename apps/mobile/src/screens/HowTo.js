// How to vote, the prototype's chaptered guide, carried forward as a written
// guide (no fake video player). Same chapters, same green info callout.
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, Linking } from 'react-native';
import { Screen, H2, Body, Card, InfoCallout, BackBar, DarkCard } from '../ui';
import { theme, useTheme, typography } from '../theme';
import { useNav } from '../nav';
import { VoteScene } from './VoteScenes';
import { STATE_NAMES } from '../ballot';
import { getBallotLocation } from '../api';
import votingRules from '../data/voting-rules.json';
import { strings } from '../strings';

const S = strings.howTo;
const R = S.rules;

const { space } = theme;

// Per-state rules from data/voting-rules.json (bundled by the pipeline, {}
// until the data lands). Each chapter picks the fields that belong to it. A
// null field is shown as "we could not confirm this", never as a blank that
// could read like "no deadline". The official site is always the final word.
const RULE_ROWS = {
  0: [ // Before you go
    { key: 'registrationDeadline', label: R.registrationDeadline, noteKey: 'registrationDeadlineNote' },
    { key: 'sameDayRegistration', label: R.sameDayRegistration, bool: { true: R.yesAvailable, false: R.notAvailable } },
    { key: 'idRequirement', label: R.idRequirement },
  ],
  1: [ // Vote by mail
    { key: 'mailBallotWhoCanRequest', label: R.mailWho },
    { key: 'mailBallotRequestDeadline', label: R.mailRequestBy },
    { key: 'mailBallotReturnDeadline', label: R.mailReturnBy, postmarkKey: 'mailBallotReturnIsPostmark' },
  ],
  2: [ // Vote early in person
    { key: 'earlyVotingStart', label: R.earlyStart },
    { key: 'earlyVotingEnd', label: R.earlyEnd },
    { key: 'earlyVotingNote', label: R.note, optional: true },
  ],
};

const UNCONFIRMED = R.unconfirmed;
const MONTHS = R.months;
// "2026-08-15" -> "August 15, 2026"; anything else passes through untouched.
function spokenDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!m) return String(iso || '');
  return R.spokenDate({ month: MONTHS[Number(m[2]) - 1] || m[2], day: Number(m[3]), year: m[1] });
}

function ruleValue(row, rules) {
  const v = rules[row.key];
  if (v === null || v === undefined || v === '') return row.optional ? null : UNCONFIRMED;
  if (row.bool) return row.bool[String(!!v)];
  let text = String(v);
  if (row.postmarkKey && rules[row.postmarkKey] === true) text += R.postmarkCounts;
  return text;
}

function StateRules({ chapterIndex, stateCode, rules }) {
  const { colors } = useTheme();
  const rows = RULE_ROWS[chapterIndex];
  if (!rows || !stateCode) return null;
  const name = STATE_NAMES[stateCode] || stateCode;
  if (!rules) {
    return (
      <View style={{ marginTop: space(3), borderTopWidth: 1, borderTopColor: colors.line, paddingTop: space(3) }}>
        <Body soft style={{ fontSize: 13 }}>
          {R.notAdded({ name })}
        </Body>
      </View>
    );
  }
  return (
    <View style={{ marginTop: space(3), borderTopWidth: 1, borderTopColor: colors.line, paddingTop: space(3) }}>
      <Text style={{ fontSize: 11.5, fontWeight: '800', letterSpacing: 1, color: colors.accent, marginBottom: 6 }}>
        {name.toUpperCase()}
      </Text>
      {rows.map((row) => {
        const value = ruleValue(row, rules);
        if (value === null) return null;
        const unconfirmed = value === UNCONFIRMED;
        const note = row.noteKey ? rules[row.noteKey] : null;
        return (
          <View key={row.key} style={{ marginBottom: 6 }}>
            <Body style={{ fontSize: 13.5, lineHeight: 20 }}>
              <Text style={{ fontWeight: '700' }}>{R.rowLabel({ label: row.label })}</Text>
              <Text style={unconfirmed ? { fontStyle: 'italic', color: colors.inkSoft } : null}>{value}</Text>
            </Body>
            {note ? <Body soft style={{ fontSize: 12.5, lineHeight: 18 }}>{note}</Body> : null}
          </View>
        );
      })}
      {rules.officialSiteUrl ? (
        <Pressable
          onPress={() => Linking.openURL(rules.officialSiteUrl)}
          accessibilityRole="link"
          accessibilityLabel={R.officialSiteA11y({ label: rules.officialSiteLabel || R.officialSite })}
          style={{ alignSelf: 'flex-start', minHeight: 36, justifyContent: 'center' }}
        >
          <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13, textDecorationLine: 'underline', marginTop: 4 }}>
            {R.officialSiteLink({ label: rules.officialSiteLabel || R.officialSite })}
          </Text>
        </Pressable>
      ) : null}
      {stateCode ? (
        <Pressable
          onPress={() => Linking.openURL(`https://vote.gov/register/${stateCode.toLowerCase()}`)}
          accessibilityRole="link"
          accessibilityLabel={R.voteGovA11y}
          style={{ alignSelf: 'flex-start', minHeight: 36, justifyContent: 'center' }}
        >
          <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13, textDecorationLine: 'underline' }}>
            {R.voteGovLink}
          </Text>
        </Pressable>
      ) : null}
      <Body soft style={{ fontSize: 12, marginTop: 4 }}>
        {R.finalWord}
        {rules.verifiedAt ? R.checkedOn({ date: spokenDate(rules.verifiedAt) }) : ''}
      </Body>
    </View>
  );
}

const CHAPTERS = S.chapters;

export function HowTo() {
  const { colors } = useTheme();
  const nav = useNav();
  const [stateCode, setStateCode] = useState(null);
  useEffect(() => {
    let alive = true;
    getBallotLocation().then(({ state }) => { if (alive) setStateCode(state); });
    return () => { alive = false; };
  }, []);
  const rules = stateCode ? votingRules[stateCode] || null : null;
  return (
    <Screen>
      <BackBar label={S.home} onPress={() => nav.go({ name: 'home' }, { replace: true })} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text accessibilityRole="header" style={[typography.display, { fontSize: 28, lineHeight: 34, color: colors.ink }]}>{S.title}</Text>
        <Body soft style={{ fontSize: 14, marginTop: 4, marginBottom: space(3) }}>
          {S.intro}
        </Body>
        <Pressable onPress={() => nav.go({ name: 'roles' })} accessibilityRole="button" accessibilityLabel={S.rolesA11y} style={({ pressed }) => [{ marginBottom: space(3), minHeight: 44, justifyContent: 'center' }, pressed && { opacity: 0.7 }]}>
          <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 14 }}>
            {S.rolesLink}
          </Text>
        </Pressable>
        <InfoCallout>
          {S.callout}
        </InfoCallout>
        {CHAPTERS.map((c, i) => (
          <Card key={c.title} style={{ paddingVertical: space(4) }}>
            <VoteScene index={i} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space(2) }}>
              <View style={{ minWidth: 26, minHeight: 26, borderRadius: 999, paddingHorizontal: 6, backgroundColor: colors.accentSoft, alignItems: 'center', justifyContent: 'center', marginRight: space(2.5) }}>
                <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 13 }}>{i + 1}</Text>
              </View>
              <Text accessibilityRole="header" style={[typography.display, { fontSize: 18, color: colors.ink, flex: 1 }]}>{c.title}</Text>
            </View>
            <Body soft style={{ fontSize: 14, lineHeight: 21 }}>{c.body}</Body>
            <StateRules chapterIndex={i} stateCode={stateCode} rules={rules} />
          </Card>
        ))}
        <DarkCard>
          <Text style={[typography.display, { fontSize: 18, color: '#F6EFE4' }]}>{S.planTitle}</Text>
          <Text style={{ color: 'rgba(246,239,228,0.75)', fontSize: 13.5, lineHeight: 20, marginTop: 6, marginBottom: space(3) }}>
            {S.planBody}
          </Text>
          <Pressable onPress={() => nav.go({ name: 'ballot' })} accessibilityRole="button" accessibilityLabel={S.reviewA11y} style={{ alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' }}>
            <Text style={{ color: colors.accentBright, fontWeight: '800', fontSize: 15 }}>
              {S.review}
            </Text>
          </Pressable>
        </DarkCard>
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}
