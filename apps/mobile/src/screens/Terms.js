// Terms of use, in-app copy of app.match2vote.org/terms/. Same text as
// docs/launch/terms.html; when one changes, change both.
import React from 'react';
import { ScrollView, View, Linking } from 'react-native';
import { Screen, H1, H2, Body, Card, Button, BackBar } from '../ui';
import { theme } from '../theme';
import { useNav } from '../nav';
import { strings } from '../strings';

const S = strings.terms;
const { space } = theme;
const PRIVACY_URL = 'https://app.match2vote.org/privacy/';

export function Terms() {
  const nav = useNav();
  return (
    <Screen>
      <BackBar label={S.back} onPress={() => nav.back({ name: 'home' })} />
      <H1>{S.title}</H1>
      <Body soft style={{ fontSize: 13, marginBottom: space(3) }}>{S.effective}</Body>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {S.sections.map((sec) => (
          <View key={sec.heading} style={{ marginBottom: space(4) }}>
            <H2 style={{ fontSize: 17 }}>{sec.heading}</H2>
            <Body style={{ fontSize: 14 }}>{sec.body}</Body>
          </View>
        ))}
        <Card>
          <Button kind="ghost" small label={S.privacyLink} onPress={() => Linking.openURL(PRIVACY_URL).catch(() => {})} />
          <Body soft style={{ fontSize: 12, textAlign: 'center' }}>{S.contact}</Body>
        </Card>
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}
