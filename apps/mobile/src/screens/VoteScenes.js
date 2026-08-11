// Animated how-to-vote scenes, ported from the prototype's vote-anim.jsx
// (CSS keyframes) to React Native Animated. One looping scene per chapter,
// staged on an espresso card like the prototype's player. Palette: gold accent.
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { useTheme } from '../theme';

const PAPER = '#F5F2EA';
const INKL = 'rgba(38,42,52,0.18)';
const DUR = 3400;

function useLoop(duration = DUR, delay = 0) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return v;
}

// Gentle vertical bob shared by every scene's paper card.
function Float({ children, style }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 1700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: 1700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  return <Animated.View style={[style, { transform: [{ translateY }] }]}>{children}</Animated.View>;
}

function Stage({ children }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        height: 132, borderRadius: 14, backgroundColor: colors.espresso,
        overflow: 'hidden', marginBottom: 12, justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute', right: -34, top: -34, width: 110, height: 110,
          borderRadius: 55, backgroundColor: colors.espressoGlow, opacity: 0.5,
        }}
      />
      {children}
    </View>
  );
}

const bar = (w, bg = INKL, h = 7) => (
  <View style={{ width: w, height: h, borderRadius: 99, backgroundColor: bg }} />
);

// Scene 0: Before you go. Checklist items tick themselves.
function SceneChecklist({ gold }) {
  return (
    <Stage>
      <Float style={{ alignSelf: 'center', width: 130, backgroundColor: PAPER, borderRadius: 10, padding: 12 }}>
        {bar(52, gold)}
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
            <CheckBox delay={500 + i * 550} gold={gold} />
            <View style={{ marginLeft: 8 }}>{bar(66 - i * 10)}</View>
          </View>
        ))}
      </Float>
    </Stage>
  );
}

function CheckBox({ delay, gold }) {
  const v = useLoop(DUR, delay);
  const opacity = v.interpolate({ inputRange: [0, 0.1, 0.85, 1], outputRange: [0, 1, 1, 0] });
  const scale = v.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0.3, 1, 1] });
  return (
    <View style={{ width: 16, height: 16, borderRadius: 4, borderWidth: 1.5, borderColor: INKL, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.Text style={{ color: gold, fontWeight: '900', fontSize: 11, opacity, transform: [{ scale }] }}>✓</Animated.Text>
    </View>
  );
}

// Scene 1: Vote by mail. An envelope glides into the drop box.
function SceneMail({ gold }) {
  const v = useLoop();
  const translateX = v.interpolate({ inputRange: [0, 0.55, 0.7, 1], outputRange: [0, 74, 74, 74] });
  const opacity = v.interpolate({ inputRange: [0, 0.5, 0.68, 1], outputRange: [1, 1, 0, 0] });
  const scale = v.interpolate({ inputRange: [0, 0.55, 0.68, 1], outputRange: [1, 0.82, 0.6, 0.6] });
  return (
    <Stage>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={{ opacity, transform: [{ translateX }, { scale }], marginRight: 26 }}>
          <View style={{ width: 64, height: 42, backgroundColor: PAPER, borderRadius: 6, overflow: 'hidden' }}>
            <View style={{ position: 'absolute', top: -21, left: 8, width: 48, height: 42, backgroundColor: 'rgba(38,42,52,0.10)', transform: [{ rotate: '45deg' }] }} />
          </View>
        </Animated.View>
        <Float>
          <View style={{ width: 58, height: 78, backgroundColor: gold, borderRadius: 9, alignItems: 'center', paddingTop: 12 }}>
            <View style={{ width: 36, height: 6, borderRadius: 99, backgroundColor: 'rgba(0,0,0,0.4)' }} />
            <Text style={{ position: 'absolute', bottom: 8, color: 'rgba(255,255,255,0.92)', fontSize: 8, fontWeight: '800', letterSpacing: 1.5 }}>VOTE</Text>
          </View>
        </Float>
      </View>
    </Stage>
  );
}

// Scene 2: Early in person. A gold marker hops across calendar days.
function SceneCalendar({ gold }) {
  const v = useLoop();
  const translateX = v.interpolate({ inputRange: [0, 0.33, 0.66, 1], outputRange: [0, 26, 52, 78] });
  const translateY = v.interpolate({
    inputRange: [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1],
    outputRange: [0, -8, 0, -8, 0, -8, 0],
  });
  return (
    <Stage>
      <Float style={{ alignSelf: 'center', width: 132, backgroundColor: PAPER, borderRadius: 10, overflow: 'hidden' }}>
        <View style={{ height: 22, backgroundColor: gold, justifyContent: 'center', paddingLeft: 10 }}>
          <View style={{ width: 50, height: 5, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.85)' }} />
        </View>
        <View style={{ padding: 12 }}>
          <View style={{ flexDirection: 'row', gap: 14, marginBottom: 10 }}>
            {[0, 1, 2, 3].map((i) => <View key={i} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: INKL }} />)}
          </View>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            {[0, 1, 2, 3].map((i) => <View key={i} style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: INKL }} />)}
          </View>
          <Animated.View
            style={{
              position: 'absolute', left: 10, top: 36, width: 16, height: 16, borderRadius: 8,
              borderWidth: 2.5, borderColor: gold, transform: [{ translateX }, { translateY }],
            }}
          />
        </View>
      </Float>
    </Stage>
  );
}

