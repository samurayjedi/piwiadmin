import { configureStore } from '@reduxjs/toolkit';
import currencies from './currencies';
import app from './app';
import client from './client';

const store = configureStore({
  reducer: {
    currencies,
    app,
    client,
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
