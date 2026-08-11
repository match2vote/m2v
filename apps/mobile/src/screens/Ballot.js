// My Ballot: the user's saved picks, one per race, stored on device only.
// Exports as plain text via the native share sheet — a pocket sample ballot.
import React, { useEffect, useState } from 'react';
import { ScrollView, View, Share, Platform } from 'react-native';
import { Screen, H1, H2, Body, Card, Button, TierBadge } from '../ui';
import { theme } from '../theme';
import { getPicks, removePick } from '../api';
import { STATE_NAMES } from '../ballot';

const { space } = theme;

export function MyBallot({ onBack, onBrowse }) {
  const [picks, setPicks] = useState(null);
  useEffect(() => { getPicks().then(setPicks); }, []);

  const exportText = () => {
    const lines = [
      'MY NOVEMBER 3, 2026 BALLOT — via M2V (Match to Vote)',
      'Personal notes, not an official ballot. Check your state’s official sample ballot.',
      '',
      ...picks.map((p) => `${p.raceTitle}: ${p.name} (${p.party || 'no party listed'})`),
      '',
      'Matched on stated positions, never party. m2v — every position sourced.',
    ];
    const message = lines.join('\n');
    if (Platform.OS === 'web') {
      try {
        if (navigator.share) { navigator.share({ text: message }); return; }
        navigator.clipboard?.writeText(message);
      } catch {}
      return;
    }
    Share.share({ message });
  };

  if (picks === null) return <Screen><Body soft>Loading…</Body></Screen>;

  return (
    <Screen>
      <H1>My Ballot</H1>
      <Body soft style={{ marginBottom: space(3) }}>
        {picks.length === 0
          ? 'No picks yet. Browse your races and tap "Add to My Ballot" on a candidate.'
          : `${picks.length} pick${picks.length === 1 ? '' : 's'} · saved only on this device`}
      </Body>
      <ScrollView style={{ flex: 1 }}>
        {picks.map((p) => (
          <Card key={p.raceId}>
            <Body soft style={{ fontSize: 12 }}>{STATE_NAMES[p.state] || p.state} · {p.raceTitle}</Body>
            <H2>{p.name}</H2>
            <Body soft style={{ marginBottom: 6 }}>{p.party}{p.matchPct != null ? ` · ${p.matchPct}% match` : ''}</Body>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TierBadge tier={p.tier} />
              <Button
                kind="ghost"
                label="Remove"
                onPress={() => removePick(p.raceId).then(setPicks)}
              />
            </View>
          </Card>
        ))}
        {picks.length > 0 && <Button label="Share / export as text" onPress={exportText} />}
        <Button kind="ghost" label="Browse candidates" onPress={onBrowse} />
        <Button kind="ghost" label="Back" onPress={onBack} />
      </ScrollView>
    </Screen>
  );
}

export function Methodology({ onBack }) {
  const P = (props) => <Body style={{ marginBottom: space(3), fontSize: 14 }} {...props} />;
  return (
    <Screen>
      <H1>How matching works</H1>
      <ScrollView style={{ flex: 1 }}>
        <P>
          M2V scores candidates on 10 issues using a five-point scale from −2 to +2,
          based only on what the candidate has publicly said or done: bills signed or
          vetoed, roll-call votes, lawsuits filed, and statements on their own campaign
          site or in reputable coverage. Every scored position links to its source.
        </P>
        <P>
          A position is never inferred. If a candidate hasn't stated a position on an
          issue, it stays "Not stated" — it is never guessed from their party, their
          endorsements, or anything else. Party labels appear for identification only
          and play no role whatsoever in the matching math.
        </P>
        <P>
          Your match percentage compares your quiz answers with a candidate's scored
          positions, counting only issues where you both weighed in. Issues you mark
          "matters most to me" count double. If a candidate has no stated positions on
          your issues, no percentage is shown at all — an honest blank instead of a
          fake number.
        </P>
        <P>
          Candidate rosters come from official FEC filings, refreshed nightly, plus
          hand-maintained governor races. Candidates researched and sourced by our team
          are labeled "curated"; the rest are real filed candidates honestly labeled as
          not yet researched. Anything illustrative is labeled "Sample."
        </P>
        <P>
          M2V is nonpartisan. It favors no party and no candidate. If you find an
          error in a position or a source, email match2vote@gmail.com and we'll
          review it against the record — corrections go live server-side, usually
          within hours.
        </P>
        <Button kind="ghost" label="Back" onPress={onBack} />
      </ScrollView>
    </Screen>
  );
}
