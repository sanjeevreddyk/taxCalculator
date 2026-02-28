export type Regime = 'OLD' | 'NEW';

export interface PersonalDetails {
  age: number;
  residentialStatus: 'resident' | 'nri';
  financialYear: 'FY2025_26';
}

export interface SalaryIncome {
  grossSalary: number;
  hraExempt: number;
  professionalTax: number;
}

export interface OtherIncome {
  housePropertyIncome: number;
  stcg: number;
  ltcg: number;
  businessIncome: number;
  otherIncome: number;
}

export interface Deductions {
  section80C: number;
  section80CCD1B: number;
  section80D: number;
  section80E: number;
  section80G: number;
  section80TTA: number;
  section80TTB: number;
  housingLoan24b: number;
  customDeduction: number;
}

export interface TaxInput {
  personal: PersonalDetails;
  salary: SalaryIncome;
  other: OtherIncome;
  deductions: Deductions;
}

export interface RegimeTaxBreakup {
  taxableIncome: number;
  taxBeforeCess: number;
  surcharge: number;
  cess: number;
  totalTax: number;
}

export interface TaxComparisonResult {
  oldRegime: RegimeTaxBreakup;
  newRegime: RegimeTaxBreakup;
  recommended: Regime;
  taxSaved: number;
}
