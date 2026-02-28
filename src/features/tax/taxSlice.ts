import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TaxComparisonResult, TaxInput } from '../../types/tax';
import { calculateTaxComparison } from '../../lib/taxCalculator';

const initialInput: TaxInput = {
  personal: { name: '', age: 30, residentialStatus: 'resident', financialYear: 'FY2025_26' },
  salary: { grossSalary: 0, hraExempt: 0, professionalTax: 0 },
  other: { housePropertyIncome: 0, stcg: 0, ltcg: 0, businessIncome: 0, otherIncome: 0 },
  deductions: { section80C: 0, section80CCD1B: 0, section80D: 0, section80E: 0, section80G: 0, section80TTA: 0, section80TTB: 0, housingLoan24b: 0, customDeduction: 0 }
};

interface TaxState {
  input: TaxInput;
  currentStep: number;
  result: TaxComparisonResult | null;
  isCalculating: boolean;
}

const initialState: TaxState = {
  input: initialInput,
  currentStep: 1,
  result: null,
  isCalculating: false
};

const taxSlice = createSlice({
  name: 'tax',
  initialState,
  reducers: {
    setTaxData(state, action: PayloadAction<TaxInput>) {
      state.input = action.payload;
    },
    updateInput(state, action: PayloadAction<Partial<TaxInput>>) {
      state.input = {
        ...state.input,
        ...action.payload,
        personal: { ...state.input.personal, ...action.payload.personal },
        salary: { ...state.input.salary, ...action.payload.salary },
        other: { ...state.input.other, ...action.payload.other },
        deductions: { ...state.input.deductions, ...action.payload.deductions }
      };
    },
    setStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    calculate(state) {
      state.isCalculating = true;
      state.result = calculateTaxComparison(state.input);
      state.isCalculating = false;
    },
    reset(state) {
      state.input = initialInput;
      state.currentStep = 1;
      state.result = null;
    }
  }
});

export const { setTaxData, updateInput, setStep, calculate, reset } = taxSlice.actions;
export default taxSlice.reducer;
