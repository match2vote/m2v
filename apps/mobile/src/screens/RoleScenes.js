// Animated "what you're voting for" scenes, a sibling of VoteScenes. One
// looping scene per chapter on the espresso stage with the gold accent.
// Every animation runs on the native driver and touches only transform and
// opacity. Reduced motion (via useLoop / Float) means resting state, no loop.
import React from 'react';
import { View, Text, Animated } from 'react-native';
import { useTheme } from '../theme';
import { Stage, Float, useLoop, bar, PAPER, INKL, DUR } from './VoteScenes';
import { strings } from '../strings';

// Scene 0: Governor. A bill slides onto the desk and the signature draws in
// (a gold pen glides across the line, then a "signed" seal fades up).
function SceneGovernor({ gold }) {
  const v = useLoop();
  const penX = v.interpolate({ inputRange: [0, 0.2, 0.6, 1], outputRange: [0, 0, 62, 62] });
  const penOpacity = v.interpolate({ inputRange: [0, 0.15, 0.2, 0.62, 0.7, 1], outputRange: [0, 0, 1, 1, 0, 0] });
  const sealOpacity = v.interpolate({ inputRange: [0, 0.68, 0.78, 0.92, 1], outputRange: [0, 0, 1, 1, 0] });
  const sealScale = v.interpolate({ inputRange: [0, 0.68, 0.78, 1], outputRange: [1.4, 1.4, 1, 1] });
  return (
    <Stage>
      <Float style={{ alignSelf: 'center', width: 138, backgroundColor: PAPER, borderRadius: 10, padding: 12 }}>
        {bar(58, gold)}
        <View style={{ marginTop: 9 }}>{bar(96)}</View>
        <View style={{ marginTop: 6 }}>{bar(84)}</View>
        <View style={{ marginTop: 6 }}>{bar(90)}</View>
        <View style={{ marginTop: 14, height: 18, justifyContent: 'flex-end' }}>
          <View style={{ height: 1.5, backgroundColor: 'rgba(38,42,52,0.35)', width: 80 }} />
          <Animated.View
            style={{
              position: 'absolute', left: 0, bottom: 2, width: 22, height: 5, borderRadius: 3,
              backgroundColor: gold, opacity: penOpacity, transform: [{ translateX: penX }, { rotate: '-20deg' }],
            }}
          />
          <Animated.View
            style={{
              position: 'absolute', right: 0, bottom: 0, width: 26, height: 26, borderRadius: 13,
              borderWidth: 2, borderColor: gold, alignItems: 'center', justifyContent: 'center',
              opacity: sealOpacity, transform: [{ scale: sealScale }],
            }}
          >
            <Text style={{ color: gold, fontSize: 12, fontWeight: '900' }}>✓</Text>
          </Animated.View>
        </View>
      </Float>
    </Stage>
  );
}

// Scene 1: Senator. One hundred seats. Two are yours (one per state, twice).
// A third of the room lights up: the seats on the ballot this time.
function SceneSenate({ gold }) {
  const v = useLoop();
  const thirdOpacity = v.interpolate({ inputRange: [0, 0.25, 0.4, 0.85, 1], outputRange: [0.25, 0.25, 1, 1, 0.25] });
  const dots = Array.from({ length: 100 }, (_, i) => i);
  return (
    <Stage>
      <Float style={{ alignSelf: 'center', width: 150, backgroundColor: PAPER, borderRadius: 10, padding: 10 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 130, alignSelf: 'center' }}>
          {dots.map((i) => {
            const onBallot = i % 3 === 0; // 34 of 100, roughly a third
            const dot = { width: 8, height: 8, borderRadius: 4, margin: 2.5 };
            return onBallot ? (
              <Animated.View key={i} style={[dot, { backgroundColor: gold, opacity: thirdOpacity }]} />
            ) : (
              <View key={i} style={[dot, { backgroundColor: INKL }]} />
            );
          })}
        </View>
      </Float>
    </Stage>
  );
}

// Scene 2: Representative. A revenue bill starts in the House column and
// travels across to the Senate column, then fades to start again.
function SceneHouse({ gold }) {
  const v = useLoop();
  const translateX = v.interpolate({ inputRange: [0, 0.2, 0.7, 1], outputRange: [0, 0, 78, 78] });
  const opacity = v.interpolate({ inputRange: [0, 0.08, 0.7, 0.85, 1], outputRange: [0, 1, 1, 0, 0] });
  const column = (label) => (
    <View style={{ width: 54, height: 78, backgroundColor: PAPER, borderRadius: 8, alignItems: 'center', paddingTop: 8 }}>
      <Text style={{ fontSize: 7.5, fontWeight: '800', letterSpacing: 1.2, color: 'rgba(38,42,52,0.6)' }}>{label}</Text>
      <View style={{ marginTop: 8 }}>{bar(30)}</View>
      <View style={{ marginTop: 6 }}>{bar(30)}</View>
      <View style={{ marginTop: 6 }}>{bar(30)}</View>
    </View>
  );
  return (
    <Stage>
      <Float style={{ alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
          {column(strings.scenes.house)}
          {column(strings.scenes.senate)}
        </View>
        <Animated.View
          style={{
            position: 'absolute', left: 14, top: 26, width: 26, height: 30, borderRadius: 4,
            backgroundColor: gold, opacity, transform: [{ translateX }],
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.95)', fontSize: 11, fontWeight: '900' }}>$</Text>
        </Animated.View>
      </Float>
    </Stage>
  );
}

// Scene 3: Delegate. Two rooms. In committee the vote lands (check). On the
// House floor the same hand is not counted (the mark stays hollow).
function SceneDelegate({ gold }) {
  const v = useLoop();
  const checkOpacity = v.interpolate({ inputRange: [0, 0.2, 0.3, 0.85, 1], outputRange: [0, 0, 1, 1, 0] });
  const checkScale = v.interpolate({ inputRange: [0, 0.2, 0.3, 1], outputRange: [0.4, 0.4, 1, 1] });
  const hollowOpacity = v.interpolate({ inputRange: [0, 0.5, 0.6, 0.85, 1], outputRange: [0, 0, 1, 1, 0] });
  const room = (label, child) => (
    <View style={{ width: 62, height: 78, backgroundColor: PAPER, borderRadius: 8, alignItems: 'center', paddingTop: 8 }}>
      <Text style={{ fontSize: 7, fontWeight: '800', letterSpacing: 1, color: 'rgba(38,42,52,0.6)' }}>{label}</Text>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>{child}</View>
    </View>
  );
  return (
    <Stage>
      <Float style={{ alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 18 }}>
          {room(strings.scenes.committee, (
            <Animated.View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: gold, alignItems: 'center', justifyContent: 'center', opacity: checkOpacity, transform: [{ scale: checkScale }] }}>
              <Text style={{ color: 'rgba(255,255,255,0.95)', fontSize: 14, fontWeight: '900' }}>✓</Text>
            </Animated.View>
          ))}
          {room(strings.scenes.houseFloor, (
            <Animated.View style={{ width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: 'rgba(38,42,52,0.35)', borderStyle: 'dashed', opacity: hollowOpacity }} />
          ))}
        </View>
      </Float>
    </Stage>
  );
}

const SCENES = [SceneGovernor, SceneSenate, SceneHouse, SceneDelegate];

export function RoleScene({ index }) {
  const { colors } = useTheme();
  const Scene = SCENES[index] || SceneGovernor;
  return <Scene gold={colors.gold} />;
}

export { DUR };
