import { PayloadAction, createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const updateDolarPrice = createAsyncThunk(
  'currencies/updateDolarPrice',
  async (_, { dispatch }) => {
    return new Promise<void>((resolve, reject) => {
      fetch(route('update-dolar-price'), {
        method: 'GET',
        mode: 'same-origin',
        headers: {
          // 'Content-Type': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(async (resp) => {
          const fuckResponse = await resp.json();
          if (resp.ok) {
            dispatch(setDolarPrice(fuckResponse.dolar));
            resolve();
          }

          return fuckResponse;
        })
        .catch((r) => reject(r));
    });
  },
);

const initialState: CurrenciesState = { dolar: 0 };
export const slice = createSlice({
  name: 'chess',
  initialState,
  reducers: {
    setDolarPrice: (state, action: PayloadAction<number>) => {
      const newPrice = action.payload;
      state.dolar = newPrice;
    },
  },
});

export const { setDolarPrice } = slice.actions;
export default slice.reducer;

export interface CurrenciesState {
  dolar: number;
}
