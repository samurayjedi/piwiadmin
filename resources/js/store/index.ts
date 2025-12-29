import { configureStore } from '@reduxjs/toolkit';
import currencies from './currencies';
import app from './app';
import client from './client';
import new_sale from './new_sale';
import sales from './sales';

const store = configureStore({
  reducer: {
    currencies,
    app,
    client,
    new_sale,
    sales,
  },
  devTools: true,
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; /**  & {
  __isStable: true;
  __immutable: true;
} */
export type ThunkGetters = { state: RootState };
