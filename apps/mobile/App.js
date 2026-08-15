// M2V root v3, persistent tab bar, real routing, quiz that never loses
// progress, ballot always one tap away.
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Platform } from 'react-native';
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
import { WhatYouVoteFor } from './src/screens/WhatYouVoteFor';
import { ChooseState, ChooseDistrict } from './src/screens/ChooseState';
import { getRaces, getCoverage, STATE_NAMES, districtLabel, statesPhrase } from './src/ballot';
import { getStateData, getPicks, savePick, removePick, getQuizState, saveQuizState, clearQuizState, getBallotLocation, kv } from './src/api';
import { shareResultCard } from './src/share';
import { DistrictLine } from './src/DistrictLine';
import { ErrorBoundary } from './src/ErrorBoundary';
import { strings } from './src/strings';

const SW = strings.welcome;
const SQ = strings.quiz;
const SM = strings.matches;

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
        <ErrorBoundary>
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
        </ErrorBoundary>
      </View>
    );
  }

  const r = nav.route;
  return (
    <QuizContext.Provider value={quizCtx}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <View style={{ flex: 1 }}>
        <ErrorBoundary>
          {r.name === 'home' && <Home />}
          {r.name === 'state' && <ChooseState />}
          {r.name === 'district' && <ChooseDistrict />}
          {r.name === 'howto' && <HowTo />}
          {r.name === 'roles' && <WhatYouVoteFor />}
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
        </ErrorBoundary>
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
          {SW.eyebrow}
        </Body>
        <H1 style={{ fontSize: 42, lineHeight: 48 }}>
          {SW.title}
        </H1>
        <Body soft style={{ marginVertical: space(4), fontSize: 17 }}>
          {SW.body}
        </Body>
        <Body style={{ fontWeight: '700', color: colors.accent, marginBottom: space(5) }}>
          {SW.stats({ races: cov.totalRaces, statesPhrase: statesPhrase(cov) })}
        </Body>
        <Button label={SW.start} onPress={onStart} />
      </View>
    </Screen>
  );
}

const CHOICES = [
  { value: -2, label: SQ.strongly, badge: 1 },
  { value: -1, label: SQ.lean, badge: 1 },
  { value: 0, label: SQ.middle, badge: null },
  { value: 1, label: SQ.lean, badge: 2 },
  { value: 2, label: SQ.strongly, badge: 2 },
];

// Rendered option badge, used identically in the legend card and the answer
// buttons so the number-to-stance mapping is obvious. Option 1 is filled gold
// with a cream numeral; option 2 is an espresso outline. Distinguishable
// without reading the numeral, and nowhere near party red/blue.
function OptionBadge({ n, size = 23 }) {
  const { colors } = useTheme();
  const filled = n === 1;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        minWidth: size, minHeight: size, borderRadius: 999, paddingHorizontal: 4,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: filled ? colors.accent : 'transparent',
        borderWidth: filled ? 0 : 2,
        borderColor: colors.ink,
      }}
    >
      <Text
        style={{
          fontSize: size * 0.58, fontWeight: '800', lineHeight: size * 0.8,
          fontFamily: Platform.OS === 'web' ? 'system-ui, sans-serif' : undefined,
          color: filled ? colors.onAccent : colors.ink,
        }}
      >
        {n}
      </Text>
    </View>
  );
}

