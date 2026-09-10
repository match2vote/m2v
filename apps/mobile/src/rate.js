// Ratings. Two paths, both Android-only and both silent on failure:
//  - openStoreListing(): explicit "Rate M2V on Google Play" button in About.
//  - maybeAskForReview(): one-time Play In-App Review sheet, requested a few
//    seconds after the user first sees match results. Never on launch, never
//    twice. Play decides whether the sheet actually appears (quota), so this
//    is a request, not a guarantee.
import { Platform, Linking } from 'react-native';
import * as StoreReview from 'expo-store-review';
import { kv } from './api';

const PACKAGE = 'org.match2vote.app';
const MARKET_URL = `market://details?id=${PACKAGE}`;
const PLAY_URL = `https://play.google.com/store/apps/details?id=${PACKAGE}`;
const ASKED_KEY = 'm2v:reviewAsked';

export const canRate = Platform.OS === 'android';

export async function openStoreListing() {
  try {
    if (Platform.OS === 'android' && (await Linking.canOpenURL(MARKET_URL))) {
      await Linking.openURL(MARKET_URL);
      return;
    }
    await Linking.openURL(PLAY_URL);
  } catch {}
}

export async function maybeAskForReview() {
  if (Platform.OS !== 'android') return;
  try {
    if (await kv.get(ASKED_KEY)) return;
    await kv.set(ASKED_KEY, '1');
    if (await StoreReview.isAvailableAsync()) await StoreReview.requestReview();
  } catch {}
}
