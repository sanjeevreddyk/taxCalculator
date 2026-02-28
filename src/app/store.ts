import { configureStore } from '@reduxjs/toolkit';
import taxReducer from '../features/tax/taxSlice';
import form16Reducer from '../features/form16/form16Slice';

export const store = configureStore({
  reducer: {
    tax: taxReducer,
    form16: form16Reducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
