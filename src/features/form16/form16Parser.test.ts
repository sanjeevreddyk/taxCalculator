import { describe, expect, it } from 'vitest';
import { parseForm16Text } from './form16Parser';

describe('parseForm16Text', () => {
  it('extracts key fields from mixed Form 16 text', () => {
    const text = `
      Gross Salary 12,00,000
      Exempt Allowances u/s 10 1,20,000
      Standard Deduction 50,000
      Professional Tax 2,500
      Income from House Property -1,50,000
      Deductions under Chapter VI-A 1,80,000
      80C 1,50,000
      80CCD(1B) 50,000
      80D 25,000
      80G 10,000
      TDS deducted 1,10,000
      Total Income 8,70,000
    `;

    const parsed = parseForm16Text(text);

    expect(parsed.grossSalary).toBe(1200000);
    expect(parsed.exemptAllowances10).toBe(120000);
    expect(parsed.professionalTax).toBe(2500);
    expect(parsed.housePropertyIncome).toBe(-150000);
    expect(parsed.section80CCD1B).toBe(50000);
    expect(parsed.tdsDeducted).toBe(110000);
    expect(parsed.missingFields.length).toBeLessThan(3);
  });
});
