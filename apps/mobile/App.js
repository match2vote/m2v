// M2V root v3, persistent tab bar, real routing, quiz that never loses
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
import { Home } from './src/screens/Home';
import { HowTo } from './src/screens/HowTo';
import { ChooseState } from './src/screens/ChooseState';
import { getRaces, getCoverage, STATE_NAMES } from './src/ballot';
import { getStateData, getPicks, savePick, removePick, getQuizState, saveQuizState, clearQuizState, kv } from './src/api';
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

  // Match results exist ONLY for a completed quiz with at least 3 real answers
  // (skips don't count). Anything less shows progress, never a "best match".
  const realAnswers = Object.values(quiz.answers).filter((v) => v !== null && v !== undefined).length;
  const quizUsable = quiz.done && realAnswers >= 3;
  const quizCtx = { answers: quizUsable ? quiz.answers : {}, matters: quiz.matters };

  if (!onboarded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        {onboarded === false && !quiz.pickingState ? (
          <Welcome onStart={() => setQuiz({ ...quiz, pickingState: true })} />
        ) : (
          <ChooseState
            onboarding
            onDone={() => {
              kv.set('m2v:onboarded', '1');
              setOnboarded(true);
              nav.go({ name: 'home' }, { replace: true });
            }}
          />
        )}
      </View>
    );
  }

  const r = nav.route;
  return (
    <QuizContext.Provider value={quizCtx}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <View style={{ flex: 1 }}>
          {r.name === 'home' && <Home />}
          {r.name === 'state' && <ChooseState />}
          {r.name === 'howto' && <HowTo />}
          {r.name === 'ballot' && <OfficialBallot key={ballotCount >= 0 ? 'b' : 'b'} />}
          {r.name === 'races' && !r.state && <StatePicker />}
          {r.name === 'races' && r.state && <Races stateCode={r.state} />}
          {r.name === 'race' && <Race raceId={r.id} />}
          {r.name === 'candidate' && <Profile candidateId={r.id} />}
          {r.name === 'quiz' && (
            <Quiz quiz={quiz} setQuiz={setQuizPersist} onDone={() => nav.go({ name: 'matches' }, { replace: true })} />
          )}
          {r.name === 'matches' && (
            <Matches quiz={quiz} setQuiz={setQuizPersist} onPicksChanged={(n) => setBallotCount(n)} />
          )}
          {r.name === 'about' && <About />}
        </View>
        <TabBar
          active={tabOf(r)}
          ballotCount={ballotCount}
          onChange={(tab) => {
            if (tab === 'home') nav.go({ name: 'home' });
            else if (tab === 'ballot') nav.go({ name: 'ballot' });
            else if (tab === 'races') nav.go({ name: 'races' });
            else if (tab === 'howto') nav.go({ name: 'howto' });
            else nav.go({ name: 'matches' });
          }}
        />
      </View>
    </QuizContext.Provider>
  );
}

