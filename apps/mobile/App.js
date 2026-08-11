// M2V — root component. Simple state router (same pattern as the prototype's
// app.jsx). Screens: Welcome → Quiz → Results → (profile detail later).
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ISSUES, rankCandidates } from '@m2v/core';
import { getRaces, getCoverage, STATE_NAMES } from './src/ballot';
import { getStateData } from './src/api';
import { Screen, H1, H2, Body, Card, Button, ProgressBar, TierBadge, MatchRing } from './src/ui';
import { theme } from './src/theme';
import { StatePicker, Races, Race, Profile } from './src/screens/Browse';
import { MyBallot, Methodology } from './src/screens/Ballot';
import { savePick } from './src/api';

const { colors, space } = theme;

// Quiz answer choices map to the -2..+2 scale; "Skip" stays null (Not stated).
const CHOICES = [
  { value: -2, label: 'Strongly agree with ①' },
  { value: -1, label: 'Lean toward ①' },
  { value: 0, label: 'Somewhere in the middle' },
  { value: 1, label: 'Lean toward ②' },
  { value: 2, label: 'Strongly agree with ②' },
];

export default function App() {
  // welcome | quiz | results | states | races | race | profile
  const [route, setRoute] = useState('welcome');
  const [answers, setAnswers] = useState({});
  const [matters, setMatters] = useState({});
  const [qIndex, setQIndex] = useState(0);
  const [stateCode, setStateCode] = useState(null);
  const [race, setRace] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [cameFrom, setCameFrom] = useState('races');

  const reset = () => { setAnswers({}); setMatters({}); setQIndex(0); setRoute('welcome'); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      {route === 'welcome' && (
        <Welcome
          onStart={() => setRoute('quiz')}
          onBrowse={() => setRoute('states')}
          onBallot={() => setRoute('ballot')}
          onMethodology={() => setRoute('methodology')}
        />
      )}
      {route === 'quiz' && (
        <Quiz
          key={qIndex}
          qIndex={qIndex}
          matters={matters}
          onAnswer={(key, value, mattersFlag) => {
            setAnswers((a) => ({ ...a, [key]: value }));
            setMatters((m) => ({ ...m, [key]: mattersFlag }));
            if (qIndex + 1 < ISSUES.length) setQIndex(qIndex + 1);
            else setRoute('results');
          }}
          onBack={() => (qIndex > 0 ? setQIndex(qIndex - 1) : setRoute('welcome'))}
        />
      )}
      {route === 'results' && !stateCode && (
        <StatePicker
          onPick={(code) => setStateCode(code)}
          onBack={() => setRoute('welcome')}
        />
      )}
      {route === 'results' && stateCode && (
        <Results
          stateCode={stateCode}
          answers={answers}
          matters={matters}
          onRestart={reset}
          onChangeState={() => setStateCode(null)}
          onOpenRace={(r) => { setRace(r); setRoute('race'); setCameFrom('results'); }}
        />
      )}
      {route === 'states' && (
        <StatePicker
          onPick={(code) => { setStateCode(code); setRoute('races'); }}
          onBack={() => setRoute('welcome')}
        />
      )}
      {route === 'races' && (
        <Races
          stateCode={stateCode}
          onOpenRace={(r) => { setRace(r); setRoute('race'); setCameFrom('races'); }}
          onBack={() => setRoute('states')}
        />
      )}
      {route === 'race' && (
        <Race
          race={race}
          answers={answers}
          matters={matters}
          onOpenProfile={(c) => { setCandidate(c); setRoute('profile'); }}
          onBack={() => setRoute(cameFrom)}
        />
      )}
      {route === 'profile' && (
        <Profile
          candidate={candidate}
          race={race}
          answers={answers}
          matters={matters}
          onAddToBallot={(pick) => savePick(pick)}
          onBack={() => setRoute('race')}
        />
      )}
      {route === 'ballot' && (
        <MyBallot onBack={() => setRoute('welcome')} onBrowse={() => setRoute('states')} />
      )}
      {route === 'methodology' && (
        <Methodology onBack={() => setRoute('welcome')} />
      )}
    </View>
  );
}

function Welcome({ onStart, onBrowse, onBallot, onMethodology }) {
  const cov = getCoverage();
  return (
    <Screen>
      <Body style={{ fontWeight: '800', letterSpacing: 2, color: colors.accent, marginBottom: space(2) }}>
        M2V · MATCH TO VOTE
      </Body>
      <H1>Vote the issues,{'\n'}not the party.</H1>
      <Body soft style={{ marginBottom: space(4) }}>
        Answer 10 questions about what you believe. We'll match you with real
        candidates on the November 2026 ballot — every position sourced, nothing
        ever guessed from party.
      </Body>
      <Body style={{ fontWeight: '700', color: colors.accent, marginBottom: space(4) }}>
        Now covering {cov.totalRaces} races across {cov.states.length} states · growing weekly
      </Body>
      <Button label="Take the quiz" onPress={onStart} />
      <Button kind="ghost" label="Browse candidates in your state" onPress={onBrowse} />
      <Button kind="ghost" label="My Ballot" onPress={onBallot} />
      <Pressable onPress={onMethodology}>
        <Body soft style={{ fontSize: 12, marginTop: space(4), textAlign: 'center', textDecorationLine: 'underline' }}>
          How matching works · Nonpartisan · Positions are never guessed
        </Body>
      </Pressable>
    </Screen>
  );
}

