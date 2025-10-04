import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { updateDolarPrice } from './currencies';

const initialState: AppState = { sync: 'loading' };
export const slice = createSlice({
  name: 'chess',
  initialState,
  reducers: {
    setSync: (state, action: PayloadAction<AppState['sync']>) => {
      state.sync = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateDolarPrice.pending, (state) => {
      state.sync = 'loading';
    });
    builder.addCase(updateDolarPrice.fulfilled, (state, action) => {
      if (action.payload !== 0) {
        state.sync = 'error';
      } else {
        state.sync = 'ok';
      }
    });
  },
});

export const { setSync } = slice.actions;
export default slice.reducer;

export interface AppState {
  sync: SyncState;
}

export type SyncState = 'loading' | 'error' | 'ok';