// One screen, then straight to "where do you vote?".
function Welcome({ onStart }) {
  const { colors } = useTheme();
  const cov = getCoverage();
  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Body style={{ fontWeight: '800', letterSpacing: 2, color: colors.accent, marginBottom: space(3) }}>
          WELCOME TO MATCH TO VOTE
        </Body>
        <H1 style={{ fontSize: 42, lineHeight: 48 }}>
          Who actually{'\n'}agrees with you?
        </H1>
        <Body soft style={{ marginVertical: space(4), fontSize: 17 }}>
          10 quick questions. Real candidates on the November ballot. Every
          position sourced, never guessed from party.
        </Body>
        <Body style={{ fontWeight: '700', color: colors.accent, marginBottom: space(5) }}>
          {cov.totalRaces} races · {cov.states.length} states · growing weekly
        </Body>
        <Button label="Get started" onPress={onStart} />
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
            {mattersFlag ? '★ Top issue, counts double' : '☆ Make this a top issue'}
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

function Matches({ quiz, setQuiz, onPicksChanged }) {
  const nav = useNav();
  const { colors } = useTheme();
  const [stateCode, setStateCode] = useState(null);
  const [data, setData] = useState(null);
  const [confirmRetake, setConfirmRetake] = useState(false);
  const [shareMsg, setShareMsg] = useState(null);
  const [picks, setPicks] = useState([]);

  useEffect(() => {
    kv.get('m2v:ballotState').then((s) => setStateCode(s || null));
    getPicks().then(setPicks);
  }, [nav.route]);

  // One-tap mark/unmark straight from the results list, with instant feedback.
  const toggleMark = async (race, candidate, pct) => {
    const existing = picks.find((p) => p.raceId === race.id);
    const next = existing && existing.candidateId === candidate.id
      ? await removePick(race.id)
      : await savePick({
          raceId: race.id, raceTitle: race.title, state: candidate.state,
          candidateId: candidate.id, name: candidate.name, party: candidate.party,
          tier: candidate.tier, matchPct: pct ?? null,
        });
    setPicks(next);
    onPicksChanged?.(next.length);
  };
  useEffect(() => {
    if (!stateCode) return;
    let alive = true;
    getStateData(stateCode, (fresh) => { if (alive) setData(fresh); })
      .then((d) => { if (alive && d) setData(d); });
    return () => { alive = false; };
  }, [stateCode]);

  const answered = Object.keys(quiz.answers).length;
  const realAnswered = Object.values(quiz.answers).filter((v) => v !== null && v !== undefined).length;

  // Not started
  if (!quiz.done && answered === 0) {
    return (
      <Screen>
        <H1>Your matches</H1>
        <Body soft style={{ marginBottom: space(4), fontSize: 16 }}>
          Take the 10-question quiz and we'll show you who on your ballot
          actually agrees with you, with a source for every position.
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
          You're {quiz.qIndex} of {ISSUES.length} questions in, your answers are saved.
        </Body>
        <Button label={`Resume at question ${quiz.qIndex + 1}`} onPress={() => nav.go({ name: 'quiz' })} />
        <Button kind="ghost" label="Start over instead" onPress={() => { setQuiz({ answers: {}, matters: {}, qIndex: 0, done: false }); nav.go({ name: 'quiz' }); }} />
      </Screen>
    );
  }

  // Completed, but mostly skipped: one or two answers is not a match basis.
  if (quiz.done && realAnswered < 3) {
    return (
      <Screen>
        <H1>Almost there</H1>
        <Body soft style={{ marginBottom: space(4), fontSize: 16 }}>
          You answered {realAnswered} of {ISSUES.length} questions (skips don't
          count). We need at least 3 real answers to say anything meaningful
          about who agrees with you, a match built on less would be noise.
        </Body>
        <Button label="Answer more questions" onPress={() => { setQuiz({ ...quiz, qIndex: 0, done: false }); nav.go({ name: 'quiz' }); }} />
      </Screen>
    );
  }

  // Done → results (needs a ballot state)
  if (!stateCode) {
    return (
      <Screen>
        <H1>One more thing</H1>
        <Body soft style={{ marginBottom: space(4), fontSize: 16 }}>
          Tell us where you vote and we'll match you against your actual ballot.
        </Body>
        <Button label="Choose my state" onPress={() => nav.go({ name: 'state' })} />
      </Screen>
    );
  }

  const races = getRaces(stateCode, data, { curatedOnly: true });
  const ranked = races.map((race) => ({ race, rows: rankCandidates(quiz.answers, quiz.matters, race.candidates) }));
  const ballotRaceCount = getRaces(stateCode, data, { ballotView: true }).length;
  const markedCount = getRaces(stateCode, data, { ballotView: true })
    .filter((r) => picks.some((p) => p.raceId === r.id)).length;
  const shareRows = ranked
    .map(({ race, rows }) => rows[0] && { name: rows[0].candidate.name, party: rows[0].candidate.party, pct: rows[0].pct, raceTitle: race.title })
    .filter(Boolean)
    .sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1));

  return (
    <Screen>
      <H1>Here's who agrees with you</H1>
      <Body soft style={{ marginBottom: space(3) }}>
        {STATE_NAMES[stateCode] || stateCode} · November 3, 2026.{' '}
        <Text style={{ textDecorationLine: 'underline' }} onPress={() => nav.go({ name: 'state' })}>Change state</Text>
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
        <Button
          kind="ghost"
          label={`View your ballot (${markedCount} of ${ballotRaceCount} race${ballotRaceCount === 1 ? '' : 's'} marked)`}
          onPress={() => nav.go({ name: 'ballot' })}
        />
        {ranked.map(({ race, rows }) => {
          // Different candidates can have different numbers of documented
          // positions, so their percentages cover different denominators.
          // Surface that difference; never let 9-issue and 10-issue numbers
          // read as the same kind of number.
          const dens = rows.filter((r) => r.pct !== null).map((r) => r.sharedIssues);
          const denSpread = dens.length > 1 ? Math.max(...dens) - Math.min(...dens) : 0;
          return (
          <Card key={race.id}>
            <Pressable onPress={() => nav.go({ name: 'race', id: race.id })}>
              <H2 style={{ marginBottom: space(2) }}>{race.title} ›</H2>
            </Pressable>
            {denSpread >= 1 && (
              <Body soft style={{ fontSize: 12, marginBottom: space(2), fontStyle: 'italic' }}>
                These percentages cover different numbers of issues, because some
                candidates have fewer documented positions. They are not directly
                comparable, check the "of your {realAnswered}" count under each name.
              </Body>
            )}
            {rows.map(({ candidate, pct, sharedIssues }) => {
              const isMarked = picks.some((p) => p.raceId === race.id && p.candidateId === candidate.id);
              return (
                <View key={candidate.id} style={{ marginBottom: space(3) }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MatchRing pct={pct} size={64} />
                    <View style={{ flex: 1, marginLeft: space(3) }}>
                      <Pressable onPress={() => nav.go({ name: 'candidate', id: candidate.id })}>
                        <Body style={{ fontWeight: '800', fontSize: 17 }}>{candidate.name}</Body>
                      </Pressable>
                      <Body soft style={{ fontSize: 12 }}>
                        {candidate.party}{candidate.tier === 'curated' ? ' · sourced ✓' : ''}
                      </Body>
                      <Body style={{ fontSize: 12.5, fontWeight: '700' }}>
                        {pct !== null
                          ? `${pct}% across ${sharedIssues} of your ${realAnswered} issue${realAnswered === 1 ? '' : 's'}`
                          : 'not enough documented positions to score'}
                      </Body>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => toggleMark(race, candidate, pct)}
                    style={({ pressed }) => [{
                      marginTop: 6, marginLeft: 64 + space(3),
                      alignSelf: 'flex-start', borderRadius: 10,
                      paddingHorizontal: 14, paddingVertical: 8,
                      backgroundColor: isMarked ? colors.gold : 'transparent',
                      borderWidth: 1.5, borderColor: colors.gold,
                    }, pressed && { opacity: 0.7 }]}
                  >
                    <Text style={{ fontWeight: '800', fontSize: 13, color: isMarked ? '#FFF9EE' : colors.gold }}>
                      {isMarked ? '● Marked on your ballot · tap to unmark' : '◯ Mark on your ballot'}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </Card>
          );
        })}
        {!confirmRetake ? (
          <Button kind="ghost" label="Retake the quiz" onPress={() => setConfirmRetake(true)} />
        ) : (
          <Card>
            <Body style={{ fontWeight: '700', marginBottom: space(2) }}>
              Retake the quiz? Your saved ballot stays exactly as it is, only
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