function Quiz({ qIndex, matters, onAnswer, onBack }) {
  const issue = ISSUES[qIndex];
  const [mattersFlag, setMattersFlag] = useState(!!matters[issue.key]);

  return (
    <Screen>
      <ProgressBar value={(qIndex + 1) / ISSUES.length} />
      <Body soft style={{ marginBottom: space(1) }}>
        {qIndex + 1} of {ISSUES.length} · {issue.name}
      </Body>
      <H2 style={{ marginBottom: space(3) }}>{issue.question}</H2>
      <Card>
        <Body style={{ marginBottom: space(2) }}>① {issue.stanceA}</Body>
        <Body>② {issue.stanceB}</Body>
      </Card>
      <ScrollView style={{ flex: 1 }}>
        {CHOICES.map((c) => (
          <Button
            key={c.value}
            kind="ghost"
            label={c.label}
            onPress={() => onAnswer(issue.key, c.value, mattersFlag)}
          />
        ))}
        <Pressable
          onPress={() => setMattersFlag((f) => !f)}
          style={[styles.mattersToggle, mattersFlag && styles.mattersOn]}
        >
          <Text style={{ color: mattersFlag ? '#fff' : colors.accent, fontWeight: '600' }}>
            {mattersFlag ? '★ This issue matters most to me' : '☆ Mark as a top issue (counts double)'}
          </Text>
        </Pressable>
        <Button kind="ghost" label="Skip this question" onPress={() => onAnswer(issue.key, null, false)} />
        <Button kind="ghost" label="Back" onPress={onBack} />
      </ScrollView>
    </Screen>
  );
}

// Real matches: every race on the user's ballot, candidates ranked by match.
// No sample data — these are the actual filed candidates in the user's state.
function Results({ stateCode, answers, matters, onRestart, onChangeState, onOpenRace }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    getStateData(stateCode, (fresh) => { if (alive) setData(fresh); })
      .then((d) => { if (alive && d) setData(d); });
    return () => { alive = false; };
  }, [stateCode]);

  const races = useMemo(
    () => getRaces(stateCode, data, { curatedOnly: true }),
    [stateCode, data]
  );
  const ranked = useMemo(() =>
    races.map((race) => ({
      race,
      rows: rankCandidates(answers, matters, race.candidates),
    })), [races, answers, matters]);

  return (
    <Screen>
      <H1>Your matches</H1>
      <Body soft style={{ marginBottom: space(3) }}>
        {STATE_NAMES[stateCode] || stateCode} · November 3, 2026 ballot · real
        candidates from FEC filings.{' '}
        <Text style={{ textDecorationLine: 'underline' }} onPress={onChangeState}>
          Change state
        </Text>
      </Body>
      <ScrollView style={{ flex: 1 }}>
        {ranked.map(({ race, rows }) => (
          <Pressable key={race.id} onPress={() => onOpenRace(race)}>
            <Card>
              <H2 style={{ marginBottom: space(2) }}>{race.title}</H2>
              {rows.map(({ candidate, pct, sharedIssues }) => (
                <View
                  key={candidate.id}
                  style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space(2) }}
                >
                  <MatchRing pct={pct} />
                  <View style={{ flex: 1, marginLeft: space(3) }}>
                    <Body style={{ fontWeight: '700' }}>{candidate.name}</Body>
                    <Body soft style={{ fontSize: 12 }}>
                      {candidate.party}
                      {pct !== null
                        ? ` · ${sharedIssues} shared issue${sharedIssues === 1 ? '' : 's'}`
                        : ' · positions not yet stated'}
                    </Body>
                  </View>
                  <TierBadge tier={candidate.tier} />
                </View>
              ))}
              <Body soft style={{ fontSize: 12 }}>
                Every score built from sourced positions — tap for details
                {race.hiddenCount > 0
                  ? ` · ${race.hiddenCount} unresearched filer${race.hiddenCount === 1 ? '' : 's'} not shown`
                  : ''}
              </Body>
            </Card>
          </Pressable>
        ))}
        <Button kind="ghost" label="Retake the quiz" onPress={onRestart} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mattersToggle: {
    borderRadius: 999, borderWidth: 1, borderColor: colors.accent,
    paddingVertical: 10, alignItems: 'center', marginVertical: 6,
  },
  mattersOn: { backgroundColor: colors.gold, borderColor: colors.gold },
});
