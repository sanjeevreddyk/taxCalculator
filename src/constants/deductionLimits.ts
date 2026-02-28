export const DEDUCTION_LIMITS = {
  section80C: 150000,
  section80CCD1B: 50000,
  section80D: 100000,
  section80E: Number.POSITIVE_INFINITY,
  section80G: Number.POSITIVE_INFINITY,
  section80TTA: 10000,
  section80TTB: 50000,
  housingLoan24b: 200000,
  customDeduction: Number.POSITIVE_INFINITY,
  standardDeductionOld: 50000,
  standardDeductionNew: 75000
} as const;

export const REBATE_87A = {
  OLD: {
    incomeLimit: 500000,
    maxRebate: 12500
  },
  NEW: {
    incomeLimit: 700000,
    maxRebate: 25000
  }
} as const;

export const CESS_RATE = 0.04;
