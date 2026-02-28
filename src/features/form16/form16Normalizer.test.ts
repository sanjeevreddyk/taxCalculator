import { describe, expect, it } from 'vitest';
import { normalizeForm16Data } from './form16Normalizer';

const rawData = {
  grossSalary: 1200000,
  exemptAllowances10: 100000,
  standardDeduction: 50000,
  professionalTax: 2500,
  housePropertyIncome: -150000,
  totalIncome: 900000,
  chapterVIA: 180000,
  section80C: 150000,
  section80CCD1B: 50000,
  section80D: 25000,
  section80G: 10000,
  tdsDeducted: 100000,
  missingFields: []
};

describe('normalizeForm16Data', () => {
  it('maps raw extracted values to TaxInput shape', () => {
    const result = normalizeForm16Data(rawData);
    expect(result.taxInput.salary.grossSalary).toBe(1200000);
    expect(result.taxInput.salary.hraExempt).toBe(100000);
    expect(result.taxInput.other.housePropertyIncome).toBe(-150000);
    expect(result.taxInput.deductions.section80D).toBe(25000);
    expect(result.warnings).toHaveLength(0);
  });

  it('adds warning when salary is missing', () => {
    const result = normalizeForm16Data({ ...rawData, grossSalary: null, missingFields: ['grossSalary'] });
    expect(result.warnings.some((item) => item.includes('Missing salary section'))).toBe(true);
    expect(result.warnings.some((item) => item.includes('Some values could not be extracted'))).toBe(true);
  });
});
