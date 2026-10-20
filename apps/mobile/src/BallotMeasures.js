// Statewide ballot measures on the sample ballot. Same rule as the races: the
// ballot mirrors the REAL ballot, so every certified November measure for the
// state is listed with Yes/No ovals the user can mark. M2V never scores,
// summarizes in its own voice, or recommends on a measure. The question text
// is the state's own ballot language, copied verbatim from the official
// source, and every measure carries its source links. Data: data/ballot-
// measures.json (bundled to src/data), keyed by state code; a state with no
// entry renders nothing, so nothing is ever faked.
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { Bubble } from './ui';
import { theme } from './theme';
import { getMeasurePicks, setMeasurePick } from './api';
import measuresByState from './data/ballot-measures.json';
import { strings } from './strings';

const S = strings.ballot.measures;
const { space } = theme;
const inkB = '#111111';
const accent = '#63305A';

export function measuresFor(stateCode) {
  const list = stateCode ? measuresByState[stateCode] : null;
  return Array.isArray(list) ? list.filter((m) => m && m.id) : [];
}

export function BallotMeasures({ stateCode }) {
  const measures = measuresFor(stateCode);
  const [picks, setPicks] = useState({});
  const [open, setOpen] = useState({});

  const load = useCallback(async () => setPicks(await getMeasurePicks()), []);
  useEffect(() => { load(); }, [load]);

  if (!measures.length) return null;

  const marked = measures.filter((m) => picks[m.id]).length;

  const toggle = async (m, choice) => {
    const next = picks[m.id] === choice ? null : choice;
    setPicks(await setMeasurePick(m.id, next));
  };

  return (
    <View style={{ marginTop: space(2) }}>
      <View style={{ borderTopWidth: 3, borderColor: inkB, paddingTop: space(3), marginBottom: space(3) }}>
        <Text accessibilityRole="header" style={{ fontWeight: '800', fontSize: 15, color: inkB, letterSpacing: 0.6 }}>
          {S.heading}
        </Text>
        <Text style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{S.count({ marked, total: measures.length })}</Text>
        <Text style={{ fontSize: 12, color: '#444', marginTop: 6, lineHeight: 17 }}>{S.intro}</Text>
      </View>

      {measures.map((m) => {
        const label = m.ballotLabel || m.title;
        const isOpen = !!open[m.id];
        const choice = picks[m.id];
        return (
          <View key={m.id} style={{ marginBottom: space(5) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Text style={{ fontWeight: '800', fontSize: 14, color: inkB, letterSpacing: 0.5 }}>
                {String(label).toUpperCase()}
              </Text>
              {m.type ? (
                <Text style={{ fontSize: 10.5, color: '#555', fontWeight: '700', letterSpacing: 0.3 }}>
                  {String(m.type).toUpperCase()}
                </Text>
              ) : null}
            </View>
            <View style={{ height: 1.5, backgroundColor: inkB, marginTop: 4, marginBottom: space(2) }} />
            {m.ballotLabel && m.title ? (
              <Text style={{ fontFamily: 'Georgia', fontSize: 16, color: inkB, fontWeight: '500', lineHeight: 22 }}>{m.title}</Text>
            ) : null}

            <Pressable
              onPress={() => setOpen((o) => ({ ...o, [m.id]: !isOpen }))}
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              accessibilityLabel={isOpen ? S.hideA11y({ label }) : S.readA11y({ label })}
              style={{ minHeight: 40, justifyContent: 'center', marginTop: 2 }}
            >
              <Text style={{ color: accent, fontWeight: '700', fontSize: 13 }}>
                {isOpen ? S.hideQuestion : S.readQuestion}{isOpen ? '' : ' ›'}
              </Text>
            </Pressable>

            {isOpen && (
              <View style={{ borderWidth: 1, borderColor: '#999', borderRadius: 4, padding: space(3), marginBottom: space(3), backgroundColor: '#FFFFFF' }}>
                {m.question ? (
                  <Text style={{ fontFamily: 'Georgia', fontSize: 14, color: inkB, lineHeight: 21 }}>{m.question}</Text>
                ) : (
                  <Text style={{ fontSize: 13, color: '#555', fontStyle: 'italic' }}>{S.noQuestion}</Text>
                )}
                {m.question && m.questionTruncated ? (
                  <Text style={{ fontSize: 12, color: '#555', fontStyle: 'italic', marginTop: 6 }}>{S.questionTruncated}</Text>
                ) : null}
                {m.yes ? (
                  <Text style={{ fontSize: 13, color: inkB, marginTop: space(3), lineHeight: 19 }}>
                    <Text style={{ fontWeight: '800' }}>{S.choiceMeans({ choice: (m.choices && m.choices[0]) || S.yesLabel })} </Text>{m.yes}
                  </Text>
                ) : null}
                {m.no ? (
                  <Text style={{ fontSize: 13, color: inkB, marginTop: 6, lineHeight: 19 }}>
                    <Text style={{ fontWeight: '800' }}>{S.choiceMeans({ choice: (m.choices && m.choices[1]) || S.noLabel })} </Text>{m.no}
                  </Text>
                ) : null}
                {Array.isArray(m.sources) && m.sources.length ? (
                  <View style={{ marginTop: space(3) }}>
                    <Text style={{ fontSize: 11.5, color: '#555', fontWeight: '700', letterSpacing: 0.3 }}>{S.sourcesLabel.toUpperCase()}</Text>
                    {m.sources.map((src) => (
                      <Pressable
                        key={src.url}
                        onPress={() => Linking.openURL(src.url).catch(() => {})}
                        accessibilityRole="link"
                        accessibilityLabel={S.sourceA11y({ label: src.label })}
                        style={{ minHeight: 36, justifyContent: 'center' }}
                      >
                        <Text style={{ color: accent, fontWeight: '700', fontSize: 13, textDecorationLine: 'underline' }}>{src.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </View>
            )}

            {/* choices: undefined = Yes/No; ['For','Against'] = the state's own
                words; null = no yes/no form (a multiple-choice advisory
                question), so no ovals are drawn and the reader marks it on
                the real ballot. */}
            {m.choices === null ? (
              <Text style={{ fontSize: 12, color: '#555', fontStyle: 'italic', marginTop: 4 }}>{S.noOvals}</Text>
            ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {[['yes', (m.choices && m.choices[0]) || S.yesLabel], ['no', (m.choices && m.choices[1]) || S.noLabel]].map(([val, text]) => {
                const filled = choice === val;
                return (
                  <Pressable
                    key={val}
                    onPress={() => toggle(m, val)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: filled }}
                    accessibilityLabel={S.choiceA11y({ choice: text, label, marked: filled })}
                    style={({ pressed }) => [
                      { flexDirection: 'row', alignItems: 'center', paddingVertical: space(2.5), minHeight: 44, marginRight: space(6) },
                      pressed && { opacity: 0.6 },
                    ]}
                  >
                    <Bubble filled={filled} />
                    <Text style={{ fontFamily: 'Georgia', fontSize: 17, color: inkB, fontWeight: filled ? '800' : '500', marginLeft: space(3) }}>
                      {String(text).toUpperCase()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
