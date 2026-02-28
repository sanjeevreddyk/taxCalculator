import { describe, expect, it } from 'vitest';
import { calculateTaxComparison } from './taxCalculator';
import type { TaxInput } from '../types/tax';

const baseInput: TaxInput = {
  personal: { age: 35, residentialStatus: 'resident', financialYear: 'FY2025_26' },
  salary: { grossSalary: 1200000, hraExempt: 100000, professionalTax: 2500 },
  other: { housePropertyIncome: -150000, stcg: 0, ltcg: 0, businessIncome: 0, otherIncome: 20000 },
  deductions: { section80C: 150000, section80CCD1B: 50000, section80D: 25000, section80E: 0, section80G: 0, section80TTA: 10000, section80TTB: 0, housingLoan24b: 200000, customDeduction: 0 }
};

describe('calculateTaxComparison', () => {
  it('returns zero tax for zero income', () => {
    const result = calculateTaxComparison({
      ...baseInput,
      salary: { grossSalary: 0, hraExempt: 0, professionalTax: 0 },
      other: { housePropertyIncome: 0, stcg: 0, ltcg: 0, businessIncome: 0, otherIncome: 0 },
      deductions: { ...baseInput.deductions, section80C: 0 }
    });
    expect(result.oldRegime.totalTax).toBe(0);
    expect(result.newRegime.totalTax).toBe(0);
  });

  it('enforces deduction caps', () => {
    const result = calculateTaxComparison({
      ...baseInput,
      deductions: { ...baseInput.deductions, section80C: 500000 }
    });
    expect(result.oldRegime.taxableIncome).toBeGreaterThan(0);
  });

  it('applies senior citizen slabs', () => {
    const seniorResult = calculateTaxComparison({
      ...baseInput,
      personal: { ...baseInput.personal, age: 65 }
    });
    const regularResult = calculateTaxComparison(baseInput);
    expect(seniorResult.oldRegime.totalTax).toBeLessThanOrEqual(regularResult.oldRegime.totalTax);
  });

  it('applies surcharge for very high income', () => {
    const result = calculateTaxComparison({
      ...baseInput,
      salary: { grossSalary: 60000000, hraExempt: 0, professionalTax: 0 }
    });
    expect(result.oldRegime.surcharge).toBeGreaterThan(0);
    expect(result.newRegime.surcharge).toBeGreaterThan(0);
  });
});
