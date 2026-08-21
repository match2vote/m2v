// Offscreen ballot card rendered only for the native image export. Mirrors
// the web canvas export in share.js: same mandatory SAMPLE BALLOT banner at
// the top (part of the captured image, cannot be cropped out of the layout),
// no party red/blue, no match percentages, filled ovals only.
// Rendered off screen by OfficialBallot and captured with view-shot.
import React from 'react';
import { View, Text } from 'react-native';
import { strings } from './strings';

const SS = strings.share;
const paper = '#FFFDF8';
const ink = '#111111';
const soft = '#645E55';
const gold = '#C78A19';
const URL_LINE = 'app.match2vote.org';

const W = 420;

function ExportOval({ filled }) {
  return (
    <View
      style={{
        width: 30, height: 18, borderRadius: 999, borderWidth: 2, borderColor: ink,
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {filled ? <View style={{ width: 20, height: 9, borderRadius: 999, backgroundColor: ink }} /> : null}
    </View>
  );
}

export const BallotShareCard = React.forwardRef(function BallotShareCard({ stateName, races, picks }, ref) {
  const pickBy = Object.fromEntries(picks.map((p) => [p.raceId, p.candidateId]));
  return (
    <View ref={ref} collapsable={false} style={{ width: W, backgroundColor: paper }}>
      {/* MANDATORY sample banner, part of the image itself */}
      <View style={{ backgroundColor: gold, paddingVertical: 10, paddingHorizontal: 12 }}>
        <Text style={{ color: ink, fontWeight: '800', fontSize: 15, textAlign: 'center' }}>
          {SS.ballotImgBanner}
        </Text>
        <Text style={{ color: ink, fontWeight: '600', fontSize: 11, textAlign: 'center', marginTop: 2 }}>
          {SS.ballotImgSub}
        </Text>
      </View>
      <View style={{ paddingHorizontal: 22, paddingBottom: 24 }}>
        {/* Header block */}
        <View style={{ height: 3, backgroundColor: ink, marginTop: 16 }} />
        <Text style={{ fontFamily: 'Georgia', fontWeight: '800', fontSize: 24, color: ink, textAlign: 'center', marginTop: 14 }}>
          {stateName.toUpperCase()}
        </Text>
        <Text style={{ fontWeight: '700', fontSize: 12, color: ink, textAlign: 'center', marginTop: 4, letterSpacing: 0.4 }}>
          {SS.ballotImgElection}
        </Text>
        <View style={{ height: 1.5, backgroundColor: ink, marginTop: 14 }} />
        {/* Races */}
        {races.map((race) => (
          <View key={race.id} style={{ marginTop: 18 }}>
            <Text style={{ fontWeight: '800', fontSize: 14, color: ink, letterSpacing: 0.5 }}>
              {race.title.toUpperCase()}
            </Text>
            <View style={{ height: 1, backgroundColor: ink, marginTop: 3, marginBottom: 6 }} />
            {race.candidates.map((cd) => {
              const filled = pickBy[race.id] === cd.id;
              return (
                <View key={cd.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5 }}>
                  <ExportOval filled={filled} />
                  <Text
                    numberOfLines={1}
                    style={{ fontFamily: 'Georgia', fontSize: 15, color: ink, fontWeight: filled ? '800' : '500', marginLeft: 10, flex: 1 }}
                  >
                    {cd.name}
                  </Text>
                  <Text numberOfLines={1} style={{ fontSize: 11, color: soft, marginLeft: 8, maxWidth: 110, textAlign: 'right' }}>
                    {cd.party || ''}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
        {/* Footer */}
        <Text style={{ fontSize: 11, color: soft, fontWeight: '600', marginTop: 20 }}>
          {SS.ballotImgFooter({ url: URL_LINE })}
        </Text>
      </View>
    </View>
  );
});
