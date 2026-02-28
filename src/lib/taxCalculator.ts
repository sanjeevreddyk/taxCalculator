import { CESS_RATE, DEDUCTION_LIMITS, REBATE_87A } from '../constants/deductionLimits';
import type { Deductions, TaxComparisonResult, TaxInput } from '../types/tax';
import { getSurchargeRate } from './surcharge';
import { CAPITAL_GAINS_RATES, NEW_SLABS_FY2025_26, OLD_SLABS, type Slab } from './taxSlabs';

const applySlabs = (income: number, slabs: readonly Slab[]): number => {
  if (income <= 0) return 0;
  let tax = 0;
  let prevLimit = 0;

  for (const slab of slabs) {
    const taxableInSlab = Math.min(income, slab.upto) - prevLimit;
    if (taxableInSlab > 0) {
      tax += taxableInSlab * slab.rate;
      prevLimit = slab.upto;
    }
    if (income <= slab.upto) break;
  }
  return tax;
};

const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));

const normalizeDeductions = (d: Deductions, isSenior: boolean): number =>
  clamp(d.section80C, DEDUCTION_LIMITS.section80C) +
  clamp(d.section80CCD1B, DEDUCTION_LIMITS.section80CCD1B) +
  clamp(d.section80D, DEDUCTION_LIMITS.section80D) +
  clamp(d.section80E, DEDUCTION_LIMITS.section80E) +
  clamp(d.section80G, DEDUCTION_LIMITS.section80G) +
  clamp(d.housingLoan24b, DEDUCTION_LIMITS.housingLoan24b) +
  clamp(d.customDeduction, DEDUCTION_LIMITS.customDeduction) +
  clamp(d.section80TTA, DEDUCTION_LIMITS.section80TTA) +
  (isSenior ? clamp(d.section80TTB, DEDUCTION_LIMITS.section80TTB) : 0);

const getOldSlabsForAge = (age: number): readonly Slab[] => {
  if (age >= 80) return OLD_SLABS.superSenior;
  if (age >= 60) return OLD_SLABS.senior;
  return OLD_SLABS.below60;
};

const computeRegimeTax = (taxableIncome: number, slabTax: number, rebateConfig: { incomeLimit: number; maxRebate: number }, isNewRegime: boolean) => {
  const rebate = taxableIncome <= rebateConfig.incomeLimit ? Math.min(slabTax, rebateConfig.maxRebate) : 0;
  const taxAfterRebate = Math.max(0, slabTax - rebate);
  const surchargeRate = getSurchargeRate(taxableIncome, isNewRegime);
  const surcharge = taxAfterRebate * surchargeRate;
  const taxBeforeCess = taxAfterRebate + surcharge;
  const cess = taxBeforeCess * CESS_RATE;
  const totalTax = taxBeforeCess + cess;

  return {
    taxableIncome,
    taxBeforeCess: Math.round(taxBeforeCess),
    surcharge: Math.round(surcharge),
    cess: Math.round(cess),
    totalTax: Math.round(totalTax)
  };
};

export const calculateTaxComparison = (input: TaxInput): TaxComparisonResult => {
  const { age } = input.personal;
  const isSenior = age >= 60;

  const salaryIncome = Math.max(0, input.salary.grossSalary - input.salary.hraExempt - input.salary.professionalTax);
  const houseProperty = input.other.housePropertyIncome;
  const businessAndOther = Math.max(0, input.other.businessIncome + input.other.otherIncome);
  const capitalGainsTax = Math.max(0, input.other.stcg) * CAPITAL_GAINS_RATES.stcg + Math.max(0, input.other.ltcg) * CAPITAL_GAINS_RATES.ltcg;

  const oldGrossIncome = Math.max(0, salaryIncome + houseProperty + businessAndOther + Math.max(0, input.other.stcg) + Math.max(0, input.other.ltcg));
  const oldTaxableIncome = Math.max(0, oldGrossIncome - DEDUCTION_LIMITS.standardDeductionOld - normalizeDeductions(input.deductions, isSenior));

  const newGrossIncome = Math.max(0, salaryIncome + houseProperty + businessAndOther + Math.max(0, input.other.stcg) + Math.max(0, input.other.ltcg));
  const newTaxableIncome = Math.max(0, newGrossIncome - DEDUCTION_LIMITS.standardDeductionNew);

  const oldSlabTax = applySlabs(oldTaxableIncome, getOldSlabsForAge(age)) + capitalGainsTax;
  const newSlabTax = applySlabs(newTaxableIncome, NEW_SLABS_FY2025_26) + capitalGainsTax;

  const oldRegime = computeRegimeTax(oldTaxableIncome, oldSlabTax, REBATE_87A.OLD, false);
  const newRegime = computeRegimeTax(newTaxableIncome, newSlabTax, REBATE_87A.NEW, true);

  const recommended = oldRegime.totalTax <= newRegime.totalTax ? 'OLD' : 'NEW';
  const taxSaved = Math.abs(oldRegime.totalTax - newRegime.totalTax);

  return { oldRegime, newRegime, recommended, taxSaved };
};
