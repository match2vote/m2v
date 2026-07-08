// M2V — root component. Simple state router (same pattern as the prototype's
// app.jsx). Screens: Welcome → Quiz → Results → (profile detail later).
import React, { useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ISSUES, rankCandidates, stanceLabel } from '@m2v/core';
import { Screen, H1, H2, Body, Card, Button, ProgressBar, TierBadge, MatchRing } from './src/ui';
import { theme } from './src/theme';
import { SAMPLE_RACE } from './src/sampleData';

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
  const [route, setRoute] = useState('welcome'); // welcome | quiz | results
  const [answers, setAnswers] = useState({});
  const [matters, setMatters] = useState({});
  const [qIndex, setQIndex] = useState(0);

  const reset = () => { setAnswers({}); setMatters({}); setQIndex(0); setRoute('welcome'); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      {route === 'welcome' && <Welcome onStart={() => setRoute('quiz')} />}
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
      {route === 'results' && <Results answers={answers} matters={matters} onRestart={reset} />}
    </View>
  );
}

function Welcome({ onStart }) {
  return (
    <Screen>
      <Body style={{ fontWeight: '800', letterSpacing: 2, color: colors.accent, marginBottom: space(2) }}>
        M2V · MATCH TO VOTE
      </Body>
      <H1>Vote the issues,{'\n'}not the party.</H1>
      <Body soft style={{ marginBottom: space(6) }}>
        Answer 10 questions about what you believe. We'll match you with the real
        candidates on your November 2026 ballot — with sources for every position,
        and honest "Not stated" labels when a candidate hasn't said.
      </Body>
      <Button label="Take the quiz" onPress={onStart} />
      <Body soft style={{ fontSize: 12, marginTop: space(4), textAlign: 'center' }}>
        Nonpartisan · No account needed · Positions are never guessed
      </Body>
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

function Results({ answers, matters, onRestart }) {
  const ranked = useMemo(
    () => rankCandidates(answers, matters, SAMPLE_RACE.candidates),
    [answers, matters]
  );

  return (
    <Screen>
      <H1>Your matches</H1>
      <Body soft style={{ marginBottom: space(4) }}>
        {SAMPLE_RACE.office} · {SAMPLE_RACE.state} — sample race until your real
        ballot data is connected.
      </Body>
      <ScrollView style={{ flex: 1 }}>
        {ranked.map(({ candidate, pct, sharedIssues, perIssue }) => (
          <Card key={candidate.id}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MatchRing pct={pct} />
              <View style={{ flex: 1, marginLeft: space(4) }}>
                <H2>{candidate.name}</H2>
                <Body soft style={{ marginBottom: 6 }}>{candidate.party}</Body>
                <TierBadge tier={candidate.tier} />
              </View>
            </View>
            <Body soft style={{ marginTop: space(2), fontSize: 13 }}>
              {pct === null
                ? "This candidate hasn't stated positions on your issues yet — a match can't be calculated."
                : `Based on ${sharedIssues} issue${sharedIssues === 1 ? '' : 's'} you both weighed in on.`}
            </Body>
            {pct !== null && <TopIssueLines perIssue={perIssue} />}
          </Card>
        ))}
        <Button kind="ghost" label="Retake the quiz" onPress={onRestart} />
      </ScrollView>
    </Screen>
  );
}

function TopIssueLines({ perIssue }) {
  const shared = perIssue.filter((p) => p.shared);
  const best = [...shared].sort((a, b) => b.agreement - a.agreement).slice(0, 2);
  return (
    <View style={{ marginTop: space(2) }}>
      {best.map((p) => {
        const issue = ISSUES.find((i) => i.key === p.issue);
        return (
          <Body key={p.issue} style={{ fontSize: 13, marginBottom: 4 }}>
            <Text style={{ fontWeight: '700' }}>{issue.name}: </Text>
            {stanceLabel(issue, p.candidate)}
          </Body>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  mattersToggle: {
    borderRadius: 999, borderWidth: 1, borderColor: colors.accent,
    paddingVertical: 10, alignItems: 'center', marginVertical: 6,
  },
  mattersOn: { backgroundColor: colors.gold, borderColor: colors.gold },
});
