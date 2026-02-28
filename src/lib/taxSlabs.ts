export interface Slab {
  upto: number;
  rate: number;
}

export const OLD_SLABS = {
  below60: [
    { upto: 250000, rate: 0 },
    { upto: 500000, rate: 0.05 },
    { upto: 1000000, rate: 0.2 },
    { upto: Number.POSITIVE_INFINITY, rate: 0.3 }
  ],
  senior: [
    { upto: 300000, rate: 0 },
    { upto: 500000, rate: 0.05 },
    { upto: 1000000, rate: 0.2 },
    { upto: Number.POSITIVE_INFINITY, rate: 0.3 }
  ],
  superSenior: [
    { upto: 500000, rate: 0 },
    { upto: 1000000, rate: 0.2 },
    { upto: Number.POSITIVE_INFINITY, rate: 0.3 }
  ]
} as const;

export const NEW_SLABS_FY2025_26: Slab[] = [
  { upto: 300000, rate: 0 },
  { upto: 700000, rate: 0.05 },
  { upto: 1000000, rate: 0.1 },
  { upto: 1200000, rate: 0.15 },
  { upto: 1500000, rate: 0.2 },
  { upto: Number.POSITIVE_INFINITY, rate: 0.3 }
];

export const CAPITAL_GAINS_RATES = {
  stcg: 0.15,
  ltcg: 0.1
} as const;
