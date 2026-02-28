import type { TaxInput } from '../../types/tax';
import type { RawForm16Data } from './form16Parser';

export interface Form16NormalizationResult {
  taxInput: TaxInput;
  warnings: string[];
}

const safeNumber = (value: number | null): number => (value === null || Number.isNaN(value) ? 0 : value);

export const normalizeForm16Data = (rawData: RawForm16Data): Form16NormalizationResult => {
  const warnings: string[] = [];

  if (rawData.grossSalary === null) {
    warnings.push('Missing salary section in Form 16.');
  }

  if (rawData.missingFields.length > 0) {
    warnings.push('Some values could not be extracted. Please review before calculation.');
  }

  const taxInput: TaxInput = {
    personal: {
      name: 'Imported from Form 16',
      age: 30,
      residentialStatus: 'resident',
      financialYear: 'FY2025_26'
    },
    salary: {
      grossSalary: safeNumber(rawData.grossSalary),
      hraExempt: safeNumber(rawData.exemptAllowances10),
      professionalTax: safeNumber(rawData.professionalTax)
    },
    other: {
      housePropertyIncome: safeNumber(rawData.housePropertyIncome),
      stcg: 0,
      ltcg: 0,
      businessIncome: 0,
      otherIncome: 0
    },
    deductions: {
      section80C: safeNumber(rawData.section80C),
      section80CCD1B: safeNumber(rawData.section80CCD1B),
      section80D: safeNumber(rawData.section80D),
      section80E: 0,
      section80G: safeNumber(rawData.section80G),
      section80TTA: 0,
      section80TTB: 0,
      housingLoan24b: 0,
      customDeduction: 0
    }
  };

  return { taxInput, warnings };
};
