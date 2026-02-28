import { describe, expect, it } from 'vitest';
import { calculateTaxComparison } from '../../lib/taxCalculator';
import { normalizeForm16Data } from '../form16/form16Normalizer';

describe('taxCalculator compatibility with Form16 normalizer', () => {
  it('calculates comparison using normalized Form16 payload', () => {
    const normalized = normalizeForm16Data({
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
    });

    const result = calculateTaxComparison(normalized.taxInput);

    expect(result.oldRegime.totalTax).toBeGreaterThanOrEqual(0);
    expect(result.newRegime.totalTax).toBeGreaterThanOrEqual(0);
    expect(['OLD', 'NEW']).toContain(result.recommended);
  });
});
