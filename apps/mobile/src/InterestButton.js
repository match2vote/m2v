// One-tap "cover my state" interest button for uncovered states.
// Tap = recorded. No mail client, no typing, no confirmation dialog.
// Optimistic UI: flips to a thank-you immediately and persists that state on
// device, so a returning user isn't asked again and can't double-submit.
// A failed network call fails silently; nobody sees an error for this.
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { theme, useTheme } from './theme';
import { STATE_NAMES } from './ballot';
import { kv, recordStateInterest } from './api';

const { space } = theme;

export function InterestButton({ stateCode }) {
  const { colors } = useTheme();
  const [sent, setSent] = useState(null); // null = loading, false = ask, true = thanked
  const name = STATE_NAMES[stateCode] || stateCode;

  useEffect(() => {
    let alive = true;
    kv.get(`m2v:interest:${stateCode}`).then((v) => { if (alive) setSent(!!v); });
    return () => { alive = false; };
  }, [stateCode]);

  if (sent === null) return null;

  if (sent) {
    return (
      <View style={{ paddingVertical: space(2.5), paddingHorizontal: space(3), borderRadius: 12, backgroundColor: colors.goldSoft, marginVertical: space(1) }}>
        <Text style={{ color: colors.ink, fontWeight: '600', fontSize: 14, textAlign: 'center' }}>
          Thanks! We'll cover {name} as soon as we can.
        </Text>
      </View>
    );
  }

  const tap = () => {
    setSent(true);                                  // optimistic, immediately
    kv.set(`m2v:interest:${stateCode}`, '1');       // per-state dedupe, persisted
    recordStateInterest(stateCode);                 // fire and forget, silent on failure
  };

  return (
    <View style={{ marginVertical: space(1) }}>
      <Pressable
        onPress={tap}
        style={({ pressed }) => [{
          borderRadius: 14, borderWidth: 1.5, borderColor: colors.accent,
          alignItems: 'center', paddingVertical: space(2), paddingHorizontal: space(5),
        }, pressed && { opacity: 0.8, transform: [{ scale: 0.99 }] }]}
      >
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.accent }}>
          I want M2V to cover {name}
        </Text>
      </Pressable>
      <Text style={{ color: colors.inkSoft, fontSize: 11.5, textAlign: 'center', marginTop: 4 }}>
        Sends only your state. No email, no account, nothing else.
      </Text>
    </View>
  );
}