// Answer button: same pill as Button kind="ghost", but renders a real badge
// element next to the label instead of a tiny unicode glyph.
function AnswerButton({ choice, onPress, stances }) {
  const { colors } = useTheme();
  const stance = choice.badge ? stances[choice.badge - 1] : null;
  const a11y = choice.badge
    ? SQ.answerA11y({ label: choice.label, option: choice.badge, stance })
    : choice.label;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={({ pressed }) => [
        {
          borderRadius: 14, borderWidth: 1.5, borderColor: colors.accent, minHeight: 44,
          marginVertical: space(1), paddingVertical: space(3), paddingHorizontal: space(5),
          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
        },
        pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] },
      ]}
    >
      {choice.badge != null && <OptionBadge n={choice.badge} />}
      <Text style={{ fontSize: 16.5, fontWeight: '700', color: colors.accent }}>{choice.label}</Text>
    </Pressable>
  );
}

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
        {SQ.progress({ n: qIndex + 1, total: ISSUES.length, issue: issue.name })}
      </Body>
      <H2 style={{ marginBottom: space(3), fontSize: 24, lineHeight: 30 }}>{issue.question}</H2>
      {/* Legend + top-issue toggle live OUTSIDE the ScrollView so they stay
          pinned while the answers scroll; the mapping never leaves the screen.
          The toggle is a statement about the question, not an answer, so it
          sits with the question, styled as a toggle rather than an answer pill. */}
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: space(2) }}>
          <OptionBadge n={1} />
          <Body style={{ flex: 1 }}>{issue.stanceA}</Body>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          <OptionBadge n={2} />
          <Body style={{ flex: 1 }}>{issue.stanceB}</Body>
        </View>
      </Card>
      <Pressable
        onPress={() => setMattersFlag((f) => !f)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: mattersFlag }}
        accessibilityLabel={SQ.topIssueA11y}
        style={({ pressed }) => [{
          flexDirection: 'row', alignItems: 'center', gap: 9, alignSelf: 'flex-start', minHeight: 44,
          paddingVertical: 7, paddingHorizontal: 12, borderRadius: 10, marginBottom: space(2),
          backgroundColor: mattersFlag ? colors.goldSoft : 'transparent',
        }, pressed && { opacity: 0.7 }]}
      >
        <View style={{
          minWidth: 20, minHeight: 20, borderRadius: 6, alignItems: 'center', justifyContent: 'center',
          borderWidth: 2, borderColor: mattersFlag ? colors.accent : colors.inkSoft,
          backgroundColor: mattersFlag ? colors.accent : 'transparent',
        }}>
          {mattersFlag && <Text style={{ color: colors.onAccent, fontSize: 13, fontWeight: '800', lineHeight: 16 }}>✓</Text>}
        </View>
        <Text style={{ color: mattersFlag ? colors.accent : colors.inkSoft, fontWeight: '700', fontSize: 14 }}>
          {mattersFlag ? SQ.topIssueOn : SQ.topIssueOff}
        </Text>
      </Pressable>
      <ScrollView style={{ flex: 1 }}>
        {CHOICES.map((c) => (
          <AnswerButton key={c.value} choice={c} stances={[issue.stanceA, issue.stanceB]} onPress={() => answer(c.value)} />
        ))}
        <Pressable onPress={() => answer(null)} accessibilityRole="button" accessibilityLabel={SQ.skipA11y} style={({ pressed }) => [{ alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 16, minHeight: 44, justifyContent: 'center' }, pressed && { opacity: 0.6 }]}>
          <Text style={{ color: colors.inkSoft, fontSize: 13.5, textDecorationLine: 'underline' }}>
            {SQ.skip}
          </Text>
        </Pressable>
        {qIndex > 0 && (
          <Button kind="ghost" small label={SQ.previous} onPress={() => setQuiz({ ...quiz, qIndex: qIndex - 1 })} />
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
  const [district, setDistrict] = useState(null);
  const [data, setData] = useState(null);
  const [confirmRetake, setConfirmRetake] = useState(false);
  const [shareMsg, setShareMsg] = useState(null);
  const [picks, setPicks] = useState([]);

  useEffect(() => {
    getBallotLocation().then(({ state, district: d }) => { setStateCode(state); setDistrict(d); });
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
        <H1>{SM.title}</H1>
        <Body soft style={{ marginBottom: space(4), fontSize: 16 }}>
          {SM.notStartedBody}
        </Body>
        <Button label={SM.startQuiz} onPress={() => nav.go({ name: 'quiz' })} />
      </Screen>
    );
  }

  // In progress
  if (!quiz.done) {
    return (
      <Screen>
        <H1>{SM.resumeTitle}</H1>
        <Body soft style={{ marginBottom: space(4), fontSize: 16 }}>
          {SM.resumeBody({ n: quiz.qIndex, total: ISSUES.length })}
        </Body>
        <Button label={SM.resumeAt({ n: quiz.qIndex + 1 })} onPress={() => nav.go({ name: 'quiz' })} />
        <Button kind="ghost" label={SM.startOver} onPress={() => { setQuiz({ answers: {}, matters: {}, qIndex: 0, done: false }); nav.go({ name: 'quiz' }); }} />
      </Screen>
    );
  }

  // Completed, but mostly skipped: one or two answers is not a match basis.
  if (quiz.done && realAnswered < 3) {
    return (
      <Screen>
        <H1>{SM.almostTitle}</H1>
        <Body soft style={{ marginBottom: space(4), fontSize: 16 }}>
          {SM.almostBody({ n: realAnswered, total: ISSUES.length })}
        </Body>
        <Button label={SM.answerMore} onPress={() => { setQuiz({ ...quiz, qIndex: 0, done: false }); nav.go({ name: 'quiz' }); }} />
      </Screen>
    );
  }

  // Done → results (needs a ballot state)
  if (!stateCode) {
    return (
      <Screen>
        <H1>{SM.oneMoreTitle}</H1>
        <Body soft style={{ marginBottom: space(4), fontSize: 16 }}>
          {SM.oneMoreBody}
        </Body>
        <Button label={SM.chooseMyState} onPress={() => nav.go({ name: 'state' })} />
      </Screen>
    );
  }

  const races = getRaces(stateCode, data, { curatedOnly: true, district });
  const ranked = races.map((race) => ({ race, rows: rankCandidates(quiz.answers, quiz.matters, race.candidates) }));
  const ballotRaces = getRaces(stateCode, data, { ballotView: true, district });
  const hasHouse = getRaces(stateCode, data, { display: true }).some((r) => r.id.includes('-house-'));
  const ballotRaceCount = ballotRaces.length;
  const markedCount = ballotRaces.filter((r) => picks.some((p) => p.raceId === r.id)).length;
  const shareRows = ranked
    .map(({ race, rows }) => rows[0] && { name: rows[0].candidate.name, party: rows[0].candidate.party, pct: rows[0].pct, raceTitle: race.title })
    .filter(Boolean)
    .sort((a, b) => (b.pct ?? -1) - (a.pct ?? -1));

  return (
    <Screen>
      <H1>{SM.resultsTitle}</H1>
      <Body soft style={{ marginBottom: space(3) }}>
        {SM.whereLine({ place: district ? SM.stateAndDistrict({ state: STATE_NAMES[stateCode] || stateCode, district: districtLabel(district) }) : STATE_NAMES[stateCode] || stateCode })}
        <Text accessibilityRole="link" style={{ textDecorationLine: 'underline' }} onPress={() => nav.go({ name: 'state' })}>{SM.changeState}</Text>
      </Body>
      <ScrollView style={{ flex: 1 }}>
        <DistrictLine stateCode={stateCode} district={district} hasHouseRaces={hasHouse} />
        <Button
          label={SM.share}
          onPress={async () => {
            const res = await shareResultCard({ stateName: STATE_NAMES[stateCode] || stateCode, rows: shareRows });
            setShareMsg(res === 'downloaded' ? SM.shareSaved : res === 'shared-text' ? SM.shareShared : SM.shareFailed);
          }}
        />
        {shareMsg && <Body soft style={{ textAlign: 'center', fontSize: 13, marginBottom: space(2) }}>{shareMsg}</Body>}
        <Button
          kind="ghost"
          label={SM.viewBallot({ marked: markedCount, total: ballotRaceCount })}
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
            <Pressable
              onPress={() => nav.go({ name: 'race', id: race.id })}
              accessibilityRole="button"
              accessibilityLabel={SM.openRaceA11y({ title: race.title })}
              style={{ minHeight: 44, justifyContent: 'center' }}
            >
              <H2 style={{ marginBottom: space(2) }}>{SM.raceTitle({ title: race.title })}</H2>
            </Pressable>
            {denSpread >= 1 && (
              <Body soft style={{ fontSize: 12, marginBottom: space(2), fontStyle: 'italic' }}>
                {SM.denominatorNote({ n: realAnswered })}
              </Body>
            )}
            {rows.map(({ candidate, pct, sharedIssues }) => {
              const isMarked = picks.some((p) => p.raceId === race.id && p.candidateId === candidate.id);
              return (
                <View key={candidate.id} style={{ marginBottom: space(3) }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MatchRing pct={pct} size={64} />
                    <View style={{ flex: 1, marginLeft: space(3) }}>
                      <Pressable
                        onPress={() => nav.go({ name: 'candidate', id: candidate.id })}
                        accessibilityRole="button"
                        accessibilityLabel={SM.openCandidateA11y({ name: candidate.name, party: candidate.party })}
                        style={{ minHeight: 44, justifyContent: 'center' }}
                      >
                        <Body style={{ fontWeight: '800', fontSize: 17 }}>{candidate.name}</Body>
                        <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 12 }}>
                          {SM.seePositions({ first: candidate.name.split(' ')[0] })}
                        </Text>
                      </Pressable>
                      <Body soft style={{ fontSize: 12 }}>
                        {candidate.party}{candidate.tier === 'curated' ? SM.sourced : ''}
                      </Body>
                      <Body style={{ fontSize: 12.5, fontWeight: '700' }}>
                        {pct !== null
                          ? SM.pctLine({ pct, shared: sharedIssues, total: realAnswered })
                          : SM.notEnough}
                      </Body>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => toggleMark(race, candidate, pct)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: isMarked }}
                    accessibilityLabel={isMarked ? SM.markedA11y({ name: candidate.name, race: race.title }) : SM.markA11y({ name: candidate.name, race: race.title })}
                    style={({ pressed }) => [{
                      marginTop: 6, marginLeft: 64 + space(3), minHeight: 44, justifyContent: 'center',
                      alignSelf: 'flex-start', borderRadius: 10,
                      paddingHorizontal: 14, paddingVertical: 8,
                      backgroundColor: isMarked ? colors.gold : 'transparent',
                      borderWidth: 1.5, borderColor: colors.gold,
                    }, pressed && { opacity: 0.7 }]}
                  >
                    <Text style={{ fontWeight: '800', fontSize: 13, color: isMarked ? colors.onAccent : colors.gold }}>
                      {isMarked ? SM.marked : SM.mark}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </Card>
          );
        })}
        {!confirmRetake ? (
          <Button kind="ghost" label={SM.retake} onPress={() => setConfirmRetake(true)} />
        ) : (
          <Card>
            <Body style={{ fontWeight: '700', marginBottom: space(2) }}>
              {SM.retakeConfirm}
            </Body>
            <Button label={SM.retakeYes} onPress={() => { setConfirmRetake(false); clearQuizState(); setQuiz({ answers: {}, matters: {}, qIndex: 0, done: false }); nav.go({ name: 'quiz' }); }} />
            <Button kind="ghost" label={SM.retakeNo} onPress={() => setConfirmRetake(false)} />
          </Card>
        )}
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}
