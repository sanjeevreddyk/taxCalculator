import type { RootState } from '../../app/store';

export const selectTaxInput = (state: RootState) => state.tax.input;
export const selectCurrentStep = (state: RootState) => state.tax.currentStep;
export const selectResult = (state: RootState) => state.tax.result;
export const selectLoading = (state: RootState) => state.tax.isCalculating;
