// M2V root v3 — persistent tab bar, real routing, quiz that never loses
// progress, ballot always one tap away.
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ISSUES, rankCandidates } from '@m2v/core';
import { Screen, H1, H2, Body, Card, Button, ProgressBar, TierBadge, MatchRing, TabBar } from './src/ui';
import { theme, ThemeProvider, useTheme } from './src/theme';
import { NavProvider, useNav, tabOf } from './src/nav';
import { QuizContext } from './src/quizContext';
import { StatePicker, Races, Race, Profile } from './src/screens/Browse';
import { OfficialBallot } from './src/screens/OfficialBallot';
import { About } from './src/screens/About';
import { getRaces, getCoverage, STATE_NAMES } from './src/ballot';
import { getStateData, getPicks, getQuizState, saveQuizState, clearQuizState, kv } from './src/api';
import { shareResultCard } from './src/share';

const { space } = theme;

export default function App() {
  return (
    <ThemeProvider getStored={kv.get} setStored={kv.set}>
      <NavProvider>
        <Root />
      </NavProvider>
    </ThemeProvider>
  );
}

function Root() {
  const { colors, scheme } = useTheme();
  const nav = useNav();
  const [onboarded, setOnboarded] = useState(null);
  const [quiz, setQuiz] = useState({ answers: {}, matters: {}, qIndex: 0, done: false });
  const [quizLoaded, setQuizLoaded] = useState(false);
  const [ballotCount, setBallotCount] = useState(0);

  useEffect(() => {
    (async () => {
      const [ob, saved] = await Promise.all([kv.get('m2v:onboarded'), getQuizState()]);
      setOnboarded(!!ob);
      if (saved) setQuiz(saved);
      setQuizLoaded(true);
    })();
  }, []);

  // Keep the ballot badge fresh whenever navigation happens.
  useEffect(() => { getPicks().then((p) => setBallotCount(p.length)); }, [nav.route]);

  const setQuizPersist = (next) => {
    setQuiz(next);
    saveQuizState(next);
  };

  if (onboarded === null || !quizLoaded) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;

  const quizCtx = { answers: quiz.done ? quiz.answers : {}, matters: quiz.matters };

  if (!onboarded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Welcome onDone={(dest) => { kv.set('m2v:onboarded', '1'); setOnboarded(true); nav.go(dest, { replace: true }); }} />
      </View>
    );
  }

  const r = nav.route;
  return (
    <QuizContext.Provider value={quizCtx}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <View style={{ flex: 1 }}>
          {r.name === 'ballot' && <OfficialBallot key={ballotCount >= 0 ? 'b' : 'b'} />}
          {r.name === 'races' && !r.state && <StatePicker />}
          {r.name === 'races' && r.state && <Races stateCode={r.state} />}
          {r.name === 'race' && <Race raceId={r.id} />}
          {r.name === 'candidate' && <Profile candidateId={r.id} />}
          {r.name === 'quiz' && (
            <Quiz quiz={quiz} setQuiz={setQuizPersist} onDone={() => nav.go({ name: 'matches' }, { replace: true })} />
          )}
          {r.name === 'matches' && (
            <Matches quiz={quiz} setQuiz={setQuizPersist} />
          )}
          {r.name === 'about' && <About />}
        </View>
        <TabBar
          active={tabOf(r)}
          ballotCount={ballotCount}
          onChange={(tab) => {
            if (tab === 'ballot') nav.go({ name: 'ballot' });
            else if (tab === 'races') nav.go({ name: 'races' });
            else if (tab === 'matches') nav.go({ name: 'matches' });
            else nav.go({ name: 'about' });
          }}
        />
      </View>
    </QuizContext.Provider>
  );
}

// One screen. Get to the quiz fast.
function Welcome({ onDone }) {
  const { colors } = useTheme();
  const cov = getCoverage();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Body style={{ fontWeight: '800', letterSpacing: 2, color: colors.accent, marginBottom: space(3) }}>
          M2V · MATCH TO VOTE
        </Body>
        <H1 style={{ fontSize: 42, lineHeight: 48 }}>
          Who actually{'\n'}agrees with you?
        </H1>
        <Body soft style={{ marginVertical: space(4), fontSize: 17 }}>
          10 quick questions. Real candidates on the November ballot. Every
          position sourced — never guessed from party.
        </Body>
        <Body style={{ fontWeight: '700', color: colors.accent, marginBottom: space(5) }}>
          {cov.totalRaces} races · {cov.states.length} states · growing weekly
        </Body>
        <Button label="Find my matches" onPress={() => onDone({ name: 'quiz' })} />
        <Button kind="ghost" label="Just browse the races" onPress={() => onDone({ name: 'races' })} />
      </View>
    </Screen>
  );
}

