// Crash safety net. Catches a render error anywhere in the screen area and
// shows a calm fallback instead of a blank app. By design this makes ZERO
// network calls, sends nothing anywhere, includes no identifiers, and persists
// nothing: the only thing that leaves the device is what the person chooses
// to paste into an email themselves. Saved answers, state, district and ballot
// marks live in storage and are untouched by a crash or a reset here.
import React from 'react';
import { ScrollView, View, Text, Pressable, Clipboard as RNClipboard, Platform } from 'react-native';
import { Screen, Body, Button, Card } from './ui';
import { theme, useTheme, typography } from './theme';
import { useNav } from './nav';
import { strings } from './strings';

const S = strings.crash;

const { space } = theme;
const CONTACT = 'match2vote@gmail.com';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Kept in component state only, for the details panel. Nothing is logged
    // to a service because there is no service.
    this.setState({ info });
  }

  reset = () => {
    this.setState({ error: null, info: null });
  };

  render() {
    if (this.state.error) {
      return (
        <CrashFallback
          error={this.state.error}
          info={this.state.info}
          onReset={this.reset}
        />
      );
    }
    return this.props.children;
  }
}

async function copyText(text) {
  try {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  try {
    RNClipboard.setString(text);
    return true;
  } catch {
    return false;
  }
}

function CrashFallback({ error, info, onReset }) {
  const { colors } = useTheme();
  const nav = useNav();
  const [open, setOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(null);

  const message = String((error && (error.message || error)) || S.unknownError);
  const stack = String((error && error.stack) || '');
  const componentStack = String((info && info.componentStack) || '');
  const details = [
    S.detailsHeader,
    S.detailsError({ message }),
    stack ? S.detailsStack({ stack }) : '',
    componentStack ? S.detailsComponentStack({ componentStack }) : '',
  ].filter(Boolean).join('\n');

  const goHome = () => {
    onReset();
    nav.go({ name: 'home' }, { replace: true });
  };

  return (
    <Screen>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={[typography.display, { fontSize: 28, lineHeight: 34, color: colors.ink }]}>
          {S.title}
        </Text>
        <Body soft style={{ fontSize: 15, marginTop: 6, marginBottom: space(3) }}>
          {S.body}
        </Body>
        <Button label={S.home} onPress={goHome} />
        <Pressable
          onPress={() => setOpen((o) => !o)}
          accessibilityRole="button"
          accessibilityLabel={open ? S.hideDetails : S.showDetails}
          accessibilityState={{ expanded: open }}
          style={({ pressed }) => [{ paddingVertical: space(3), minHeight: 44, justifyContent: 'center' }, pressed && { opacity: 0.7 }]}
        >
          <Text style={{ color: colors.accent, fontWeight: '800', fontSize: 14 }}>
            {open ? S.hideDetails : S.showDetails}  {open ? '▴' : '▾'}
          </Text>
        </Pressable>
        {open && (
          <Card>
            <Text selectable style={{ fontFamily: Platform.OS === 'web' ? 'monospace' : undefined, fontSize: 11.5, lineHeight: 16, color: colors.ink }}>
              {details}
            </Text>
            <Button
              kind="ghost"
              small
              label={copied === true ? S.copied : copied === false ? S.copyFailed : S.copy}
              onPress={async () => setCopied(await copyText(details))}
              style={{ marginTop: space(3) }}
            />
            <Body soft style={{ fontSize: 12.5, textAlign: 'center' }}>
              {S.pasteNote({ contact: CONTACT })}
            </Body>
          </Card>
        )}
        <View style={{ height: space(6) }} />
      </ScrollView>
    </Screen>
  );
}