// Scene 3: Election Day. A voter heads toward the polling place.
function SceneDay({ gold }) {
  const v = useLoop();
  const translateX = v.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 66, 66] });
  const opacity = v.interpolate({ inputRange: [0, 0.68, 0.8, 1], outputRange: [1, 1, 0, 0] });
  return (
    <Stage>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 14 }}>
        <Animated.View style={{ opacity, transform: [{ translateX }], marginRight: 40, alignItems: 'center' }}>
          <View style={{ width: 13, height: 13, borderRadius: 7, backgroundColor: PAPER }} />
          <View style={{ width: 18, height: 22, marginTop: 2, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: gold }} />
        </Animated.View>
        <Float style={{ alignItems: 'center' }}>
          <View style={{ width: 96, backgroundColor: PAPER, borderRadius: 8, overflow: 'hidden' }}>
            <View style={{ height: 20, backgroundColor: gold, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.95)', fontSize: 8, fontWeight: '800', letterSpacing: 2 }}>VOTE</Text>
            </View>
            <View style={{ height: 42, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, alignItems: 'center' }}>
              <View style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: INKL }} />
              <View style={{ width: 20, height: 30, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: 'rgba(38,42,52,0.8)', alignSelf: 'flex-end' }} />
              <View style={{ width: 14, height: 14, borderRadius: 3, backgroundColor: INKL }} />
            </View>
          </View>
        </Float>
      </View>
    </Stage>
  );
}

// Scene 4: Fill out your ballot. Ovals pop full, one by one.
function SceneBallot({ gold }) {
  return (
    <Stage>
      <Float style={{ alignSelf: 'center', width: 126, backgroundColor: PAPER, borderRadius: 10, padding: 12 }}>
        {bar(58, gold)}
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
            <Oval delay={400 + i * 500} gold={gold} />
            <View style={{ marginLeft: 8 }}>{bar(62)}</View>
          </View>
        ))}
      </Float>
    </Stage>
  );
}

function Oval({ delay, gold }) {
  const v = useLoop(DUR, delay);
  const scale = v.interpolate({ inputRange: [0, 0.12, 0.85, 1], outputRange: [0, 1, 1, 0] });
  return (
    <View style={{ width: 22, height: 14, borderRadius: 8, borderWidth: 1.8, borderColor: 'rgba(38,42,52,0.45)', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      <Animated.View style={{ width: 14, height: 7, borderRadius: 4, backgroundColor: '#211B14', transform: [{ scale }] }} />
    </View>
  );
}

const SCENES = [SceneChecklist, SceneMail, SceneCalendar, SceneDay, SceneBallot];

export function VoteScene({ index }) {
  const { colors } = useTheme();
  const Scene = SCENES[index] || SceneChecklist;
  return <Scene gold={colors.gold} />;
}
