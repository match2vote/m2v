// M2V theme tokens — ported from the prototype's CSS variables.
export const theme = {
  colors: {
    bg: '#FAF7F2',
    surface: '#FFFFFF',
    ink: '#1A1A1A',
    inkSoft: '#5C5852',
    line: '#E8E2D8',
    accent: '#1B4332',      // deep civic green
    accentSoft: '#EAF2EE',
    gold: '#B8860B',
    danger: '#8B2E2E',
    notStated: '#9A958D',
    sample: '#7A6DB3',
  },
  radius: { sm: 8, md: 14, lg: 22 },
  space: (n) => n * 4,
  font: {
    // Newsreader / Public Sans come in via expo-google-fonts later;
    // serif/sans system stand-ins keep the same hierarchy meanwhile.
    display: { fontFamily: 'Georgia', fontWeight: '600' },
    body: {},
  },
};