const CHOICES = [
  { value: -2, label: 'Strongly ①' },
  { value: -1, label: 'Lean ①' },
  { value: 0, label: 'In the middle' },
  { value: 1, label: 'Lean ②' },
  { value: 2, label: 'Strongly ②' },
];

function Quiz({ quiz, setQuiz, onDone }) {
  const { colors } = useTheme();
  const nav = useNav();
  const qIndex = Math.min(quiz.qIndex, ISSUES.length - 1);
  const issue = ISSUES[qIndex];
  const [mattersFlag, setMattersFlag] = useState(!!quiz.matters[issue.key]);
  useEffect(() => { setMattersFlag(!!quiz.matters[ISSUES[qIndex].key]); }, [qIndex]);

  const answer = (value) => {
    const next = {
      ...quiz,
      answers: { ...quiz.answers, [issue.key]: value },
      matters: { ...quiz.matters, [issue.key]: mattersFlag },
      qIndex: qIndex + 1,
      done: qIndex + 1 >= ISSUES.length,
    };
    setQuiz(next);
    if (next.done) onDone();
  };

  return (
    <Screen>
      <ProgressBar value={(qIndex + 1) / ISSUES.length} />
      <Body soft style={{ marginBottom: space(1) }}>
        {qIndex + 1} of {ISSUES.length} · {issue.name} · progress saves automatically
      </Body>
      <H2 style={{ marginBottom: space(3), fontSize: 24, lineHeight: 30 }}>{issue.question}</H2>
      <Card>
        <Body style={{ marginBottom: space(2) }}>① {issue.stanceA}</Body>
        <Body>② {issue.stanceB}</Body>
      </Card>
      <ScrollView style={{ flex: 1 }}>
        {CHOICES.map((c) => (
          <Button key={c.value} kind="ghost" label={c.label} onPress={() => answer(c.value)} />
        ))}
        <Pressable
          onPress={() => setMattersFlag((f) => !f)}
          style={{
            borderRadius: 999, borderWidth: 1.5, paddingVertical: 10, alignItems: 'center', marginVertical: 6,
            borderColor: mattersFlag ? colors.gold : colors.accent,
            backgroundColor: mattersFlag ? colors.gold : 'transparent',
          }}
        >
          <Text style={{ color: mattersFlag ? '#fff' : colors.accent, fontWeight: '700' }}>
            {mattersFlag ? '★ Top issue — counts double' : '☆ Make this a top issue'}
          </Text>
        </Pressable>
        <Button kind="ghost" label="Skip this one" onPress={() => answer(null)} />
        {qIndex > 0 && (
          <Button kind="ghost" small label="‹ Previous question" onPress={() => setQuiz({ ...quiz, qIndex: qIndex - 1 })} />
        )}
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}

function Matches({ quiz, setQuiz }) {
  const nav = useNav();
  const { colors } = useTheme();
  const [stateCode, setStateCode] = useState(null);
  const [data, setData] = useState(null);
  const [confirmRetake, setConfirmRetake] = useState(false);
  const [shareMsg, setShareMsg] = useState(null);

  useEffect(() => {
    kv.get('m2v:ballotState').then((s) => setStateCode(s || null));
  }, [nav.route]);
  useEffect(() => {
    if (!stateCode) return;
    let alive = true;
    getStateData(stateCode, (fresh) => { if (alive) setData(fresh); })
      .then((d) => { if (alive && d) setData(d); });
    return () => { alive = false; };
  }, [stateCode]);

  const answered = Object.keys(quiz.answers).length;

  // Not started
  if (!quiz.done && answered === 0) {
    return (
      <Screen>
        <H1>Your matches</H1>
        <Body soft style={{ marginBottom: space(4), fontSize: 16 }}>
          Take the 10-question quiz and we'll show you who on your ballot
          actually agrees with you — with a source for every position.
        </Body>
        <Button label="Start the quiz (2 minutes)" onPress={() => nav.go({ name: 'quiz' })} />
      </Screen>
    );
  }

  // In progress
  if (!quiz.done) {
    return (
      <Screen>
        <H1>Pick up where you left off</H1>
        <Body soft style={{ marginBottom: space(4), fontSize: 16 }}>
          You're {quiz.qIndex} of {ISSUES.length} questions in — your answers are saved.
        </Body>
        <Button label={`Resume at question ${quiz.qIndex + 1}`} onPress={() => nav.go({ name: 'quiz' })} />
        <Button kind="ghost" label="Start over instead" onPress={() => { setQuiz({ answers: {}, matters: {}, qIndex: 0, done: false }); nav.go({ name: 'quiz' }); }} />
      </Screen>
    );
  }

  // Done → results
  if (!stateCode) {
    return <StatePickerInline onPick={(code) => { kv.set('m2v:ballotState', code); setStateCode(code); }} />;
  }

  const races = getRaces(stateCode, data, { curatedOnly: true });
  const ranked = races.map((race) => ({ race, rows: rankCandidates(quiz.answers, quiz.matters, race.candidates) }));
  const shareRows = ranked
    .map(({ race, rows }) => rows[0] && { name: rows[0].candidate.name, party: rows[0].candidate.party, pct: rows[0].pct, raceTitle: race.title })
    .filter(Boolean)
    .sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1));

  return (
    <Screen>
      <H1>Here's who agrees with you</H1>
      <Body soft style={{ marginBottom: space(3) }}>
        {STATE_NAMES[stateCode] || stateCode} · November 3, 2026.{' '}
        <Text style={{ textDecorationLine: 'underline' }} onPress={() => setStateCode(null)}>Change state</Text>
      </Body>
      <ScrollView style={{ flex: 1 }}>
        <Button
          label="Share my matches (image)"
          onPress={async () => {
            const res = await shareResultCard({ stateName: STATE_NAMES[stateCode] || stateCode, rows: shareRows });
            setShareMsg(res === 'downloaded' ? 'Card saved! Post it anywhere.' : res === 'shared-text' ? 'Shared.' : 'Could not export here.');
          }}
        />
        {shareMsg && <Body soft style={{ textAlign: 'center', fontSize: 13, marginBottom: space(2) }}>{shareMsg}</Body>}
        {ranked.map(({ race, rows }) => (
          <Pressable key={race.id} onPress={() => nav.go({ name: 'race', id: race.id })}>
            <Card>
              <H2 style={{ marginBottom: space(2) }}>{race.title}</H2>
              {rows.map(({ candidate, pct, sharedIssues }) => (
                <View key={candidate.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: space(2) }}>
                  <MatchRing pct={pct} size={64} />
                  <View style={{ flex: 1, marginLeft: space(3) }}>
                    <Body style={{ fontWeight: '800', fontSize: 17 }}>{candidate.name}</Body>
                    <Body soft style={{ fontSize: 12 }}>
                      {candidate.party}
                      {pct !== null ? ` · ${sharedIssues} shared issue${sharedIssues === 1 ? '' : 's'}` : ' · not enough stated positions'}
                      {candidate.tier === 'curated' ? ' · sourced ✓' : ''}
                    </Body>
                  </View>
                </View>
              ))}
              <Body soft style={{ fontSize: 12 }}>Tap to compare and mark your ballot ›</Body>
            </Card>
          </Pressable>
        ))}
        {!confirmRetake ? (
          <Button kind="ghost" label="Retake the quiz" onPress={() => setConfirmRetake(true)} />
        ) : (
          <Card>
            <Body style={{ fontWeight: '700', marginBottom: space(2) }}>
              Retake the quiz? Your saved ballot stays exactly as it is — only
              your quiz answers reset.
            </Body>
            <Button label="Yes, retake" onPress={() => { setConfirmRetake(false); clearQuizState(); setQuiz({ answers: {}, matters: {}, qIndex: 0, done: false }); nav.go({ name: 'quiz' }); }} />
            <Button kind="ghost" label="Never mind" onPress={() => setConfirmRetake(false)} />
          </Card>
        )}
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}

function StatePickerInline({ onPick }) {
  const { colors } = useTheme();
  const { states } = getCoverage();
  return (
    <Screen>
      <H1>Where do you vote?</H1>
      <Body soft style={{ marginBottom: space(3) }}>So we can match you with your actual ballot.</Body>
      <ScrollView style={{ flex: 1 }}>
        {states.map((s) => (
          <Pressable
            key={s.code}
            onPress={() => onPick(s.code)}
            style={{
              flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16,
              borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: 12, marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.ink }}>{s.name}</Text>
            <Text style={{ color: colors.inkSoft }}>›</Text>
          </Pressable>
        ))}
        <Body soft style={{ fontSize: 13, marginTop: space(2) }}>
          Not listed? We don't cover your state yet — new races are added weekly.
        </Body>
      </ScrollView>
    </Screen>
  );
}
