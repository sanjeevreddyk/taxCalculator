import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TaxInput } from '../../types/tax';
import type { RawForm16Data } from './form16Parser';

interface Form16State {
  rawData: RawForm16Data | null;
  normalizedData: TaxInput | null;
  isParsing: boolean;
  error: string | null;
  warnings: string[];
}

const initialState: Form16State = {
  rawData: null,
  normalizedData: null,
  isParsing: false,
  error: null,
  warnings: []
};

const form16Slice = createSlice({
  name: 'form16',
  initialState,
  reducers: {
    parseStart(state) {
      state.isParsing = true;
      state.error = null;
      state.warnings = [];
    },
    parseSuccess(state, action: PayloadAction<{ rawData: RawForm16Data; normalizedData: TaxInput; warnings: string[] }>) {
      state.isParsing = false;
      state.rawData = action.payload.rawData;
      state.normalizedData = action.payload.normalizedData;
      state.warnings = action.payload.warnings;
      state.error = null;
    },
    parseFailure(state, action: PayloadAction<string>) {
      state.isParsing = false;
      state.error = action.payload;
    },
    updateNormalizedData(state, action: PayloadAction<TaxInput>) {
      state.normalizedData = action.payload;
    },
    clearForm16State() {
      return initialState;
    }
  }
});

export const { parseStart, parseSuccess, parseFailure, updateNormalizedData, clearForm16State } = form16Slice.actions;
export default form16Slice.reducer;
