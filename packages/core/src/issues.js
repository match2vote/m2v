// M2V core — the 10-issue framework.
// Carried over from the prototype. Each issue has a stable key used
// everywhere: quiz answers, candidate positions, matching.
//
// Position scale (candidates AND users):
//   -2 strongly toward stance A, -1 leans A, 0 mixed/neutral,
//   +1 leans B, +2 strongly toward stance B,
//   null = "Not stated" (NEVER inferred — core product rule).

export const ISSUES = [
  {
    key: 'cost',
    name: 'Cost of Living',
    question:
      'What should government do about the cost of everyday essentials (groceries, gas, bills)?',
    stanceA: 'Intervene directly — cap prices, expand subsidies and assistance',
    stanceB: 'Step back — cut regulations and taxes so markets lower prices',
  },
  {
    key: 'health',
    name: 'Healthcare',
    question: 'How should Americans get health coverage?',
    stanceA: 'Bigger public role — expand Medicare/Medicaid toward universal coverage',
    stanceB: 'Bigger private role — more competition and choice, less government',
  },
  {
    key: 'housing',
    name: 'Housing',
    question: 'How do we make housing affordable?',
    stanceA: 'Public action — build public housing, protect renters, tax vacancy',
    stanceB: 'Unleash building — cut zoning rules and permits so the market builds more',
  },
  {
    key: 'immigration',
    name: 'Immigration',
    question: 'What should immigration policy prioritize?',
    stanceA: 'Pathways and protections — legal status for long-term residents, higher legal immigration',
    stanceB: 'Enforcement first — stricter border security and deportations',
  },
  {
    key: 'taxes',
    name: 'Taxes & Spending',
    question: 'How should the tax burden be set?',
    stanceA: 'Raise taxes on corporations and high earners to fund programs',
    stanceB: 'Cut taxes across the board and reduce government spending',
  },
  {
    key: 'climate',
    name: 'Climate & Energy',
    question: 'How urgently should government act on climate change?',
    stanceA: 'Act aggressively — rapid transition to clean energy, strict emissions rules',
    stanceB: 'Prioritize energy independence and cost — expand all sources including oil and gas',
  },
  {
    key: 'education',
    name: 'Education',
    question: 'Where should public education money go?',
    stanceA: 'Into public schools — higher teacher pay, universal pre-K',
    stanceB: 'Into choice — vouchers and charter schools parents pick',
  },
  {
    key: 'safety',
    name: 'Crime & Public Safety',
    question: 'What makes communities safer?',
    stanceA: 'Prevention — invest in mental health, reentry, and root causes',
    stanceB: 'Enforcement — more police funding and tougher sentencing',
  },
  {
    key: 'repro',
    name: 'Reproductive Rights',
    question: 'What should abortion law look like?',
    stanceA: 'Protect access — guarantee the right to abortion',
    stanceB: 'Restrict — limit or prohibit abortion',
  },
  {
    key: 'democracy',
    name: 'Elections & Democracy',
    question: 'What does American democracy need most?',
    stanceA: 'Easier voting — automatic registration, expanded mail and early voting',
    stanceB: 'Stricter safeguards — voter ID and tighter election rules',
  },
];

export const ISSUE_KEYS = ISSUES.map((i) => i.key);

export function getIssue(key) {
  return ISSUES.find((i) => i.key === key) || null;
}

// Human label for a candidate's position value on an issue.
export function stanceLabel(issue, value) {
  if (value === null || value === undefined) return 'Not stated';
  const i = typeof issue === 'string' ? getIssue(issue) : issue;
  if (!i) return 'Not stated';
  switch (value) {
    case -2: return `Strongly: ${i.stanceA}`;
    case -1: return `Leans: ${i.stanceA}`;
    case 0:  return 'Mixed / middle-ground position';
    case 1:  return `Leans: ${i.stanceB}`;
    case 2:  return `Strongly: ${i.stanceB}`;
    default: return 'Not stated';
  }
}
